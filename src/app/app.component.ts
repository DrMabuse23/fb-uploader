import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  template: `
  <div> {{ user?.email }} </div>
  <button [hidden]="user?.uid " (click)="login()">Login</button>
  <button [hidden]="!user?.uid " (click)="logout()">Logout</button>
  <storage *ngIf="user?.uid"></storage>
  `,
})
export class AppComponent {

  user: firebase.User;
  loggedIn = false;

  constructor(public afAuth: AngularFireAuth) {
     afAuth.authState.subscribe((user) => {
      this.user = user;
    });
  }

  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GithubAuthProvider);
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}