import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { Message } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ToastService } from './toast.service';
import { ToastItemCloseEvent } from './toast.interface';
import * as Aos from 'aos';

@Component({
  selector: 'stupa-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ToastComponent {

  @Input() mainHeading: any = 'Done';
  @Input() subHeading: any = 'your request has been accepted';
  @Input() severity: any = 'success';
  @Input() closeToast: boolean = false;
  @Input() timeInterval: number = 4000;
  @Input() message: Message | null | any;
  intervalID: any
  messageSubscription: Subscription | undefined;

  clearSubscription: Subscription | undefined;

  messages: Message[] | null | undefined;

  messagesArchieve: Message[] | undefined;

  template: TemplateRef<any> | undefined;
  @Input() preventOpenDuplicates: boolean = false;
  @Input() preventDuplicates: boolean = false;
  @Input() key: string | undefined;
  @Output() onClose: EventEmitter<ToastItemCloseEvent> = new EventEmitter();
  constructor(public toastService: ToastService, private cd: ChangeDetectorRef,) {
    this.severity = 'warn'
  }
  ngOnInit() {
    this.messageSubscription = this.toastService.messageObserver.subscribe((messages) => {
      if (messages) {
        if (Array.isArray(messages)) {
          const filteredMessages = messages.filter((m) => this.canAdd(m));
          this.add(filteredMessages);
        } else if (this.canAdd(messages)) {
          this.add([messages]);
        }
      }
    });

    this.clearSubscription = this.toastService.clearObserver.subscribe((key) => {
      if (key) {
        if (this.key === key) {
          this.messages = null;
        }
      } else {
        this.messages = null;
      }

      this.cd.markForCheck();
    });
    // this.setInterval();
  }
  add(messages: Message[]): void {
    this.messages = this.messages ? [...this.messages, ...messages] : [...messages];

    if (this.preventDuplicates) {
      this.messagesArchieve = this.messagesArchieve ? [...this.messagesArchieve, ...messages] : [...messages];
    }

    this.cd.markForCheck();
  }

  canAdd(message: Message): boolean {
    let allow = this.key === message.key;

    if (allow && this.preventOpenDuplicates) {
      allow = !this.containsMessage(this.messages!, message);
    }

    if (allow && this.preventDuplicates) {
      allow = !this.containsMessage(this.messagesArchieve!, message);
    }

    return allow;
  }
  containsMessage(collection: Message[], message: Message): boolean {
    if (!collection) {
      return false;
    }

    return (
      collection.find((m) => {
        return m.summary === message.summary && m.detail == message.detail && m.severity === message.severity;
      }) != null
    );
  }
  onMessageClose(event: ToastItemCloseEvent) {
    this.messages?.splice(event.index, 1);

    // this.onClose.emit({
    //     // message: event.message
    // });

    this.cd.detectChanges();
  }
  setClass() {
    if (this.severity === 'success') {
      return 'toast-box _success flex-vc'
    }
    else if (this.severity === 'info') {
      return 'toast-box _info flex-vc'
    }
    else if (this.severity === 'warn') {
      return 'toast-box _warn flex-vc'
    }
    else {
      return 'toast-box _fail flex-vc'
    }
  }
  setIcon() {
    if (this.severity === 'success') {
      return 'pi pi-check text-white'
    }
    else if (this.severity === 'info') {
      return 'pi pi-info text-white'
    }
    else if (this.severity === 'warn') {
      return 'pi pi-question text-white'
    }
    else {
      return 'pi pi-times text-white'
    }
  }

  // setInterval() {
  //   this.closeToast = true
  // }
  closeToastBox() {
    this.closeToast = true
  }
  setInterval() {
    this.intervalID = setInterval(() => {
      this.closeToast = false
      clearInterval(this.intervalID)
    }, 3000);
  }
}