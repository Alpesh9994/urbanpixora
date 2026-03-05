import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface LoginResponse {
    success: boolean;
    data: {
        access_token: string;
        admin: AdminUser;
    };
}

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private readonly API = 'http://localhost:3000/api/auth';
    private readonly TOKEN_KEY = 'admin_token';

    currentUser = signal<AdminUser | null>(null);

    constructor() {
        const token = this.getToken();
        if (token) {
            this.loadProfile();
        }
    }

    login(email: string, password: string) {
        return this.http.post<LoginResponse>(`${this.API}/login`, { email, password }).pipe(
            tap(res => {
                localStorage.setItem(this.TOKEN_KEY, res.data.access_token);
                this.currentUser.set(res.data.admin);
            })
        );
    }

    logout() {
        localStorage.removeItem(this.TOKEN_KEY);
        this.currentUser.set(null);
        this.router.navigate(['/admin/login']);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    loadProfile() {
        this.http.get<{ success: boolean; data: AdminUser }>(`${this.API}/profile`, {
            headers: { Authorization: `Bearer ${this.getToken()}` }
        }).subscribe({
            next: res => this.currentUser.set(res.data),
            error: () => this.logout()
        });
    }
}
