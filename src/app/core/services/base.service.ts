import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService<T> {
  serviceData: Observable<any> | null;

  private _items$ = new BehaviorSubject<T[]>([]);
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  private _isFirstLoading$ = new BehaviorSubject<boolean>(true);
  private _errorMessage = new BehaviorSubject<string>('');
  private _subscriptions: Subscription[] = [];

  // Getters
  get items$(): Observable<T[]> {
    return this._items$.asObservable();
  }
  get isLoading$(): any {
    return this._isLoading$.asObservable();
  }
  get isFirstLoading$(): Observable<boolean> {
    return this._isFirstLoading$.asObservable();
  }
  get errorMessage$(): any {
    return this._errorMessage.asObservable();
  }
  get subscriptions(): Subscription[] {
    return this._subscriptions;
  }

  protected http: HttpClient;

  API_URL = `${environment.loopbackUrl}api`;

  constructor(http: HttpClient) {
    this.http = http;
  }

  clearCache(): void {
    this.serviceData = null;
  }
}
