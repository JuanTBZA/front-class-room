import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export interface Course {
  id: number;
  name: string;
  description: string;
}

export interface CourseResponse {
  content: Course[];
  totalElements: number;
  page: number;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class CourseService {
  private api = `${environment.apiUrl}/courses`;

  constructor(private http: HttpClient) {}

  getCourses(filtro: string, page: number, size: number, orderBy: string, orderDir: string) {
    const params = new URLSearchParams({
      filtro,
      page: String(page),
      size: String(size),
      orderBy,
      orderDir
    });
    return this.http.get<CourseResponse>(`${this.api}/paginated?${params.toString()}`);
  }
}
