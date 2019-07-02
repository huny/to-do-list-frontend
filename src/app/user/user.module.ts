import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './sign-up/sign-up.component';
import { ResetpasswordComponent } from './reset-password/reset-password.component';

import { NgxSpinnerModule } from 'ngx-spinner';

import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [LoginComponent, SignupComponent, ResetpasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgxSpinnerModule,
    RouterModule.forChild([
      { path: 'sign-up', component: SignupComponent },
      { path: 'reset-password/:resetPasswordToken', component: ResetpasswordComponent }
    ])
  ]
})
export class UserModule { }
