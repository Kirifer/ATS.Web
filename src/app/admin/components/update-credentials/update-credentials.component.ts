import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-credentials',
  templateUrl: './update-credentials.component.html',
  styleUrls: ['./update-credentials.component.css']
})
export class UpdateCredentialsComponent implements OnInit {
  firstName = '';
  lastName = '';
  password = '';
  username = ''; // Assuming username is read-only and displayed

  @ViewChild('container') container!: ElementRef;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    
    if (user) {
      // Pre-populate the fields with current user data
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.username = user.username; // Assuming this is not editable

      // Log the currentUser for debugging purposes
      console.log('Current logged-in user:', user);
    } else {
      // Optionally, fetch the user identity if not already available
      this.authService.getIdentity().subscribe(success => {
        if (success) {
          const currentUser = this.authService.getCurrentUser();
          if (currentUser) {
            this.firstName = currentUser.firstName;
            this.lastName = currentUser.lastName;
            this.username = currentUser.username;

            // Log the currentUser after fetching identity
            console.log('Current logged-in user after identity fetch:', currentUser);
          }
        }
      });
    }
  }

  // Submit the update credentials form
  onSubmitUpdateCredentials() {
    if (this.firstName && this.lastName && this.password) {
      const updatedCredentials = {
        firstName: this.firstName,
        lastName: this.lastName,
        password: this.password,
      };
      
      this.authService.updateCredentials(updatedCredentials).subscribe(response => {
        if (response) {
          alert('Your credentials have been updated successfully.');
          this.router.navigate(['/dashboard']);
        }
      });
    } else {
      alert('Please fill out all required fields.');
    }
  }
}
