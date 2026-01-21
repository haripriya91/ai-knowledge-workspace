import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-view-toggle',
  imports: [],
  templateUrl: './view-toggle.component.html',
  styleUrl: './view-toggle.component.css'
})
export class ViewToggleComponent {
  @Input() view: 'grid' | 'list' = 'grid';
  @Output() viewChange = new EventEmitter<'grid' | 'list'>();

  setView(view: 'grid' | 'list') {
    this.viewChange.emit(view);
  }
}
