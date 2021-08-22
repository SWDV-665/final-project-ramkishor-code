import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { billServiceProvider } from '../bill-service/bills-service';

import { UserCrudService } from '../usercrud/userCrud.service';
@Injectable(
  {
    providedIn: 'root'
  }
)
export class InputDialogServiceProvider {
constructor(
  private userCrudService: UserCrudService ,
  public alertCtrl: AlertController, 
  public toastCtrl: ToastController,
  public dataService: billServiceProvider
 ) {
console.log('Hello InputDialogServiceProvider Provider');
}

async showErrorToast() {
  let toast = await this.toastCtrl.create({
    message: 'Please enter valid values',
    duration: 3000,
    position: 'top'
  });

 

 await toast.present();
}
 async showPrompt(item?, index?) {
     const prompt =await this.alertCtrl.create({
      cssClass:'my-custom-class',
     message: item ? "Please edit billing item..." : "Please enter billing item...",
      inputs: [
    {
        name: 'name', 
    placeholder: 'Name',
     value: item ? item.name : null
      },
      {
    name: 'amount',
     placeholder: 'Amount', 
     type: 'number',
     value: item ? item.amount : null
      },
      {
        name: 'due_day',
         placeholder: 'Due day ( 1 to 31st )', 
         type: 'number',
         min: 1,
         max: 31,

         value: item ? item.due_day : null
          }

    
    ],
    buttons: [
    {text: 'Cancel', handler: data => {
    console.log('Cancel clicked');
    }
    }
    ,{
    text: 'Save', 
    handler: data => {
      if(data.due_day>31 || data.due_day<1){
        return false;
      //  this.showErrorToast();
      }
     
    console.log("Save Handler ", data); 
     if (index !== undefined) {
      
    item.name = data.name; 
    item.amount = data.amount;
    item.due_day=data.due_day; 
    this.dataService.editItem(item, index);
      } else {
        console.log(data);
       data['userid']=this.userCrudService.logger;
    //  data['userid']=1;
    this.dataService. addItem(data);

              }
                 }
    }
     ]
 
    });
    await prompt.present();
}
}