import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  dni: string;
  role: string;
  enabled: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  page: number;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/users';

  getUsers(
    filtro: string = '',
    page: number = 0,
    size: number = 5,
    orderBy: 'dni' | 'name' = 'dni',
    orderDir: 'asc' | 'desc' = 'desc'
  ): Observable<PaginatedResponse<User>> {
    const params = new URLSearchParams({
      filtro,
      page: page.toString(),
      size: size.toString(),
      orderBy,
      orderDir
    });

    return this.http.get<PaginatedResponse<User>>(`${this.apiUrl}/paginated?${params.toString()}`);
  }
}
