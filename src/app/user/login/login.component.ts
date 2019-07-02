import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AppService } from './../../app.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email: any;
  public password: any;

  constructor(
    public appService: AppService,
    public router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
  }

  public goToSignUp: any = () => {

    this.router.navigate(['/sign-up']);

  } // end goToSignUp

  public forgotPassword: any = () => {
    if (!this.email) {
      this.toastr.warning('Enter email')
    } else {
      this.spinner.show();
      this.appService.forgotPassword(this.email)
        .subscribe((apiResponse) => {
          if (apiResponse.status === 200) {
            this.spinner.hide();
            this.toastr.success('A password reset mail sent to your mail id.')
          } else {
            this.spinner.hide();
            this.toastr.error(apiResponse.message)
          }
        }, (err) => {
          this.spinner.hide();
          this.toastr.error(`some error occured: ${err.message}`)

        })
    }
  }

  public signinFunction: any = () => {

    if (!this.email) {
      this.toastr.warning('Enter email')


    } else if (!this.password) {

      this.toastr.warning('Enter password')


    } else {

      let data = {
        email: this.email,
        password: this.password
      }

      this.appService.signinFunction(data)
        .subscribe((apiResponse) => {

          if (apiResponse.status === 200) {

            Cookie.set('authToken', apiResponse.data.authToken);

            Cookie.set('userId', apiResponse.data.userDetails.userId);

            Cookie.set('userName', apiResponse.data.userDetails.userName);

            this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails)

            this.toastr.success('User logged in successfully')
            this.router.navigate([`/to-do-list`]);

          } else {

            this.toastr.error(apiResponse.message)

          }

        }, (err) => {
          this.toastr.error(`some error occured: ${err.message}`)

        });

    } // end condition

  } // end signinFunction





}