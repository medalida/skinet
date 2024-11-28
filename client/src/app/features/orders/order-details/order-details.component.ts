import { Component, inject } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../shared/modules/order';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { AddressPipe } from '../../../shared/pipes/address.pipe';
import { CurrencyEurPipe } from '../../../shared/pipes/currency-eur.pipe';
import { DatePipe } from '@angular/common';
import { PaymentPipe } from '../../../shared/pipes/payment.pipe';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [MatCardModule, AddressPipe, CurrencyEurPipe, DatePipe, PaymentPipe],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent {
buttonText: string = "Return to Orders";
onReturnClick() {
  console.log('Return to orders');
}
  orderService = inject(OrderService);
  private activatedRoute = inject(ActivatedRoute);
  order?: Order;

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) return;
    this.orderService.getOrderDetailed(+id).subscribe({ 
      next: (order) => this.order = order,
      error: (error) => console.error(error)
    });
  }
}
