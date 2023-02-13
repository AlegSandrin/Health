import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { getAuth, signOut } from 'firebase/auth';
import { Registro } from '../models/registro';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: AngularFireAuth, private router: Router) { }

  login(user: Registro ){
    return this.auth.signInWithEmailAndPassword(user.email, user.senha);
  }

  registrar(user: Registro ){
    return this.auth.createUserWithEmailAndPassword(user.email, user.senha)
  }

  logout() {
    const auth = getAuth();
    signOut(auth).then(() => {
    location.reload()
    this.router.navigateByUrl("/home");
    
    
    }).catch((error) => {
      console.log("Error getting cached document:", error);
    });
  }
}
