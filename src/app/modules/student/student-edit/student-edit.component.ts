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
import { StudentService } from 'src/app/core/services/student.service';

@Component({
  standalone: true,
  selector: 'app-student-edit',
  imports: [CommonModule, FormsModule],
  templateUrl: './student-edit.component.html'
})
export class StudentEditComponent implements OnChanges {
  private studentService = inject(StudentService);

  @Input() visible = false;
  @Input() userId?: number;
  @Output() closed = new EventEmitter<boolean>();

  studentId?: number;

  name = '';
  email = '';
  dni = '';
  enabled = true;
  universityHeadquarters = '';
  intendedMajor = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (this.visible && this.userId) {
      this.loadStudent(this.userId);
    }
  }

  loadStudent(userId: number) {
    this.studentService.getStudentByUserId(userId).subscribe(student => {
      this.studentId = student.id;

      const user = student.userRequestDto || student.userResponseDto || {};
      this.name = user.name;
      this.email = user.email;
      this.dni = user.dni;
      this.enabled = user.enabled ?? true;
      this.universityHeadquarters = student.universityHeadquarters;
      this.intendedMajor = student.intendedMajor;
    });
  }

  close() {
    this.closed.emit(false);
    this.resetForm();
  }

  submit() {
    if (!this.studentId) return;

    const body = {
      userRequestDto: {
        name: this.name,
        email: this.email,
        dni: this.dni,
        enabled: this.enabled
      },
      universityHeadquarters: this.universityHeadquarters,
      intendedMajor: this.intendedMajor
    };

    this.studentService.updateStudent(this.studentId, body).subscribe(() => {
      this.closed.emit(true);
      this.resetForm();
    });
  }

  resetForm() {
    this.name = '';
    this.email = '';
    this.dni = '';
    this.enabled = true;
    this.universityHeadquarters = '';
    this.intendedMajor = '';
  }
}
