import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDetailService } from 'src/app/services/userDetail/user-detail.service';
import { SnotifyService } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: [ './edit-user.component.css' ],
})
export class EditUserComponent implements OnInit {
  userId: string;
  userForm: FormGroup;
  user: any = {};
  onGoingRequest = false;
  constructor(
    private formBuilder: FormBuilder,
    private activateRoute: ActivatedRoute,
    private userApi: UserDetailService,
    private router: Router,
    private snotifyService: SnotifyService,
    private spinner: NgxSpinnerService,
  ) {
    this.userForm = this.formBuilder.group({
      firstName: [ '', [ Validators.required ] ],
      lastName: [ '', [ Validators.required ] ],
      email: [
        '',
        Validators.compose([
          Validators.pattern(
            // tslint:disable-next-line: max-line-length
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          ),
        ]),
      ],
      phone: [ '', [ Validators.pattern('[6-9]\\d{9}') ] ],
      jobTitle: [ '' ],
    });
  }

  ngOnInit() {
    this.userId = this.activateRoute.snapshot.paramMap.get('userId');
    this.spinner.show();
    this.userApi
      .getUserById(this.userId)
      .toPromise()
      .then((res: any) => {
        this.user = res.user;
        this.initForm();
      })
      .catch((err) => {
        this.spinner.hide();
        if (err.status === 404) {
          this.router.navigate([ '/' ]);
        }
      });
  }

  initForm() {
    this.userForm = this.formBuilder.group({
      firstName: [ this.user.firstName, [ Validators.required ] ],
      lastName: [ this.user.lastName, [ Validators.required ] ],
      email: [
        this.user.email,
        Validators.compose([
          Validators.pattern(
            // tslint:disable-next-line: max-line-length
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          ),
        ]),
      ],
      phone: [ this.user.phone, [ Validators.pattern('[6-9]\\d{9}') ] ],
      jobTitle: [ this.user.jobTitle ],
    });
    this.spinner.hide();
  }

  getChangedProperties() {
    const changedProperties = {};
    Object.keys(this.userForm.controls).forEach((name) => {
      const currentControl = this.userForm.controls[name];
      if (currentControl.dirty) {
        changedProperties[name] = this.userForm.controls[name].value;
      }
    });
    return changedProperties;
  }

  updateUser() {
    const data = this.getChangedProperties();
    if (Object.keys(data).length) {
      this.onGoingRequest = true;
      const updatedData: any = this.getChangedProperties();
      updatedData.updatedBy = this.user.firstName + ' ' + this.user.lastName;
      this.userApi
        .updateUserById(this.user._id, updatedData)
        .toPromise()
        .then((res) => {
          this.onGoingRequest = false;
          this.snotifyService.success('User Updated Suceesfully!!!');
        })
        .catch((err) => {
          this.onGoingRequest = false;
          this.snotifyService.error('Something went wrong!!!');
        });
    }
  }

  linkImg(fileName) {
    // base_URL returns localhost:3000 or the production URL
    return `http://localhost:3000/static/${fileName}`;
  }
}
