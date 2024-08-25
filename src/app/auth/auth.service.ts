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


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7012';
  private currentUser: User | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      map(response => {
        if (response.succeeded && response.data && response.data.token) {
          localStorage.setItem('authToken', response.data.token);
          this.currentUser = {
            ...response.data,
          };
          console.log('Current user after login:', this.currentUser); // Debugging log
          return response;
        } else {
          throw new Error('Login failed');
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return of(null);
      })
    );
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): Observable<boolean> {
    const token = localStorage.getItem('authToken');
    console.log('Retrieved token:', token); // Debugging log
    if (!token) {
      return of(false);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log('Headers:', headers); // Debugging log
    return this.http.get<any>(`${this.apiUrl}/identity`, { headers }).pipe(
      map(response => {
        console.log('Authentication response:', response); // Debugging log
        if (response.succeeded) {
          this.currentUser = {
            ...response.data,
          };
          console.log('Current user during authentication:', this.currentUser); // Debugging log
          return true;
        }
        return false;
      }),
      catchError(() => {
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.currentUser = null;
    const token = localStorage.getItem('authToken');
    console.log('Token after logout:', token); // Debugging log
    this.router.navigate(['/dashboard']);
    alert('Successfully logged out'); // Show logout alert
  }

  register(user: User): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user);
  }
}
