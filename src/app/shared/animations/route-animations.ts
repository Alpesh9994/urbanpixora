import { trigger, style, animate, transition, query, group } from '@angular/animations';

export const routeTransitionAnimations = trigger('routeTransition', [
    // On any route change
    transition('* <=> *', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
            style({
                position: 'relative',
                width: '100%',
                opacity: 0,
            })
        ], { optional: true }),

        query(':enter', [
            style({ opacity: 0, transform: 'translateY(15px)' })
        ], { optional: true }),

        // Group runs animations in parallel
        group([
            // Animate leaving page
            query(':leave', [
                style({ position: 'absolute', top: 0, left: 0, zIndex: -1 }),
                animate('0.35s ease-out', style({ opacity: 0, transform: 'translateY(-15px)' }))
            ], { optional: true }),

            // Animate entering page
            query(':enter', [
                // Allow a small delay for leaving animation to play out slightly
                animate('0.45s 0.1s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
            ], { optional: true })
        ])
    ])
]);
