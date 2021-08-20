import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  message: any;
  messageClass: any;
  newPost = false;
  loadingBlogs = false;
  form: any;
  processing = false;
  username: any;
  blogPosts: any;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService
  ) { 
    this.createNewBlogForm();
  }

  createNewBlogForm(){
    this.form = this.formBuilder.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5),
        this.alphaNumericValidation
      ])],
      body: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(5)
      ])]
    })
  }
  

  enableFormNewBlogForm() {
    this.form.get('title').enable(); 
    this.form.get('body').enable();
  }

 
  disableFormNewBlogForm() {
    this.form.get('title').disable(); 
    this.form.get('body').disable(); 
  }


  alphaNumericValidation(controls: any){
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    if(regExp.test(controls.value)){
      return null;
    } else {
      return { 'alphaNumericValidation': true }
    }
  }


  newBlogForm(){
    this.newPost = true;  
  }


  reloadBlogs(){
    this.loadingBlogs = true;
    this.getAllBlogs();
    setTimeout(() => {
      this.loadingBlogs = false;
    }, 2000);
  }

  draftComment(){
    
  }

  onBlogSubmit(){
    this.processing = true;
    this.disableFormNewBlogForm();
    const blog = {
      title: this.form.get('title').value,
      body: this.form.get('body').value,
      createdBy: this.username
    }
    this.blogService.newBlog(blog).subscribe((data:any) => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false; 
        this.enableFormNewBlogForm(); 
      } else {
        this.messageClass = 'alert alert-success'; 
        this.message = data.message;
        this.getAllBlogs();
        setTimeout(() => {
          this.newPost = false; 
          this.processing = false; 
          this.message = false; 
          this.form.reset(); 
          this.enableFormNewBlogForm();
        }, 1000);
      }
    });
  }

  goBack(){
    window.location.reload();
  }

  getAllBlogs(){
    this.blogService.getAllBlogs().subscribe((data:any) => {
      this.blogPosts = data.blogs
    })
  }

  ngOnInit(): void {
    this.authService.getProfile().subscribe((profile: any) => {
      this.username = profile.user.username;
    });

    this.getAllBlogs();
  }

}
