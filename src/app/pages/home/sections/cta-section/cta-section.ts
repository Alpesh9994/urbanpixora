import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import { CmsSection } from '../../../../shared/services/cms.service';

@Component({
    selector: 'app-cta-section',
    standalone: true,
    imports: [RouterLink, ScrollRevealDirective],
    templateUrl: './cta-section.html',
    styleUrl: './cta-section.scss'
})
export class CtaSectionComponent {
    @Input() data: CmsSection | undefined;
}
