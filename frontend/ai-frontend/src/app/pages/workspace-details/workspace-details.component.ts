import { Component, inject } from '@angular/core';
import { WorkspaceHeaderComponent } from '../../features/workspace/components/workspace-header/workspace-header.component';
import { WorkspaceSourcesComponent } from '../../features/workspace/components/workspace-sources/workspace-sources.component';
import { WorkspaceAiFeaturesComponent } from '../../features/workspace/components/workspace-ai-features/workspace-ai-features.component';
import { WorkspaceService } from '../../features/workspace/workspace.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-workspace-details',
  imports: [ WorkspaceSourcesComponent,WorkspaceAiFeaturesComponent],
  templateUrl: './workspace-details.component.html',
  styleUrl: './workspace-details.component.css'
})
export class WorkspaceDetailsComponent {
  private workspaceService = inject(WorkspaceService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  workspace: any;
   workspaceId!: string;
   workspaceName = '';
   loading = false;
   error = '';
   activeTab: 'sources' | 'chat' | 'ai' = 'chat';
   
  ngOnInit() {

    this.workspaceId = this.route.snapshot.paramMap.get('id')!;

    this.loadWorkspace();
  }

  loadWorkspace() {
    this.loading = true;

    this.workspaceService.getWorkspaceDetails(this.workspaceId).subscribe({
      next: (data) => {
        this.workspace = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load workspace';
        this.loading = false;

        if (err.status === 401) {
          this.router.navigate(['/dashboard']);
        }
      }
    });
  }
  
  onNameChange(newName: string) {
    if (this.workspaceId)
      this.workspaceService.update(this.workspaceId, newName).subscribe();
  }

  deleteWorkspace() {
    if (this.workspaceId) {
      this.workspaceService.delete(this.workspaceId).subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
    }
  }

  get isMobile() {
    return window.innerWidth < 768;
  }
}
