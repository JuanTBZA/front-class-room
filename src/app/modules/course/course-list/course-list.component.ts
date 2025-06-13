import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService, Course } from 'src/app/core/services/course.service';



@Component({
  standalone: true,
  selector: 'app-course-list',
  imports: [CommonModule],
  templateUrl: './course-list.component.html'
})
export class CourseListComponent {
  private courseService = inject(CourseService);
  courses: Course[] = [];

  constructor() {
    this.courseService.getAllCourses().subscribe({
      next: (data: Course[]) => this.courses = data,
      error: (err: unknown) => console.error('Error al obtener cursos', err)
    });
  }
}
