import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';
import { NotauthGuard } from './guards/Notauth.guard';
import { BlogComponent } from './components/blog/blog.component';



const routes: Routes = [
  { 
    path: '',
    component: HomeComponent
  },
  { 
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'register',
    component: RegisterComponent,
    canActivate: [NotauthGuard]
  },
  { 
    path: 'login',
    component: LoginComponent,
    canActivate: [NotauthGuard]
  },
  { 
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'blog',
    component: BlogComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: '**',
    component: HomeComponent 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
