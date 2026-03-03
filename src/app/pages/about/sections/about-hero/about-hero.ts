import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-about-hero',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './about-hero.html',
    styleUrl: './about-hero.scss'
})
export class AboutHeroComponent { }
