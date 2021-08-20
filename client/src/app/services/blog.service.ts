import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt'

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  options: any;
  domain = this.authService.domain;

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }

  createAuthenticationHeaders(){
    this.authService.loadToken();
    this.options = new HttpHeaders({
        'Content-Type': 'application/json',
        'authorization': this.authService.authToken
      });
  }

  newBlog(blog:any) {
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'blogs/newBlog', blog,  {headers: this.options})
  }

  getAllBlogs(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'blogs/allBlogs', {headers: this.options});
  }
}
