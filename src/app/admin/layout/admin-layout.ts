import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-shell">
      <!-- Sidebar -->
      <aside class="admin-sidebar">
        <div class="sidebar-header">
          <span class="logo-mark">UP</span>
          <span class="logo-text">UrbanPixora <em>Admin</em></span>
        </div>

        <nav class="sidebar-nav">
          <span class="nav-label">Content</span>
          <a routerLink="/admin" routerLinkActive="is-active" [routerLinkActiveOptions]="{exact:true}" class="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Dashboard
          </a>
          <a routerLink="/admin" routerLinkActive="is-active" [routerLinkActiveOptions]="{exact:true}" class="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Pages
          </a>
          <a routerLink="/admin/media" routerLinkActive="is-active" class="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            Media
          </a>

          <span class="nav-label" style="margin-top: 1.5rem">Site</span>
          <a href="/" target="_blank" class="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            View Site ↗
          </a>
        </nav>

        <div class="sidebar-footer">
          <div class="user-info">
            <div class="user-avatar">{{ auth.currentUser()?.name?.charAt(0) || 'A' }}</div>
            <div>
              <p class="user-name">{{ auth.currentUser()?.name || 'Admin' }}</p>
              <p class="user-role">{{ auth.currentUser()?.role || '' }}</p>
            </div>
          </div>
          <button class="logout-btn" (click)="auth.logout()" title="Logout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </aside>

      <!-- Main content -->
      <main class="admin-main">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    * { box-sizing: border-box; }

    .admin-shell {
      display: flex;
      min-height: 100vh;
      background: #0d0d0d;
      font-family: 'Inter', sans-serif;
      color: #e0e0e0;
    }

    /* ── Sidebar ── */
    .admin-sidebar {
      width: 240px;
      min-width: 240px;
      background: #111;
      border-right: 1px solid #1f1f1f;
      display: flex;
      flex-direction: column;
      padding: 0;
      position: sticky;
      top: 0;
      height: 100vh;
    }
    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 1.5rem 1.25rem;
      border-bottom: 1px solid #1f1f1f;
    }
    .logo-mark {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #f5a623, #e8901a);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: #000;
      font-size: 0.75rem;
      flex-shrink: 0;
    }
    .logo-text {
      font-size: 0.9rem;
      font-weight: 500;
      color: #fff;
      em { color: #f5a623; font-style: normal; }
    }
    .sidebar-nav {
      flex: 1;
      padding: 1.25rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .nav-label {
      font-size: 0.65rem;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #444;
      padding: 0.25rem 0.5rem 0.5rem;
      display: block;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.65rem 0.75rem;
      border-radius: 8px;
      color: #777;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.15s;
      svg { flex-shrink: 0; }
      &:hover { background: #1a1a1a; color: #ccc; }
      &.is-active { background: rgba(245,166,35,0.12); color: #f5a623; }
    }
    .sidebar-footer {
      border-top: 1px solid #1f1f1f;
      padding: 1rem 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      overflow: hidden;
    }
    .user-avatar {
      width: 30px;
      height: 30px;
      border-radius: 8px;
      background: linear-gradient(135deg, #f5a623, #e8901a);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: #000;
      font-size: 0.75rem;
      flex-shrink: 0;
    }
    .user-name {
      font-size: 0.8rem;
      font-weight: 600;
      color: #ddd;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .user-role {
      font-size: 0.7rem;
      color: #555;
      margin: 0;
      text-transform: capitalize;
      white-space: nowrap;
    }
    .logout-btn {
      background: none;
      border: 1px solid #2a2a2a;
      border-radius: 6px;
      color: #555;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
      transition: all 0.15s;
      &:hover { border-color: #f87171; color: #f87171; }
    }

    /* ── Main ── */
    .admin-main {
      flex: 1;
      overflow-y: auto;
      min-height: 100vh;
    }
  `]
})
export class AdminLayoutComponent {
  auth = inject(AdminAuthService);
}
