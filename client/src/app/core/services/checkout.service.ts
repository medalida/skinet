import { inject, Injectable } from '@angular/core';
import { DeliveryMethod } from '../../shared/modules/deliveryMethod';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  baseUrl = environment.baseUrl;
  private http = inject(HttpClient);
  deliveryMethods: DeliveryMethod[] = [];
  

  getDelivryMethods() {
    if (this.deliveryMethods.length > 0) return of(this.deliveryMethods);
    return this.http.get<DeliveryMethod[]>(`${this.baseUrl}payments/delivery-methods`).pipe(
      map((dm: DeliveryMethod[]) => {
        return this.deliveryMethods = dm.sort((a, b) => b.price - a.price);
      })
    );
  }
}
