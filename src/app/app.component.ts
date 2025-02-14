import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Todo } from '../models/todo.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  public mode = 'list';
  public todos: Todo[] = [];
  public title: String = 'Minhas tarefas';
  public form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.compose([
        Validators.minLength(1),
        Validators.maxLength(60),
        Validators.required
      ])]
    });
    this.load();
  }

  remove(todo: Todo) {
    const index = this.todos.indexOf(todo);
    if (index != -1) {
      this.todos.splice(index, 1);
    }
    this.save();
  }

  markAsDone(todo: Todo) {
    todo.done = true;
    this.save();
  }

  markAsUndone(todo: Todo) {
    todo.done = false;
    this.save();
  }

  add() {
    const title = this.form.controls['title'].value;
    const id = this.todos.length + 1;
    this.todos.push(new Todo(title, false, id));
    this.save();
    this.clear();
  }

  clear() {
    this.form.reset();
  }
  save() {
    const data = JSON.stringify(this.todos);
    localStorage.setItem('todos', data);
    this.mode='list';
  }
  load() {
    const data = localStorage.getItem('todos');
    if (data) {
      try {
        this.todos = JSON.parse(data);
      } catch (error) {
        console.error('Erro ao fazer parse dos dados do localStorage:', error);
        this.todos = [];
      }
    } else {
      this.todos = [];
    }
  }
  changeMode(mode: string) {
    this.mode = mode;
  }
}
