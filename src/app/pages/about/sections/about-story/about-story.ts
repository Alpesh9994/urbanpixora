import { Component } from '@angular/core';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
    selector: 'app-about-story',
    standalone: true,
    imports: [ScrollRevealDirective],
    templateUrl: './about-story.html',
    styleUrl: './about-story.scss'
})
export class AboutStoryComponent {
    readonly stats = [
        { val: '120+', lbl: 'Projects Delivered', accent: false },
        { val: '8+', lbl: 'Years Experience', accent: true },
        { val: '40+', lbl: 'Happy Clients', accent: false },
        { val: '2', lbl: 'Founding Partners', accent: false },
    ];
}
