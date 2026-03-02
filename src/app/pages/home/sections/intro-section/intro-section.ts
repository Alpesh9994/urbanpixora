import { Component } from '@angular/core';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
    selector: 'app-intro-section',
    standalone: true,
    imports: [ScrollRevealDirective],
    templateUrl: './intro-section.html',
    styleUrl: './intro-section.scss'
})
export class IntroSectionComponent { }
