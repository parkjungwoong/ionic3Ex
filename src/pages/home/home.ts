import { Component } from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items: string[] = [];

  newItem:string;

  constructor(public navCtrl: NavController
             ,public alertCtrl: AlertController
             ,public http: HttpClient
             ,private storage: Storage) {
    this.getItem();
  }

  //리스트의 마지막에 새로운 행 추가
  addItem(){
    if( this.checkInput() ) {
      this.alertCtrl.create({
        title: 'Alert',
        subTitle: 'item name is empty',
        buttons:['확인']
      }).present();
    } else {
      //this.request('addItem','item='+this.newItem);
      this.items.push(this.newItem);
      this.storage.set('item', this.items);

    }
    this.newItem = '';
  }

  //입력값이 유효한지 검사
  checkInput() : boolean{
    return this.newItem === undefined || this.newItem.trim().length == 0;
  }

  //서버로 부터 값 가져오기
  getItem(){
    this.storage.get('item').then((val) => {
      if(val) {
        val.forEach( item => {
          this.items.push(item);
        });
      }
    });
    /*this.request('getItem','').then( (res:any[]) => {
      res.forEach( item => {
        this.items.push(item.item);
      });
    });*/
  }

  //http Get
  request(url,param){
    return this.http.get('http://localhost:3000/'+url+'?'+param).toPromise();
  }


}
