import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AppService } from './../../app.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignupComponent implements OnInit {

  public firstName: any;
  public lastName: any;
  public mobile: any;
  public email: any;
  public password: any;
  public countryCode: any;
  public countryCodeList: any;



  constructor(
    public appService: AppService,
    public router: Router,
    private toastr: ToastrService) {
    this.getCountryCodeList();
  }

  ngOnInit() {
  }


  public getCountryCodeList: any = () => {
    this.countryCodeList = this.appService.getCountryCodeList();
  }

  public goToSignIn: any = () => {

    this.router.navigate(['/login']);

  } // end goToSignIn

  public signupFunction: any = () => {

    if (!this.firstName) {
      this.toastr.warning('Enter first name')

    } else if (!this.lastName) {
      this.toastr.warning('Enter last name')

    } else if (!this.mobile) {
      this.toastr.warning('Enter mobile number')

    } else if (!this.countryCode) {
      this.toastr.warning('Select country code')

    } else if (!this.email) {
      this.toastr.warning('Enter email')

    } else if (!this.password) {
      this.toastr.warning('Enter password')

    } else {

      let data = {
        firstName: this.firstName,
        lastName: this.lastName,
        mobile: this.mobile,
        email: this.email,
        password: this.password,
        countryCode: this.countryCode
      }

      this.appService.signupFunction(data)
        .subscribe((apiResponse) => {

          if (apiResponse.status === 200) {

            this.toastr.success('Signup successful');

            setTimeout(() => {

              this.goToSignIn();

            }, 2000);

          } else {

            this.toastr.error(apiResponse.message);

          }

        }, (err) => {

          this.toastr.error('some error occured');

        });

    } // end condition

  } // end signupFunction

}
