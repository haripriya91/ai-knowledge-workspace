import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-auth-required-modal',
  imports: [],
  templateUrl: './auth-required-modal.component.html',
  styleUrl: './auth-required-modal.component.css'
})
export class AuthRequiredModalComponent {
  @Output() close = new EventEmitter<void>();
}
