import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Address, User } from '../../shared/modules/user';
import { map, tap } from 'rxjs';
import { SignalrService } from './signalr.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = environment.baseUrl;
  private http = inject(HttpClient);
  currentUser = signal<User | null>(null);
  signalrService = inject(SignalrService);
  isAdmin = computed(()=>{
    const role = this.currentUser()?.role;
    return role === 'Admin';
  });

  login(values: any) {
    let params = new HttpParams();
    params = params.append('useCookies', true);
    return this.http.post<User>(this.baseUrl + 'login', values, {params}).pipe(
      tap( user => {
        if(user){
          this.signalrService.createHubConnection();
    }}));
  }

  register(values: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', values).pipe(
      tap( user => {
        if(user){
          this.signalrService.stopHubConnection();
    }}));
  }

  getUserInfo() {
    return this.http.get<User>(this.baseUrl + 'account/user-info').pipe(
      map(user => {
        this.currentUser.set(user);
        return user;
      }));
  }

  logout() {
    return this.http.post<User>(this.baseUrl + 'account/logout', {});
  }

  updateAddress(address: Address) {
    return this.http.post<Address>(this.baseUrl + 'account/address', address).pipe(
      tap(() => {this.currentUser.update(user => {
        if (user) user.address = address;
        return user;
      })}
      )
    );
  }
}
