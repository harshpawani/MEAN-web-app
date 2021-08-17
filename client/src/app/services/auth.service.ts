import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  domain = "http://localhost:3000";

  constructor(private http: HttpClient) { }


  registerUser(user:any){
    return this.http.post(this.domain + '/authentication/register', user);
  }
}
 