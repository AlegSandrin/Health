import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private router: Router, public auth: AngularFireAuth, private authService: AuthService) {}

  usuario : any;

  async ngOnInit(){

    this.auth.onAuthStateChanged(async user => { // verifica se o usuário esta logado
      if (user) {
    this.router.navigateByUrl("/inicial");  // se estiver logado manda pra página inicial  
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user.uid;
    const db = getFirestore();
    const docRef = doc(db, "BDusuarios", uid);
    try {
      const doc = await getDoc(docRef);
      this.usuario = doc.data();
    } catch (e) {
      console.log("Error getting cached document:", e);
    }
      }
      else{
        this.router.navigateByUrl("/home");
      }
    })
    }


  signOut(){
    this.authService.logout();
    }

}
