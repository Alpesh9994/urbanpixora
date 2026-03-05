import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
    selector: 'app-admin-login',
    standalone: true,
    imports: [FormsModule],
    template: `
    <div class="admin-login">
      <div class="admin-login__card">
        <div class="admin-login__logo">
          <span class="logo-mark">UP</span>
          <span class="logo-text">UrbanPixora <em>Admin</em></span>
        </div>
        <h1 class="admin-login__title">Welcome back</h1>
        <p class="admin-login__sub">Sign in to manage your content</p>

        @if (error()) {
          <div class="admin-login__error">{{ error() }}</div>
        }

        <form (ngSubmit)="login()" #form="ngForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" type="email" [(ngModel)]="email" name="email"
              placeholder="admin@urbanpixora.com" required autocomplete="email" />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" type="password" [(ngModel)]="password" name="password"
              placeholder="••••••••" required autocomplete="current-password" />
          </div>
          <button type="submit" class="admin-login__btn" [disabled]="loading()">
            @if (loading()) { <span class="spinner"></span> Signing in... }
            @else { Sign In → }
          </button>
        </form>
      </div>
    </div>
  `,
    styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    .admin-login {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0a0a0a;
      padding: 1rem;
      font-family: 'Inter', sans-serif;
    }
    .admin-login__card {
      background: #111;
      border: 1px solid #222;
      border-radius: 16px;
      padding: 2.5rem;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.6);
    }
    .admin-login__logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 2rem;
    }
    .logo-mark {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #f5a623, #e8901a);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: #000;
      font-size: 0.85rem;
      letter-spacing: 0.5px;
    }
    .logo-text {
      font-size: 1rem;
      font-weight: 500;
      color: #fff;
      em { color: #f5a623; font-style: normal; }
    }
    .admin-login__title {
      font-size: 1.6rem;
      font-weight: 700;
      color: #fff;
      margin: 0 0 0.4rem;
    }
    .admin-login__sub {
      color: #666;
      font-size: 0.9rem;
      margin: 0 0 2rem;
    }
    .admin-login__error {
      background: rgba(239,68,68,0.12);
      border: 1px solid rgba(239,68,68,0.3);
      color: #f87171;
      border-radius: 8px;
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
      margin-bottom: 1.25rem;
    }
    .form-group {
      margin-bottom: 1.25rem;
    }
    .form-group label {
      display: block;
      color: #aaa;
      font-size: 0.8rem;
      font-weight: 500;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }
    .form-group input {
      width: 100%;
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 8px;
      padding: 0.75rem 1rem;
      color: #fff;
      font-size: 0.95rem;
      font-family: 'Inter', sans-serif;
      transition: border-color 0.2s;
      box-sizing: border-box;
      &:focus {
        outline: none;
        border-color: #f5a623;
        background: #1e1e1e;
      }
      &::placeholder { color: #444; }
    }
    .admin-login__btn {
      width: 100%;
      padding: 0.85rem;
      background: linear-gradient(135deg, #f5a623, #e8901a);
      color: #000;
      border: none;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      margin-top: 0.5rem;
      transition: opacity 0.2s, transform 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      &:hover { opacity: 0.9; transform: translateY(-1px); }
      &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
    }
    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(0,0,0,0.3);
      border-top-color: #000;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); }}
  `]
})
export class AdminLoginComponent {
    private auth = inject(AdminAuthService);
    private router = inject(Router);

    email = '';
    password = '';
    loading = signal(false);
    error = signal('');

    login() {
        if (!this.email || !this.password) return;
        this.loading.set(true);
        this.error.set('');
        this.auth.login(this.email, this.password).subscribe({
            next: () => {
                this.loading.set(false);
                this.router.navigate(['/admin']);
            },
            error: (err) => {
                this.loading.set(false);
                this.error.set(err?.error?.message || 'Invalid credentials. Please try again.');
            }
        });
    }
}
