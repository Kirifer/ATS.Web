import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onSubmit(): void {

    const fakeUsername = 'admin';
    const fakePassword = 'password';

    if (this.username === fakeUsername && this.password === fakePassword) {
      // Redirect to admin dashboard
      this.router.navigate(['/admin/admin-dashboard']);
    } else {
      alert('Invalid credentials');
    }
  }
}
