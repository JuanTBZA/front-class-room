import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService, Course } from 'src/app/core/services/course.service';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';

@Component({
  standalone: true,
  selector: 'app-course-list',
  imports: [CommonModule, FormsModule, LayoutComponent],
  templateUrl: './course-list.component.html',
})
export class CourseListComponent {
  private courseService = inject(CourseService);

  courses: Course[] = [];
  filtro = '';
  page = 0;
  size = 10;
  totalElements = 0;

  orderBy: 'name' = 'name';
  orderDir: 'asc' | 'desc' = 'asc';

  ngOnInit() {
    this.fetchCourses();
  }

  fetchCourses() {
    this.courseService.getCourses(this.filtro, this.page, this.size, this.orderBy, this.orderDir)
      .subscribe({
        next: (res) => {
          this.courses = res.content;
          this.totalElements = res.totalElements;
        },
        error: (err) => {
          if (err.status === 204) {
            this.courses = [];
            this.totalElements = 0;
            if (this.page > 0) {
              this.page--;
              this.fetchCourses();
            }
          } else {
            console.error('Error al cargar cursos', err);
          }
        }
      });
  }

  onSearch(event: Event) {
    event.preventDefault();
    this.page = 0;
    this.fetchCourses();
  }

  cambiarPagina(offset: number) {
    const nuevaPagina = this.page + offset;
    const ultimaPagina = Math.ceil(this.totalElements / this.size) - 1;
    if (nuevaPagina >= 0 && nuevaPagina <= ultimaPagina) {
      this.page = nuevaPagina;
      this.fetchCourses();
    }
  }

  hasNextPage(): boolean {
    return (this.page + 1) * this.size < this.totalElements;
  }
}
