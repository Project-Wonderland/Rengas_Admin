import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: '[app-login-page]',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  @Input() logo!: string;
  @Input() role: string = 'Admin';
  @Output() roleChange = new EventEmitter<string>();
  @Output() loginSuccess = new EventEmitter<string>();

  username = '';
  password = '';
  error = '';

  setRole(newRole: string) {
    this.role = newRole;
    this.roleChange.emit(this.role);
  }

  login() {
    this.error = '';
    if (this.role === 'Admin' && this.username.trim() === 'admin' && this.password === 'admin123') {
      this.loginSuccess.emit('Admin');
      return;
    }
    if (this.role === 'Order Management Admin' && this.username.trim() === 'order' && this.password === 'order123') {
      this.loginSuccess.emit('Order Management Admin');
      return;
    }
    this.error = 'Invalid username or password';
  }
}
