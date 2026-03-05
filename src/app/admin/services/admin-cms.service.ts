import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdminAuthService } from './admin-auth.service';

export interface AdminPage {
    id: string;
    slug: string;
    title: string;
    meta_title: string;
    meta_description: string;
    is_published: boolean;
    sections: AdminSection[];
}

export interface AdminSection {
    id: string;
    type: string;
    name: string;
    order: number;
    is_active: boolean;
    fields: Record<string, any>;
    items: Record<string, any>[];
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

@Injectable({ providedIn: 'root' })
export class AdminCmsService {
    private http = inject(HttpClient);
    private auth = inject(AdminAuthService);
    private readonly API = 'http://localhost:3000/api';

    private get headers(): HttpHeaders {
        return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
    }

    // Pages
    getPages(): Observable<AdminPage[]> {
        return this.http.get<ApiResponse<AdminPage[]>>(`${this.API}/pages`, { headers: this.headers })
            .pipe(map(r => r.data));
    }

    getPage(slug: string): Observable<AdminPage> {
        return this.http.get<ApiResponse<AdminPage>>(`${this.API}/pages/${slug}`, { headers: this.headers })
            .pipe(map(r => r.data));
    }

    updatePage(id: string, data: Partial<AdminPage>): Observable<AdminPage> {
        return this.http.patch<ApiResponse<AdminPage>>(`${this.API}/pages/${id}`, data, { headers: this.headers })
            .pipe(map(r => r.data));
    }

    // Sections
    getSectionsForPage(pageId: string): Observable<AdminSection[]> {
        return this.http.get<ApiResponse<AdminSection[]>>(`${this.API}/sections/page/${pageId}`, { headers: this.headers })
            .pipe(map(r => r.data));
    }

    updateSection(id: string, data: Partial<AdminSection>): Observable<AdminSection> {
        return this.http.patch<ApiResponse<AdminSection>>(`${this.API}/sections/${id}`, data, { headers: this.headers })
            .pipe(map(r => r.data));
    }

    reorderSections(sections: { id: string; order: number }[]): Observable<any> {
        return this.http.patch(`${this.API}/sections/reorder`, { sections }, { headers: this.headers });
    }

    createSection(data: Partial<AdminSection> & { page_id: string }): Observable<AdminSection> {
        return this.http.post<ApiResponse<AdminSection>>(`${this.API}/sections`, data, { headers: this.headers })
            .pipe(map(r => r.data));
    }

    deleteSection(id: string): Observable<any> {
        return this.http.delete(`${this.API}/sections/${id}`, { headers: this.headers });
    }

    // Media
    uploadFile(file: File): Observable<{ url: string; filename: string }> {
        const form = new FormData();
        form.append('file', file);
        return this.http.post<any>(`${this.API}/media/upload`, form, {
            headers: new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` })
        }).pipe(map(r => r.data ?? r));
    }
}
