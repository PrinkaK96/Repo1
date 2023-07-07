import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable()
export class HttpResponseInterceptor implements HttpInterceptor {
    constructor(private router: Router) {

    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            tap({
                next: (event) => {
                    if (event instanceof HttpResponse) {
                        if (event.status == 401) {
                            // alert('Unauthorized access!')
                            // this.router.navigate(['/account/login']);
                        }
                    }
                    return event;
                },
                error: (error) => {
                    if (error.error.msg === 'Session Expired.') {
                        this.router.navigate(['/account/login']);
                    }
                    // else if (error.status === 404) {
                    //     // alert('Page Not Found!')
                    //     this.router.navigate(['/account/login']);
                    // }
                }
            }));
    }
}
