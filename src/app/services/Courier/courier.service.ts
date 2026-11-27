import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnimationStyleMetadata } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class CourierService {
  private readonly KEY = 'selectedModule';
  private readonly apiUrl = 'https://localhost:7073/api/Employee';
  constructor(private http: HttpClient) { }
  GetCourier(Type: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetCourier?Type=${Type}`);
  }
  SaveCourier(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/SaveCourier`, data);
  }
  UpdateCourier(data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/UpdateCourier`, data);
  }
  DeleteCour(DocEntry: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/DeleteCourier?code=${DocEntry}`);
  }
  setModule(name: string): void {
    sessionStorage.setItem(this.KEY, name);
  }

  getModule(): string {
    return sessionStorage.getItem(this.KEY) ?? '';
  }

  clearModule(): void {
    sessionStorage.removeItem(this.KEY);
  }
}
