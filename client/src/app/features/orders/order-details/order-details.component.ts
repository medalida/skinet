import { Component, inject } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../shared/modules/order';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { AddressPipe } from '../../../shared/pipes/address.pipe';
import { CurrencyEurPipe } from '../../../shared/pipes/currency-eur.pipe';
import { DatePipe } from '@angular/common';
import { PaymentPipe } from '../../../shared/pipes/payment.pipe';
import { AccountService } from '../../../core/services/account.service';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [MatCardModule, AddressPipe, CurrencyEurPipe, DatePipe, PaymentPipe],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent {
  private accountService = inject(AccountService);
  private adminService = inject(AdminService);
  orderService = inject(OrderService);
  private activatedRoute = inject(ActivatedRoute);
  order?: Order;
  buttonText: string = "Return to Orders";

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) return;
    let callbacks = { 
      next: (order: Order) => this.order = order,
      error: (error: any) => console.error(error)
    }
    if (this.accountService.isAdmin()) {
      this.adminService.getOrder(+id).subscribe(callbacks);
    } else {
      this.orderService.getOrderDetailed(+id).subscribe(callbacks);
    }
  }

  onReturnClick() {
    console.log('Return to orders');
  }
  
}
