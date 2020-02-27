import { Component, OnInit, OnDestroy } from '@angular/core';

import { take } from 'rxjs/operators';
import { TodoService } from './services/todo.service';
import { Todo } from './todo';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  public todos: any[] = [];
  public todoSubscription: Subscription;

  todos$: Observable<any[]> = new Observable();

  constructor(private todoService: TodoService) {
  }

  ngOnInit() {
    this.getTodos();
  }

  addTodo(value: string) {
    this.todoService.addTodo({ title: value });
    this.getTodos();
  }

  getTodos() {
    this.todos$ = this.todoService.getAllTodos();
  }

  ngOnDestroy() {
    if (this.todoSubscription !== undefined) {
      this.todoSubscription.unsubscribe();
    }
  }
}
