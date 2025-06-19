import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class TeacherService {
  private api = `${environment.apiUrl}/teachers`;

  constructor(private http: HttpClient) {}

getTeacherByUserId(userId: number) {
  return this.http.get<any>(`${this.api}/by-user/${userId}`);
}
  updateTeacher(id: number, data: any) {
    return this.http.put(`${this.api}/${id}`, data);
  }
}
