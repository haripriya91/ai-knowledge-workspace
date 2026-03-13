import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ai-feature-card',
  imports: [],
  templateUrl: './ai-feature-card.component.html',
  styleUrl: './ai-feature-card.component.css'
})
export class AiFeatureCardComponent {

  @Input() icon!: string;
  @Input() title!: string;
  @Input() description!: string;

}
