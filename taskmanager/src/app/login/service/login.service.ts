import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loginUrl = 'http://localhost:5000/api/auth/login';


  constructor(private http: HttpClient) { }

  // Login User
  login(loginDetails: any): Observable<any> {

    return this.http.post<any>(this.loginUrl, loginDetails);
  }
}
