import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private flashMessagessSerivce: FlashMessagesService,
    private router: Router
  ) { }

    onLogoutClick(){
      this.authService.logout();
      this.flashMessagessSerivce.show('You are logged out', { cssClass: 'alert-info' });
      this.router.navigate(['/'])
    }

  ngOnInit(): void {
  }

}
