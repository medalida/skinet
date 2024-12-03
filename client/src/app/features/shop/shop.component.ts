import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../shared/modules/product';
import { MatCard } from '@angular/material/card';
import { ProductItemComponent } from '../product-item/product-item.component';
import { MatDialog } from '@angular/material/dialog';
import { FilterDialogComponent } from './filter-dialog/filter-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { ShopParams } from '../../shared/modules/shopParams';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Pagination } from '../../shared/modules/pagination';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [ProductItemComponent, MatButtonModule, MatIconModule, MatSelectionList, MatListOption, MatMenuTrigger, MatMenu, FormsModule, MatPaginator, EmptyStateComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
  title = 'Skine';
  shopService = inject(ShopService);
  dialogService = inject(MatDialog);
  products?: Pagination<Product>;
  shopParams = new ShopParams();
  sortOptions: any = [
    { name: "Alphabatical", value: "Name" },
    { name: "price: Low-High", value: "PriceAsc" },
    { name: "price: High-Low", value: "PriceDesc" }
  ];

  ngOnInit(): void {
    this.intializeShop();
  }

  resetFilters(): void {
    this.shopParams = new ShopParams();
    this.setProducts(this.shopParams);
  }

  intializeShop(): void {
    this.setProducts(new ShopParams());
    this.shopService.getBrands();
    this.shopService.getTypes();
  }

  setProducts(shopParams: ShopParams): void {
    this.shopService.getProducts(shopParams).subscribe({
      next: (response) => {this.products = response; console.log(response);},
      error: (error) => console.error(error)
    });
  }

  openFiltersDialog() {
    const dialogRef = this.dialogService.open(FilterDialogComponent, {
      minHeight: "500pz",
      data: {
        selectedBrands: this.shopParams.brands,
        selectedTypes: this.shopParams.types
      }
    });

    dialogRef.afterClosed().subscribe({
      next: result => {
        if (result) {
          this.shopParams.brands = result.selectedBrands;
          this.shopParams.types = result.selectedTypes;
          this.shopParams.pageIndex = 1;
          this.setProducts(this.shopParams);
        }
      }
    });
  }

  onSortChange(event: MatSelectionListChange) {
    this.shopParams.sort = event.options[0].value ?? "name";
    this.shopParams.pageIndex = 1;
    console.log(this.shopParams);
    this.setProducts(this.shopParams);
  }

  handlePageEvent(event: PageEvent): void {
    this.shopParams.pageIndex = event.pageIndex + 1;
    this.shopParams.pageSize = event.pageSize;
    this.setProducts(this.shopParams);
  }


  onSearch(): void {
    this.setProducts(this.shopParams);
  }
}
