import { Component } from '@angular/core';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
    selector: 'app-about-story', standalone: true, imports: [ScrollRevealDirective],
    templateUrl: './about-story.html', styleUrl: './about-story.scss'
})
export class AboutStoryComponent { }
