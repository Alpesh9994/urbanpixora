import { Injectable, signal, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class MenuStateService {
    readonly isOpen = signal(false);

    constructor(@Inject(PLATFORM_ID) private platformId: object) { }

    private lockScroll(): void {
        if (!isPlatformBrowser(this.platformId)) return;
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
    }

    private unlockScroll(): void {
        if (!isPlatformBrowser(this.platformId)) return;
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
    }

    open() { this.isOpen.set(true); this.lockScroll(); }
    close() { this.isOpen.set(false); this.unlockScroll(); }
    toggle() {
        const next = !this.isOpen();
        this.isOpen.set(next);
        next ? this.lockScroll() : this.unlockScroll();
    }
}
