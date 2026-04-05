import { Component, Input } from '@angular/core';
import { Workspace } from '../../../../shared/models/workspace.model';
import { WorkspaceCardComponent } from '../workspace-card/workspace-card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workspace-list',
  imports: [WorkspaceCardComponent],
  templateUrl: './workspace-list.component.html',
  styleUrl: './workspace-list.component.css'
})
export class WorkspaceListComponent {
   @Input() workspaces: Workspace[] = [];
  @Input() view: 'grid' | 'list' = 'grid';
  constructor(private router: Router) {}

  openWorkspace(ws: any) {
    this.router.navigate(['/workspace', ws.id]);
  }
}
