import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskItemService } from './service/task-item.service';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css'
})
export class TaskItemComponent {
  @Input() task: any
  @Output() refreshTaskList = new EventEmitter<string>();
  @Output() taskEdited = new EventEmitter<any>();

  constructor(private taskItemService: TaskItemService) {}


  deleteTask(taskId: string): void {
    console.log('Deleting task with ID:', taskId);
    this.taskItemService.deleteTask(taskId).subscribe({
      next: () => {
        console.log('Task deleted successfully');
        this.refreshTaskList.emit(taskId);
      },
      error: (err) => {
        console.error('Error deleting task:', err);
      }
    });
  }

  editTask(task: any): void {
    this.taskEdited.emit(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
