import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { CollectionsService } from '../services/collections.service';

@Component({
  selector: 'app-collection-create-page',
  standalone: true,
  templateUrl: './collection-create.page.html',
  styleUrl: './collection-create.page.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule
  ]
})
export class CollectionCreatePage {
  form!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private collectionsService: CollectionsService,
    private router: Router
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.isSubmitting = true;
    const { title, description } = this.form.value;

    try {
      const newCollection = this.collectionsService.create(title, description);
      this.router.navigate(['/collections', newCollection.id]);
    } catch (error) {
      console.error('Erro ao criar coleção:', error);
      this.isSubmitting = false;
    }
  }

  cancel(): void {
    this.router.navigate(['/collections']);
  }

  get titleControl() {
    return this.form.get('title');
  }

  get descriptionControl() {
    return this.form.get('description');
  }
}

