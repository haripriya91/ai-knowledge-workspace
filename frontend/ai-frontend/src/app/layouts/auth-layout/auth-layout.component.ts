import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet,RouterLink],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent {

  currentYear: string;

  constructor() {
    this.currentYear = new Date().getFullYear().toString();
  }
}
