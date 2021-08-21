import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit {
  currentUrl: any;
  username: any;
  email: any;
  foundProfile = false;
  messageClass: any;
  message: any;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params; 
    this.authService.getPublicProfile(this.currentUrl.username).subscribe((data: any) => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; 
        this.message = data.message; 
      } else {
        this.username = data.user.username; 
        this.email = data.user.email;
        this.foundProfile = true;
      }
    });
  }

}