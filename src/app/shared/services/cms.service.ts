import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface CmsItem {
    [key: string]: any;
}

export interface CmsSection {
    id: string;
    type: string;
    name: string;
    order: number;
    fields: Record<string, any>;
    items: CmsItem[];
}

export interface CmsPage {
    id: string;
    slug: string;
    title: string;
    meta_title: string;
    meta_description: string;
    sections: CmsSection[];
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
    timestamp: string;
}

@Injectable({
    providedIn: 'root'
})
export class CmsService {
    private http = inject(HttpClient);
    private readonly API_URL = 'http://localhost:3000/api';

    getPage(slug: string): Observable<CmsPage> {
        return this.http.get<ApiResponse<CmsPage>>(`${this.API_URL}/pages/${slug}`).pipe(
            map(response => response.data)
        );
    }

    // Helper method to extract a specific section by its type
    getSection(page: CmsPage, type: string): CmsSection | undefined {
        return page?.sections?.find(s => s.type === type);
    }
}
