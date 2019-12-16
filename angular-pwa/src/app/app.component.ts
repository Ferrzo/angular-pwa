import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  todos: string[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService
      .getAllTodos()
      .pipe(take(1))
      .subscribe(response => {
        this.todos = response;
      });
  }

  addTodo(newTask: string) {
    if (newTask) {
      this.apiService
        .addNewTodo(newTask)
        .pipe(take(1))
        .subscribe(response => {
          this.todos.push(newTask);
        });
    }
  }
}
