import { Component ,inject,OnInit} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../../features/auth/auth.service';

interface Menu {
  label: string;
  route?: string;
  sectionId?: string;
}

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  menus: Menu[] = [];
  isMobileMenuOpen = false;
  profileOpen = false;
  private auth = inject(AuthService);

  isLoggedIn = this.auth.isLoggedIn;
  user = this.auth.user;
  nonLoggedInMenus = [
    { label: 'Overview', sectionId: 'hero' },
    { label: 'How it Works', sectionId: 'how-it-works' },
    { label: 'Public Workspaces', sectionId: 'public-workspaces' },
    { label: 'Login', route: '/auth/login' },
    { label: 'Signup', route: '/auth/signup' },
  ];

  loggedInMenus = [
    { label: 'Dashboard', route: '/dashboard' },
  ];
  constructor(private router: Router) {}

  ngOnInit() {
    this.menus = this.isLoggedIn() ? this.loggedInMenus : this.nonLoggedInMenus;
  }

  scrollToSection(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }
  onMenuClick(menu: Menu) {
    if (menu.route) {
      this.navigate(menu.route);
    } else if (menu.sectionId) {
      this.scrollToSection(menu.sectionId);
    }
  }
  goHome() {
    this.auth.isLoggedIn()
      ? this.router.navigate(['/dashboard'])
      : this.router.navigate(['/']);
  }
  logout() {
    this.auth.logout();
    this.profileOpen = false;
    this.router.navigate(['/']);
  }
}
