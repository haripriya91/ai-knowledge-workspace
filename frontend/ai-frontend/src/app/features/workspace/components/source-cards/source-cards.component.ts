import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-source-cards',
  imports: [],
  templateUrl: './source-cards.component.html',
  styleUrl: './source-cards.component.css'
})
export class SourceCardsComponent {


  @Input() type!: string;
  @Input() title!: string;  
  
}
