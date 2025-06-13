import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:8080/auth/login'; // Ajusta según tu backend

  login(credentials: { email: string; password: string }) {
    return this.http.post<{ access_token: string }>(this.apiUrl, credentials).pipe(
      tap(res => {
        localStorage.setItem('accessToken', res.access_token);
        this.router.navigate(['/']);
      })
    );
  }
}
