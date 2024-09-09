// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, of } from 'rxjs';
// import { catchError, map } from 'rxjs/operators';
// import { Router } from '@angular/router';
// import { User } from '../models/user';
// import { CookieService } from 'ngx-cookie-service'; // Import the CookieService

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private apiUrl = 'https://localhost:7012';

//   constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) { } // Inject the CookieService

//   login(username: string, password: string): Observable<any> {
//     return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
//       map(response => {
//         console.log('Login response:', response); // Debugging log
//         if (response.succeeded && response.data && response.data.token) {
//           // Store token in cookies
//           this.cookieService.set('authToken', response.data.token);
//           console.log('Token stored:', response.data.token); // Debugging log
//           return response;
//         } else {
//           throw new Error('Login failed');
//         }
//       }),
//       catchError(error => {
//         console.error('Login error:', error); // Debugging log
//         throw new Error('Login failed');
//       })
//     );
//   }

//   register(user: User): Observable<any> {
//     return this.http.post<any>(`${this.apiUrl}/register`, user);
//   }

//   logout(): void {
//     this.cookieService.delete('authToken');
//     this.router.navigate(['/login']);
//   }

//   isAuthenticated(): Observable<boolean> {
//     const token = this.cookieService.get('authToken');
//     console.log('Retrieved token:', token); // Debugging log
//     if (!token) {
//       return of(false);
//     }

//     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
//     console.log('Headers:', headers); // Debugging log
//     return this.http.get<any>(`${this.apiUrl}/identity`, { headers }).pipe(
//       map(response => response.succeeded),
//       catchError(() => {
//         this.router.navigate(['/login']);
//         return of(false);
//       })
//     );
//   }
// }


// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, of } from 'rxjs';
// import { catchError, map } from 'rxjs/operators';
// import { Router } from '@angular/router';
// import { User } from '../models/user';
// import { CookieService } from 'ngx-cookie-service';
// import { DOCUMENT } from '@angular/common';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private apiUrl = 'https://localhost:7012';
//   private currentUser: User | null = null;

//   constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {}

//   private isTokenExpired(token: string): boolean {
//     const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
//     return (Math.floor((new Date).getTime() / 1000)) >= expiry;
//   }

//   login(username: string, password: string): Observable<any> {
//     return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
//       map(response => {
//         if (response.succeeded && response.data && response.data.token) {
//           this.cookieService.set('authToken', response.data.token, response.data.tokenExpiresIn, '/', '', true, 'Strict');
//           this.currentUser = {
//             ...response.data,
//           };
//           console.log('Current user after login:', this.currentUser); // Debugging log
//           return response;
//         } else {
//           throw new Error('Login failed');
//         }
//       }),
//       catchError(error => {
//         console.error('Login error:', error);
//         return of(null);
//       })
//     );
//   }
  

//   getCurrentUser(): User | null {
//     return this.currentUser;
//   }

//   isAuthenticated(): Observable<boolean> {
//     const token = this.cookieService.get('authToken');
//     if (!token || this.isTokenExpired(token)) {
//       return of(false);
//     }

//     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
//     return this.http.get<any>(`${this.apiUrl}/identity`, { headers }).pipe(
//       map(response => {
//         console.log('Authentication response:', response); // Debugging log
//         if (response.succeeded) {
//           this.currentUser = {
//             ...response.data,
//           };
//           console.log('Current user during authentication:', this.currentUser); // Debugging log
//           return true;
//         }
//         return false;
//       }),
//       catchError(() => {
//         this.router.navigate(['/login']);
//         return of(false);
//       })
//     );
//   }

//   logout(): void {
//     this.cookieService.delete('authToken');
//     this.currentUser = null;
//     this.router.navigate(['/dashboard']).then(() => {
//       window.location.reload();
//     });
//     alert('Successfully logged out'); // Show logout alert
//   }

//   register(user: User): Observable<any> {
//     return this.http.post<any>(`${this.apiUrl}/register`, user, { withCredentials: true });
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7012'; // Your API base URL
  private currentUser: User | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    console.debug('Attempting login with username:', username);
    
    const loginData = { username, password };
    return this.http.post<any>(`${this.apiUrl}/login`, loginData, { withCredentials: true }).pipe(
      map(response => {
        console.debug('Login response received:', response);
        
        if (response.succeeded && response.data && response.data.token) {
          this.currentUser = { ...response.data, id: response.data.userId, token: response.data.token };
          console.log('User logged in successfully:', this.currentUser);
          return response;
        } else {
          console.warn('Login failed:', response);
          throw new Error('Login failed');
        }
      }),
      catchError(error => {
        console.error('Login error occurred:', error);
        alert('Login failed. Please check your credentials and try again.');
        return of(null);
      })
    );
  }

  logout(): Observable<any> {
    console.debug('Logging out...');
    
    return this.http.post<any>(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        console.log('Logout successful.');
        this.currentUser = null;
        alert('You have been logged out successfully.');
        this.router.navigate(['/dashboard']);
      }),
      catchError(error => {
        console.error('Logout error occurred:', error);
        alert('An error occurred during logout. Please try again.');
        return of(null);
      })
    );
  }

  getIdentity(): Observable<boolean> {
    console.debug('Fetching user identity'); // Debugging log
  
    // Check if the user is already logged in by inspecting the current user
    if (!this.currentUser) {
      console.warn('User is not logged in, skipping identity fetch.');
      // return of(false); // Return false immediately if not logged in
    }
  
    return this.http.get<{ data: User, succeeded: boolean }>(`${this.apiUrl}/identity`, { withCredentials: true }).pipe(
      map(response => {
          console.log('Identity response:', response);
          if (response.succeeded) {
              this.currentUser = {
                  ...response.data,
              };
              console.log('Current user during identity fetch:', this.currentUser);
              return true;
          }
          return false;
      }),
      catchError(error => {
          if (error.status === 401) {
              console.warn('Unauthorized access, redirecting to login.');
          } else {
              console.error('Error fetching identity:', error);
          }
          this.router.navigate(['/dashboard']);
          return of(false);
      })
  );
}

  // Update Credentials Method
  updateCredentials(updatedCredentials: { firstName: string, lastName: string, password: string }): Observable<any> {
    if (!this.currentUser || !this.currentUser.userId) {  // Change to userId
      console.error('No current user or user ID is missing.');
      return of(null);
    }

    const url = `${this.apiUrl}/users/${this.currentUser.userId}`;  // Change to userId
    return this.http.put<any>(url, updatedCredentials, { withCredentials: true }).pipe(
      tap(response => {
        if (response.succeeded) {
          // Update current user details after successful update
          this.currentUser = {
            ...this.currentUser,
            firstName: updatedCredentials.firstName,
            lastName: updatedCredentials.lastName,
            password: updatedCredentials.password,
          } as User;
          console.log('User credentials updated successfully', this.currentUser);
        }
      }),
      catchError(error => {
        alert('An error occurred while updating your credentials.');
        return of(null);
      })
    );
  }

  getCurrentUser(): User | null {
    console.debug('Retrieving current user:', this.currentUser);
    return this.currentUser;
  }

  register(user: User): Observable<any> {
    console.debug('Registering new user:', user);
    
    return this.http.post<any>(`${this.apiUrl}/register`, user, { withCredentials: true }).pipe(
      tap(response => {
        console.log('Registration successful:', response);
      }),
      catchError(error => {
        console.error('Registration error occurred:', error);
        alert('Registration failed. Please check your details and try again.');
        return of(null);
      })
    );
  }
}