import { Component, inject } from '@angular/core';
import { ShopService } from '../../../core/services/shop.service';
import { ActivatedRoute } from '@angular/router';
import { _isNumberValue } from '@angular/cdk/coercion';
import { Product } from '../../../shared/modules/product';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {
  private shopService = inject(ShopService);
  private activatedRoute = inject(ActivatedRoute);
  product?: Product;

  ngOnInit() {
    this.loadProduct();
  }

  loadProduct() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id && !_isNumberValue(id)) return;
    this.shopService.getProduct(Number(id)).subscribe({
      next: (product) => this.product = product,
      error: (error) => console.error(error)
    });
  }
}
