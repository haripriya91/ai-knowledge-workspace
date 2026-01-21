import { Component } from '@angular/core';
import { Workspace } from '../../../../shared/models/workspace.model'
import { ViewToggleComponent } from '../../../../shared/components/view-toggle/view-toggle.component';

@Component({
  selector: 'app-public-workspace-section',
  imports: [ViewToggleComponent],
  templateUrl: './public-workspace-section.component.html',
  styleUrl: './public-workspace-section.component.css'
})
export class PublicWorkspaceSectionComponent {
  view: 'grid' | 'list' = 'grid';

  workspaces: Workspace[] = [
    {
      id: '1',
      title: 'AI Research',
      coverImage: 'assets/ws1.jpg',
      isPublic: true
    },
    {
      id: '2',
      title: 'Startup Ideas',
      coverImage: 'assets/ws2.jpg',
      isPublic: true
    }
  ];

  onViewChange(view: 'grid' | 'list') {
    this.view = view;
  }
}
