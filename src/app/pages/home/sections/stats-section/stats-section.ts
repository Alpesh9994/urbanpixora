import { Component } from '@angular/core';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
    selector: 'app-stats-section',
    standalone: true,
    imports: [ScrollRevealDirective],
    templateUrl: './stats-section.html',
    styleUrl: './stats-section.scss'
})
export class StatsSectionComponent {
    readonly stats = [
        { value: '120+', label: 'Projects Delivered' },
        { value: '8+', label: 'Years of Experience' },
        { value: '40+', label: 'Happy Clients' },
        { value: '12', label: 'Industry Awards' },
    ];
}
