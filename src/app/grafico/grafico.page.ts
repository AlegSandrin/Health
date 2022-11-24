import { getLocaleDayNames } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonBackButtonDelegate } from '@ionic/angular';
import { EChartsOption } from 'echarts';
import { getAuth } from 'firebase/auth';
import * as firebase from 'firebase/compat';
import { arrayUnion, doc, getFirestore, onSnapshot, updateDoc } from 'firebase/firestore';

@Component({
  selector: 'app-grafico',
  templateUrl: './grafico.page.html',
  styleUrls: ['./grafico.page.scss'],
})
export class GraficoPage implements OnInit {

  
  data_atual = new Date();
  registro : number;
  data : any;
  testeData = ['2022-02-02', '2020-03-03'];
  testeValor = [75,77]
  //dataFormatada = ((this.data.getDate() )) + "/" + ((this.data.getMonth() + 1)) + "/" + this.data.getFullYear(); 

  dados = [];

  constructor() { }

  chartOption: EChartsOption = {
    title: {
      text: 'Frequência Cardíaca',
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {},
    toolbox: {
      right: 10,
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      }
    },
    dataZoom: [
      {
        startValue: `'${this.data_atual}'`
      },
      {
        type: 'inside'
      }
    ],
    visualMap: {
      top: 50,
      right: 10,
      pieces: [
        {
          gt: 56,
          lte: 62,
          color: '#32CD32'
        },
        {
          gt: 62,
          lte: 70,
          color: '#ADFF2F'
        },
        {
          gt: 70,
          lte: 74,
          color: '#b6cf38'
        },
        {
          gt: 74,
          lte: 80,
          color: '#FBDB0F'
        },
        {
          gt: 80,
          lte: 84,
          color: '#AC3B2A'
        },
      ],
      outOfRange: {
        color: '#999'
      }
    },
    series: {
      name: 'Frequência Cardíaca',
      type: 'line',
      data: [this.testeData , this.testeValor],//this.dados.sort(),
      markLine: {
        silent: true,
        lineStyle: {
          color: '#333'
        },
        data: [
          {
            yAxis: 50
          },
          {
            yAxis: 100
          },
          {
            yAxis: 150
          },
          {
            yAxis: 200
          },
          {
            yAxis: 300
          }
        ]
      }
    }
    
};

  ngOnInit() {

    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user.uid;
    const db = getFirestore();

    const atualiza = onSnapshot(doc(db, "BDusuarios", uid), (doc) => {

      const dadosUser = doc.data();
      this.dados = dadosUser.registros_cardiacos;
      console.log("Current data: ", this.dados);
      
  });
  

  }

  async enviarDados(){

    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user.uid;
    const db = getFirestore();

    const docRef = doc(db, "BDusuarios", uid);

    const data = this.data.replace("T"," "); 
    await updateDoc(docRef, {registros_cardiacos: arrayUnion(`${data} - ${this.registro}`)
    });

  }
}
