import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Enlace oficial del backend alojado en Render.
  private productionUrl = 'https://sushi-app-s1qp.onrender.com/api';
  private localUrl = 'http://localhost:3000/api';
  
  private get apiUrl(): string {
    return window.location.hostname === 'localhost' ? this.localUrl : this.productionUrl;
  }

  constructor(private http: HttpClient) { }

  getDishes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dishes`);
  }

  getPromotions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/promotions`);
  }

  createOrder(orderData: any, token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders`, orderData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getMyOrders(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getAdminOrders(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  updateOrderStatus(orderId: number, status: string, token: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/orders/${orderId}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Admin Dish Management
  getAdminDishes(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/dishes/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  createDish(dishData: any, token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/dishes`, dishData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  updateDish(id: number, dishData: any, token: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/dishes/${id}`, dishData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  deleteDish(id: number, token: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/dishes/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  uploadImage(file: File, token: string): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post(`${this.apiUrl}/upload`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
