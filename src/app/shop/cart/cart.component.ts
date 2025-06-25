import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart.interface';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  isLoading = true;
  total = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.cartService.getCart().subscribe(cart => {
      this.cart = cart;
      this.calculateTotal();
      this.isLoading = false;
    });
  }

  calculateTotal(): void {
    if (this.cart) {
      this.total = this.cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    }
  }

  updateQuantity(itemId: string, event: Event): void {
    const quantity = parseInt((event.target as HTMLInputElement).value, 10);
    if (quantity > 0) {
      this.cartService.updateCartItem(itemId, quantity).subscribe(() => this.loadCart());
    }
  }

  removeItem(itemId: string): void {
    this.cartService.removeCartItem(itemId).subscribe(() => this.loadCart());
  }
} 