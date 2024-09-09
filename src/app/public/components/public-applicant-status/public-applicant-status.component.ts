import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/auth.service'; 
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { JobCandidate } from '../../../models/job-candidate';

@Component({
  selector: 'app-public-applicant-status',
  templateUrl: './public-applicant-status.component.html',
  styleUrls: ['./public-applicant-status.component.css']
})
export class PublicApplicantStatusComponent implements OnInit {
  jobCandidate: JobCandidate | null = null;

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
  }


  logout(): void {
    this.authService.logout();
  }
}
