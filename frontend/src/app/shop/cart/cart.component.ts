import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart.interface';
import { ProductStockService } from '../../services/product-stock.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  isLoading = true;

  constructor(private cartService: CartService, private productStockService: ProductStockService) {}

  ngOnInit() {
    this.fetchCart();
  }

  fetchCart() {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (data) => {
        this.cartItems = data.items || data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  get total() {
    return this.cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }

  updateQuantity(item: CartItem, quantity: number) {
    const newQty = Math.max(1, quantity);
    if (newQty === item.quantity) return;
    this.cartService.updateCartItem(item.id, newQty).subscribe({
      next: () => {
        item.quantity = newQty;
        this.productStockService.notifyStockChanged();
      },
      error: () => {
        window.alert('Failed to update quantity.');
      },
    });
  }

  removeItem(item: CartItem) {
    if (!confirm('Remove this item from your cart?')) return;
    this.cartService.removeCartItem(item.id).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(i => i.id !== item.id);
        this.productStockService.notifyStockChanged();
      },
      error: () => {
        window.alert('Failed to remove item.');
      },
    });
  }

  onInputChange(event: Event, item: CartItem) {
    const input = event.target as HTMLInputElement;
    const value = input.valueAsNumber;
    if (!isNaN(value)) {
      this.updateQuantity(item, value);
    }
  }
}
