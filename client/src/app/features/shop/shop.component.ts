import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../shared/modules/product';
import { MatCard } from '@angular/material/card';
import { ProductItemComponent } from '../product-item/product-item.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [MatCard, ProductItemComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
  title = 'Skine';
  shopService = inject(ShopService);
  products: Product[] = [];

  ngOnInit(): void {
    this.intializeShop();
  }

  intializeShop(): void {
    this.shopService.getProducts();
    this.shopService.getBrands();
    this.shopService.getProducts().subscribe({
      next: (response) => this.products = response.data,
      error: (error) => console.error(error)
    });
  }

}
