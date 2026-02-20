import { Component, Inject, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

import { CollectionsService } from '../services/collections.service';
import type { Collection, Movie } from '../../../shared/models';
import { MATERIAL_MODULES } from '../../../shared/material/material.module';

@Component({
  selector: 'app-add-to-collection-dialog',
  standalone: true,
  templateUrl: './add-to-collection-dialog.component.html',
  styleUrl: './add-to-collection-dialog.component.scss',
  imports: [
    ...MATERIAL_MODULES,
    MatDialogModule,
    FormsModule
  ]
})
export class AddToCollectionDialogComponent implements OnInit {
  collections: Collection[] = [];
  selectedCollectionIds: Set<string> = new Set();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { movies: Movie[] },
    public dialogRef: MatDialogRef<AddToCollectionDialogComponent>,
    private collectionsService: CollectionsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCollections();
  }

  private loadCollections(): void {
    this.collections = this.collectionsService.getAll();
  }

  toggleCollection(collectionId: string): void {
    if (this.selectedCollectionIds.has(collectionId)) {
      this.selectedCollectionIds.delete(collectionId);
    } else {
      this.selectedCollectionIds.add(collectionId);
    }
  }

  isCollectionSelected(collectionId: string): boolean {
    return this.selectedCollectionIds.has(collectionId);
  }

  addToSelectedCollections(): void {
    this.selectedCollectionIds.forEach(collectionId => {
      this.data.movies.forEach(movie => {
        this.collectionsService.addMovieToCollection(collectionId, movie);
      });
    });

    this.dialogRef.close();
  }

  createNewCollection(): void {
    this.dialogRef.close();
    this.router.navigate(['/collections/create']);
  }
}
