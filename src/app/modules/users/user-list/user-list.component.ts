import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from 'src/app/core/services/user.service';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { UserCreateComponent } from 'src/app/modules/users/user-create/user-create.component';
import { TeacherEditComponent } from 'src/app/modules/teacher/teacher-edit/teacher-edit.component';

@Component({
  standalone: true,
  selector: 'app-user-list',
  imports: [
    CommonModule,
    FormsModule,
    LayoutComponent,
    UserCreateComponent,
    TeacherEditComponent
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

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.userService
      .getUsers(this.filtro, this.page, this.size, this.orderBy, this.orderDir)
      .subscribe({
        next: (res) => {
          this.users = res.content;
          this.totalElements = res.totalElements;
        },
        error: (err) => console.error('Error al cargar usuarios', err),
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
}
