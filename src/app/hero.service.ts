import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Hero } from './hero';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class HeroService {
  private collectionName = 'heroes';
  private heroesUrl = 'api/heroes';  // URL to web api

  constructor(
    private http: HttpClient,
    private afs: AngularFirestore,
    private messageService: MessageService) { }

  /** GET heroes from firestore */
  getHeroes (): Observable<Hero[]> {
    var heroesCollection:any = this.afs.collection(this.collectionName, ref => ref.orderBy("id"));
    // return heroesCollection.valueChanges();

    return heroesCollection.snapshotChanges()
    .map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Hero
        const documentId = a.payload.doc.id;

        return { documentId, data };
      });
    });
  }

  /** GET hero by id. Return `undefined` when id not found */
  getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    // return this.afs.collection('heroes').valueChanges();
    return this.http.get<Hero[]>(url)
      .pipe(
        map(heroes => heroes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  /** GET hero by id. Will 404 if id not found */
  getHero(documentId: string): Observable<Hero> {
    var heroesCollection:any = this.afs.doc(this.collectionName + '/' + documentId);
    return heroesCollection.valueChanges();
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`api/heroes/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new hero to the server */
  addHero (hero: Hero, lastId: number): Observable<Hero> {
    this.afs.collection(this.collectionName).add({'id': lastId + 1, 'name': hero.name})
    .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
    return;
  }

  /** DELETE: delete the hero from the server */
  deleteHero (hero: Hero): Observable<Hero> {
    this.afs.doc('heroes/' + hero.documentId).delete();
    return null;

    // const id = typeof hero === 'number' ? hero : hero.id;
    // const url = `${this.heroesUrl}/${id}`;
    //
    // return this.http.delete<Hero>(url, httpOptions).pipe(
    //   tap(_ => this.log(`deleted hero id=${id}`)),
    //   catchError(this.handleError<Hero>('deleteHero'))
    // );
  }

  /** PUT: update the hero on the server */
  updateHero (hero: Hero, documentId): Observable<any> {
    this.afs.collection(this.collectionName).doc(documentId).update(hero)
    return null;
    // return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
    //   tap(_ => this.log(`updated hero id=${hero.id}`)),
    //   catchError(this.handleError<any>('updateHero'))
    // );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }
}


/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
