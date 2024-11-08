import { Component, Input } from '@angular/core';
import { Product } from '../../shared/modules/product';
import { MatCard, MatCardActions, MatCardContent } from '@angular/material/card';
import { CurrencyPipe, registerLocaleData } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import localeFr from '@angular/common/locales/fr';
import { RouterLink } from '@angular/router';

registerLocaleData(localeFr, 'fr-FR');

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [MatCard, MatCardContent, MatCardActions, MatIcon, MatButton, CurrencyPipe, RouterLink],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss'
})
export class ProductItemComponent {
  @Input() product?: Product;
  
}
