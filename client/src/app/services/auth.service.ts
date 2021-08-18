import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface RegisterResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  domain = "http://localhost:3000";
  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }


  registerUser(user:any){
    return this.http.post<RegisterResponse>(this.domain + '/authentication/register', user, { headers: this.headers });
  }

  checkUsername(username:any){
    return this.http.get<RegisterResponse>(this.domain + '/authentication/checkUsername/' + username);
  }

  checkEmail(email:any){
    return this.http.get<RegisterResponse>(this.domain + '/authentication/checkEmail/' + email);
  }
}
 