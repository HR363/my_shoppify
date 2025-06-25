import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';
import { User } from '../../auth/interfaces/user.interface';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  user$: Observable<User | null>;

  categories = [
    { label: 'All', value: '' },
    { label: 'Clothes', value: 'clothes' },
    { label: 'Fragrances', value: 'fragrances' },
    { label: 'Shoes', value: 'shoes' }
  ];
  selectedCategory = '';

  constructor(private authService: AuthService, private router: Router) {
    this.user$ = this.authService.user$;
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    // TODO: Emit event or use shared service for filtering
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
