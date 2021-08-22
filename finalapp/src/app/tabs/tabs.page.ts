import { Component } from '@angular/core';
import { billServiceProvider } from '../providers/bill-service/bills-service';
import {Tab3Page} from '../tab3/tab3.page'
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(   public dataService:billServiceProvider, public t3:Tab3Page) {}
  reload() {
    this.dataService.getItems();
      
     
       }
       reload1() {
        this.dataService.getupcomingItems();
          
         
           }
           reload2() {
             console.log("hello from pending function");
            this.dataService.getpendingItems();
              this.t3.loadItems;
             
               }
}
