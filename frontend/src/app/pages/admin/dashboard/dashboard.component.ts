import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  apiService = inject(ApiService);
  authService = inject(AuthService);
  router = inject(Router);

  orders: any[] = [];
  stats = {
    totalSales: 0,
    activeOrders: 0
  };

  ngOnInit() {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/login']);
      return;
    }
    this.fetchOrders();
  }

  fetchOrders() {
    const token = this.authService.getToken();
    this.apiService.getAdminOrders(token!).subscribe({
      next: (data) => {
        this.orders = data;
        this.calculateStats();
      },
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          this.authService.logout();
        }
      }
    });
  }

  calculateStats() {
    this.stats.totalSales = this.orders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + o.totalAmount, 0);
      
    this.stats.activeOrders = this.orders
      .filter(o => o.status !== 'completed').length;
  }

  updateStatus(orderId: number, status: string) {
    const token = this.authService.getToken();
    this.apiService.updateOrderStatus(orderId, status, token!).subscribe({
      next: () => {
        this.fetchOrders(); // Refresh
      },
      error: (err) => console.error(err)
    });
  }

  logout() {
    this.authService.logout();
  }

  getStatusBadgeClass(status: string) {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'delivering': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
