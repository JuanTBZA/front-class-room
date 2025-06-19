import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from 'src/app/core/services/user.service';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { UserCreateComponent } from 'src/app/modules/users/user-create/user-create.component';
import { TeacherEditComponent } from 'src/app/modules/teacher/teacher-edit/teacher-edit.component';
import { StudentEditComponent } from 'src/app/modules/student/student-edit/student-edit.component';
import { StudentService } from 'src/app/core/services/student.service';
import { TeacherService } from 'src/app/core/services/teacher.service';


@Component({
  standalone: true,
  selector: 'app-user-list',
  imports: [
    CommonModule,
    FormsModule,
    LayoutComponent,
    UserCreateComponent,
    TeacherEditComponent,
    StudentEditComponent 
  ],
  templateUrl: './user-list.component.html',
})
export class UserListComponent {
  private userService = inject(UserService);

  users: User[] = [];
  filtro = '';
  page = 0; // base cero
  size = 5;
  totalElements = 0;

  toastVisible = false;

  orderBy: 'dni' | 'name' = 'dni';
  orderDir: 'asc' | 'desc' = 'desc';

  // Crear usuario
  modalVisible = false;

  // Editar profesor
  modalEditarVisible = false;
  teacherIdEditar?: number;

  modalEditarEstudianteVisible = false;
studentUserIdEditar?: number;

private studentService = inject(StudentService);
private teacherService = inject(TeacherService);


abrirEditarEstudiante(userId: number) {
  this.studentUserIdEditar = userId;
  this.modalEditarEstudianteVisible = true;
}

cerrarEditarEstudianteModal(guardado: boolean) {
  this.modalEditarEstudianteVisible = false;
  if (guardado) {
    this.fetchUsers();
  }
}


  ngOnInit() {
    this.fetchUsers();
  }

fetchUsers() {
  this.userService
    .getUsers(this.filtro, this.page, this.size, this.orderBy, this.orderDir)
    .subscribe({
      next: (res) => {
        if (!res || !res.content || res.content.length === 0) {
          // Si la página actual está vacía y no es la primera, retroceder
          if (this.page > 0) {
            this.page--;
            this.fetchUsers(); // volver a intentar
          } else {
            this.users = [];
            this.totalElements = 0;
          }
        } else {
          this.users = res.content;
          this.totalElements = res.totalElements;
        }
      },
      error: (err) => {
        if (err.status === 204) {
          this.users = [];
          this.totalElements = 0;
          if (this.page > 0) {
            this.page--;
            this.fetchUsers();
          }
        } else {
          console.error('Error al cargar usuarios', err);
        }
      },
    });
}


  onSearch(event: Event) {
    event.preventDefault();
    this.page = 0;
    this.fetchUsers();
  }

  cambiarPagina(offset: number) {
    const nuevaPagina = this.page + offset;
    const ultimaPagina = Math.ceil(this.totalElements / this.size) - 1;
    if (nuevaPagina >= 0 && nuevaPagina <= ultimaPagina) {
      this.page = nuevaPagina;
      this.fetchUsers();
    }
  }

  getRolNombre(role: string): string {
    switch (role) {
      case 'ROLE_STUDENT': return 'Estudiante';
      case 'ROLE_TEACHER': return 'Profesor';
      case 'ROLE_ADMIN': return 'Administrador';
      default: return role;
    }
  }

  hasNextPage(): boolean {
    return (this.page + 1) * this.size < this.totalElements;
  }

  abrirModal() {
    this.modalVisible = false;
    setTimeout(() => this.modalVisible = true, 0);
  }

  onModalClose(usuarioCreado: boolean) {
    this.modalVisible = false;

    if (usuarioCreado) {
      this.toastVisible = true;
      this.fetchUsers();

      setTimeout(() => {
        this.toastVisible = false;
      }, 3000);
    }
  }

  abrirEditar(id: number) {
    this.teacherIdEditar = id;
    this.modalEditarVisible = true;
  }

  cerrarEditarModal(guardado: boolean) {
    this.modalEditarVisible = false;
    if (guardado) {
      this.fetchUsers();
    }
  }

  eliminarUsuario(user: User) {
    
  if (user.role === 'ROLE_STUDENT') {
    this.studentService.deleteStudent(user.id).subscribe(() => {
      this.fetchUsers();
    });
  } else if (user.role === 'ROLE_TEACHER') {
    this.teacherService.deleteTeacher(user.id).subscribe(() => {
      this.fetchUsers();
    });
  } else {
    console.warn('Este tipo de usuario no se puede eliminar');
  }
}

}
