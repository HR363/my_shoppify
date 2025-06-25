import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductStockService {
  private stockChangedSource = new Subject<void>();
  stockChanged$ = this.stockChangedSource.asObservable();

  notifyStockChanged() {
    this.stockChangedSource.next();
  }
} 