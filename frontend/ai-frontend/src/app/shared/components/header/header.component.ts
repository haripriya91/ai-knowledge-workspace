import { Component ,OnInit} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';


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
  isLoggedIn = false;
  menus: Menu[] = [];

  nonLoggedInMenus = [
    { label: 'Overview', sectionId: 'hero' },
    { label: 'How it Works', sectionId: 'how-it-works' },
    { label: 'Public Workspaces', sectionId: 'public-workspaces' },
    { label: 'Login', route: '/login' },
    { label: 'Signup', route: '/signup' },
  ];

  loggedInMenus = [
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Workspaces', route: '/workspaces' }
  ];
  constructor(private router: Router) {}

  ngOnInit() {
    this.isLoggedIn = !!localStorage.getItem('access_token');
    this.menus = this.isLoggedIn ? this.loggedInMenus : this.nonLoggedInMenus;
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
}
