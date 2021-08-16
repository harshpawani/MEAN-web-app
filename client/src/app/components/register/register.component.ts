import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validator } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form = this.formBuilder.group({
      email: '',
      username: '',
      password: '',
      confirm: ''
    });

  constructor(
    private formBuilder: FormBuilder, 
  ) { }

  ngOnInit(): void {
  }

}
