import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public loginForm: FormGroup;
  public loading;

  constructor(public formBuilder: FormBuilder,
    public authService: AuthService,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private router: Router,) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(30), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      senha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
    });
   }

  ngOnInit() {
  }

  async logar(){
    await this.presentLoading();

    try{
      await this.authService.login(this.loginForm.value);
      this.loading.dismiss(this.router.navigate(['/inicial']));
    }
    catch(error){
      let mensagem: string;

      switch(error.code) {
        case 'auth/wrong-password':
        mensagem = 'Senha/Email incorreto';
        break;

        case 'auth/invalid-email':
        mensagem = 'Email inválido!';
        break;

        case 'auth/weak-password':
        mensagem = 'A senha deve ter no mínimo 6 caracteres';
        break;

        case 'auth/network-request-failed':
        mensagem = 'Falha na conexão';
        break;

        case 'auth/user-not-found':
          mensagem = 'Usuario não encontrado'
          break;

          case 'auth/too-many-requests':
          mensagem = 'Muitas tentativas de login. Por favor, tente novamente mais tarde'
          break;

          case 'auth/missing-email':
          mensagem = 'Campo(s) vazio(s), preencha todos antes de efetuar o login'
          break;

          case 'auth/internal-error':
            mensagem = 'Erro na autenticação, revise os dados inseridos nos campos e tente novamente'
            break;
      }
      this.presentToast(mensagem);
    }
    finally{
      this.loading.dismiss();
    }
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Autenticando...'});
  return this.loading.present();

}

async presentToast(message: string) {
  const toast = await this.toastCtrl.create({ message, duration: 2000 });
  toast.present();

}

}
