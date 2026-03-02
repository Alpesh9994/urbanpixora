import { Component, inject, HostListener, signal } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { filter } from 'rxjs';
import { MenuStateService } from '../../services/menu-state.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [RouterLink, NgClass],
    templateUrl: './header.html',
    styleUrl: './header.scss'
})
export class HeaderComponent {
    protected readonly menuState = inject(MenuStateService);
    private readonly router = inject(Router);

    /** true while user has scrolled more than 20px */
    readonly isScrolled = signal(false);

    /** true only on the home page (dark hero) */
    readonly isHomePage = signal(false);

    constructor() {
        // Track route changes
        this.router.events
            .pipe(filter(e => e instanceof NavigationEnd))
            .subscribe((e: NavigationEnd) => {
                this.isHomePage.set(e.urlAfterRedirects === '/' || e.urlAfterRedirects === '');
            });

        // Set initial state immediately (for first load)
        const url = this.router.url;
        this.isHomePage.set(url === '/' || url === '');
    }

    @HostListener('window:scroll', [])
    onScroll() {
        this.isScrolled.set(window.scrollY > 20);
    }

    /**
     * On light inner pages: header needs dark text.
     * On home page (dark hero): header can stay transparent with light text.
     * When scrolled: always show white backdrop with dark text (works on both types).
     */
    get headerClass() {
        return {
            'is-scrolled': this.isScrolled(),
            'is-dark-page': this.isHomePage(),
            'is-light-page': !this.isHomePage(),
        };
    }
}
