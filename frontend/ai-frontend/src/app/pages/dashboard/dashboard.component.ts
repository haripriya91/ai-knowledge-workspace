import { Component, inject } from '@angular/core';
import { PublicWorkspaceSectionComponent } from '../../features/home/components/public-workspace-section/public-workspace-section.component';
import { PrivateWorkspaceSectionComponent } from '../../features/dashboard/components/private-workspace-section/private-workspace-section.component';
import { AuthService } from '../../features/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [PublicWorkspaceSectionComponent, PrivateWorkspaceSectionComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  activeTab: 'private' | 'public' = 'private';
  private auth = inject(AuthService);

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.auth.getProfile().subscribe();
    }
  }
}
