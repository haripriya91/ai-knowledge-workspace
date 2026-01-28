import { Component, HostListener } from '@angular/core';
import { WorkspaceListComponent } from '../../../workspace/components/workspace-list/workspace-list.component';
import { ViewToggleComponent } from '../../../../shared/components/view-toggle/view-toggle.component';
import { PUBLIC_WORKSPACES } from '../../public-workspaces.mock';
import { Workspace } from '../../../../shared/models/workspace.model';

@Component({
  selector: 'app-public-workspace-section',
  imports: [WorkspaceListComponent,ViewToggleComponent],
  templateUrl: './public-workspace-section.component.html',
  styleUrl: './public-workspace-section.component.css'
})
export class PublicWorkspaceSectionComponent {
  workspaces: Workspace[] = PUBLIC_WORKSPACES;

  categories: string[] = ['All', 'Environment', 'Fashion', 'Travel', 'Programming', 'AI', 'Hobby'];
  selectedCategory = 'All';

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
  get filteredWorkspaces() {
    if (this.selectedCategory === 'All') return this.workspaces;
    return this.workspaces.filter(ws => ws.category === this.selectedCategory);
  }

  onCategoryChange(category: string) {
    this.selectedCategory = category;
  }
}
