import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { OrderParams } from '../../../shared/modules/orderParams';
import { Order } from '../../../shared/modules/order';
import { AdminService } from '../../../core/services/admin.service';
import { DatePipe } from '@angular/common';
import { CurrencyEurPipe } from '../../../shared/pipes/currency-eur.pipe';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';
import { MatButton } from '@angular/material/button';
import { DialogService } from '../../../core/services/dialog.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [MatFormField, MatLabel, MatPaginator, MatSelectModule, MatTableModule, DatePipe, CurrencyEurPipe, MatIcon, RouterLink, MatTooltip, MatTabsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  private AdminService = inject(AdminService);
  private dialogService = inject(DialogService);
  orderParams: OrderParams = new OrderParams();
  displayedColumns: string[] = ['id', 'buyerEmail', 'status', 'action'];
  statusOptions = ["All", "Pending", "PaymentReceived", "PaymentFailed", "PaymentMismatch", "Refunded"]
  dataSource = new MatTableDataSource<Order>([]);
  totalItems: number = 0;

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.AdminService.getOrders(this.orderParams).subscribe({
      next: (response) => {
        this.dataSource.data = response.data;
        this.totalItems = response.count;
      },
      error: (error) => console.error(error)
    });
  }

  onPageChange(event: any) {
    this.orderParams.pageIndex = event.pageIndex + 1;
    this.orderParams.pageSize = event.pageSize;
    this.loadOrders();
  }

  onFilterSelect(event: any) {
    this.orderParams.status = event.value;
    this.orderParams.pageIndex = 1;
    this.loadOrders();
  }

  async openConfirmDialog(id: number) {
    const cofirm = await this.dialogService.confirm(
      'Confirm refund',
      'Are you sure you want to refund this order?'
    );
    if (cofirm) {
      this.refundOrder(id);
    }
  }

  refundOrder(id: number) {
    this.AdminService.refundOrder(id).subscribe({
      next: (order) => {
        this.dataSource.data = this.dataSource.data.map((o) => o.id == id ? order : o);
      }
    });
  }
}
