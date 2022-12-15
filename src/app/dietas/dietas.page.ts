import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dietas',
  templateUrl: './dietas.page.html',
  styleUrls: ['./dietas.page.scss'],
})
export class DietasPage implements OnInit {
  

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
  
  constructor(private alertController: AlertController, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.resultado = parseFloat(this.activatedRoute.snapshot.paramMap.get('resultado'));
    this.genero = this.activatedRoute.snapshot.paramMap.get('sexo');
    this.idade = parseFloat(this.activatedRoute.snapshot.paramMap.get('idade'));

    this.calcularIMC();

  }
  
  calcularIMC(){
  this.resultado = parseFloat(this.resultado.toFixed(2));

  document.getElementById("abaixo").style.display = "none";
  document.getElementById("ideal").style.display = "none";
  document.getElementById("sobre").style.display = "none";
  document.getElementById("graui").style.display = "none";
  document.getElementById("grauii").style.display = "none";
  document.getElementById("grauiii").style.display = "none";
  document.getElementById("curvam").style.display = "none";
  document.getElementById("curvaf").style.display = "none";

  if(this.resultado<18.5){
    document.getElementById("abaixo").style.display = "block";
    this.presentAlert("abaixo");
  }
  else if(this.resultado>=18.5 && this.resultado<25){
    document.getElementById("ideal").style.display = "block";
  }
  else if(this.resultado>=25 && this.resultado<30){
    document.getElementById("sobre").style.display = "block";
  }
  else if(this.resultado>=30 && this.resultado<35){
    document.getElementById("graui").style.display = "block";
    this.presentAlert("obesidade1");
  }
  else if(this.resultado>=35 && this.resultado<40){
    document.getElementById("grauii").style.display = "block";
    this.presentAlert("obesidade2");
  }
  else if(this.resultado>=40){
    document.getElementById("grauiii").style.display = "block";
    this.presentAlert("obesidade3");
  }
  if(this.idade < 19 && this.genero == "masculino"){
      document.getElementById("curvam").style.display = "block";
  }
  else if(this.idade <19 && this.genero == "feminino"){
    document.getElementById("curvaf").style.display = "block";
  }
  
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
    message = "Esta seriamente na hora de procurar um profissional para ajuda-lo!";
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
 

