import { Component, OnInit } from '@angular/core';
import { UserDetailService } from 'src/app/services/userDetail/user-detail.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  users = [];
  baseUrl = '';
  constructor(private userApi: UserDetailService, private router: Router, private spinner: NgxSpinnerService
) { }

  ngOnInit() {
    this.spinner.show();
    this.userApi.listOfUsers().toPromise().then((res: any) => {
      this.users = res.users;
      this.spinner.hide();
    }).catch(err => {
      this.spinner.hide();
    });
    this.baseUrl = environment.BASE_URL;
  }
  linkImg(fileName) {
// base_URL returns localhost:3000 or the production URL
    return `http://localhost:3000/static/${fileName}`;
  }
  editUser(id) {
    this.router.navigate([
      'edit-user/',
      id,
    ]);
  }


}
