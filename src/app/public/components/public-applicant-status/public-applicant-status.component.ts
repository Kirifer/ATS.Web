import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/auth.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-public-applicant-status',
  templateUrl: './public-applicant-status.component.html',
  styleUrls: ['./public-applicant-status.component.css']
})
export class PublicApplicantStatusComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
