import { Component } from '@angular/core';
import { WorkspaceHeaderComponent } from '../../features/workspace/components/workspace-header/workspace-header.component';
import { WorkspaceSourcesComponent } from '../../features/workspace/components/workspace-sources/workspace-sources.component';
import { WorkspaceAiFeaturesComponent } from '../../features/workspace/components/workspace-ai-features/workspace-ai-features.component';

@Component({
  selector: 'app-workspace-details',
  imports: [ WorkspaceSourcesComponent,WorkspaceAiFeaturesComponent],
  templateUrl: './workspace-details.component.html',
  styleUrl: './workspace-details.component.css'
})
export class WorkspaceDetailsComponent {

}
