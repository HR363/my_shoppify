import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    CommonModule
  ],
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.css'
})
export class ProductCreateComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private http = inject(HttpClient);
  productForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  loading = false;
  error = '';
  success = '';

  constructor(private fb: FormBuilder) {
    this.auth.user$.subscribe(user => {
      if (user && user.role?.toLowerCase() !== 'admin') {
        this.router.navigate(['/shop']);
      }
    });
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      shortDescription: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      image: [null, Validators.required]
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
    // Step 1: Upload image and get imageUrl
    const imageFile = this.productForm.value.image;
    const imageFormData = new FormData();
    imageFormData.append('file', imageFile);
    this.http.post<{ imageUrl: string }>('http://localhost:3000/products/upload-image', imageFormData).subscribe({
      next: (res) => {
        const imageUrl = res.imageUrl;
        // Step 2: Create product with imageUrl
        const productData = {
          name: this.productForm.value.name,
          shortDescription: this.productForm.value.shortDescription,
          price: Number(this.productForm.value.price),
          stockQuantity: Number(this.productForm.value.stockQuantity),
          imageUrl
        };
        this.http.post('http://localhost:3000/products', productData).subscribe({
          next: () => {
            this.loading = false;
            this.router.navigate(['/shop'], { state: { success: 'Product created successfully!' } });
          },
          error: (err) => {
            this.error = err.error?.message || 'Failed to create product.';
            this.loading = false;
          }
        });
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to upload image.';
        this.loading = false;
      }
    });
  }
}
