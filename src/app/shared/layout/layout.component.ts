import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [CommonModule, SidebarComponent],
  templateUrl: './layout.component.html'
})
export class LayoutComponent {}
