import { Component } from '@angular/core';
import { billServiceProvider } from '../providers/bill-service/bills-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  errorMessage: string;
  items =[];
  ngOnInit() {
    this.loadItems();
    
  }
  constructor(  private router: Router,public dataService:billServiceProvider) {
    dataService.dataChanged$.subscribe( (dataChanged: boolean) => {
      this.loadItems();
      
     });
  }
  loadItems() {
    this.dataService.getpendingItems() .subscribe(
      items => this.items = items,
      error => this.errorMessage = error);
     console.log(this.items);
     
       }
       doRefresh(event) {
        console.log('Begin async operation');
        this.loadItems();
        setTimeout(() => {
          console.log('Async operation has ended');
          event.target.complete();
        }, 1000);
      }

       async editItem(item, index) {
        console.log("Edit Item - ", item, index);
        item.status=0;
        this.dataService.paid(item,index);
       }
       logout(){
        this.router.navigate(['/']); 
      }
}
