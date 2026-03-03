import { Component, signal, inject } from '@angular/core';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { FooterComponent } from '../../shared/components/footer/footer';
import { ContactFormService } from '../../shared/services/contact-form.service';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [ScrollRevealDirective, FooterComponent],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.scss'
})
export class ContactPageComponent {
  private formService = inject(ContactFormService);

  name = signal('');
  email = signal('');
  subject = signal('');
  message = signal('');

  submitted = signal(false);
  loading = signal(false);
  error = signal('');

  onSubmit(e: Event) {
    e.preventDefault();
    if (this.loading()) return;

    this.error.set('');
    this.loading.set(true);

    this.formService.send({
      name: this.name(),
      email: this.email(),
      subject: this.subject(),
      message: this.message(),
    }).subscribe(result => {
      this.loading.set(false);
      if (result.ok) {
        this.submitted.set(true);
      } else {
        this.error.set(result.error ?? 'Something went wrong. Please try again.');
      }
    });
  }

  readonly info = [
    { icon: '📍', label: 'Studio Location', value: 'Surat, Gujarat, India' },
    { icon: '📧', label: 'Email Us', value: 'hello@urbanpixora.com' },
    { icon: '📱', label: 'Call / WhatsApp', value: '+91 98XXX XXXXX' },
    { icon: '⏰', label: 'Working Hours', value: 'Mon – Sat, 9am – 6pm IST' },
  ];
}
