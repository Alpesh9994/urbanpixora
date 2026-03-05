import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { AdminCmsService, AdminPage, AdminSection } from '../../services/admin-cms.service';

@Component({
  selector: 'app-admin-page-editor',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="admin-page">
      <!-- Header -->
      <div class="page-header">
        <div class="breadcrumb">
          <a routerLink="/admin" class="bc-link">Dashboard</a>
          <span class="bc-sep">›</span>
          <span>{{ page()?.title || 'Loading...' }}</span>
        </div>
        @if (page()) {
          <div class="header-actions">
            <span class="status-badge" [class.is-published]="page()!.is_published">
              {{ page()!.is_published ? 'Published' : 'Draft' }}
            </span>
            <button class="btn-primary" [class.btn-success]="pageSaved()" (click)="saveAllChanges()" [disabled]="saving()">
              {{ saving() ? 'Saving...' : (pageSaved() ? '✓ Saved All' : 'Save All Changes') }}
            </button>
          </div>
        }
      </div>

      @if (loading()) {
        <div class="loading">Loading page...</div>
      } @else if (page()) {

        <!-- Page Meta Card -->
        <div class="card mb-2">
          <div class="card-header">
            <h2>SEO & Meta</h2>
            <span class="card-tag">Page Settings</span>
          </div>
          <div class="card-body">
            <div class="form-row">
              <div class="form-group">
                <label>Page Title</label>
                <input type="text" [(ngModel)]="page()!.title" placeholder="Page title..." />
              </div>
              <div class="form-group">
                <label>Meta Title</label>
                <input type="text" [(ngModel)]="page()!.meta_title" placeholder="SEO title..." />
              </div>
            </div>
            <div class="form-group">
              <label>Meta Description</label>
              <textarea [(ngModel)]="page()!.meta_description" rows="2" placeholder="SEO description..."></textarea>
            </div>
            <label class="toggle-row">
              <input type="checkbox" [(ngModel)]="page()!.is_published" />
              <span class="toggle-label">Published (visible on site)</span>
            </label>
          </div>
        </div>

        <!-- Sections -->
        <div class="card">
          <div class="card-header">
            <h2>Sections</h2>
            <span class="card-tag">{{ page()!.sections.length }} sections</span>
          </div>
          @if (page()!.sections.length === 0) {
            <div class="empty-state">No sections found for this page.</div>
          }
          @for (section of page()!.sections; track section.id; let i = $index) {
            <div class="section-panel" [class.is-open]="openSection() === section.id">
              <button class="section-toggle" (click)="toggleSection(section.id)">
                <div class="section-info">
                  <span class="section-type-badge">{{ section.type }}</span>
                  <span class="section-name">{{ section.name }}</span>
                </div>
                <div class="section-actions">
                  <label class="mini-toggle" title="Active">
                    <input type="checkbox" [(ngModel)]="section.is_active"
                      (change)="saveSection(section)" (click)="$event.stopPropagation()" />
                    <span>Active</span>
                  </label>
                  <span class="chevron" [class.open]="openSection() === section.id">›</span>
                </div>
              </button>

              @if (openSection() === section.id) {
                <div class="section-body">
                  @if (sectionSaved() === section.id) {
                    <div class="save-toast">✓ Saved successfully</div>
                  }

                  <!-- Fields -->
                  <div class="editor-group">
                    <h4 class="editor-label">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      Fields
                    </h4>
                    @for (key of getFieldKeys(section); track key) {
                      <div class="form-group">
                        <label>{{ key }}</label>
                        @if (isLongText(section.fields[key])) {
                          <textarea [(ngModel)]="section.fields[key]" rows="3" [placeholder]="'Enter ' + key + '...'"></textarea>
                        } @else {
                          <input type="text" [(ngModel)]="section.fields[key]" [placeholder]="'Enter ' + key + '...'" />
                        }
                      </div>
                    }
                    @if (getFieldKeys(section).length === 0) {
                      <p class="empty-hint">No fields defined for this section.</p>
                    }
                  </div>

                  <!-- Items -->
                  @if (section.items && section.items.length > 0) {
                    <div class="editor-group">
                      <div class="editor-group-header">
                        <h4 class="editor-label">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                          Repeatable Items
                        </h4>
                        <button class="btn-add-item" (click)="addItem(section)">+ Add Item</button>
                      </div>
                      @for (item of section.items; track $index; let idx = $index) {
                        <div class="item-card">
                          <div class="item-header">
                            <span class="item-num">{{ idx + 1 }}</span>
                            <button class="item-remove" (click)="removeItem(section, idx)" title="Remove item">✕</button>
                          </div>
                          @for (key of getItemKeys(item); track key) {
                            <div class="form-group">
                              <label>{{ key }}</label>
                              @if (isLongText(item[key])) {
                                <textarea [(ngModel)]="item[key]" rows="2" [placeholder]="'Enter ' + key + '...'"></textarea>
                              } @else {
                                <input type="text" [(ngModel)]="item[key]" [placeholder]="'Enter ' + key + '...'" />
                              }
                            </div>
                          }
                        </div>
                      }
                    </div>
                  }

                  <button class="btn-save" (click)="saveSection(section)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Save Section
                  </button>
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    * { box-sizing: border-box; }
    .admin-page { padding: 2rem; font-family: 'Inter', sans-serif; max-width: 860px; }
    .page-header {
      display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.75rem;
    }
    .breadcrumb { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: #555; }
    .bc-link { color: #f5a623; text-decoration: none; &:hover { text-decoration: underline; } }
    .bc-sep { color: #333; }
    .header-actions { display: flex; align-items: center; gap: 0.75rem; }
    .status-badge {
      font-size: 0.7rem; font-weight: 600; padding: 0.25rem 0.75rem; border-radius: 20px;
      background: #1a1a1a; color: #555; text-transform: uppercase; letter-spacing: 0.5px;
      &.is-published { background: rgba(34,197,94,0.12); color: #4ade80; }
    }
    .loading { color: #555; font-size: 0.9rem; padding: 2rem 0; }
    .mb-2 { margin-bottom: 1.25rem; }
    .card { background: #111; border: 1px solid #1f1f1f; border-radius: 12px; overflow: hidden; margin-bottom: 1.25rem; }
    .card-header {
      display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.5rem;
      border-bottom: 1px solid #1a1a1a;
      h2 { margin: 0; font-size: 0.9rem; font-weight: 600; color: #ddd; }
    }
    .card-tag {
      font-size: 0.7rem; color: #555; background: #1a1a1a; padding: 0.2rem 0.6rem; border-radius: 20px;
    }
    .card-body { padding: 1.5rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { margin-bottom: 1rem; }
    .form-group label {
      display: block; font-size: 0.75rem; font-weight: 600; color: #666;
      text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.4rem;
    }
    .form-group input, .form-group textarea {
      width: 100%; background: #161616; border: 1px solid #2a2a2a; border-radius: 8px;
      padding: 0.65rem 0.9rem; color: #ddd; font-size: 0.875rem; font-family: 'Inter', sans-serif;
      transition: border-color 0.15s; resize: vertical;
      &:focus { outline: none; border-color: #f5a623; background: #1a1a1a; }
      &::placeholder { color: #3a3a3a; }
    }
    .toggle-row {
      display: flex; align-items: center; gap: 0.6rem; cursor: pointer; margin-top: 0.25rem;
      input[type=checkbox] { accent-color: #f5a623; width: 16px; height: 16px; cursor: pointer; }
    }
    .toggle-label { font-size: 0.85rem; color: #888; }
    .empty-state { padding: 2rem; text-align: center; color: #444; font-size: 0.85rem; }

    /* Sections */
    .section-panel { border-bottom: 1px solid #161616; &:last-child { border-bottom: none; } }
    .section-toggle {
      width: 100%; display: flex; align-items: center; justify-content: space-between;
      padding: 1rem 1.5rem; background: none; border: none; cursor: pointer; text-align: left;
      transition: background 0.15s;
      &:hover { background: #141414; }
    }
    .section-info { display: flex; align-items: center; gap: 0.75rem; }
    .section-type-badge {
      font-size: 0.7rem; font-weight: 600; padding: 0.2rem 0.6rem; border-radius: 6px;
      background: rgba(245,166,35,0.12); color: #f5a623; text-transform: uppercase; letter-spacing: 0.5px;
    }
    .section-name { font-size: 0.9rem; font-weight: 500; color: #ccc; }
    .section-actions { display: flex; align-items: center; gap: 1rem; }
    .mini-toggle {
      display: flex; align-items: center; gap: 0.4rem; font-size: 0.75rem; color: #555; cursor: pointer;
      input[type=checkbox] { accent-color: #f5a623; cursor: pointer; }
    }
    .chevron { color: #444; font-size: 1.2rem; transition: transform 0.2s; &.open { transform: rotate(90deg); } }
    .section-body { padding: 1.25rem 1.5rem; border-top: 1px solid #161616; background: #0f0f0f; }
    .save-toast {
      background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.25); color: #4ade80;
      border-radius: 8px; padding: 0.6rem 1rem; font-size: 0.8rem; margin-bottom: 1rem;
    }
    .editor-group { margin-bottom: 1.5rem; }
    .editor-group-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; }
    .editor-label {
      display: flex; align-items: center; gap: 0.4rem; font-size: 0.75rem; font-weight: 700;
      color: #888; text-transform: uppercase; letter-spacing: 0.75px; margin: 0 0 0.75rem;
    }
    .empty-hint { font-size: 0.8rem; color: #444; }
    .item-card {
      background: #141414; border: 1px solid #222; border-radius: 10px;
      padding: 1rem; margin-bottom: 0.75rem;
    }
    .item-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 0.75rem;
    }
    .item-num {
      width: 22px; height: 22px; border-radius: 6px; background: #1e1e1e;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.7rem; font-weight: 700; color: #666;
    }
    .item-remove {
      background: none; border: none; color: #444; cursor: pointer; font-size: 0.75rem;
      padding: 0.25rem 0.5rem; border-radius: 4px; transition: color 0.15s;
      &:hover { color: #f87171; }
    }
    .btn-add-item {
      background: #1a1a1a; border: 1px solid #2a2a2a; color: #888; border-radius: 6px;
      font-size: 0.75rem; padding: 0.3rem 0.75rem; cursor: pointer; font-family: 'Inter', sans-serif;
      transition: all 0.15s;
      &:hover { background: #222; color: #f5a623; border-color: rgba(245,166,35,0.3); }
    }
    .btn-primary {
      background: linear-gradient(135deg, #f5a623, #e8901a); color: #000; border: none;
      border-radius: 8px; padding: 0.55rem 1.25rem; font-size: 0.85rem; font-weight: 600;
      font-family: 'Inter', sans-serif; cursor: pointer; transition: opacity 0.15s, background 0.15s;
      &:hover { opacity: 0.9; } &:disabled { opacity: 0.6; cursor: not-allowed; }
      &.btn-success { background: #22c55e; color: #fff; pointer-events: none; }
    }
    .btn-save {
      display: flex; align-items: center; gap: 0.4rem;
      background: rgba(245,166,35,0.12); color: #f5a623; border: 1px solid rgba(245,166,35,0.25);
      border-radius: 8px; padding: 0.6rem 1.25rem; font-size: 0.85rem; font-weight: 600;
      font-family: 'Inter', sans-serif; cursor: pointer; margin-top: 0.5rem; transition: all 0.15s;
      &:hover { background: rgba(245,166,35,0.2); }
    }
  `]
})
export class AdminPageEditorComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private cms = inject(AdminCmsService);

  page = signal<AdminPage | null>(null);
  loading = signal(true);
  saving = signal(false);
  pageSaved = signal(false);
  openSection = signal<string | null>(null);
  sectionSaved = signal<string | null>(null);

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.cms.getPage(slug).subscribe({
      next: data => { this.page.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  toggleSection(id: string) {
    this.openSection.set(this.openSection() === id ? null : id);
  }

  getFieldKeys(section: AdminSection): string[] {
    return Object.keys(section.fields || {});
  }

  getItemKeys(item: Record<string, any>): string[] {
    return Object.keys(item || {});
  }

  isLongText(value: any): boolean {
    return typeof value === 'string' && value.length > 80;
  }

  addItem(section: AdminSection) {
    if (!section.items) section.items = [];
    // Clone keys from first item as template, or use empty object
    const template = section.items[0] ? Object.fromEntries(Object.keys(section.items[0]).map(k => [k, ''])) : {};
    section.items = [...section.items, template];
  }

  removeItem(section: AdminSection, idx: number) {
    section.items = section.items.filter((_, i) => i !== idx);
  }

  saveSection(section: AdminSection) {
    this.cms.updateSection(section.id, {
      fields: section.fields,
      items: section.items,
      is_active: section.is_active,
    }).subscribe({
      next: () => {
        this.sectionSaved.set(section.id);
        setTimeout(() => this.sectionSaved.set(null), 2500);
      },
      error: (err) => {
        console.error('Save Section Error:', err);
      }
    });
  }

  saveAllChanges() {
    const p = this.page();
    if (!p) return;
    this.saving.set(true);

    const requests = [];

    // Save Page SEO & Meta
    requests.push(
      this.cms.updatePage(p.id, {
        title: p.title,
        meta_title: p.meta_title,
        meta_description: p.meta_description,
        is_published: p.is_published,
      })
    );

    // Save all Sections
    if (p.sections && p.sections.length > 0) {
      for (const section of p.sections) {
        requests.push(
          this.cms.updateSection(section.id, {
            fields: section.fields,
            items: section.items,
            is_active: section.is_active,
          })
        );
      }
    }

    forkJoin(requests).subscribe({
      next: () => {
        this.saving.set(false);
        this.pageSaved.set(true);
        setTimeout(() => this.pageSaved.set(false), 3000);
      },
      error: (err) => {
        this.saving.set(false);
        console.error('Save All Error:', err);
      }
    });
  }
}
