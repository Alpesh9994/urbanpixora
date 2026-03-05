import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CmsSection } from '../../services/cms.service';

@Component({
    selector: 'app-hero',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './hero.html',
    styleUrl: './hero.scss'
})
export class HeroComponent {
    @Input() data: CmsSection | undefined;
}
