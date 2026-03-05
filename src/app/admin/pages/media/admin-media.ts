import { Component, signal, inject } from '@angular/core';
import { AdminAuthService } from '../../services/admin-auth.service';
import { AdminCmsService } from '../../services/admin-cms.service';

@Component({
    selector: 'app-admin-media',
    standalone: true,
    imports: [],
    template: `
    <div class="admin-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Media</h1>
          <p class="page-sub">Upload and manage images</p>
        </div>
      </div>

      <!-- Upload Zone -->
      <div class="upload-zone" (click)="fileInput.click()" (dragover)="$event.preventDefault()" (drop)="onDrop($event)">
        <input #fileInput type="file" accept="image/*" multiple hidden (change)="onFileSelect($event)" />
        <div class="upload-icon">↑</div>
        <p class="upload-title">Drop images here or <span class="upload-link">browse</span></p>
        <p class="upload-sub">JPG, PNG, WebP, SVG — max 5MB each</p>
      </div>

      @if (uploading()) {
        <div class="upload-progress">Uploading... please wait</div>
      }

      @if (uploadedUrls().length) {
        <div class="card mt-2">
          <div class="card-header">
            <h2>Recently Uploaded</h2>
            <span class="card-tag">{{ uploadedUrls().length }} file(s)</span>
          </div>
          <div class="media-grid">
            @for (item of uploadedUrls(); track item.filename) {
              <div class="media-item">
                <img [src]="item.url" [alt]="item.filename" />
                <div class="media-info">
                  <span class="media-name">{{ item.filename }}</span>
                  <button class="copy-btn" (click)="copyUrl(item.url)">Copy URL</button>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
    styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    * { box-sizing: border-box; }
    .admin-page { padding: 2rem; font-family: 'Inter', sans-serif; max-width: 860px; }
    .page-header { margin-bottom: 1.75rem; }
    .page-title { font-size: 1.75rem; font-weight: 700; color: #fff; margin: 0 0 0.25rem; }
    .page-sub { color: #555; font-size: 0.875rem; margin: 0; }
    .upload-zone {
      border: 2px dashed #2a2a2a; border-radius: 14px; padding: 3rem 2rem; text-align: center;
      cursor: pointer; transition: all 0.2s;
      &:hover { border-color: rgba(245,166,35,0.4); background: rgba(245,166,35,0.03); }
    }
    .upload-icon { font-size: 2rem; color: #f5a623; margin-bottom: 0.75rem; }
    .upload-title { color: #888; font-size: 0.95rem; margin: 0 0 0.3rem; }
    .upload-link { color: #f5a623; }
    .upload-sub { color: #444; font-size: 0.8rem; margin: 0; }
    .upload-progress { color: #f5a623; font-size: 0.85rem; margin-top: 1rem; }
    .mt-2 { margin-top: 1.25rem; }
    .card { background: #111; border: 1px solid #1f1f1f; border-radius: 12px; overflow: hidden; }
    .card-header {
      display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.5rem;
      border-bottom: 1px solid #1a1a1a;
      h2 { margin: 0; font-size: 0.9rem; font-weight: 600; color: #ddd; }
    }
    .card-tag { font-size: 0.7rem; color: #555; background: #1a1a1a; padding: 0.2rem 0.6rem; border-radius: 20px; }
    .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; padding: 1.25rem; }
    .media-item { background: #161616; border: 1px solid #222; border-radius: 10px; overflow: hidden; }
    .media-item img { width: 100%; height: 120px; object-fit: cover; display: block; }
    .media-info { padding: 0.6rem; display: flex; flex-direction: column; gap: 0.4rem; }
    .media-name { font-size: 0.7rem; color: #555; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .copy-btn {
      background: #1e1e1e; border: 1px solid #2a2a2a; color: #888; border-radius: 6px;
      font-size: 0.7rem; padding: 0.25rem 0.5rem; cursor: pointer; font-family: 'Inter', sans-serif;
      transition: all 0.15s; text-align: center;
      &:hover { color: #f5a623; border-color: rgba(245,166,35,0.3); }
    }
  `]
})
export class AdminMediaComponent {
    private cms = inject(AdminCmsService);
    uploading = signal(false);
    uploadedUrls = signal<{ url: string; filename: string }[]>([]);

    onFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files) this.uploadFiles(Array.from(input.files));
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        const files = Array.from(event.dataTransfer?.files ?? []);
        this.uploadFiles(files);
    }

    uploadFiles(files: File[]) {
        this.uploading.set(true);
        let remaining = files.length;
        files.forEach(file => {
            this.cms.uploadFile(file).subscribe({
                next: (res) => {
                    this.uploadedUrls.update(prev => [{ url: res.url, filename: res.filename }, ...prev]);
                    remaining--;
                    if (remaining === 0) this.uploading.set(false);
                },
                error: () => { remaining--; if (remaining === 0) this.uploading.set(false); }
            });
        });
    }

    copyUrl(url: string) {
        navigator.clipboard.writeText(url);
    }
}
