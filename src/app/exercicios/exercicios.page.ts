import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-exercicios',
  templateUrl: './exercicios.page.html',
  styleUrls: ['./exercicios.page.scss'],
})
export class ExerciciosPage implements OnInit {

  constructor(private http: HttpClient, private alertController: AlertController) { }

  dadosTotal: any;
  dados = [];

  valor = '';

  ngOnInit() {

    this.consultaAPI('');
}

async consultaAPI(param){

  // Requisita os dados da API
  let headers = new HttpHeaders({ 
    'X-RapidAPI-Key': environment.RapidAPIKey,
    'X-RapidAPI-Host': environment.RapidAPIHost,
  });
  this.dadosTotal = await this.http.get<any>(`https://exercisedb.p.rapidapi.com/exercises${param}`, {headers: headers}).toPromise();
    // Chama a função para gerar os dados na página
    this.gerarPaginas();

}

  gerarPaginas(){
    const len = this.dados.length;
    // Enquanto a quantidade de elementos na array "dados" for menor que a quantidade de elementos
    // no array "dadosTotal", a variavel "dados" receberá +5 elementos
    if(len < this.dadosTotal.length){
      for(let i = 0; i < 10; i++){
        this.dados.push(this.dadosTotal[len + i]);
      }
    }
  }

  loadMore(event){
    // Carrega mais 5 elementos quando o scroll chegar no final da página
    this.gerarPaginas();
    setTimeout(() => {
      (event as InfiniteScrollCustomEvent).target.complete();
    }, 500)
  }

