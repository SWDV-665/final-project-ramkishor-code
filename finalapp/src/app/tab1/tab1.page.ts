import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { billServiceProvider } from '../providers/bill-service/bills-service';
import { InputDialogServiceProvider } from '../providers/input-dialog-service/input-dialog-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.css']
})
export class Tab1Page {
  errorMessage: string;
  constructor(
    private router: Router,
    public navCtrl: NavController,
     public toastCtrl: ToastController,
      public alertCtrl: AlertController,
      public socialSharing: SocialSharing,
      public dataService:billServiceProvider,
      public inputDialogService: InputDialogServiceProvider )
   {
    dataService.dataChanged$.subscribe( (dataChanged: boolean) => {
      this.loadItems();
      
     });
   }
  items =[];
  ngOnInit() {
    this.loadItems();
    
  }

  ionViewDidLoad() {
    this.loadItems();
  }
    loadItems() {
       this.dataService.getItems() .subscribe(
         items => this.items = items,
         error => this.errorMessage = error);
        console.log(this.items);
        
          }

     async  removeItem(item) {
        const toast = await this.toastCtrl.create({
          message: 'deleting Item - ' + item.name + " ...",
          duration: 3000
        });
        await toast.present();
    this.dataService.removeItem(item);
    this.loadItems();
    

       }
  
  async shareItem(item, index) {
    console.log("Sharing Item - ", item, index);
    const toast = await this.toastCtrl.create({
      message: 'Sharing Item - ' + index + " ...",
      duration: 3000
    });

   await toast.present();

    let message = "billing Item - Name: " + item.name + " - Quantity: " + item.amount;
    let subject = "Shared via Bitracker";

    this.socialSharing.share(message, subject).then(() => {
      // Sharing via email is possible
      console.log("Shared successfully!");
    }).catch((error) => {
      console.error("Error while sharing ", error);
    });    

  }
 
  async editItem(item, index) {
    console.log("Edit Item - ", item, index);
    const toast = await this.toastCtrl.create({
    message: 'Editing Item - ' + index + '',
    duration: 3000
    });
    await toast.present();
    this.inputDialogService.showPrompt(item, index);
    this.loadItems();
    }
    

    addItem() {
     
    console.log("Adding Item");
    this.inputDialogService.showPrompt();
    this.loadItems();
    }

    logout(){
      this.router.navigate(['/']); 
    }
}



        
  

