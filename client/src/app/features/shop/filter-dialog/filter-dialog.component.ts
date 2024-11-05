import { Component, inject } from '@angular/core';
import { ShopService } from '../../../core/services/shop.service';
import {MatDivider} from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-dialog',
  standalone: true,
  imports: [MatDivider, MatListModule, MatButtonModule, FormsModule],
  templateUrl: './filter-dialog.component.html',
  styleUrl: './filter-dialog.component.scss'
})


export class FilterDialogComponent {
  shopService = inject(ShopService);
  private dialogRef = inject(MatDialogRef<FilterDialogComponent>);
  data = inject(MAT_DIALOG_DATA);

  selectedBrands: string[] = this.data.selectedBrands;
  selectedTypes: string[] = this.data.selectedTypes;

  applyFilters() {
    this.dialogRef.close({
      selectedBrands: this.selectedBrands,
      selectedTypes: this.selectedTypes
    });
  }
}
