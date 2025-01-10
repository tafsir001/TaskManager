import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  private signupUrl = 'http://localhost:5000/api/auth/createuser';


  constructor(private http: HttpClient) { }

  // Login User
  signup(signupDetails: any): Observable<any> {

    return this.http.post<any>(this.signupUrl, signupDetails);
  }
}
