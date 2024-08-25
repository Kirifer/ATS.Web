import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { navbarData } from './nav-data';
import { User } from '../../../models/user';

@Component({
  selector: 'app-public-nav',
  templateUrl: './public-nav.component.html',
  styleUrls: ['./public-nav.component.css']
})
export class PublicNavComponent implements OnInit {
  navbarData = navbarData;
  isAuthenticated: boolean = false;
  currentUser: User | null = null; // Store the current user

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (isAuth) {
        this.currentUser = this.authService.getCurrentUser(); // Get user info
      }
    });

    const toogle_btn = document.querySelector(".toogle_btn");
    const toogle_btnIcon = document.querySelector(".toogle_btn i");
    const dropdown_menu = document.querySelector(".dropdown_menu");

    toogle_btn?.addEventListener('click', () => {
      dropdown_menu?.classList.toggle("open");
      const isOpen = dropdown_menu?.classList.contains("open");
      if (toogle_btnIcon) {
        toogle_btnIcon.classList.value = isOpen
          ? "fas fa-times"
          : "fas fa-bars";
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/dashboard']);
  }
}
