import { Injectable } from '@angular/core';
import { Todo, TodoDb } from '../todo';
import Dexie from 'dexie';
import uuidv4 from 'uuid/v4';
import { OfflineService } from './offline.service';
import { ApiService } from './api.service';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private db: any; // TodoDb;

  constructor(private offlineService: OfflineService,
    private apiService: ApiService,
  ) {
    this.db = new TodoDb();
    this.createIndexedDatabase();
    this.checkConnection();
  }

  public postTodo(item: any) {
    return this.apiService.addNewTodo(item);
  }

  getAllTodos() {
    return this.apiService.getAllTodos();
  }

  public bulkTodo(todos: any) {
    return this.apiService.addNewTodo(todos);
  }

  private checkConnection() {
    this.offlineService.connectionChanged
      .subscribe(online => {
        if (online) {
          console.log('ONLINE ... SEND ONLINE');
          // online .. send new todos to server + mark them done
          this.sendItemsFromIndexedDb();
        } else {
          console.log('OFFLINE ... STORE INDEXDB');
          // offline .. store in db new todos and marked them done.
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
          console.log(res);
        });
    }
  }

  private async addToIndexedDb(todo: any) {
    this.db.todos.add(todo)
      .then(async () => {
        const allItems: any[] = await this.db.todos.toArray();
        console.log('saved in DB, DB is now', allItems);
      })
      .catch(e => {
        alert('Error: ' + (e.stack || e));
      });
  }

  private async sendItemsFromIndexedDb() {
    console.log('sending');

    const allItems: any[] = await this.db.todos.toArray();
    this.bulkTodo(allItems).subscribe(res => {
      console.log(res);
      this.db.todos.clear();
    });

  }
}
