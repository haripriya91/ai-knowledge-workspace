import { Component, HostListener, Input, OnInit } from '@angular/core';
import { WorkspaceListComponent } from '../../../workspace/components/workspace-list/workspace-list.component';
import { ViewToggleComponent } from '../../../../shared/components/view-toggle/view-toggle.component';
import { PRIVATE_WORKSPACES } from '../../private-workspaces.mock';
import { Workspace } from '../../../../shared/models/workspace.model';

@Component({
  selector: 'app-private-workspace-section',
  standalone: true,
  imports: [WorkspaceListComponent, ViewToggleComponent],
  templateUrl: './private-workspace-section.component.html',
  styleUrl: './private-workspace-section.component.css'
})
export class PrivateWorkspaceSectionComponent implements OnInit {

  @Input() workspaces: Workspace[] = [];

  view: 'grid' | 'list' = 'grid';
  isMobile = false;

  ngOnInit() {
    this.checkScreen();
  }

  @HostListener('window:resize')
  checkScreen() {
    this.isMobile = window.innerWidth < 768;

    // Force list view on mobile
    if (this.isMobile) {
      this.view = 'list';
    }
  }

  get effectiveView(): 'list' | 'grid' {
    return this.isMobile ? 'list' : this.view;
  }

  onViewChange(view: 'list' | 'grid') {
    if (!this.isMobile) {
      this.view = view;
    }
  }

  /** Future-ready: filters, search, permissions */
  get filteredWorkspaces(): Workspace[] {
    return this.workspaces;
  }
}
