import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './shared/components/header/header';
import { OverlayMenuComponent } from './shared/components/overlay-menu/overlay-menu';
import { SmoothScrollService } from './shared/services/smooth-scroll.service';
import { CustomCursorComponent } from './shared/components/custom-cursor/custom-cursor';
import { routeTransitionAnimations } from './shared/animations/route-animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, OverlayMenuComponent, CustomCursorComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  animations: [routeTransitionAnimations]
})
export class App implements OnInit {
  isAdminRoute = signal(false);

  constructor(
    private smoothScroll: SmoothScrollService,
    private router: Router
  ) { }

  ngOnInit() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: NavigationEnd) => {
      const admin = e.urlAfterRedirects.startsWith('/admin');
      this.isAdminRoute.set(admin);

      if (admin) {
        // Destroy Lenis so the admin panel uses native browser scroll
        this.smoothScroll.destroy();
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        return;
      }

      // Public site: ensure Lenis is running
      this.smoothScroll.init();
      this.smoothScroll.scrollToTop();

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.smoothScroll.resize();
          setTimeout(() => this.smoothScroll.resize(), 300);
        });
      });
    });

    // Check on first load (before any navigation event)
    const initialUrl = this.router.url;
    if (initialUrl.startsWith('/admin')) {
      this.isAdminRoute.set(true);
      this.smoothScroll.destroy();
    } else {
      this.smoothScroll.init();
    }
  }

  getRouteAnimationData(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.isActivated
      ? outlet.activatedRoute.snapshot.url.join('/')
      : null;
  }
}

