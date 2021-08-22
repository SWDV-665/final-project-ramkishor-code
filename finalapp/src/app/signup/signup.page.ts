import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from "@angular/forms";
import { UserCrudService } from '../providers/usercrud/userCrud.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  userForm: FormGroup;
  constructor(
    public toastController: ToastController,
    private router: Router,
    public formBuilder: FormBuilder,
    private zone: NgZone,
    private userCrudService: UserCrudService    
  ) {
    this.userForm = this.formBuilder.group({
      name: [''],
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
      message: 'Successfully Registered',
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
    if (!this.userForm.valid) {
      this.validateToast();
      return false;
    } else {
      this.userCrudService.createUser(this.userForm.value)
        .subscribe((response) => {
          this.zone.run(() => {
            this.successToast();
            this.userForm.reset();
            this.router.navigate(['/login']);
          })
        });
    }
  }

}
