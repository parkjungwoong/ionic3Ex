var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { HttpClient } from "@angular/common/http";
import { Storage } from '@ionic/storage';
var HomePage = /** @class */ (function () {
    function HomePage(navCtrl, alertCtrl, http, storage) {
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this.http = http;
        this.storage = storage;
        this.items = [];
        this.getItem();
    }
    //리스트의 마지막에 새로운 행 추가
    HomePage.prototype.addItem = function () {
        if (this.checkInput()) {
            this.alertCtrl.create({
                title: 'Alert',
                subTitle: 'item name is empty',
                buttons: ['확인']
            }).present();
        }
        else {
            //this.request('addItem','item='+this.newItem);
            this.items.push(this.newItem);
            this.storage.set('item', this.items);
        }
        this.newItem = '';
    };
    //입력값이 유효한지 검사
    HomePage.prototype.checkInput = function () {
        return this.newItem === undefined || this.newItem.trim().length == 0;
    };
    //서버로 부터 값 가져오기
    HomePage.prototype.getItem = function () {
        var _this = this;
        this.storage.get('item').then(function (val) {
            if (val) {
                val.forEach(function (item) {
                    _this.items.push(item);
                });
            }
        });
        /*this.request('getItem','').then( (res:any[]) => {
          res.forEach( item => {
            this.items.push(item.item);
          });
        });*/
    };
    //http Get
    HomePage.prototype.request = function (url, param) {
        return this.http.get('http://localhost:3000/' + url + '?' + param).toPromise();
    };
    HomePage = __decorate([
        Component({
            selector: 'page-home',
            templateUrl: 'home.html'
        }),
        __metadata("design:paramtypes", [NavController,
            AlertController,
            HttpClient,
            Storage])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
//# sourceMappingURL=home.js.map