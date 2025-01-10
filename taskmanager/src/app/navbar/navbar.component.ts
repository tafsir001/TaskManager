import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink , RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  isMenuOpen = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private cdr: ChangeDetectorRef, private router: Router,) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedIn = !!localStorage.getItem('authToken');
      console.log("Is logged in:", this.isLoggedIn);
    }
  }

  ngDoCheck(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedIn = !!localStorage.getItem('authToken');
      console.log("Is logged in:", this.isLoggedIn);
      this.cdr.detectChanges();
    }
  }


  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      this.isLoggedIn = false;
      console.log("Is logged in:", this.isLoggedIn);
      this.cdr.detectChanges();
    }

    this.router.navigate(['/login']);
  }

}
