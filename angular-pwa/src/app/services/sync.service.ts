import { Injectable } from '@angular/core';
import { OfflineService } from './offline.service';
import { ApiService } from './api.service';
import { interval, Subject, Observable, of, BehaviorSubject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import Dexie from 'dexie';

@Injectable({
    providedIn: 'root'

})
export class SyncService {
    private db: any;

    todos$: BehaviorSubject<any[]> = new BehaviorSubject([]);

    notifier$: Subject<boolean> = new Subject<boolean>();
    constructor(private offlineService: OfflineService,
                private apiService: ApiService) {
        this.createIndexedDatabase();
        this.checkConnection();
        this.initSyncTodos();
    }

    initSyncTodos() {
        const syncInterval$ = interval(5000)
                                .pipe(takeUntil(this.notifier$))
                                .subscribe(() => {
                                    this.syncTodo();
                                });

    }

    syncTodo() {
        if (this.offlineService.isOnline) {
            this.apiService.getAllTodos()
                .pipe(take(1))
                .subscribe((values) => {
                    this.todos$.next(values);
                });
        }
    }

    addTodo(todo: any) {
        todo.done = false;
        // save into the indexedDB if the connection is lost
        if (!this.offlineService.isOnline) {
          this.addToIndexedDb(todo);
        } else {
          this.apiService.addNewTodo(todo)
            .pipe(take(1))
            .subscribe(res => {
              // ok saved to server
              console.log(res);
            });
        }
      }

    stopInterval() {
        this.notifier$.next(true);
    }

    sendBulkTodo(todos: any[]) {
        return this.apiService.addNewTodo(todos);
    }

      private checkConnection() {
        this.offlineService.connectionChanged.subscribe(online => {
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

      private async addToIndexedDb(todo: any) {
        this.db.todos.add(todo).catch(e => {
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
