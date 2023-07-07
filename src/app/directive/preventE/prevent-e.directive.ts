import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[preventE]',
})
export class PreventEDirective {

  constructor(private elementRef: ElementRef) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    
    if (event.key === 'e') {
      event.preventDefault();
    }
  }

}
