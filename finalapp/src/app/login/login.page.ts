
import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from "@angular/forms";
import { UserCrudService } from '../providers/usercrud/userCrud.service';
import { ToastController } from '@ionic/angular';




@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  userlogin: FormGroup;
  constructor(
    public toastController: ToastController,
    private router: Router,
    public formBuilder: FormBuilder,
    private zone: NgZone,
    private userCrudService: UserCrudService   
  ) { 

    this.userlogin = this.formBuilder.group({
      
      email: [''],
      password: [''],
  
    })

  }

 ngOnInit() {
 }
 async presentToast() {
  const toast = await this.toastController.create({
    message: 'Failed to Login',
    duration: 2000
  });
  toast.present();
}
async successToast() {
  const toast = await this.toastController.create({
    message: 'Successfully logged in',
    duration: 2000
  });
  toast.present();
}
async validateToast() {
  const toast = await this.toastController.create({
    message: 'Please fill all details and provide valid inputs',
    duration: 2000
  });
  toast.present();
}

 onSubmit() {
   if (!this.userlogin.valid) {
    this.validateToast();
     return false;
     
   } else {
     console.log(this.userlogin.value);
     this.userCrudService.loginUser(this.userlogin.value)
       .subscribe((response) => {
         this.zone.run(() => {
           
           if(response==null){
            this.presentToast();
            
            this.userlogin.reset();
           }else{
            this.successToast();
            this.userCrudService.logger=response._id;
            this.userlogin.reset();
            console.log(this.userCrudService.logger);
            this.router.navigate(['/tabs/tabs/tab1']); 
           }
         
           
         })
       });
   }
 }

}

