import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-imc',
  templateUrl: './imc.page.html',
  styleUrls: ['./imc.page.scss'],
})
export class IMCPage implements OnInit {


  idade: number;
  altura: number;
  peso: number;
  resultado: number;
  abaixo: boolean;
  ideal: boolean;
  sobre: boolean;
  graui: boolean;
  grauii: boolean;
  grauiii: boolean;
  curvam: boolean;
  curvaf: boolean;
  genero: string;
  menos: boolean;
  saudavel: boolean;
  acima: boolean;
  um: boolean;
  dois: boolean;
  tres: boolean;
  
  public imcForm: FormGroup;

  constructor(private alertController: AlertController, private router: Router, private formBuilder: FormBuilder) {
    this.imcForm = this.formBuilder.group({
      sexo: ['', [Validators.required]],
      idade: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(2)]],
      altura: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(3)]],
      peso: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(5)]],
    })
   }

  ngOnInit() {
  }
  
  calcular(){
    const resultado = this.peso/(this.altura*this.altura);
    this.resultado = parseFloat(resultado.toFixed(2));

  document.getElementById("menos").style.display = "none";
  document.getElementById("saudavel").style.display = "none";
  document.getElementById("acima").style.display = "none";
  document.getElementById("um").style.display = "none";
  document.getElementById("dois").style.display = "none";
  document.getElementById("tres").style.display = "none";

  if(this.resultado < 18.5 ){
    document.getElementById("menos").style.display = "block";
}
else if(this.resultado>=18.5 && this.resultado<25){
  document.getElementById("saudavel").style.display = "block";
}
else if(this.resultado>=25 && this.resultado<30){
  document.getElementById("acima").style.display = "block";
}
else if(this.resultado>=30 && this.resultado<35){
  document.getElementById("um").style.display = "block";
}
else if(this.resultado>=35 && this.resultado<40){
  document.getElementById("dois").style.display = "block";
}
else if(this.resultado>=40){
  document.getElementById("tres").style.display = "block";
}
if(this.idade < 19 && this.genero == "masculino"){
  document.getElementById("curvam").style.display = "block";
}
else if(this.idade <19 && this.genero == "feminino"){
document.getElementById("curvaf").style.display = "block";
}

  }
  calcularIMC(){
  const resultado = this.peso/(this.altura*this.altura);
  this.resultado = parseFloat(resultado.toFixed(2));

  this.router.navigateByUrl(`/dietas/${this.resultado}/${this.genero}/${this.idade}`);
  
  }

  async presentAlert(mensagem) {

   var subheader, message;

   switch(mensagem){
    case("abaixo"):
    subheader = "Ops, parece que você esta abaixo do peso!";
    message = "Que tal cuidar da saude?";
    break;

    case("obesidade1"):
    subheader = "Ops, parece que você chegou no nivel 1 de obesidade!";
    message = "Que tal tentar reverter essa situação quanto antes?";
    break;

    case("obesidade2"):
    subheader = "Ham..., essa situação não esta boa!";
    message = "Por que não começar a cuidar um pouco mais de sua saude?";
    break;

    case("obesidade3"):
    subheader = "OBESIDADE 3???";
    message = "Esta seriamente na hora de procurar um profissinal para ajudalo!";
    break;
   }

    const alert = await this.alertController.create({
      header: 'Alerta!',
      subHeader: subheader,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }


}
 

