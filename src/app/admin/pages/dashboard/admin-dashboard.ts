import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminCmsService, AdminPage } from '../../services/admin-cms.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="admin-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-sub">Welcome to UrbanPixora CMS</p>
        </div>
      </div>

      @if (loading()) {
        <div class="loading">Loading pages...</div>
      } @else {
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-value">{{ pages().length }}</span>
            <span class="stat-label">Total Pages</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ publishedCount() }}</span>
            <span class="stat-label">Published</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ totalSections() }}</span>
            <span class="stat-label">Total Sections</span>
          </div>
        </div>

        <div class="section-card">
          <div class="section-header">
            <h2>Pages</h2>
            <span class="badge">{{ pages().length }} pages</span>
          </div>
          <div class="page-list">
            @for (page of pages(); track page.id) {
              <a [routerLink]="['/admin/pages', page.slug]" class="page-row">
                <div class="page-row__info">
                  <span class="page-row__slug">/{{ page.slug }}</span>
                  <h3 class="page-row__title">{{ page.title }}</h3>
                </div>
                <div class="page-row__right">
                  <span class="status-badge" [class.is-published]="page.is_published">
                    {{ page.is_published ? 'Published' : 'Draft' }}
                  </span>
                  <span class="section-count">{{ page.sections.length }} sections</span>
                  <span class="arrow">→</span>
                </div>
              </a>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    * { box-sizing: border-box; }
    .admin-page {
      padding: 2rem;
      font-family: 'Inter', sans-serif;
      max-width: 900px;
    }
    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 2rem;
    }
    .page-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #fff;
      margin: 0 0 0.25rem;
    }
    .page-sub {
      color: #555;
      font-size: 0.875rem;
      margin: 0;
    }
    .loading {
      color: #555;
      font-size: 0.9rem;
      padding: 2rem 0;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background: #111;
      border: 1px solid #1f1f1f;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #f5a623;
    }
    .stat-label {
      font-size: 0.8rem;
      color: #555;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .section-card {
      background: #111;
      border: 1px solid #1f1f1f;
      border-radius: 12px;
      overflow: hidden;
    }
    .section-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #1a1a1a;
      h2 { margin: 0; font-size: 0.95rem; font-weight: 600; color: #ddd; }
    }
    .badge {
      background: #1e1e1e;
      color: #666;
      font-size: 0.75rem;
      padding: 0.2rem 0.6rem;
      border-radius: 20px;
    }
    .page-list { display: flex; flex-direction: column; }
    .page-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #161616;
      text-decoration: none;
      transition: background 0.15s;
      &:last-child { border-bottom: none; }
      &:hover { background: #151515; }
    }
    .page-row__info { display: flex; flex-direction: column; gap: 0.2rem; }
    .page-row__slug { font-size: 0.75rem; color: #555; font-family: monospace; }
    .page-row__title { font-size: 0.95rem; font-weight: 600; color: #ddd; margin: 0; }
    .page-row__right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .status-badge {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 0.2rem 0.65rem;
      border-radius: 20px;
      background: #1a1a1a;
      color: #555;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      &.is-published { background: rgba(34,197,94,0.12); color: #4ade80; }
    }
    .section-count { font-size: 0.8rem; color: #444; }
    .arrow { color: #333; font-size: 1rem; transition: color 0.15s; }
    .page-row:hover .arrow { color: #f5a623; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private cms = inject(AdminCmsService);
  pages = signal<AdminPage[]>([]);
  loading = signal(true);

  publishedCount = () => this.pages().filter(p => p.is_published).length;
  totalSections = () => this.pages().reduce((sum, p) => sum + (p.sections?.length || 0), 0);

  ngOnInit() {
    this.cms.getPages().subscribe({
      next: data => { this.pages.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
