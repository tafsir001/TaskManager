import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TaskItemService {

  private deleteTaskUrl = 'http://localhost:5000/api/tasks/deletetask';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  private getAuthToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken'); 
    }
    return null; 
  }

  deleteTask(id: any): Observable<any[]> {
    const authToken = this.getAuthToken();
    let headers = new HttpHeaders();
    if(authToken){
      headers = headers.set('Authorization', `${authToken}`);
    }
    return this.http.delete<any[]>(this.deleteTaskUrl+'/' + id, { headers });
  }
}
