import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  collapsed = false;
  mobileOpen = false;

  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  openMobile() {
    this.mobileOpen = true;
  }

  closeMobile() {
    this.mobileOpen = false;
  }
}
