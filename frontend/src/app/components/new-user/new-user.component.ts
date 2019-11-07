import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserDetailService } from 'src/app/services/userDetail/user-detail.service';
import { FileUploader} from 'ng2-file-upload';
import { environment } from '../../../environments/environment';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {
  userForm: FormGroup;
  fileToUpload: File;
  isFileSelected = false;
  uploader: FileUploader;

  constructor(private formBuilder: FormBuilder, private userApi: UserDetailService, private snotifyService: SnotifyService) {
    this.userForm = this.formBuilder.group({
      'firstName': ['', [Validators.required]],
      'lastName': ['', [Validators.required]],
      'email': ['', Validators.compose([
        Validators.pattern(
          // tslint:disable-next-line: max-line-length
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
      ])],
      'phone': ['', [Validators.pattern('[6-9]\\d{9}')]],
      'jobTitle': [''],
    });
    this.uploader = new FileUploader({});

    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
    };
   }
  ngOnInit() {
  }

  onFileSelected(event) {
    const file: File = event[0];
    this.fileToUpload = file;
    this.isFileSelected = true;
  }

  createUser() {
    let url = environment.BASE_URL;
    const firstName = this.userForm.get('firstName').value;
    const lastName = this.userForm.get('lastName').value;
    const email = this.userForm.get('email').value;
    const phone = this.userForm.get('phone').value;
    const jobTitle = this.userForm.get('jobTitle').value;
    if (this.isFileSelected) {
      // tslint:disable-next-line: max-line-length
      url += `/user/newUser?isFileSelected=${this.isFileSelected}&firstName=${firstName}&lastName=${lastName}&email=${email}&phone=${phone}&jobTitle=${jobTitle}`;
      this.uploader.setOptions({ url: url, itemAlias: 'file' });
      this.uploader.uploadAll();
      this.uploader.onSuccessItem = () => {
        this.snotifyService.success('User Created Suceesfully!!!');
        this.userForm.reset();
      };
      this.uploader.onErrorItem = () =>  this.snotifyService.error('Something went wrong!!!');

    } else {
      const newUser = {firstName, lastName, email, phone, jobTitle, fileSelected: true};
      this.userApi.createNewUser(newUser).toPromise().then(res => {
        this.snotifyService.success('User Created Suceesfully!!!');
        this.userForm.reset();
      }).catch(err => {
        this.snotifyService.error('Something went wrong!!!');
      });
    }
  }

  _keyPress(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
        event.preventDefault();
    }
}

}
