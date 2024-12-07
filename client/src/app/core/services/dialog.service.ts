import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
 private dialong = inject(MatDialog);

 confirm(title: string, message: string) {
   const dialogRef = this.dialong.open(ConfirmationDialogComponent, {
    width: '400px',
     data: {
       title,
       message
     }
   });
    return dialogRef.afterClosed();
 }
}
