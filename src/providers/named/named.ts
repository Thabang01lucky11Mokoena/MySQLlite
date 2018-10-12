import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';

import { SQLite } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs/Rx';
import { Platform } from 'ionic-angular';
import { Http } from '@angular/http';

/*
  Generated class for the NamedProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NamedProvider {
  named: SQLiteObject;

  private namedReady: BehaviorSubject<boolean>;

  constructor(public http: Http, private sqlitePorter: SQLitePorter, private storage:
  Storage, private sqlite: SQLite, private platform: Platform) {
    // console.log('Hello NamedProvider Provider');
    this.namedReady = new BehaviorSubject(false);
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'developers.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
        this.named = db;
        this.storage.get('named_filled').then(val => {
          if (val) {
            this.namedReady.next(true);
          } else {
            this.fillNamed();
          }
        })
      });
    });
  }
  fillNamed(){
    this.http.get('assets/icon/dummyDumps.sql')
    .map (res => res.toString())
    .subscribe(sql => {
      this.sqlitePorter.importJsonToDb(this.named, sql)
      .then(data => {
        this.namedReady.next(true);
        this.storage.set('named_filled', true);
      })
      .catch(e => console.log(e));
    });
  }

  addDeveloper(firstName, lastName, stdID){
    let data = [firstName, lastName, stdID];
    return this.named.executeSql("INSERT INTO developer (firstName, lastName, stdID) VALUES (?, ?, ?)", data).then(res =>{
      return res;
    });
  }
  getAllDevelopers(){
    return this.named.executeSql("SELECT * FROM developer", []).then(data => {
      let developers = [];
      if (data.row.length > 0) {
        for (var i = 0; i < data.row.length; i++) {
          developers.push({firstName: data.row.item(i).firstName,lastName:data.row.item(i).lastName,stdID: data.row.item(i).stdID})
        }
      }
      return developers;
    }, err => {
      console.log('Error: ', err);
    return [];
    })
  }
  getNamedState() {
    return this.namedReady.asObservable();
  }
}
