import { Directive, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[stupaContDwnTimer]'
})
export class ContDwnTimerDirective implements OnChanges  {

  intervalId: number = 0;
  message: string = '';
  @Input('seconds') public seconds: number=0;
  @Output() currentTime = new EventEmitter<any>();
  ngOnInit() {this.countDown(); }
  ngOnDestroy() { this.clearTimer(); }

  clearTimer(): void { clearInterval(this.intervalId); }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      const chng = changes[propName];
      const cur = JSON.stringify(chng.currentValue);
      const prev = JSON.stringify(chng.previousValue);
      // this.changeLog.push(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
    }
  }
  private countDown(): void {
    this.clearTimer();
    this.intervalId = window.setInterval(() => {
      if (this.seconds !== 0) {
        this.seconds -= 1;
        this.currentTime.emit(this.seconds);
      }
     
      // if (this.seconds === 0) {
      //   this.message = 'Blast off!';
      // } else {
      //   if (this.seconds < 0) {
      //     this.seconds = 60;
      //   } // reset
      //   this.message = `T-${this.seconds} seconds and counting`;
      // }
    }, 1000);
  }

}
