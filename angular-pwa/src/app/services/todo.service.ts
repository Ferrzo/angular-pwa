import { Injectable } from '@angular/core';
import { TodoDb } from '../todo';
import Dexie from 'dexie';
import { OfflineService } from './offline.service';
import { ApiService } from './api.service';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private db: any;

  constructor(private offlineService: OfflineService,
    private apiService: ApiService
  ) {
    this.createIndexedDatabase();
    this.checkConnection();
  }

  public postTodo(item: any) {
    return this.apiService.addNewTodo(item);
  }

  getAllTodos() {
    return this.apiService.getAllTodos();
  }

  public sendBulkTodo(todos: any[]) {
    return this.apiService.addNewTodo(todos);
  }

  private checkConnection() {
    this.offlineService.connectionChanged
      .subscribe(online => {
        if (online) {
          this.sendItemsFromIndexedDb();
        }
      });
  }

  private createIndexedDatabase() {
    this.db = new Dexie('TodosDatabase');
    this.db.version(1).stores({
      todos: 'title,done'
    });
    this.db.open().catch(err => console.error(err));
  }

  addTodo(todo: any) {
    todo.done = false;
    // save into the indexedDB if the connection is lost
    if (!this.offlineService.isOnline) {
      this.addToIndexedDb(todo);
    } else {
      this.postTodo(todo)
        .pipe(take(1))
        .subscribe(res => {
          // ok saved to server
          console.log(res);
        });
    }
  }

  private async addToIndexedDb(todo: any) {
    this.db.todos.add(todo)
      .catch(e => {
        console.log(e);
      });
  }

  private async sendItemsFromIndexedDb() {
    const allItems: any[] = await this.db.todos.toArray();
    this.sendBulkTodo(allItems).subscribe(res => {
      this.db.todos.clear();
    });
  }
}
