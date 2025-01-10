import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TasksService } from './service/tasks.service'
import { TaskItemComponent } from '../task-item/task-item.component'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TaskItemComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit {
  isLoading = true;
  isEdit = false;
  task!: FormGroup;

  tasks: any[] = [];
  tasksBackup: any[] = []; 
  selectedStatus: string = '';

  constructor(private taskService: TasksService, private fb: FormBuilder, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    // Initialize the form with FormControl and Validators
    this.task = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      status: ['', Validators.required],
      id: ['']
    });

    if(isPlatformBrowser(this.platformId) && localStorage.getItem('authToken')){
      this.fetchTasks();
    } else {
      this.router.navigate(['/login']);
    }
  }
  // Getters to access the form controls in the template
  get title() {
    return this.task.get('title');
  }

  get description() {
    return this.task.get('description');
  }

  get status() {
    return this.task.get('status');
  }

  // Submit handler for the form
  addTask() {
    if (this.task.valid) {
      const newTask = this.task.value;
      if (this.isEdit) {
        this.taskService.updateTask(newTask).subscribe({
          next: () => {
            console.log('Task updated successfully');
            this.task.reset(); // Reset form after successful submission
            this.fetchTasks();
          },
          error: (err: any) => console.error('Error updating task:', err),
        });
        this.isEdit = false;
      } else {

        this.taskService.addTask(newTask).subscribe({
          next: () => {
            console.log('Task added successfully');
            this.task.reset(); // Reset form after successful submission
            this.fetchTasks();
          },
          error: (err: any) => console.error('Error adding task:', err),
        });
      }
    }
  }

  // Fetch tasks using the TaskService
  fetchTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.tasksBackup = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
        this.isLoading = false;
      },
    });
  }

  filterTasks(status: string): void {
    this.selectedStatus = status;
    if (status) {
      this.tasks = this.tasksBackup.filter(task => task.status.toLowerCase() === status.toLowerCase());
    } else {
      this.tasks = [...this.tasksBackup];
    }
  }

  handleRefreshTaskList(taskId: string): void {
    // Refresh the task list after deletion and updation
    this.fetchTasks();
  }

  // Handle task editing (triggered from child component)
  handleTaskEdited(task: any): void {
    console.log('Task edited:', task);
    this.isEdit = true;
    this.task.patchValue({
      title: task.title,
      description: task.description,
      status: task.status.toLowerCase(),
      id: task._id
    });
  }

}
