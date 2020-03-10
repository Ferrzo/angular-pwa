import { Component, OnInit } from '@angular/core';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss']
})
export class TodoFormComponent implements OnInit {

  constructor(private todoService: TodoService) { }

  ngOnInit() {
  }

  addTodo(value: string) {
    this.todoService.addTodo({ title: value });
  }
}
