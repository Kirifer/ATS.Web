import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: User | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  // Login method
  login(username: string, password: string): Observable<any> {
    console.debug('Attempting login with username:', username);
    const loginData = { username, password };
    return this.http.post<any>(environment.loginUrl, loginData, { withCredentials: true }).pipe(
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

  // Logout method
  logout(): Observable<any> {
    console.debug('Logging out...');
    return this.http.post<any>(environment.logoutUrl, {}, { withCredentials: true }).pipe(
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

  // Get identity method
  getIdentity(): Observable<boolean> {
    console.debug('Fetching user identity');
    if (!this.currentUser) {
      console.warn('User is not logged in, skipping identity fetch.');
      // return of(false);
    }

    return this.http.get<{ data: User, succeeded: boolean }>(environment.identityUrl, { withCredentials: true }).pipe(
      map(response => {
        console.log('Identity response:', response);
        if (response.succeeded) {
          this.currentUser = { ...response.data };
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

  // Update credentials method
  updateCredentials(updatedCredentials: { firstName: string, lastName: string, password: string }): Observable<any> {
    if (!this.currentUser || !this.currentUser.userId) {
      console.error('No current user or user ID is missing.');
      return of(null);
    }

    const url = `${environment.updateUserUrl}/${this.currentUser.userId}`;
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
        console.error('An error occurred while updating your credentials.', error);
        return of(null);
      })
    );
  }

  // Get current user
  getCurrentUser(): User | null {
    console.debug('Retrieving current user:', this.currentUser);
    return this.currentUser;
  }

  // Register new user
  register(user: User): Observable<any> {
    console.debug('Registering new user:', user);
    return this.http.post<any>(environment.registerUrl, user, { withCredentials: true }).pipe(
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
