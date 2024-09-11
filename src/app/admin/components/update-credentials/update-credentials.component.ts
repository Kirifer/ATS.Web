import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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

  originalFirstName = '';
  originalLastName = '';

  @ViewChild('container') container!: ElementRef;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    
    if (user) {
      // Pre-populate the fields with current user data
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.username = user.username; // Assuming this is not editable

      // Store the original values for comparison
      this.originalFirstName = user.firstName;
      this.originalLastName = user.lastName;

      // Log the current user for debugging purposes
      console.log('Current logged-in user:', user);
    }
  }

  // Submit the update credentials form
  onSubmitUpdateCredentials() {
    // Check if no changes have been made to the form
    if (this.firstName === this.originalFirstName && 
        this.lastName === this.originalLastName && 
        !this.password) {
      Swal.fire({
        title: 'No Changes Made',
        text: 'No changes were made to your credentials. Please update at least one field before submitting.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    // If the password field is filled, ask for confirmation to change the password
    if (this.password) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to change your password?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, change it',
        cancelButtonText: 'No, cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          // Proceed with the update after confirmation
          this.updateCredentials();
        } else {
          // Reset the password field and do not proceed
          this.password = '';
          Swal.fire('Cancelled', 'Your password has not been changed.', 'info');
        }
      });
    } else {
      // If there's no password change, update other details
      this.updateCredentials();
    }
  }

  // Function to update credentials
  updateCredentials() {
    if (this.firstName && this.lastName && (this.password || !this.password)) {
      const updatedCredentials = {
        firstName: this.firstName,
        lastName: this.lastName,
        password: this.password,  // Password may be empty if not updated
      };

      this.authService.updateCredentials(updatedCredentials).subscribe(response => {
        if (response) {
          Swal.fire({
            title: 'Success!',
            text: 'Your credentials have been updated successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/dashboard']);
          });
        }
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Please fill out all required fields.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }
}
