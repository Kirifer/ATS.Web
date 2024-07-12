import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.css']
})
export class PublicLayoutComponent {
  constructor(private router: Router) { }

  get isAdminLogin(): boolean {
    return this.router.url === '/login';
  }
}