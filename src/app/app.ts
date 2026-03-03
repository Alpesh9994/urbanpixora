import { Component, OnInit } from '@angular/core';
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
  constructor(
    private smoothScroll: SmoothScrollService,
    private router: Router
  ) { }

  ngOnInit() {
    this.smoothScroll.init();

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      // 1. Jump to top immediately
      this.smoothScroll.scrollToTop();

      // 2. After Angular has finished rendering the new route components,
      //    tell Lenis to recalculate the page's scrollable height.
      //    Without this, Lenis uses the old page height and scroll gets stuck.
      //
      //    We use two nested rAFs + a small timeout to guarantee we run
      //    AFTER Angular's full rendering cycle (including scroll-reveal
      //    and any lazy-loaded images that affect layout).
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.smoothScroll.resize();
          // Belt-and-braces: also resize after images / fonts may have loaded
          setTimeout(() => this.smoothScroll.resize(), 300);
        });
      });
    });
  }

  getRouteAnimationData(outlet: RouterOutlet) {
    // Return a unique string for each route so the * <=> * transition always fires
    return outlet && outlet.activatedRouteData && outlet.isActivated
      ? outlet.activatedRoute.snapshot.url.join('/')
      : null;
  }
}
