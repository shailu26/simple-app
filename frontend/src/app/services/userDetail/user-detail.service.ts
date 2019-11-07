import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

const HTTP_OPTIONS = {
  'headers': new HttpHeaders({'content-type': 'application/json', 'Access-Control-Allow-Origin': '*'})
};
@Injectable({
  providedIn: 'root'
})
export class UserDetailService {

  constructor(private http: HttpClient) { }

  createNewUser(userData) {
    return this.http.post(`${environment.BASE_URL}/user/newUser`, userData, HTTP_OPTIONS);
  }
  listOfUsers() {
    return this.http.get(`${environment.BASE_URL}/user/getAllUser`, HTTP_OPTIONS);
  }
  getUserById(id) {
      return this.http.get(`${environment.BASE_URL}/user/userById?userId=${id}`, HTTP_OPTIONS);
  }
  updateUserById(id, data) {
      return this.http.patch(`${environment.BASE_URL}/user/updateUser/${id}`, data, HTTP_OPTIONS);

  }
}
