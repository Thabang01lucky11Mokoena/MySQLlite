import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NamedProvider } from '../../providers/named/named';
import { Platform } from 'ionic-angular';

import { ToastController } from 'ionic-angular';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  developers = [];
  developer = {};

  constructor(public navCtrl: NavController, private namedProvider: NamedProvider , public toastCtrl: ToastController) {
    this.namedProvider.getNamedState().subscribe (rdy => {
      if (rdy) {
        this.loadDeveloperData();
      }
    })
  }
  loadDeveloperData(){
    this.namedProvider.getAllDevelopers().then(data => {
      this.developers = data;


      

      const toast = this.toastCtrl.create({
        message: 'User was added successfully' + this.developer,
        duration: 3000
      });
      toast.present();
    
      console.log(this.developer);


      
    });
  }
  addDeveloper(){
    this.namedProvider.addDeveloper(this.developer['firstName'], this.developer['lastName'], parseInt(this.developer['stdID']))
    .then(data => {
      this.loadDeveloperData();
    });
    this.developer = {};
  }
}
