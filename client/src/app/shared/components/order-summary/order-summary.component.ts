import { Component, inject, NgModule } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, MatIconModule, CurrencyPipe, RouterLink, MatInput, MatLabel, MatButtonModule],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss'
})
export class OrderSummaryComponent {
  cartService = inject(CartService);
  location = inject(Location);
}
