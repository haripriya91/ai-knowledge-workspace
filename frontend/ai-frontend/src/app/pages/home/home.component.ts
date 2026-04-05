import { Component, inject } from '@angular/core';
import { PublicWorkspaceSectionComponent } from '../../features/home/components/public-workspace-section/public-workspace-section.component';
import { HowItWorksComponent } from '../../features/home/components/how-it-works/how-it-works.component';
import { HeroSectionComponent } from '../../features/home/components/hero-section/hero-section.component';
import { Workspace } from '../../shared/models/workspace.model';
import { WorkspaceService } from '../../features/workspace/workspace.service';



@Component({
  selector: 'app-home',
  imports: [  HeroSectionComponent,
    HowItWorksComponent,
    PublicWorkspaceSectionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  private workspaceService = inject(WorkspaceService);
  publicWorkspaces: Workspace[] = [];

  ngOnInit() {
    this.workspaceService.getPublicWorkspace().subscribe(data => {
      this.publicWorkspaces = data;
    });
  }

}
