import { Component, inject } from '@angular/core';
import { PublicWorkspaceSectionComponent } from '../../features/home/components/public-workspace-section/public-workspace-section.component';
import { PrivateWorkspaceSectionComponent } from '../../features/dashboard/components/private-workspace-section/private-workspace-section.component';
import { AuthService } from '../../features/auth/auth.service';
import { WorkspaceService } from '../../features/workspace/workspace.service';
import { Workspace } from '../../shared/models/workspace.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  imports: [PublicWorkspaceSectionComponent, PrivateWorkspaceSectionComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  activeTab: 'private' | 'public' = 'private';
  private auth = inject(AuthService);
  private workspaceService = inject(WorkspaceService);
  router = inject(Router);
  
  user = this.auth.user;
  workspaces: Workspace[] = [];


  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.auth.getProfile().subscribe();
      const id = this.user()?.name;
      if (id) {
        this.workspaceService.getWorkspace(id).subscribe(data => {
          this.workspaces = data;
        });
      } else {
        console.error('Workspace ID is undefined');
      }
    }
  }

  createWorkspace() {
    this.workspaceService.create('Untitled Workspace').subscribe(res => {
      this.router.navigate(['/workspace', res.id]);
    });
  }
}
