import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-locked-overlay',
  imports: [RouterModule],
  templateUrl: './locked-overlay.component.html',
  styleUrl: './locked-overlay.component.css'
})
export class LockedOverlayComponent {
  @Input() message = 'Login to unlock this feature';
}
