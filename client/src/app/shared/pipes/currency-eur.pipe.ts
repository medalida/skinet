import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyEur',
  standalone: true
})
export class CurrencyEurPipe implements PipeTransform {

  transform(value?: number): string {
    if (value === undefined) {
      return '-'; // Handle invalid input
    }
    
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  }

}
