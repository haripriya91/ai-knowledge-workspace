import { Component, Input } from '@angular/core';
import { Workspace } from '../../../../shared/models/workspace.model';
import { WorkspaceCardComponent } from '../workspace-card/workspace-card.component';

@Component({
  selector: 'app-workspace-list',
  imports: [WorkspaceCardComponent],
  templateUrl: './workspace-list.component.html',
  styleUrl: './workspace-list.component.css'
})
export class WorkspaceListComponent {
   @Input() workspaces: Workspace[] = [];
  @Input() view: 'grid' | 'list' = 'grid';
}
