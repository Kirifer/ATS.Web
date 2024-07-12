import { Component, OnInit } from '@angular/core';
import { navbarData } from './nav-data';

@Component({
  selector: 'app-public-nav',
  templateUrl: './public-nav.component.html',
  styleUrls: ['./public-nav.component.scss']
})
export class PublicNavComponent implements OnInit {
  navbarData = navbarData;
  constructor() { }

  ngOnInit(): void {
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
}
