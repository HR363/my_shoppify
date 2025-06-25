import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.interface';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../auth/interfaces/user.interface';
import { CartService } from '../../services/cart.service';
import { ProductStockService } from '../../services/product-stock.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductDetailDialogComponent } from '../product-detail-dialog/product-detail-dialog.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    CommonModule,
    RouterModule,
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error = '';
  success = '';
  user: User | null = null;

  constructor(
    private productService: ProductService,
    private router: Router,
    private authService: AuthService,
    private cartService: CartService,
    private productStockService: ProductStockService,
    public dialog: MatDialog
  ) {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state && nav.extras.state['success']) {
      this.success = nav.extras.state['success'];
    }
    this.productStockService.stockChanged$.subscribe(() => {
      this.loadProducts();
    });
  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.error = '';
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products.';
        this.loading = false;
      }
    });
  }

  deleteProduct(product: Product) {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;
    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        this.success = 'Product deleted successfully!';
        this.loadProducts();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to delete product.';
      }
    });
  }

  addToCart(productId: string) {
    this.cartService.addToCart(productId, 1).subscribe({
      next: () => {
        this.success = `Product added to cart!`;
        this.loadProducts(); 
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to add to cart.';
      }
    });
  }

  openProductDialog(product: Product): void {
    const dialogRef = this.dialog.open(ProductDetailDialogComponent, {
      data: product,
      width: '900px',
      panelClass: 'product-dialog-panel'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addToCart(result);
      }
    });
  }
}
