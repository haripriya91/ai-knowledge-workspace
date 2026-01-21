import { Component } from '@angular/core';
import { PublicWorkspaceSectionComponent } from '../../features/home/components/public-workspace-section/public-workspace-section.component';
import { HowItWorksComponent } from '../../features/home/components/how-it-works/how-it-works.component';
import { HeroSectionComponent } from '../../features/home/components/hero-section/hero-section.component';

@Component({
  selector: 'app-home',
  imports: [  HeroSectionComponent,
    HowItWorksComponent,
    PublicWorkspaceSectionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
