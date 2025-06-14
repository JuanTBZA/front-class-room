import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-user-create',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-create.component.html',
})
export class UserCreateComponent {
  private http = inject(HttpClient);

  @Input() visible = false;
  @Output() closed = new EventEmitter<void>();

  role: 'STUDENT' | 'TEACHER' = 'STUDENT';

  // Comunes
  name = '';
  lastName = '';
  email = '';
  dni = '';
  phone = '';

  // Estudiante
  universityHeadquarters = '';
  intendedMajor = '';

  // Profesor
  contractDateStart = '';
  contractDateEnd = '';
  specialization = '';

  close() {
    this.closed.emit();
    this.resetForm();
  }

  submit() {
    const userRequestDto: any = {
      name: this.name,
      email: this.email,
      dni: this.dni,
    };

    if (this.role === 'STUDENT') {
      userRequestDto.lastName = this.lastName;
      userRequestDto.phone = this.phone;

      const body = {
        userRequestDto,
        universityHeadquarters: this.universityHeadquarters,
        intendedMajor: this.intendedMajor,
      };

      this.http.post('/api/students', body).subscribe(() => {
        this.closed.emit();
        this.resetForm();
      });
    } else {
      const body = {
        userRequestDto,
        contractDateStart: this.contractDateStart,
        contractDateEnd: this.contractDateEnd,
        specialization: this.specialization,
      };

      this.http.post('/api/teachers', body).subscribe(() => {
        this.closed.emit();
        this.resetForm();
      });
    }
  }

  resetForm() {
    this.name = '';
    this.lastName = '';
    this.email = '';
    this.dni = '';
    this.phone = '';
    this.universityHeadquarters = '';
    this.intendedMajor = '';
    this.contractDateStart = '';
    this.contractDateEnd = '';
    this.specialization = '';
    this.role = 'STUDENT';
  }
}
