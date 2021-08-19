import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class NotauthGuard implements CanActivate {

	constructor(
		private authService: AuthService,
		private router: Router
	) { }

	canActivate(): boolean {
		if(!this.authService.loggedIn()) {
			this.router.navigate(['/']);
			return false;
		} else {
			return true;
		}
	}
}