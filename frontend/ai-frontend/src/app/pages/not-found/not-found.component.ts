import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {
  
  private auth = inject(AuthService);
  constructor(private router: Router) {}

  goHome() {
    this.auth.isLoggedIn()
      ? this.router.navigate(['/dashboard'])
      : this.router.navigate(['/']);
  }
}
