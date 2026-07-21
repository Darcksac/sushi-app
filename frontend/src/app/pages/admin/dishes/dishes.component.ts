import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dishes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dishes.component.html',
  styleUrl: './dishes.component.scss'
})
export class DishesComponent implements OnInit {
  apiService = inject(ApiService);
  authService = inject(AuthService);
  router = inject(Router);

  dishes: any[] = [];
  categories = ['Bebidas', 'Platillos', 'Sushis', 'Postres'];
  
  showModal = false;
  isEditing = false;
  isUploading = false;
  currentDish: any = {
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: 'Sushis',
    isAvailable: true
  };

  ngOnInit() {
    this.loadDishes();
  }

  loadDishes() {
    const token = this.authService.getToken();
    if (!token) return;
    
    this.apiService.getAdminDishes(token).subscribe({
      next: (data) => this.dishes = data,
      error: (err) => {
        console.error(err);
        if (err.status === 401 || err.status === 403) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const token = this.authService.getToken();
      if (!token) return;
      
      this.isUploading = true;
      this.apiService.uploadImage(file, token).subscribe({
        next: (res) => {
          this.currentDish.imageUrl = res.imageUrl;
          this.isUploading = false;
        },
        error: (err) => {
          console.error(err);
          alert('Error al subir imagen: ' + (err.error?.message || err.message));
          this.isUploading = false;
        }
      });
    }
  }

  openCreateModal() {
    this.isEditing = false;
    this.currentDish = {
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      category: 'Sushis',
      isAvailable: true
    };
    this.showModal = true;
  }

  openEditModal(dish: any) {
    this.isEditing = true;
    this.currentDish = { ...dish };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveDish() {
    const token = this.authService.getToken();
    if (!token) return;

    if (this.isEditing) {
      this.apiService.updateDish(this.currentDish.id, this.currentDish, token).subscribe({
        next: () => {
          this.loadDishes();
          this.closeModal();
        },
        error: (err) => alert('Error: ' + err.message)
      });
    } else {
      this.apiService.createDish(this.currentDish, token).subscribe({
        next: () => {
          this.loadDishes();
          this.closeModal();
        },
        error: (err) => alert('Error: ' + err.message)
      });
    }
  }

  deleteDish(id: number) {
    if (!confirm('¿Estás seguro de que quieres eliminar este platillo permanentemente?')) return;
    
    const token = this.authService.getToken();
    if (!token) return;

    this.apiService.deleteDish(id, token).subscribe({
      next: () => this.loadDishes(),
      error: (err) => alert('Error: ' + err.message)
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
