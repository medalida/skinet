import { Component, inject } from '@angular/core';
import { ShopService } from '../../../core/services/shop.service';
import { ActivatedRoute } from '@angular/router';
import { _isNumberValue } from '@angular/cdk/coercion';
import { Product } from '../../../shared/modules/product';
import { CurrencyPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatDivider } from '@angular/material/divider';
import {MatInputModule} from '@angular/material/input';
import { CartService } from '../../../core/services/cart.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CurrencyPipe, MatButton, MatIcon, MatFormField, MatInputModule, MatDivider, MatLabel, FormsModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {

  private shopService = inject(ShopService);
  private cartService = inject(CartService);
  private activatedRoute = inject(ActivatedRoute);
  product?: Product;
  quantityInCart = 0;
  quantity = 1;

  ngOnInit() {
    this.loadProduct();
  }

  loadProduct() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id && !_isNumberValue(id)) return;
    this.shopService.getProduct(Number(id)).subscribe({
      next: (product) => {
        this.product = product;
        this.updateQuantityInCart();
      },
      error: (error) => console.error(error)
    });
  }

  updateCart() {
    if (!this.product) return;
    if (this.quantity > this.quantityInCart) {
      const itemsToAdd = this.quantity - this.quantityInCart;
      this.quantityInCart += itemsToAdd;
      this.cartService.addItemToCart(this.product, itemsToAdd);
    } else {
      const itemsToRemove = this.quantityInCart - this.quantity;
      this.quantityInCart -= itemsToRemove;
      this.cartService.removeItemFromCart(this.product.id, itemsToRemove);
    }
  }

  updateQuantityInCart() {
    this.quantityInCart = this.cartService.cart()?.items.find(i => i.productId === this.product?.id)?.quantity ?? 0;
    this.quantity = this.quantityInCart || 1;
  }

  getButtonText() {
    return this.quantityInCart ? "Update cart" : "Add to cart"
  }
}
