import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeacherService } from 'src/app/core/services/teacher.service';

@Component({
  standalone: true,
  selector: 'app-teacher-edit',
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-edit.component.html',
})
export class TeacherEditComponent implements OnChanges {
  private teacherService = inject(TeacherService);

  @Input() visible = false;
  @Input() teacherId?: number;
  @Output() closed = new EventEmitter<boolean>();

  // Campos del formulario
  name = '';
  email = '';
  dni = '';
  enabled = true;
  specialization = '';
  contractDateStart = '';
  contractDateEnd = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (this.visible && this.teacherId) {
      this.loadTeacher(this.teacherId);
    }
  }

loadTeacher(userId: number) {
  this.teacherService.getTeacherByUserId(userId).subscribe(teacher => {
    this.teacherId = teacher.id; 

    const user = teacher.userResponseDto || {};
    this.name = user.name;
    this.email = user.email;
    this.dni = user.dni;
    this.enabled = user.enabled ?? true;
    this.specialization = teacher.specialization;
    this.contractDateStart = teacher.contractDateStart;
    this.contractDateEnd = teacher.contractDateEnd;
  });
}



  close() {
    this.closed.emit(false);
    this.resetForm();
  }

  submit() {
    if (!this.teacherId) return;

    const body = {
      userRequestDto: {
        name: this.name,
        email: this.email,
        dni: this.dni,
        enabled: this.enabled
      },
      contractDateStart: this.contractDateStart,
      contractDateEnd: this.contractDateEnd,
      specialization: this.specialization
    };

    this.teacherService.updateTeacher(this.teacherId, body).subscribe(() => {
      this.closed.emit(true);
      this.resetForm();
    });
  }

  resetForm() {
    this.name = '';
    this.email = '';
    this.dni = '';
    this.enabled = true;
    this.specialization = '';
    this.contractDateStart = '';
    this.contractDateEnd = '';
  }
}
