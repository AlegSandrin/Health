import { Component, OnInit } from '@angular/core';

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
  texto1: string;
  texto2: string;
  
  constructor() { }

  ngOnInit() {
  }
  
  calcularIMC(){
  const resultado = this.peso/(this.altura*this.altura);
  this.resultado = parseFloat(resultado.toFixed(2));

  if(this.resultado<18.5){
    this.texto1 = "ABAIXO DO PESO";
  }
  else{
    this.texto2 = "sla";
  }
  }
}
