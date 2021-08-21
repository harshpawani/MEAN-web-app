import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  username: any;
  email: any;
  
  constructor(
    private authService: AuthService,) { }

  ngOnInit(): void {
    this.authService.getProfile().subscribe((profile: any) => {
      this.username = profile.user.username;
      this.email = profile.user.email;
    })
  }

}