  async filtrar(filtro){

    let alert;

    switch(filtro){

      case 'targetMuscles':

      alert = await this.alertController.create({
      mode: 'ios',
      header: 'Selecione o músculo alvo',
      inputs: [
        {
          label: 'Abdutores',
          type: 'radio',
          value: '/target/abductors',
        },
        {
          label: 'Abdome',
          type: 'radio',
          value: '/target/abs',
        },
        {
          label: 'Adutores',
          type: 'radio',
          value: '/target/adductors',
        },
        {
          label: 'Bíceps',
          type: 'radio',
          value: '/target/biceps',
        },
        {
          label: 'Panturrilha',
          type: 'radio',
          value: '/target/calves',
        },
        {
          label: 'Sistema cardiovascular',
          type: 'radio',
          value: '/target/cardiovascular system',
        },
        {
          label: 'Deltóide',
          type: 'radio',
          value: '/target/delts',
        },
        {
          label: 'Antebraços',
          type: 'radio',
          value: '/target/forearms',
        },
        {
          label: 'Glúteos',
          type: 'radio',
          value: '/target/glutes',
        },
        {
          label: 'Isquiotibiais',
          type: 'radio',
          value: '/target/hamstrings',
        },
        {
          label: 'Dorsal',
          type: 'radio',
          value: '/target/lats',
        },
        {
          label: 'Levantador da Escápula',
          type: 'radio',
          value: '/target/levator scapulae',
        },
        {
          label: 'Peitorais',
          type: 'radio',
          value: '/target/pectorals',
        },
        {
          label: 'Quadríceps',
          type: 'radio',
          value: '/target/quads',
        },
        {
          label: 'Serrátil anterior',
          type: 'radio',
          value: '/target/serratus anterior',
        },
        {
          label: 'Coluna',
          type: 'radio',
          value: '/target/spine',
        },
        {
          label: 'Trapézio',
          type: 'radio',
          value: '/target/traps',
        },
        {
          label: 'Tríceps',
          type: 'radio',
          value: '/target/triceps',
        },
        {
          label: 'Superior das costas',
          type: 'radio',
          value: '/target/upper back',
        },
        {
          label: 'Sem filtro',
          type: 'radio',
          value: '',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Confirmar',
          handler: (valor) => {
            this.dadosTotal = []; // Limpa resultados anteriores da consulta e realiza uma nova
            this.dados = [];
            this.consultaAPI(valor);
          },
        },
      ],
    });
    break;

    case 'bodyParts':
      alert = await this.alertController.create({
        mode: 'ios',
        header: 'Selecione a parte do corpo que será treinada',
        inputs: [
          {
            label: 'Costas',
            type: 'radio',
            value: '/bodyPart/back',
          },
          {
            label: 'Cárdio',
            type: 'radio',
            value: '/bodyPart/cardio',
          },
          {
            label: 'Peito',
            type: 'radio',
            value: '/bodyPart/chest',
          },
          {
            label: 'Antebraço',
            type: 'radio',
            value: '/bodyPart/lower arms',
          },
          {
            label: 'Pernas (inferiores)',
            type: 'radio',
            value: '/bodyPart/lower legs',
          },
          {
            label: 'Pescoço',
            type: 'radio',
            value: '/bodyPart/neck',
          },
          {
            label: 'Ombros',
            type: 'radio',
            value: '/bodyPart/shoulders',
          },
          {
            label: 'Braços (superiores)',
            type: 'radio',
            value: '/bodyPart/upper arms',
          },
          {
            label: 'Pernas (superiores)',
            type: 'radio',
            value: '/bodyPart/upper legs',
          },
          {
            label: 'Cintura',
            type: 'radio',
            value: '/bodyPart/waist',
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
          },
          {
            text: 'Confirmar',
            handler: (valor) => {
              this.dadosTotal = []; // Limpa resultados anteriores da consulta e realiza uma nova
              this.dados = [];
              this.consultaAPI(valor);
            },
          },
        ],
      });
      break;

    case 'equipment':

      alert = await this.alertController.create({
        mode: 'ios',
        header: 'Selecione o equipamento a ser usado',
        inputs: [
          {
            label: 'Assistencia',
            type: 'radio',
            value: '/equipment/assisted',
          },
          {
            label: 'Faixa elástica',
            type: 'radio',
            value: '/equipment/band',
          },
          {
            label: 'Barra',
            type: 'radio',
            value: '/equipment/barbell',
          },
          {
            label: 'Peso corporal',
            type: 'radio',
            value: '/equipment/body weight',
          },
          {
            label: 'Bola Bosu',
            type: 'radio',
            value: '/equipment/bosu ball',
          },
          {
            label: 'Cabo',
            type: 'radio',
            value: '/equipment/cable',
          },
          {
            label: 'Haltere',
            type: 'radio',
            value: '/equipment/dumbbell',
          },
          {
            label: 'Máquina elíptica',
            type: 'radio',
            value: '/equipment/elliptical machine',
          },
          {
            label: 'Barra EZ',
            type: 'radio',
            value: '/equipment/ez barbell',
          },
          {
            label: 'Martelo',
            type: 'radio',
            value: '/equipment/hammer',
          },
          {
            label: 'Kettlebell',
            type: 'radio',
            value: '/equipment/kettlebell',
          },
          {
            label: 'Máquina de alavancagem',
            type: 'radio',
            value: '/equipment/leverage machine',
          },
          {
            label: 'Bola medicinal',
            type: 'radio',
            value: '/equipment/medicine ball',
          },
          {
            label: 'Barra olímpica',
            type: 'radio',
            value: '/equipment/olympic barbell',
          },
          {
            label: 'Faixa elástica de resistência',
            type: 'radio',
            value: '/equipment/resistance band',
          },
          {
            label: 'Rolo',
            type: 'radio',
            value: '/equipment/roller',
          },
          {
            label: 'Corda',
            type: 'radio',
            value: '/equipment/rope',
          },
          {
            label: 'Máquina de esquiar',
            type: 'radio',
            value: '/equipment/skierg machine',
          },
          {
            label: 'Aparelho Sled',
            type: 'radio',
            value: '/equipment/sled machine',
          },
          {
            label: 'Aparelho Smith',
            type: 'radio',
            value: '/equipment/smith machine',
          },
          {
            label: 'Bola de estabilidade',
            type: 'radio',
            value: '/equipment/stability ball',
          },
          {
            label: 'Bicicleta estacionária',
            type: 'radio',
            value: '/equipment/stationary bike',
          },
          {
            label: 'Máquina de passos',
            type: 'radio',
            value: '/equipment/stepmill machine',
          },
          {
            label: 'Pneu',
            type: 'radio',
            value: '/equipment/tire',
          },
          {
            label: 'Barra Hexagonal',
            type: 'radio',
            value: '/equipment/trap bar',
          },
          {
            label: 'Ergômetro p/ Superior do Corpo',
            type: 'radio',
            value: '/equipment/upper body ergometer',
          },
          {
            label: 'Pesos',
            type: 'radio',
            value: '/equipment/weighted',
          },
          {
            label: 'Roda/rolo de abdominal',
            type: 'radio',
            value: '/equipment/wheel roller',
          },
          {
            label: 'Sem filtro',
            type: 'radio',
            value: '',
          },
        ],
        buttons: [
          {
            text: 'Cancelar',
          },
          {
            text: 'Confirmar',
            handler: (valor) => {
              this.dadosTotal = []; // Limpa resultados anteriores da consulta e realiza uma nova
              this.dados = [];
              this.consultaAPI(valor);
            },
          },
        ],
      });
      break;
  }

    await alert.present();

  }

}
