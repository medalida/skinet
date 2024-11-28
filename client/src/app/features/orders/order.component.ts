import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../shared/modules/order';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CurrencyEurPipe } from "../../shared/pipes/currency-eur.pipe";

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [RouterLink, DatePipe, CurrencyEurPipe],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {
  orderService = inject(OrderService);
  orders: Order[] = [];

  ngOnInit(): void {
    this.orderService.getOrderForUser().subscribe({ 
      next: (orders) => this.orders = orders,
      error: (error) => console.error(error)
    });
  }
}
