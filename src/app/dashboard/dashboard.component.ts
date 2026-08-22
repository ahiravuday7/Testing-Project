import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private readonly authService = inject(AuthService);
  protected readonly user = this.authService.currentUser;

  protected logout(): void {
    this.authService.logout();
  }
}
