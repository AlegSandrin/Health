import { Component, OnInit } from '@angular/core';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-inicial',
  templateUrl: './inicial.page.html',
  styleUrls: ['./inicial.page.scss'],
})
export class InicialPage implements OnInit {

  dados?: {};

  constructor(public auth: AngularFireAuth) { }

  async ngOnInit() {

    this.auth.onAuthStateChanged(async user => {
      if (user) {

    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user.uid;

    const db = getFirestore();
    const docRef = doc(db, "BDusuarios", uid);
    try {
      const doc = await getDoc(docRef);
      this.dados = doc.data();
    } catch (e) {
      console.log("Error getting cached document:", e);
    }
    
      
      }
    });
  }
}



