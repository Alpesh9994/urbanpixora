import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

export interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

@Injectable({ providedIn: 'root' })
export class ContactFormService {
    private http = inject(HttpClient);

    // ─────────────────────────────────────────────────────────
    // 👉 Replace YOUR_FORM_ID with your Formspree Form ID
    //    Sign up free at https://formspree.io → New Form → copy the ID
    //    Example: 'xpwzbkqr'
    // ─────────────────────────────────────────────────────────
    private readonly FORMSPREE_URL = 'https://formspree.io/f/xbdavekg';

    send(data: ContactFormData): Observable<{ ok: boolean; error?: string }> {
        const headers = new HttpHeaders({ Accept: 'application/json' });
        return this.http.post<{ ok: boolean }>(this.FORMSPREE_URL, data, { headers }).pipe(
            map(() => ({ ok: true })),
            catchError(err => {
                const msg = err?.error?.error ?? 'Something went wrong. Please try again.';
                return of({ ok: false, error: msg });
            })
        );
    }
}
