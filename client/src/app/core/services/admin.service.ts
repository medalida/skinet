import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { OrderParams } from '../../shared/modules/orderParams';
import { Pagination } from '../../shared/modules/pagination';
import { Order } from '../../shared/modules/order';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.baseUrl;
  private http: HttpClient = inject(HttpClient);
  
  getOrders(orderParams: OrderParams) {
    let params: HttpParams = new HttpParams();
    if (orderParams.status && orderParams.status !== 'All') {
      params = params.append('status', orderParams.status);
    }
    params = params.append('pageIndex', orderParams.pageIndex);
    params = params.append('pageSize', orderParams.pageSize);
    return this.http.get<Pagination<Order>>(this.baseUrl + 'admin/orders', {params});
  }

  getOrder(id: number) {
    return this.http.get<Order>(this.baseUrl + 'admin/orders/'+id);
  }

  refundOrder(id: number) {
    return this.http.get<Order>(this.baseUrl + 'admin/orders/refund/'+id, {});
  }
}
