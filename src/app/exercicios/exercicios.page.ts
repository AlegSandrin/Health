import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-exercicios',
  templateUrl: './exercicios.page.html',
  styleUrls: ['./exercicios.page.scss'],
})
export class ExerciciosPage implements OnInit {

  constructor(private http: HttpClient) { }

  dadosTotal: any;
  dados = [];
  paginalAtual = 1;

  ngOnInit() {

    this.consultaAPI();
}

async consultaAPI(){

  let headers = new HttpHeaders({
    'X-RapidAPI-Key': environment.RapidAPIKey,
    'X-RapidAPI-Host': environment.RapidAPIHost,
  });
  this.dadosTotal = await this.http
    .get<any>('https://exercisedb.p.rapidapi.com/exercises', {
      headers: headers
    })
    .toPromise();

    this.gerarPaginas(this.paginalAtual);

}

  load(event?: InfiniteScrollCustomEvent){
    this.paginalAtual++;
    this.gerarPaginas(this.paginalAtual);
    event?.target.complete();
  }

  gerarPaginas(paginas){

    for(var i = 0; i < (5*paginas); i++){
      this.dados.push(this.dadosTotal[i]);
    }
    console.log(this.dados);
  }

  loadMore(event: InfiniteScrollCustomEvent){
    this.load(event);
  }

}
