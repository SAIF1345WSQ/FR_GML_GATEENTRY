import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnimationStyleMetadata } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private readonly apiUrl = 'https://localhost:7073/api/Employee';

  constructor(private http: HttpClient) { }

  SaveEmployee(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/SaveEmployee`, data);
  }
  saveVisitor(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/SaveVisitot`, data);
  }
   UpdateVisitEmployee(data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/UpdateVisitor`, data);
  }
  GetEmployee(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetEmployee`);
  }
  UpdateEmployee(data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/UpdateEmployee`, data);
  }
  GetVistor(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetVistor`);
  }
  UpdateOut(id: string, DocEntry: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/UpdtaeOut?id=${id}&DocEntry=${DocEntry}`);
  }
  Download(path: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/Download`, {
      params: { path },
      responseType: 'blob'
    });
  }
  GetEmployeeMov(Type: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetEmpMov?Type=${Type}`);
  }
  SaveEmpMov(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/SaveEmpMov`, data);
  }
  markOut_In(Type: string, DocEntry: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/MarkOut_In?Type=${Type}&DocEntry=${DocEntry}`);
  }
  DelteteMov(DocEntry: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/DeleteMovement?DocEntry=${DocEntry}`);
  }
}
