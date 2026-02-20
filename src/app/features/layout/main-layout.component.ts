import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MATERIAL_MODULES } from '../../shared/material/material.module';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ...MATERIAL_MODULES,
    RouterModule
  ]
})
export class MainLayoutComponent {
  sidenavOpen = signal(true);

  toggleSidenav(): void {
    this.sidenavOpen.update(value => !value);
  }

  closeSidenav(): void {
    this.sidenavOpen.set(false);
  }
}

