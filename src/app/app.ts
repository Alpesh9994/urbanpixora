import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header';
import { OverlayMenuComponent } from './shared/components/overlay-menu/overlay-menu';
import { SmoothScrollService } from './shared/services/smooth-scroll.service';
import { CustomCursorComponent } from './shared/components/custom-cursor/custom-cursor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, OverlayMenuComponent, CustomCursorComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  constructor(private smoothScroll: SmoothScrollService) { }

  ngOnInit() {
    this.smoothScroll.init();
  }
}
