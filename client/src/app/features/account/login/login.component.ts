import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AccountService } from '../../../core/services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TextInputComponent } from '../../../shared/components/text-input/text-input.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCard,
    TextInputComponent,
    MatButton
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  returnUrl = '/shop';

  constructor() {
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] ?? this.returnUrl;
    console.log(this.returnUrl);
  }

  loginFrom = this.fb.group({
    email: [''],
    password: ['']
  });

  onSubmit() {
    this.accountService.login(this.loginFrom.value).subscribe({
      next: () => {
        this.accountService.getUserInfo().subscribe({
          next: () => {
            this.router.navigateByUrl(this.returnUrl);
          }
        });
      }
    });
  }
}
