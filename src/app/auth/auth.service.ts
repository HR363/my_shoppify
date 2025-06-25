import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from './interfaces/user.interface';
import { AuthResponse } from './interfaces/token.interface';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { RequestResetDto } from '../dto/request-reset.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  private userSubject = new BehaviorSubject<User | null>(this.getUserFromToken());
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  register(dto: RegisterDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, dto);
  }

  login(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, dto).pipe(
      tap(response => this.handleAuthentication(response))
    );
  }

  requestPasswordReset(dto: RequestResetDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/request-reset`, dto);
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    this.userSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private handleAuthentication(response: AuthResponse): void {
    localStorage.setItem('accessToken', response.accessToken);
    this.userSubject.next(response.user);
    if (response.user.role === 'ADMIN') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/shop']);
    }
  }

  private getUserFromToken(): User | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user; 
    } catch (e) {
      return null;
    }
  }

  isAdmin(): boolean {
    return this.userSubject.value?.role === 'ADMIN';
  }
} 