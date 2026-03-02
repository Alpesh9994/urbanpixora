import { Component, signal } from '@angular/core';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { FooterComponent } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [ScrollRevealDirective, FooterComponent],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.scss'
})
export class ContactPageComponent {
  name = signal('');
  email = signal('');
  subject = signal('');
  message = signal('');
  submitted = signal(false);

  onSubmit(e: Event) {
    e.preventDefault();
    // In a real app wire to an API / EmailJS / Formspree here
    this.submitted.set(true);
  }

  readonly info = [
    { icon: '📍', label: 'Studio Location', value: 'Surat, Gujarat, India' },
    { icon: '📧', label: 'Email Us', value: 'hello@urbanpixora.com' },
    { icon: '📱', label: 'Call / WhatsApp', value: '+91 98XXX XXXXX' },
    { icon: '⏰', label: 'Working Hours', value: 'Mon – Sat, 9am – 6pm IST' },
  ];
}
