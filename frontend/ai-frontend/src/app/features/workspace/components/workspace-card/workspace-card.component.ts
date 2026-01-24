import { Component, Input } from '@angular/core';
import { Workspace } from '../../../../shared/models/workspace.model';

@Component({
  selector: 'app-workspace-card',
  imports: [],
  templateUrl: './workspace-card.component.html',
  styleUrl: './workspace-card.component.css'
})
export class WorkspaceCardComponent {
  @Input({ required: true }) workspace!: Workspace;
  @Input() view: 'grid' | 'list' = 'grid';
}
