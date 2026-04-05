import { Component, Input } from '@angular/core';
import { Asset } from '../../../../shared/models/source.model'; 

@Component({
  selector: 'app-source-cards',
  imports: [],
  templateUrl: './source-cards.component.html',
  styleUrl: './source-cards.component.css'
})
export class SourceCardsComponent {


  @Input() asset!: Asset;

}
