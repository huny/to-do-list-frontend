import { Component, OnInit } from '@angular/core';
import { AppService } from './../../app.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetpasswordComponent implements OnInit {

  public password: any;
  public confirmPassword: any;
  public resetPasswordToken: any;
  public sub: any;

  constructor(
    public appService: AppService,
    public router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.resetPasswordToken = params['resetPasswordToken'];
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public goToSignUp: any = () => {

    this.router.navigate(['/sign-up']);

  } // end goToSignUp

  public goToSignIn: any = () => {

    this.router.navigate(['/login']);

  } // end goToSignIn

  public resetPassword: any = () => {
    if (!this.password) {
      this.toastr.warning('Enter password')
    } else if (!this.confirmPassword) {
      this.toastr.warning('Enter Confirm Password')
    } else if (this.password !== this.confirmPassword) {
      this.toastr.warning('Password do not match')
    } else {

      let data = {
        password: this.password,
        confirmPassword: this.confirmPassword,
        resetPasswordToken: this.resetPasswordToken
      }

      this.appService.resetPassword(data)
        .subscribe((apiResponse) => {
          if (apiResponse.status === 200) {
            this.toastr.success('Password changed successfully.')
            this.router.navigate(['/login'])
          } else {
            this.toastr.error(apiResponse.message)
          }
        }, (err) => {
          this.toastr.error(`some error occured: ${err.message}`)

        })
    }
  }

}
