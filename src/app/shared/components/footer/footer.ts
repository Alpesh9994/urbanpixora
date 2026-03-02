import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './footer.html',
    styleUrl: './footer.scss'
})
export class FooterComponent {
    readonly year = new Date().getFullYear();

    readonly navLinks = [
        { label: 'Home', path: '/' },
        { label: 'About', path: '/about' },
        { label: 'Services', path: '/services' },
        { label: 'Projects', path: '/projects' },
        { label: 'Contact', path: '/contact' },
    ];

    readonly socialLinks = [
        { label: 'LinkedIn', url: 'https://linkedin.com' },
        { label: 'Instagram', url: 'https://instagram.com' },
        { label: 'Behance', url: 'https://behance.net' },
        { label: 'Dribbble', url: 'https://dribbble.com' },
    ];
}
