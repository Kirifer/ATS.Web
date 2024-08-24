import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../models/user';
import { catchError, Observable, tap, throwError, map } from 'rxjs';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  @ViewChild('container') container!: ElementRef;

  // Properties for login
  username: string = '';
  password: string = '';

  // Properties for registration (applicant only)
  signUpFirstName: string = '';
  signUpLastName: string = '';
  signUpEmail: string = '';
  signUpUsername: string = '';
  signUpPassword: string = '';

  constructor(private router: Router, private http: HttpClient) { }

  // Login Functionality
  onSubmitSignIn(): void {
    const loginData = {
      username: this.username,
      password: this.password
    };

    this.http.post<User>('https://localhost:7012/login', loginData).pipe(
      tap(user => console.log('Login response:', user)), // Debugging log
      map(user => {
        // Optionally modify user or handle different cases here
        console.log('Mapped user:', user);
        return user;
      }),
      catchError(error => {
        console.error('Login error:', error); // Error logging
        alert('Invalid credentials');
        return throwError(error);
      })
    ).subscribe(
      (user: User) => {
        if (user.isAdmin) {
          console.log('Admin user logged in:', user);
          this.router.navigate(['/admin/admin-dashboard']);
        } else {
          console.log('Applicant user logged in:', user);
          this.router.navigate(['/public/public-dashboard']);
        }
      },
      (error) => {
        console.error('Login subscription error:', error); // Subscription error logging
      }
    );
  }

  // Registration Functionality
  onSubmitSignUp(): void {
    const registrationData = {
      firstName: this.signUpFirstName,
      lastName: this.signUpLastName,
      email: this.signUpEmail,
      username: this.signUpUsername,
      password: this.signUpPassword,
      isAdmin: false,
      isApplicant: true
    };

    this.http.post<User>('https://localhost:7012/register', registrationData).pipe(
      tap(user => console.log('Registration response:', user)), // Debugging log
      map(user => {
        // Optionally modify user or handle different cases here
        console.log('Mapped user:', user);
        return user;
      }),
      catchError(error => {
        console.error('Registration error:', error); // Error logging
        alert('Registration failed');
        return throwError(error);
      })
    ).subscribe(
      (user: User) => {
        console.log('Registration successful:', user);
        alert('Registration successful');
        this.onLoginClick(); // Switch to the login view after successful registration
      },
      (error) => {
        console.error('Registration subscription error:', error); // Subscription error logging
      }
    );
  }

  // Method to switch to the login form
  onLoginClick(): void {
    this.container.nativeElement.classList.remove("active");
    console.log('Switched to login view');
  }

  // Method to switch to the registration form
  onRegisterClick(): void {
    this.container.nativeElement.classList.add("active");
    console.log('Switched to registration view');
  }
}
