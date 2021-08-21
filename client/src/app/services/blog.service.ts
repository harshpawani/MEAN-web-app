import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt'
import { map } from 'rxjs/operators';

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
  

  getSingleBlog(id:any) {
    this.createAuthenticationHeaders(); 
    return this.http.get(this.domain + 'blogs/singleBlog/' + id, {headers: this.options})
  }

  editBlog(blog:any) {
    this.createAuthenticationHeaders();
    return this.http.put(this.domain + 'blogs/updateBlog/', blog, {headers: this.options})
  }

  deleteBlog(id:any) {
    this.createAuthenticationHeaders();
    return this.http.delete(this.domain + 'blogs/deleteBlog/' + id, {headers: this.options});
  }

  likeBlog(id:any) {
    const blogData = { id: id };
    return this.http.put(this.domain + 'blogs/likeBlog/', blogData, {headers: this.options});
  }

  
  dislikeBlog(id:any) {
    const blogData = { id: id };
    return this.http.put(this.domain + 'blogs/dislikeBlog/', blogData, {headers: this.options});
  }

  postComment(id:any, comment:any) {
    this.createAuthenticationHeaders();
    const blogData = {
      id: id,
      comment: comment
    }
    return this.http.post(this.domain + 'blogs/comment', blogData, {headers: this.options});

  }
}
