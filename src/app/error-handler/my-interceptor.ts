import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Router } from '@angular/router'
import { EmptyObservable } from 'rxjs/observable/EmptyObservable';

@Injectable()

export class MyInterceptor implements HttpInterceptor {
    constructor(private router: Router) {

    }
    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        return next.handle(req)
            .do(evt => {
                if (evt instanceof HttpResponse) {
                    //Do nothing
                }
            },
                (error: any) => {
                    if (error instanceof HttpErrorResponse) {
                        if (error.status === 404) {
                            this.router.navigateByUrl('/not-found', { replaceUrl: true });
                        } else if (error.status === 500) {
                            this.router.navigateByUrl('/internal-server-error', { replaceUrl: true });
                        }
                        return new EmptyObservable();
                    }
                })
    }
}