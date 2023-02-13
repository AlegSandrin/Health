import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EChartsOption } from 'echarts';
import * as echarts from 'echarts/types/dist/echarts';
import { getAuth } from 'firebase/auth';
import { arrayUnion, doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';

@Component({
  selector: 'app-grafico',
  templateUrl: './grafico.page.html',
  styleUrls: ['./grafico.page.scss'],
})
export class GraficoPage implements OnInit {

  //dataFormatada = ((this.data.getDate() )) + "/" + ((this.data.getMonth() + 1)) + "/" + this.data.getFullYear(); 

  data_atual = new Date();

  registro : number; // registro enviado pelo usuário
  data : any; // data enviada pelo usuário

  datas = []; // datas recebidas pelo banco de dados
  registros = []; // registros recebidos pelo banco de dados

  dados = []; // recebe uma array com as datas e os registros juntos

  graficoForm : FormGroup; // validação para impedir que o usuário envie valores vazios para o banco de dados

  echartsInstance: any;

  chartOption: EChartsOption = {
    title: {
      text: 'Frequência Cardíaca',
    },
    tooltip: {
      trigger: 'axis'
    },
    animation: true,
    xAxis: [{
      type: 'category',
    },
  ],
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
      data: this.dados,
      markLine: {
        silent: true,
        lineStyle: {
          color: '#333'
        },
      },
    },
    
};

mergeOption = {};
loading = true;

  constructor(private formBuilder: FormBuilder) {
    this.graficoForm = this.formBuilder.group({
      registro: ['', [Validators.required, Validators.minLength(1), Validators.max(220)]],
      data: ['', [Validators.required]]
    })
   }
  
  ngOnInit(){
    this.lerDados();
    
  }

async atualizarDados(){

    let novosDados = await this.dados; // armazena os dados recebidos na variavel
    novosDados.push([this.data, this.registro]) // acrescenta os dados digitados pelo usuário
    this.mergeOption = { series: [{data: novosDados}]}; // acrescenta os dados no gráfico
  }

  async enviarDados(){

    this.atualizarDados();

    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user.uid;
    const db = getFirestore();

    const docRef = doc(db, "BDusuarios", uid);

    const data = this.data.replace("T"," "); 

    await updateDoc(docRef, {registros_data: arrayUnion(data), registros: arrayUnion(this.registro) });
  }

  onChartInit(ec) {
    this.echartsInstance = ec;
  }

  resizeChart() {
    if (this.echartsInstance) {
      this.echartsInstance.resize();
    }
  }

  ngOnDestroy(){
    this.echartsInstance.dispose();
  }

  async lerDados(){
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user.uid;
    const db = getFirestore();

    const docRef = doc(db, "BDusuarios", uid);

      const docs = await getDoc(docRef);
      const dadosUser = docs.data();
      this.datas = dadosUser.registros_data;
      this.registros = dadosUser.registros;

  let len = this.registros.length;
  
  for(let i= 0; i < len; i++){
  const arrays = [this.datas[i],this.registros[i]];
  this.dados.push(arrays);
  }

  if (this.echartsInstance){
  this.echartsInstance.setOption(this.chartOption);
  }
  }

}
