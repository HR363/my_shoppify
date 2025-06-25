import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Product } from '../../models/product.interface';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="dialog-container">
      <div class="image-container">
        <img [src]="data.imageUrl" [alt]="data.name">
      </div>
      <div class="content-container">
        <h1 mat-dialog-title>{{ data.name }}</h1>
        <mat-dialog-content>
          <p class="description">{{ data.shortDescription }}</p>
          <div class="product-info">
            <span class="price">\${{ data.price }}</span>
            <span *ngIf="data.stockQuantity > 0" class="in-stock">In Stock: {{ data.stockQuantity }}</span>
            <span *ngIf="data.stockQuantity === 0" class="out-of-stock">Out of Stock</span>
          </div>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
          <button mat-button (click)="onNoClick()">Close</button>
          <button mat-raised-button color="primary" [mat-dialog-close]="data.id" [disabled]="data.stockQuantity === 0">Add to Cart</button>
        </mat-dialog-actions>
      </div>
    </div>
  `,
  styleUrls: ['./product-detail-dialog.component.css']
})
export class ProductDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ProductDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
} 