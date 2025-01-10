import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private getTaskUrl = 'http://localhost:5000/api/tasks/gettasks';
  private addTaskUrl = 'http://localhost:5000/api/tasks/addtask';
  private updateTaskUrl = 'http://localhost:5000/api/tasks/updatetask';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }


  private getAuthToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken'); 
    }
    return null; 
  }
  // Fetch all tasks
  getTasks(): Observable<any[]> {
    const authToken = this.getAuthToken();
    let headers = new HttpHeaders();
    if(authToken){
      headers = headers.set('Authorization', `${authToken}`);
    }
    return this.http.get<any[]>(this.getTaskUrl, { headers });
  }

  // Add a new task
  addTask(task: any): Observable<any> {
    const authToken = this.getAuthToken();
    let headers = new HttpHeaders();
    if(authToken){
      headers = headers.set('Authorization', `${authToken}`);
    }
    return this.http.post<any>(this.addTaskUrl, task, { headers });
  }

  // Update a task
  updateTask(task: any): Observable<any> {
    const authToken = this.getAuthToken();
    let headers = new HttpHeaders();
    if(authToken){
      headers = headers.set('Authorization', `${authToken}`);
    }
    return this.http.put<any>(this.updateTaskUrl + '/' + task.id, task, { headers });
  }
}
