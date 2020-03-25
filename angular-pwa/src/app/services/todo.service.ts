import { Injectable } from '@angular/core';
import { SyncService } from './sync.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  constructor(private syncService: SyncService) {}

  addTodo(item) {
    this.syncService.addTodo(item);
  }

  getAllTodos() {
    return this.syncService.todos$;
  }
}
