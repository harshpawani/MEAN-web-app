import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt'

export interface RegisterResponse {
  token: any;
  user: any;
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  domain = "http://localhost:3000";
  authToken: any;
  user: any;
  options: any;
  helper = new JwtHelperService();

  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  createAuthenticationHeaders(){
    this.loadToken();
    this.options = new HttpHeaders({
        'Content-Type': 'application/json',
        'authorization': this.authToken
      });
  }
  
  loadToken() {
    const token = localStorage.getItem('token');
    this.authToken = token
  }

  registerUser(user:any){
    return this.http.post<RegisterResponse>(this.domain + '/authentication/register', user, { headers: this.headers });
  }

  checkUsername(username:any){
    return this.http.get<RegisterResponse>(this.domain + '/authentication/checkUsername/' + username);
  }

  checkEmail(email:any){
    return this.http.get<RegisterResponse>(this.domain + '/authentication/checkEmail/' + email);
  }

  login(user:any){
    return this.http.post<RegisterResponse>(this.domain + '/authentication/login', user, { headers: this.headers });
  }

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  storeUserData(token: any, user: any){
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  getProfile(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/authentication/profile', {headers: this.options}, );
  }

  loggedIn(): boolean{
    const token = localStorage.getItem('token');
    return this.helper.isTokenExpired(token);
  }
}
 