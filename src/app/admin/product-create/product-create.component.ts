import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent {
  product = {
    name: '',
    shortDescription: '',
    price: 0,
    stockQuantity: 0,
    imageUrl: ''
  };
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isUploading = false;

  constructor(private productService: ProductService, private router: Router) { }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.selectedFile) {
      this.isUploading = true;
      this.productService.uploadImage(this.selectedFile).subscribe(response => {
        this.product.imageUrl = response.imageUrl;
        this.createProduct();
      });
    } else {
      this.createProduct();
    }
  }

  private createProduct(): void {
    this.productService.createProduct(this.product).subscribe(() => {
      this.isUploading = false;
      this.router.navigate(['/admin']);
    });
  }
} 