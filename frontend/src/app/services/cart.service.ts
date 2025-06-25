import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private http: HttpClient) { }

  addToCart(productId: string, quantity: number = 1): Observable<any> {
    return this.http.post('http://localhost:3000/cart', { productId, quantity });
  }

  getCart(): Observable<any> {
    return this.http.get('http://localhost:3000/cart');
  }

  updateCartItem(itemId: string, quantity: number): Observable<any> {
    return this.http.patch(`http://localhost:3000/cart/${itemId}`, { quantity });
  }

  removeCartItem(itemId: string): Observable<any> {
    return this.http.delete(`http://localhost:3000/cart/${itemId}`);
  }
}
