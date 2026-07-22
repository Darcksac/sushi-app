import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

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
          Swal.fire({
            icon: 'error',
            title: 'Error al subir imagen',
            text: err.error?.message || err.message,
            confirmButtonColor: '#ef4444'
          });
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
          Swal.fire({
            icon: 'success',
            title: '¡Actualizado!',
            text: 'El platillo se ha actualizado correctamente.',
            showConfirmButton: false,
            timer: 1500
          });
          this.loadDishes();
          this.closeModal();
        },
        error: (err) => {
          Swal.fire({ icon: 'error', title: 'Error', text: err.message, confirmButtonColor: '#ef4444' });
        }
      });
    } else {
      this.apiService.createDish(this.currentDish, token).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: '¡Creado!',
            text: 'El platillo se ha creado correctamente.',
            showConfirmButton: false,
            timer: 1500
          });
          this.loadDishes();
          this.closeModal();
        },
        error: (err) => {
          Swal.fire({ icon: 'error', title: 'Error', text: err.message, confirmButtonColor: '#ef4444' });
        }
      });
    }
  }

  deleteDish(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto, el platillo se eliminará permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const token = this.authService.getToken();
        if (!token) return;

        this.apiService.deleteDish(id, token).subscribe({
          next: () => {
            Swal.fire({
              title: '¡Eliminado!',
              text: 'El platillo ha sido eliminado.',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500
            });
            this.loadDishes();
          },
          error: (err) => {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message, confirmButtonColor: '#ef4444' });
          }
        });
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
