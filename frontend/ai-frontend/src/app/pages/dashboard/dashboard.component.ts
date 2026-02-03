import { Component } from '@angular/core';
import { PublicWorkspaceSectionComponent } from '../../features/home/components/public-workspace-section/public-workspace-section.component';
import { PrivateWorkspaceSectionComponent } from '../../features/dashboard/components/private-workspace-section/private-workspace-section.component';
@Component({
  selector: 'app-dashboard',
  imports: [PublicWorkspaceSectionComponent, PrivateWorkspaceSectionComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  activeTab: 'private' | 'public' = 'private';

}
