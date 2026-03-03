import {
    Component, OnInit, OnDestroy,
    ElementRef, NgZone, PLATFORM_ID, Inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

interface Stat {
    target: number;    // numeric end value
    suffix: string;    // '+' or ''
    label: string;
    current: number;   // animated display value
}

const DURATION = 1800; // ms for the full count-up
const EASE = (t: number) => 1 - Math.pow(1 - t, 3); // cubic ease-out

@Component({
    selector: 'app-stats-section',
    standalone: true,
    imports: [ScrollRevealDirective],
    templateUrl: './stats-section.html',
    styleUrl: './stats-section.scss'
})
export class StatsSectionComponent implements OnInit, OnDestroy {

    stats: Stat[] = [
        { target: 120, suffix: '+', label: 'Projects Delivered', current: 0 },
        { target: 8, suffix: '+', label: 'Years of Experience', current: 0 },
        { target: 40, suffix: '+', label: 'Happy Clients', current: 0 },
        { target: 12, suffix: '', label: 'Industry Awards', current: 0 },
    ];

    private observer!: IntersectionObserver;
    private rafId = 0;
    private started = false;
    private isBrowser: boolean;

    constructor(
        private elRef: ElementRef,
        private zone: NgZone,
        @Inject(PLATFORM_ID) platformId: object
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    ngOnInit(): void {
        if (!this.isBrowser) return;

        this.zone.runOutsideAngular(() => {
            this.observer = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && !this.started) {
                        this.started = true;
                        this.runCountUp();
                    }
                },
                { threshold: 0.3 } // trigger when 30% of section is visible
            );
            this.observer.observe(this.elRef.nativeElement);
        });
    }

    private runCountUp(): void {
        const start = performance.now();

        const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / DURATION, 1);
            const eased = EASE(progress);

            // Update each stat's current display value
            this.zone.run(() => {
                for (const stat of this.stats) {
                    stat.current = Math.round(stat.target * eased);
                }
            });

            if (progress < 1) {
                this.rafId = requestAnimationFrame(tick);
            } else {
                // Ensure we land exactly on target
                this.zone.run(() => {
                    for (const stat of this.stats) {
                        stat.current = stat.target;
                    }
                    // Trigger CSS landing bounce on each value element
                    setTimeout(() => {
                        this.elRef.nativeElement
                            .querySelectorAll('.stat-item__value')
                            .forEach((el: Element) => el.classList.add('did-count'));
                    }, 50);
                });
            }
        };

        this.rafId = requestAnimationFrame(tick);
    }

    ngOnDestroy(): void {
        this.observer?.disconnect();
        cancelAnimationFrame(this.rafId);
    }
}
