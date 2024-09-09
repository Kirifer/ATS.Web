import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { navbarData } from './nav-data';
import { User } from '../../../models/user';

@Component({
  selector: 'app-public-nav',
  templateUrl: './public-nav.component.html',
  styleUrls: ['./public-nav.component.css']
})
export class PublicNavComponent implements OnInit {
  navbarData = navbarData;
  mainNavbarData: any[] = [];
  dropdownNavbarData: any[] = [];
  currentUser: User | null = null;
  isLoggedIn: boolean = false;
  isDropdownOpen: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.getIdentity().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.currentUser = this.authService.getCurrentUser();
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
        this.router.navigate(['/dashboard']);
      }
      this.updateNavbarData();
    });

    const toggle_btn = document.querySelector(".toggle_btn");
    const toggle_btnIcon = document.querySelector(".toggle_btn i");
    const dropdown_menu = document.querySelector(".dropdown_menu");

    toggle_btn?.addEventListener('click', () => {
      dropdown_menu?.classList.toggle("open");
      const isOpen = dropdown_menu?.classList.contains("open");
      if (toggle_btnIcon) {
        toggle_btnIcon.classList.value = isOpen
          ? "fas fa-times"
          : "fas fa-bars";
      }
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url === '/public/logout' && this.currentUser) {
        this.logout();
      }
    });
  }

  updateNavbarData() {
    this.mainNavbarData = this.navbarData.filter(item =>
      !item.visibleWhenLoggedIn || (item.visibleWhenLoggedIn && this.isLoggedIn)
    ).filter(item => !item.showInDropdown);

    this.dropdownNavbarData = this.navbarData.filter(item =>
      item.showInDropdown && this.isLoggedIn
    );
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.isLoggedIn = false;
      this.currentUser = null;
      this.updateNavbarData();
      this.router.navigate(['/dashboard']);
    });
  }
}
