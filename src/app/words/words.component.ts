import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Word } from '../word';
import { WordService } from '../word.service';
// Custom
import { firebaseConfig }       from '../custom-settings'

@Component({
  selector: 'app-words',
  templateUrl: './words.component.html',
  // styleUrls: ['./words.component.css']
})

export class WordsComponent implements OnInit {
  words: Word[];
  model = new Word({});
  submitted = false;
  private id: number;
  private word: string;
  private categories: any;
  private collectionCategoriesName: string = 'categories';
  showHide: false;

  constructor(
    private wordService: WordService,
  ) {}
  ngOnInit() {
    this.getWords();
    this.getCategories();
    $('.collapsible').collapsible();
    $('select').material_select();
  }

  getWords(): void {
    this.wordService.getWords()
    .subscribe(words => this.words = words);
  }

  getCategories(): void {
    this.wordService.getCategories()
    .subscribe(categories => this.categories = categories);
  }

  add(ev: any, submitedForm: NgForm): void {
    ev.stopImmediatePropagation();
    console.log(submitedForm.form.value);
    var categoryPath = `firestore.googleapis.com/project/${firebaseConfig.projectId}/database/(default)/documents/`,
    dataSend: Word = {
      "id": 0,
      "english": submitedForm.form.value.english.trim(),
      "spanish": submitedForm.form.value.spanish.trim(),
      "spanishPronunciation": submitedForm.form.value.spanishPronunciation.trim(),
      "phonetic": submitedForm.form.value.phonetic.trim(),
      "category": submitedForm.form.value.category,
    };
    this.submitted = true;

    if (!dataSend.english) { return null; }

    if (this.words[this.words.length -1].hasOwnProperty("data") && this.words[this.words.length -1].data.id != undefined) {
      dataSend.id = this.words[this.words.length -1].data.id;
    } else if(this.words[this.words.length -1].id != undefined) {
      dataSend.id = this.words[this.words.length -1].id;
    }
    // console.log(typeof submitedForm.form.value.category)
    // console.log(submitedForm.form.value.category)
    // if (submitedForm.form.value.category.trim() != '') {
    //     dataSend.category = categoryPath + submitedForm.form.value.category.trim()
    // }

    // console.log(dataSend)

    this.wordService.addWord(dataSend as Word);
      // .subscribe(word => {
      //   this.words.push(word);
      // });
    submitedForm.reset();
  }

  delete(word: Word): void {
    this.words = this.words.filter(h => h !== word);
    this.wordService.deleteWord(word);
    //.subscribe();
  }
}
