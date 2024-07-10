import { Component } from '@angular/core';

interface Job {
  title: string;
  description: string;
}

@Component({
  selector: 'app-public-dashboard',
  templateUrl: './public-dashboard.component.html',
  styleUrls: ['./public-dashboard.component.css']
})
export class PublicDashboardComponent {
  jobs: Job[] = [
    {
      title: 'Web Developer',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      title: 'Frontend Developer',
      description: 'Curabitur vitae orci vitae turpis cursus sollicitudin.',
    },
    // Add more job postings as needed
  ];
}
