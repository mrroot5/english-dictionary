import { Component, OnInit } from '@angular/core';
// firestore
// import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'my-app',
  styleUrls: ['./app.component.css'],
  template: `
  <h1>{{title}}</h1>
  <nav>
    <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
    <a routerLink="/words" routerLinkActive="active">Words</a>
   </nav>
  <router-outlet></router-outlet>
  `
})

export class AppComponent {
  title = 'English Dictionjary Intermediate 1';
}
