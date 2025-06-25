import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    CommonModule
  ],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css'
})
export class ProductEditComponent {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private http = inject(HttpClient);
  productForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  loading = false;
  error = '';
  success = '';
  productId = '';
  originalImageUrl = '';

  constructor() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      shortDescription: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      image: [null]
    });
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.productId = id;
        this.loadProduct(id);
      }
    });
  }

  loadProduct(id: string) {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          shortDescription: product.shortDescription,
          price: product.price,
          stockQuantity: product.stockQuantity
        });
        this.originalImageUrl = product.imageUrl;
        this.imagePreview = product.imageUrl;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load product.';
        this.loading = false;
      }
    });
  }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.productForm.patchValue({ image: file });
      this.productForm.get('image')?.updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  submit() {
    if (this.productForm.invalid) return;
    this.loading = true;
    this.error = '';
    this.success = '';
    const updateProduct = (imageUrl: string) => {
      const data = {
        name: this.productForm.value.name,
        shortDescription: this.productForm.value.shortDescription,
        price: Number(this.productForm.value.price),
        stockQuantity: Number(this.productForm.value.stockQuantity),
        imageUrl
      };
      this.productService.updateProduct(this.productId, data).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/shop'], { state: { success: 'Product updated successfully!' } });
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to update product.';
          this.loading = false;
        }
      });
    };
    // If a new image is uploaded, upload it first
    if (this.productForm.value.image) {
      const imageFormData = new FormData();
      imageFormData.append('file', this.productForm.value.image);
      this.http.post<{ imageUrl: string }>('http://localhost:3000/products/upload-image', imageFormData).subscribe({
        next: (res) => updateProduct(res.imageUrl),
        error: (err) => {
          this.error = err.error?.message || 'Failed to upload image.';
          this.loading = false;
        }
      });
    } else {
      updateProduct(this.originalImageUrl);
    }
  }
}
