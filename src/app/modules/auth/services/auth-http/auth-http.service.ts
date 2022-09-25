import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../../models/user.model';
import { environment } from '../../../../../environments/environment';
import { AuthModel } from '../../models/auth.model';

const API_USERS_URL = `${environment.apiUrl}/admin`;
export enum Crud {
  create = 'create',
  read = 'read',
  update = 'update',
  delete = 'delete',
}
export enum CrudPosition {
  create = 'create',
  read = 'read',
  update = 'update',
  delete = 'delete',
  publish = 'publish',
  status = 'status',
  applicants = 'applicants',
  permission = 'permission',
}
export enum CrudUser {
  create = 'create',
  read = 'read',
  update = 'update',
  delete = 'delete',
}

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) {}

  // public methods
  login(email: string, password: string): Observable<any> {
    return this.http.post<AuthModel>(`${API_USERS_URL}/login`, {
      email,
      password,
    });
  }

  // CREATE =>  POST: add a new user to the server
  createUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(API_USERS_URL, user);
  }

  // Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
  forgotPassword(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${API_USERS_URL}/forgot-password`, {
      email,
    });
  }

  getUserByToken(token: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(`${API_USERS_URL}/me`, {
      headers: httpHeaders,
    });
  }

  role(token: string): Observable<string[]> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<string[]>(`${API_USERS_URL}/roles`, {
      headers: httpHeaders,
    });
  }

  dictionary(token: string, crud?: Crud): Observable<string[]> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const url = `${API_USERS_URL}/permission/dictionary` + (crud ? `/${crud}` : ``);
    return this.http.get<string[]>(url, {
      headers: httpHeaders,
    });
  }

  office(token: string, officeId?: number, crud?: Crud): Observable<string[]> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const url = `${API_USERS_URL}/permission/office` + (officeId ? `/${officeId}` : ``) + (crud ? `/${crud}` : ``);
    return this.http.get<string[]>(url, {
      headers: httpHeaders,
    });
  }

  company(token: string, crud?: Crud): Observable<string[]> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const url = `${API_USERS_URL}/permission/company` + (crud ? `/${crud}` : ``);
    return this.http.get<string[]>(url, {
      headers: httpHeaders,
    });
  }

  position(token: string, positionId?: number, crud?: CrudPosition): Observable<string[]> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const url = `${API_USERS_URL}/permission/position` + (positionId ? `/${positionId}` : ``) + (crud ? `/${crud}` : ``);
    return this.http.get<string[]>(url, {
      headers: httpHeaders,
    });
  }

  positionOffice(token: string): Observable<string[]> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<string[]>(`${API_USERS_URL}/permission/position/office`, {
      headers: httpHeaders,
    });
  }

  user(token: string, userId?: number, crud?: CrudUser): Observable<string[]> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const url = `${API_USERS_URL}/permission/user` + (userId ? `/${userId}` : ``) + (crud ? `/${crud}` : ``);
    return this.http.get<string[]>(url, {
      headers: httpHeaders,
    });
  }
}
