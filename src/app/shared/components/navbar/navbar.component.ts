import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MATERIAL_MODULES } from '../../material/material.module';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [
    ...MATERIAL_MODULES,
    RouterModule
  ]
})
export class NavbarComponent {}
