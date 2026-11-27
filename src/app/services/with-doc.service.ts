import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnimationStyleMetadata } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class WithDocService {

 private readonly apiUrl = 'https://localhost:7073/api/GateIn';

  constructor(private http: HttpClient) { }

  GetSupplier(docType:any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetSupplier?transactionType=${docType}`);
  }

  GetDocNum(cardCode: any, docType: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetPODoc?cardCode=${cardCode}&docType=${docType}`);
  }
  GetItemsByDocNum(DocEntry: AnimationStyleMetadata, docType: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetItems?DocEntry=${DocEntry}&docType=${docType}`);
  }
  SaveGateIn(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/SaveGateIn`, data);
  }
  UpdateGateIn(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/UpdateGateEntry`, data);
  }
 ViewGateIn(Type: string): Observable<any> {
   return this.http.get<any>(`${this.apiUrl}/ViewGateIn?Type=${Type}`);
  }
   GetRecord(DocEntry: string): Observable<any> {
   return this.http.get<any>(`${this.apiUrl}/GetRecord?DocEntry=${DocEntry}`);
  }
}
