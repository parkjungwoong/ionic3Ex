import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { AddEventPage } from '../add-event/add-event';
import { Calendar } from '@ionic-native/calendar';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  date: any;
  daysInThisMonth: any;
  daysInLastMonth: any;
  daysInNextMonth: any;
  monthNames: string[];
  currentMonth: any;
  currentYear: any;
  currentDate: any;
  selectedEvent: any;
  isSelected: any;
  list:Array<any>;
  eventList:Array<any>;

  constructor(private alertCtrl: AlertController,
              public navCtrl: NavController,
              private calendar: Calendar) {
    this.date = new Date();
    this.monthNames = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
    this.getDaysOfMonth();
    this.loadEventThisMonth();
    this.eventList = [{stDt:20181001,enDt:20181004,title:'4일짜리 이벤트 제목입니다.',id:'a1'}
                      ,{stDt:20181001,enDt:20181005,title:'5일짜리 이벤트 제목입니다.',id:'a2'}
                      ,{stDt:20181005,enDt:20181005,title:'1일짜리 이벤트 제목입니다.',id:'a2-1'}
                      ,{stDt:20181004,enDt:20181004,title:'1일짜리 이벤트 제목입니다.',id:'a2-2'}
                      ,{stDt:20181006,enDt:20181008,title:'3일짜리 주 넘어가는',id:'a3'}
                      ,{stDt:20181007,enDt:20181011,title:'5일짜리 이벤트 제목입니다.',id:'a4'}
                      ,{stDt:20181012,enDt:20181021,title:'12~21일짜리 이벤트 제목입니다.',id:'a5'}
                      ,{stDt:20181021,enDt:20181101,title:'달 넘어가는거',id:'a6'}
                      ];
    //달력 데이터 세팅
    this.setListDay();
    //this.list = [ {day:['',1,2,3,4,5,6]}, {event:[{ title : '3일짜리 가나다라마바사아자카타차아다아아나', color : 'event-color', col : 'col-3'}, { title : '4일 짜리이이이이', color : 'event-color2', col : 'col-4'}]}, {day:[7,8,9,10,11,12,13]} ];

  }

  setListDay(){
    //todo: 이전 날짜까지 해서 달력 리스트에 넣기, 달력 출력시 일자만 보이게 변경
    this.list = [];
    const rowCnt:number = 7;
    let days = [];

    for(let i=0;i<this.daysInLastMonth.length;i++){
      days.push(0);
    }

    days = days.concat(this.daysInThisMonth);

    for(let j=0; j<days.length; j+=rowCnt) {
      //0, 7, 14
      let dayRow = [];
      for(let i=j; i<rowCnt+j; i++){
        //0~6 / 7~13 / 14 ~ 20 / ....
        dayRow.push(days[i]);
      }
      this.list.push( {day: dayRow} );
    }
    console.log('list =>',this.list);

    this.setListEvent();
  }

  /**
   * 이벤트 로우 생성
   * @param {Array<any>} events
   * @param {Array<any>} rowDay
   * @returns {Array<any>}
   */
  setEventRow(events:Array<any>,rowDay:Array<any>):Array<any>{
    let curYearMon = Number(this.date.getFullYear()+''+(this.date.getMonth()+1)+'00');
    let pointer:number = 0; //안 칠해진 칸 중 가장 빠른 인덱스
    const rowMaxNum:number = 7; //한줄에 7칸

    let eventRow = [];

    for(let i=0; i<rowDay.length; i=pointer){

      for(let j=0; j<events.length; j++){
        let curEvent = events[j];

        //시작 날짜가 저번주 이면 시작일을 해당 로우의 제일 빠른 일자로 세팅
        if(rowDay[0] > curEvent.stDt-curYearMon) curEvent.stDt = curYearMon+rowDay[0];

        //해당 날짜에 시작하는 이벤트가 있으면 해당 일자 만큼 칸 칠함
        if(rowDay[i] == curEvent.stDt-curYearMon){
          let colCnt = curEvent.enDt - curEvent.stDt + 1; //일자 수만큼
          if(colCnt > rowMaxNum-pointer) colCnt = rowMaxNum-pointer;//남은 일보다 크면 남은 칸만큼만 지정
          eventRow.push({title:curEvent.title, col:colCnt, color:'event-color', id:curEvent.id});
          pointer += colCnt;
          break;
        }
      }

      //해당 날짜에 이벤트가 없으면
      if(pointer == i) {
        eventRow.push({title:'', col:1, color:'', id:''});
        pointer++;
      }
    }

    return eventRow;
  }

  setListEvent(){
    if(this.list === undefined && this.list.length == 0) return;

    let curYearMon = Number(this.date.getFullYear()+''+(this.date.getMonth()+1)+'00');
    const rowLastIndex:number = 6; //한줄에 7칸
    let mergeList = []; //이벤트와 날짜 머지한 리스트

    for(let i=0; i<this.list.length; i++){
      let rowDay = this.list[i].day;
      mergeList.push({day:rowDay});

      let events = [];

      //마지막 주에서는 달 넘어가는거 이벤트 체크
      if(i == this.list.length-1){
        events = this.eventList.map(event=>{
          if(event.enDt > curYearMon+31){
            let overMon = event;
            overMon.enDt = curYearMon+31;
            return overMon;
          } else {
            return event;
          }
        });
      }

      //todo: 시작일이 저번달인 이벤트 처리
      //todo: 2주 이상인 이벤트 처리
      //todo: 달 넘어가는 이벤트 처리

      //날짜가 해당 로우의 날짜인 이벤트만 추출
      events = this.eventList.filter(event => (event.stDt >= curYearMon+rowDay[0] && event.stDt-curYearMon <= rowDay[rowLastIndex]) || (event.enDt-curYearMon >= rowDay[0] && event.enDt-curYearMon <= rowDay[rowLastIndex]) );

      while(events.length != 0){
        let eventRow = this.setEventRow(events,rowDay);
        mergeList.push({event: eventRow});

        //eventRow에 들어간 이벤트 제외하고 다시 row 세팅
        events = events.filter( event => {
          let flag = true;
          for(let j=0; j<eventRow.length; j++){
            if(event.id == eventRow[j].id) {
              flag = false;
              break;
            }
          }
          return flag;
        });
      }
    }

    this.list = mergeList;
  }

  /**
   *
   * @param {number} date 일자
   * @param {number} dateInit Date 시점 ( 0: 전달, 1:이번달 )
   * @returns {number}
   */
  getYYYYMMDD(date:string,dateInit:number):number{

    let dateObj = new Date(this.date.getFullYear(), this.date.getMonth(), dateInit);

    let year = dateObj.getFullYear();
    let month = dateObj.getMonth()+1;
    let monthStr = month+'';

    if(month < 10) monthStr = '0'+month;
    if(date.length != 2) date = '0'+date;

    return Number(year+''+monthStr+''+date);
  }

 /* ionViewWillEnter() {
    this.date = new Date();
    this.monthNames = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
    this.getDaysOfMonth();
    this.loadEventThisMonth();
  }*/

  getDaysOfMonth() {
    this.daysInThisMonth = [];
    this.daysInLastMonth = [];
    this.daysInNextMonth = [];
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    if(this.date.getMonth() === new Date().getMonth()) {
      this.currentDate = new Date().getDate();
    } else {
      this.currentDate = 999;
    }

    var prevMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 0);//지난달

    var firstDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();//이번달 1일의 요일 (*요일)
    var prevNumOfDays = prevMonth.getDate();//저번달 마지막 날짜 (*일)
    /**
     * ex) 이번달 달력의 저번달 일자 구하기
     *
     * 이번달 첫 날짜 : 2018-09-01 토요일,
     * 전달 마지막 날짜 : 2018-08-31 금요일,
     *
     * 이번달 달력에서 저번달 일자 보여줄려면 저번달 마지막 날짜에서 저번달 마지막 일요일 날짜까지 구해야됨
     * *요일 인덱스는 0(일) ~ 6(토)
     * 저번달 마지막 날짜(31일) - (이번달 첫 요일 인덱스(6) - 1) => 26 => 26일은 저번달 일요일임
     * 그럼 26 부터 31 까지 1씩 증가시켜서 배열에 넣으면 이번달 달력의 저번달 일자 구해짐
     */
    var prevYearMonth = this.getYYYYMMDD('0',0);
    for(var i = prevNumOfDays-(firstDayThisMonth-1); i <= prevNumOfDays; i++) {
      this.daysInLastMonth.push(prevYearMonth+i);
    }

    var thisYearMonth = this.getYYYYMMDD('0',1);
    var thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDate();
    for (var j = 0; j < thisNumOfDays; j++) {
      this.daysInThisMonth.push(thisYearMonth+j+1);
    }

    var lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDay();
    // var nextNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0).getDate();
    for (var k = 0; k < (6-lastDayThisMonth); k++) {
      this.daysInNextMonth.push(k+1);
    }
    var totalDays = this.daysInLastMonth.length+this.daysInThisMonth.length+this.daysInNextMonth.length;
    if(totalDays<36) {
      for(var l = (7-lastDayThisMonth); l < ((7-lastDayThisMonth)+7); l++) {
        this.daysInNextMonth.push(l);
      }
    }
  }

  goToLastMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
    this.getDaysOfMonth();
  }

  goToNextMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0);
    this.getDaysOfMonth();
  }

  addEvent() {
    this.navCtrl.push(AddEventPage);
  }

  loadEventThisMonth() {
    this.eventList = new Array();
    var startDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    var endDate = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0);
    this.calendar.listEventsInRange(startDate, endDate).then(
      (msg) => {
        msg.forEach(item => {
          this.eventList.push(item);
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  checkEvent(day) {
    var hasEvent = false;
    var thisDate1 = this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day+" 00:00:00";
    var thisDate2 = this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day+" 23:59:59";
    this.eventList.forEach(event => {
      if(((event.startDate >= thisDate1) && (event.startDate <= thisDate2)) || ((event.endDate >= thisDate1) && (event.endDate <= thisDate2))) {
        hasEvent = true;
      }
    });
    return hasEvent;
  }

  selectDate(day) {
    this.isSelected = false;
    this.selectedEvent = new Array();
    var thisDate1 = this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day+" 00:00:00";
    var thisDate2 = this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day+" 23:59:59";
    this.eventList.forEach(event => {
      if(((event.startDate >= thisDate1) && (event.startDate <= thisDate2)) || ((event.endDate >= thisDate1) && (event.endDate <= thisDate2))) {
        this.isSelected = true;
        this.selectedEvent.push(event);
      }
    });
  }

  deleteEvent(evt) {
    // console.log(new Date(evt.startDate.replace(/\s/, 'T')));
    // console.log(new Date(evt.endDate.replace(/\s/, 'T')));
    let alert = this.alertCtrl.create({
      title: 'Confirm Delete',
      message: 'Are you sure want to delete this event?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.calendar.deleteEvent(evt.title, evt.location, evt.notes, new Date(evt.startDate.replace(/\s/, 'T')), new Date(evt.endDate.replace(/\s/, 'T'))).then(
              (msg) => {
                console.log(msg);
                this.loadEventThisMonth();
                this.selectDate(new Date(evt.startDate.replace(/\s/, 'T')).getDate());
              },
              (err) => {
                console.log(err);
              }
            )
          }
        }
      ]
    });
    alert.present();
  }

}
