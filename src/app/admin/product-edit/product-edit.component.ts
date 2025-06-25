import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.interface';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  product: Product | null = null;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isUploading = false;
  productId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {
    this.productId = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.productService.getProduct(this.productId).subscribe(data => {
      this.product = data;
      this.imagePreview = data.imageUrl;
    });
  }

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
        if (this.product) {
          this.product.imageUrl = response.imageUrl;
          this.updateProduct();
        }
      });
    } else {
      this.updateProduct();
    }
  }

  private updateProduct(): void {
    if (this.product) {
      this.productService.updateProduct(this.productId, this.product).subscribe(() => {
        this.isUploading = false;
        this.router.navigate(['/admin']);
      });
    }
  }
} 