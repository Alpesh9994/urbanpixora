import {
    Component,
    inject,
} from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import {
    trigger,
    style,
    animate,
    transition,
    query,
    stagger,
    animateChild,
} from '@angular/animations';
import { MenuStateService } from '../../services/menu-state.service';

const OVERLAY_ANIM = trigger('overlayAnim', [
    transition(':enter', [
        style({ opacity: 0 }),
        animate('350ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1 })),
        query('@itemAnim', stagger(60, animateChild()), { optional: true }),
    ]),
    transition(':leave', [
        query('@itemAnim', stagger(30, animateChild()), { optional: true }),
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 0 })),
    ]),
]);

const ITEM_ANIM = trigger('itemAnim', [
    transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)',
            style({ opacity: 1, transform: 'translateY(0)' })),
    ]),
    transition(':leave', [
        animate('150ms cubic-bezier(0.4, 0, 0.2, 1)',
            style({ opacity: 0, transform: 'translateY(10px)' })),
    ]),
]);

@Component({
    selector: 'app-overlay-menu',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './overlay-menu.html',
    styleUrl: './overlay-menu.scss',
    animations: [OVERLAY_ANIM, ITEM_ANIM],
})
export class OverlayMenuComponent {
    protected readonly menuState = inject(MenuStateService);
    private readonly router = inject(Router);

    readonly navLinks = [
        { label: 'Home', path: '/' },
        { label: 'Projects', path: '/projects' },
        { label: 'Services', path: '/services' },
        { label: 'Contact', path: '/contact' },
        { label: 'About', path: '/about' },
    ];

    isActive(path: string): boolean {
        if (path === '/') {
            return this.router.url === '/';
        }
        return this.router.url.startsWith(path);
    }

    /**
     * Close the menu first, then navigate after the leave animation completes.
     * This prevents the race condition where the new page mounts (and
     * ScrollRevealDirective hides everything) while the overlay is still visible.
     */
    navigateTo(path: string, event: Event) {
        event.preventDefault();
        this.menuState.close();
        // Wait for the leave animation to finish (200ms) before navigating
        setTimeout(() => {
            this.router.navigateByUrl(path);
        }, 210);
    }
}
