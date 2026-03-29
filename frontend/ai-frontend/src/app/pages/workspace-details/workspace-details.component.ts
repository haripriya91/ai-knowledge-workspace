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
   id = this.route.snapshot.paramMap.get('id');

  onNameChange(newName: string) {
    if (this.id)
      this.workspaceService.update(this.id, newName).subscribe();
  }

  deleteWorkspace() {
    if (this.id) {
      this.workspaceService.delete(this.id).subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
    }
  }
}
