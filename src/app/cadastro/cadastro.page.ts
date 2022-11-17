import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { doc, getFirestore, setDoc } from 'firebase/firestore';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {

  public cadastroForm: FormGroup;
  public loading;

  constructor(public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public authService: AuthService,
    )
    {
      this.cadastroForm = this.formBuilder.group({
        nome_usuario: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
        email: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(30), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]], // padrão para validação de email
        data_nasc: ['', [Validators.required]],
        telefone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(11),Validators.pattern("^[0-9]*$")]], // padrão para validação do número de celular (apenas números)
        senha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
        confirm_senha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
      })
    }

  ngOnInit() {
  }

  

  async cadastrar(){
    await this.presentLoading();

    if(this.cadastroForm.value.senha !== this.cadastroForm.value.confirm_senha){
    this.presentToast("Senhas não se coincidem");
    await this.loading.dismiss();
    }
    else{
    
      try{
        const novoUsuario = await this.authService.registrar(this.cadastroForm.value);
        const DBFirestore = getFirestore();
        const dados = this.cadastroForm.value;
        delete dados.confirm_senha; // remove o campo "confirm_senha" antes de enviar ao banco de dados
        await setDoc(doc(DBFirestore, "BDusuarios", novoUsuario.user.uid), dados);
        //this.loading.dismiss(); // -> faça isso depois de cadastrar com sucesso
      }
      catch(error){
        let mensagem: string;

        switch(error.code) {
          case 'auth/email-already-in-use':
            mensagem = 'Email já em uso.';
            break;

          case 'auth/invalid-email':
            mensagem = 'Email inválido.';
            break;
        }
      
      this.presentToast(mensagem);
      }
      finally{
        this.loading.dismiss();
      }

    }
    
  }

  async presentLoading(){
    this.loading = await this.loadingCtrl.create({message: 'Por favor, aguarde...'});
  return this.loading.present();
  }

  async presentToast(message: string){
    const toast = await this.toastCtrl.create({message, duration: 2000});
    toast.present();
  }

}
