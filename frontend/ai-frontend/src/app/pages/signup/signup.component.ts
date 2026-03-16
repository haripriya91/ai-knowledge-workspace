import { Component,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports:  [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  error = '';

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  submit(): void {

    if (this.form.invalid) return;
  
    this.loading = true;
    this.error = '';
  
    this.auth.signup(this.form.getRawValue())
      .subscribe({
  
        next: () => {
          this.router.navigate(['/auth/login']);
        },
  
        error: () => {
          this.error = 'Signup failed';
          this.loading = false;
        }
  
      });
  }
}

