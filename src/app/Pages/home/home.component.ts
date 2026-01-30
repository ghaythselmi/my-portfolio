import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isDarkMode = false;
  isMobileMenuOpen = false;

  ngOnInit(): void {
    // Check for saved theme preference
    if (localStorage.getItem('theme') === 'dark') {
      this.isDarkMode = true;
      document.documentElement.classList.add('dark');
    }
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  openMenu(): void {
    this.isMobileMenuOpen = true;
  }

  closeMenu(): void {
    this.isMobileMenuOpen = false;
  }

  scrollTo(section: string): void {
    this.closeMenu();
    const element = document.getElementById(section);
    element?.scrollIntoView({ behavior: 'smooth' });
  }
}