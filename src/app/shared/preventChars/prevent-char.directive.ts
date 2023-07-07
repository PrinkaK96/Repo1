import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[stupaPreventChar]'
})
export class PreventCharDirective {

  constructor(private elementRef: ElementRef) { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'e') {
      event.preventDefault();
    }
  }

}
