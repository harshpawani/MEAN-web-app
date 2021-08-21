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
  newComment = <any>[];
  commentForm: any;
  enabledComments = <any>[];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService
  ) { 
    this.createNewBlogForm();
    this.createCommentForm();
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

  createCommentForm() {
    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(200)
      ])]
    })
  }

  // Enable the comment form
  enableCommentForm() {
    this.commentForm.get('comment').enable(); // Enable comment field
  }

  // Disable the comment form
  disableCommentForm() {
    this.commentForm.get('comment').disable(); // Disable comment field
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

  draftComment(id:any){
    this.commentForm.reset(); // Reset the comment form each time users starts a new comment
    this.newComment = []; // Clear array so only one post can be commented on at a time
    this.newComment.push(id);
  }

  cancelSubmission(id:any) {
    const index = this.newComment.indexOf(id); // Check the index of the blog post in the array
    this.newComment.splice(index, 1); // Remove the id from the array to cancel post submission
    this.commentForm.reset(); // Reset  the form after cancellation
    this.enableCommentForm(); // Enable the form after cancellation
    this.processing = false; // Enable any buttons that were locked
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

  likeBlog(id:any) {
    this.blogService.likeBlog(id).subscribe((data:any) => {
      this.getAllBlogs(); 
    });
  }

  dislikeBlog(id:any) {
    this.blogService.dislikeBlog(id).subscribe((data:any) => {
      this.getAllBlogs(); 
    });
  }

  postComment(id:any) {
    this.disableCommentForm(); 
    this.processing = true; 
    const comment = this.commentForm.get('comment').value;
    this.blogService.postComment(id, comment).subscribe(data => {
      this.getAllBlogs(); 
      const index = this.newComment.indexOf(id); 
      this.newComment.splice(index, 1);
      this.enableCommentForm();
      this.commentForm.reset(); 
      this.processing = false; 
      if (this.enabledComments.indexOf(id) < 0) this.expand(id); 
    });
  }

  
  expand(id:any) {
    this.enabledComments.push(id);
  }


  collapse(id:any) {
    const index = this.enabledComments.indexOf(id); 
    this.enabledComments.splice(index, 1); 
  }


  ngOnInit(): void {
    this.authService.getProfile().subscribe((profile: any) => {
      this.username = profile.user.username;
    });

    this.getAllBlogs();
  }

}
