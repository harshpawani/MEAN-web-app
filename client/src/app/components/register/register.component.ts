import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        this.validateUsername
      ]],
      password: ['', [
        Validators.required,
        this.validatePassword
      ]],
      confirm: ['', [Validators.required]],  
    },  
      {  
        validator: this.matchingPasswords('password', 'confirm'),  
      }  
    ); 

  message: any;
  messageClass: any; 
  processing: boolean = false;
  emailValid = false;
  usernameClass: any; 
  emailMessage: any;
  usernameValid = false;
  emailClass: any; 
  usernameMessage: any;


  get email() {
    return this.form.get('email');
  }

  validateUsername(controls: any) {
    // Create a regular expression
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    // Test username against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid username
    } else {
      return { 'validateUsername': true } // Return as invalid username
    }
  }

  validatePassword(controls: any) {
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    if (regExp.test(controls.value)) {
      return null; 
    } else {
      return { 'validatePassword': true } 
    }
  }

  matchingPasswords(password: any, confirm: any) {
    return (group: FormGroup) => {
      if (group.controls[password].value === group.controls[confirm].value) {
        return null;
      } else {
        return { 'matchingPasswords': true } 
      }
    }
  }

  onRegisterSubmit() {
    this.processing = true;
    const user = {
      email: this.form.get('email').value,
      username: this.form.get('username').value,
      password: this.form.get('password').value
    }
    this.authService.registerUser(user).subscribe(data => {
      if(data.success == false) {
        this.messageClass = "alert alert-danger";
        this.message = data.message;
        this.processing = false;
      }
      else {
        this.messageClass = "alert alert-success";
        this.message = data.message;
        this.form.reset({})
        setTimeout(() => {
          this.router.navigate(['/login'])
        }, 2000)
      }
    });
    // console.log(this.form.get('email').value);
    // console.log(this.form.get('username').value);
  }

  checkEmail() {
    this.authService.checkEmail(this.form.get('email').value).subscribe(data => {
      console.log(this.form.get('email').value)
      if(data.success == false) {
        this.emailValid = false;
        this.emailClass = "alert alert-danger";
        this.emailMessage = data.message;
      } else {
        this.emailValid = true;
        this.emailClass = "alert alert-success";
        this.emailMessage = data.message;
      }
    });
  }
  
  checkUsername() {
    this.authService.checkUsername(this.form.get('username').value).subscribe(data => {
      if(data.success == false) {
        this.usernameValid = false;
        this.usernameClass = "alert alert-danger";
        this.usernameMessage = data.message;
      } else {
        this.usernameValid = true;
        this.usernameClass = "alert alert-success";
        this.usernameMessage = data.message;
      }
    });
  }
  

  

  constructor(
    private formBuilder: FormBuilder, 
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

}
