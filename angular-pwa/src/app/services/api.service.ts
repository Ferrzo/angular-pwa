import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }

  public getAllTodos(): Observable<any> {
    return this.httpClient.get(`${this.url}/todo`);
  }

  public addNewTodo(item): Observable<any> {
    return this.httpClient.post(`${this.url}/todo`, {value: item});
  }
}
