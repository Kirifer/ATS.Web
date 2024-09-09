// import { Component, ViewChild, ElementRef } from '@angular/core';
// import { Router } from '@angular/router';
// import { AuthService } from '../../../auth/auth.service';
// import { User } from '../../../models/user';

// @Component({
//   selector: 'app-admin-login',
//   templateUrl: './admin-login.component.html',
//   styleUrls: ['./admin-login.component.css']
// })
// export class AdminLoginComponent {
//   @ViewChild('container') container!: ElementRef;

//   username: string = '';
//   password: string = '';

//   signUpFirstName: string = '';
//   signUpLastName: string = '';
//   signUpEmail: string = '';
//   signUpUsername: string = '';
//   signUpPassword: string = '';

//   constructor(private router: Router, private authService: AuthService) { }

//   onSubmitSignIn(): void {
//     this.authService.login(this.username, this.password).subscribe(
//       response => {
//         if (response.succeeded) {
//           this.authService.isAuthenticated().subscribe(isAuth => {
//             if (isAuth) {
//               if (response.data.isAdmin) {
//                 this.router.navigate(['/admin/admin-dashboard']);
//               } else {
//                 this.router.navigate(['/public/public-dashboard']);
//               }
//             }
//           });
//         } else {
//           alert('Invalid credentials');
//         }
//       },
//       error => {
//         console.error('Login error:', error);
//         alert('Invalid credentials');
//       }
//     );
//   }

//   onSubmitSignUp(): void {
//     const registrationData: User = {
//       id: '', // This will be generated by the backend
//       username: this.signUpUsername,
//       password: this.signUpPassword,
//       firstName: this.signUpFirstName,
//       lastName: this.signUpLastName,
//       email: this.signUpEmail,
//       isAdmin: false, // Default value, can be changed based on your logic
//       isApplicant: true, // Default value, can be changed based on your logic
//       createdOn: new Date(),
//       // Optional fields can be left out or set to null
//     };

//     this.authService.register(registrationData).subscribe(
//       response => {
//         alert('Registration successful');
//         this.onLoginClick();
//       },
//       error => {
//         console.error('Registration error:', error);
//         alert('Registration failed');
//       }
//     );
//   }

//   onLoginClick(): void {
//     this.container.nativeElement.classList.remove("active");
//   }

//   onRegisterClick(): void {
//     this.container.nativeElement.classList.add("active");
//   }
// }


// import { Component, ViewChild, ElementRef } from '@angular/core';
// import { Router } from '@angular/router';
// import { AuthService } from '../../../auth/auth.service';
// import { User } from '../../../models/user';

// @Component({
//   selector: 'app-admin-login',
//   templateUrl: './admin-login.component.html',
//   styleUrls: ['./admin-login.component.css']
// })
// export class AdminLoginComponent {
//   @ViewChild('container') container!: ElementRef;

//   username: string = '';
//   password: string = '';

//   signUpFirstName: string = '';
//   signUpLastName: string = '';
//   signUpEmail: string = '';
//   signUpUsername: string = '';
//   signUpPassword: string = '';

//   constructor(private router: Router, private authService: AuthService) {}

//   onSubmitSignIn(): void {
//     this.authService.login(this.username, this.password).subscribe(
//       response => {
//         console.log('Login Response:', response?.data); // Debugging log
//         if (response && response.succeeded && response.data && response.data.token) {
//           this.authService.getCurrentUser();
//           this.authService.isAuthenticated().subscribe(isAuth => {
//             console.log('Is Authenticated:', isAuth); // Debugging log
//             const currentUser = this.authService.getCurrentUser();
//             console.log('Current user:', currentUser); // Debugging log
//             if (isAuth) {
//               if (currentUser?.isAdmin) {
//                 console.log('User is admin, redirecting to admin-dashboard'); // Debugging log
//                 this.router.navigate(['/admin/admin-dashboard']);
//               } else {
//                 console.log('User is not admin, redirecting to applicant-status'); // Debugging log
//                 this.router.navigate(['/applicant-status']);
//               }
//             } else {
//               console.error('User is not authenticated'); // Debugging log
//               this.router.navigate(['/login']);
//             }
//           });
//         } else {
//           alert('Invalid credentials');
//         }
//       },
//       error => {
//         console.error('Login error:', error); // Debugging log
//         alert('Invalid credentials');
//       }
//     );
//   }

//   onSubmitSignUp(): void {
//     const registrationData: User = {
//       id: '', // This will be generated by the backend
//       username: this.signUpUsername,
//       password: this.signUpPassword,
//       firstName: this.signUpFirstName,
//       lastName: this.signUpLastName,
//       email: this.signUpEmail,
//       isAdmin: false, // Default value, can be changed based on your logic
//       isApplicant: true, // Default value, can be changed based on your logic
//       createdOn: new Date(),
//     };

//     this.authService.register(registrationData).subscribe(
//       response => {
//         alert('Registration successful');
//         this.onLoginClick();
//       },
//       error => {
//         console.error('Registration error:', error); // Debugging log
//         alert('Registration failed');
//       }
//     );
//   }

//   onLoginClick(): void {
//     this.container.nativeElement.classList.remove("active");
//   }

//   onRegisterClick(): void {
//     this.container.nativeElement.classList.add("active");
//   }
// }


import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../models/user';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  @ViewChild('container') container!: ElementRef;

  username = '';
  password = '';
  errorMessage = '';

  signUpFirstName = '';
  signUpLastName = '';
  signUpEmail = '';
  signUpUsername = '';
  signUpPassword = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmitSignIn(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        // After login, fetch the user's identity
        this.authService.getIdentity().subscribe({
          next: (isAuthenticated) => {
            if (isAuthenticated) {
              const user = this.authService.getCurrentUser();
              // Navigate based on user roles
              if (user?.isAdmin) {
                this.router.navigate(['/admin/admin-dashboard']);
              } else if (user?.isApplicant) {
                this.router.navigate(['/applicant-status']);
              } else {
                this.router.navigate(['/dashboard']); // Default route if neither role is matched
              }
            } else {
              this.errorMessage = 'Failed to retrieve user identity.';
            }
          },
          error: () => {
            this.errorMessage = 'Error fetching user identity.';
          }
        });
      },
      error: () => {
        this.errorMessage = 'Login failed. Please check your credentials.';
      }
    });
  }

  onSubmitSignUp(): void {
    const registrationData: User = {
      userId: '', // This will be generated by the backend
      username: this.signUpUsername,
      password: this.signUpPassword,
      firstName: this.signUpFirstName,
      lastName: this.signUpLastName,
      email: this.signUpEmail,
      isAdmin: false, // Default value, can be changed based on your logic
      isApplicant: true, // Default value, can be changed based on your logic
      createdOn: new Date(),
    };

    this.authService.register(registrationData).subscribe({
      next: () => {
        alert('Registration successful');
        this.onLoginClick();
      },
      error: () => this.errorMessage = 'Registration failed. Please try again.'
    });
  }

  onLoginClick(): void {
    this.container.nativeElement.classList.remove("active");
  }

  onRegisterClick(): void {
    this.container.nativeElement.classList.add("active");
  }
}