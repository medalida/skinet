import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../shared/modules/product';
import { MatCard } from '@angular/material/card';
import { ProductItemComponent } from '../product-item/product-item.component';
import { MatDialog } from '@angular/material/dialog';
import { FilterDialogComponent } from './filter-dialog/filter-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [MatCard, ProductItemComponent, MatButtonModule, MatIconModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
  title = 'Skine';
  shopService = inject(ShopService);
  dialogService = inject(MatDialog);

  products: Product[] = [];
  selectedBrands: string[] = [];
  selectedTypes: string[] = [];

  ngOnInit(): void {
    this.intializeShop();
  }

  intializeShop(): void {
    this.setProducts();
    this.shopService.getBrands();
    this.shopService.getTypes();
  }

  setProducts(brands? : string[], types? : string[]): void {
    this.shopService.getProducts(brands, types).subscribe({
      next: (response) => this.products = response.data,
      error: (error) => console.error(error)
    });
  }

  openFiltersDialog() {
    const dialogRef = this.dialogService.open(FilterDialogComponent, {
      minHeight: "500pz",
      data: {
        selectedBrands: this.selectedBrands,
        selectedTypes: this.selectedTypes
      }
    });
    dialogRef.afterClosed().subscribe({
      next: result => {
        if (result) {
          this.selectedBrands = result.selectedBrands;
          this.selectedTypes = result.selectedTypes;
          this.setProducts(this.selectedBrands, this.selectedTypes);
        }
      }
    });
  }

}
