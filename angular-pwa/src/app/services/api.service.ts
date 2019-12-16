import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url = 'http://localhost:3000'; // todo: environment
  constructor(private httpClient: HttpClient) { }

  public getAllTodos(): Observable<any> {
    return this.httpClient.get(`${this.url}/todo`);
  }

  public addNewTodo(item): Observable<any> {
    return this.httpClient.post(`${this.url}/todo`, {value: item});
  }
}
