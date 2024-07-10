import { Component } from '@angular/core';

interface Job {
  title: string;
  location: string;
  setting: string;
  description: string;
  postedTime: string;
}

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.css'
})
export class JobListComponent {
  jobs: Job[] = [
    {
      title: 'Web Developer',
      location: 'New York, NY',
      setting: 'Permanent / Full-time',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      postedTime: 'Posted 2 days ago'
    },
    {
      title: 'Frontend Developer',
      location: 'San Francisco, CA',
      setting: 'Contract / Part-time',
      description: 'Curabitur vitae orci vitae turpis cursus sollicitudin.',
      postedTime: 'Posted 3 days ago'
    },
    // Add more job postings as needed
  ];
}
