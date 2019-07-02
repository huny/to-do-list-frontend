import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToDoListComponent } from './to-do-list/to-do-list.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxSmartModalModule } from 'ngx-smart-modal';

//import { FontAwesomeModule } from 'font-awesome';

@NgModule({
  declarations: [ToDoListComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgxSmartModalModule.forRoot(),
    RouterModule.forChild([
      { path: 'to-do-list', component: ToDoListComponent }
    ])
  ]
})
export class ToDoListModule { }
