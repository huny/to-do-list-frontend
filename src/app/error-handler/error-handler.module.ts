import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternalServerErrorComponent } from './internal-server-error/internal-server-error.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [InternalServerErrorComponent, NotFoundComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: 'not-found', component: NotFoundComponent },
      { path: 'internal-server-error', component: InternalServerErrorComponent },
    ])
  ]
})
export class ErrorHandlerModule { }
