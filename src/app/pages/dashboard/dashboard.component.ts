import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { LayoutComponent } from 'src/app/shared/layout/layout.component'; // ✅ importante

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, LayoutComponent], // ✅ aquí se importa
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  private http = inject(HttpClient);

  activeStudents = 0;
  teacherCount = 0;
  enrollmentsToday = 0;

ngOnInit() {
  this.http.get<{ activeStudentCount: number }>('http://localhost:8080/api/students/active-count')
    .subscribe(res => this.activeStudents = res.activeStudentCount);

  this.http.get<{ teacherCount: number }>('http://localhost:8080/api/teachers/count')
    .subscribe(res => this.teacherCount = res.teacherCount);

  this.http.get<{ enrollmentsToday: number }>('http://localhost:8080/api/enrollments/today-count')
    .subscribe(res => this.enrollmentsToday = res.enrollmentsToday);
}


}
