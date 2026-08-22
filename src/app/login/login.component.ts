import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly submitted = signal(false);
  protected readonly authError = signal('');
  protected readonly demoEmail = 'admin@example.com';
  protected readonly demoPassword = 'Password123!';
  protected readonly isLoggedIn = computed(() => this.authService.isAuthenticated());

  protected readonly loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    remember: [true],
  });

  protected login(): void {
    this.submitted.set(true);
    this.authError.set('');

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const success = this.authService.login(this.loginForm.getRawValue());

    if (!success) {
      this.authError.set('Email or password is incorrect.');
      return;
    }

    void this.router.navigate(['/dashboard']);
  }

  protected useDemoAccount(): void {
    this.loginForm.patchValue({
      email: this.demoEmail,
      password: this.demoPassword,
      remember: true,
    });
    this.authError.set('');
  }
}
