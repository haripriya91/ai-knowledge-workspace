import { Component } from '@angular/core';

@Component({
  selector: 'app-ai-feature-card',
  imports: [],
  templateUrl: './ai-feature-card.component.html',
  styleUrl: './ai-feature-card.component.css'
})
export class AiFeatureCardComponent {

  title: string = 'AI Feature Card';
  description: string = 'This is a card component to display AI features.';
  icon: string = 'assets/ai-icon.png';
}
