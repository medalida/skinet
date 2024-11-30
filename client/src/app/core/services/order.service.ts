import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Order, OrderToCrete } from '../../shared/modules/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  baseUrl = environment.baseUrl;
  private http: HttpClient = inject(HttpClient);

  createOrder(orderToCreate: OrderToCrete) {
    return this.http.post<Order>(this.baseUrl + 'orders', orderToCreate);
  }

  getOrderForUser() {
    return this.http.get<Order[]>(this.baseUrl + 'orders');
  }

  getOrderDetailed(orderId: number) {
    return this.http.get<Order>(this.baseUrl + 'orders/' + orderId);
  }
  
}
