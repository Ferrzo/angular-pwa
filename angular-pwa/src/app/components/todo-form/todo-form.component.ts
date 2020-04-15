import { Component, OnInit } from '@angular/core';
import { TodoService } from 'src/app/services/todo.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ITodo } from 'src/app/models/todo';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss']
})
export class TodoFormComponent implements OnInit {
  formGroup: FormGroup;

  constructor(private todoService: TodoService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      'name': [null, Validators.required],
      'description': [null],
      'isDone': false
    });
  }

  get name() {
    return this.formGroup.get('name') as FormControl;
  }

  addTodo(value) {
    this.todoService.addTodo({ title: value.name, description: value.description });
  }
}
