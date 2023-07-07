import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[stupaDragDropItem]'
})
export class DragDropItemDirective {

  constructor() { }

  @HostBinding('attr.draggable') draggable = true;
  @Input('elemPosition') elemPosition: number | any;
  @Input('list') list: any;
  @Input('fillList') fillList: any;

  @Output('returnUpdatedList') returnUpdatedList = new EventEmitter<any>();
  @Output('returnUpdatedPullList') returnUpdatedPullList = new EventEmitter<any>();

  @Input('parentIndex') parentIndex: number | any;
  @HostListener('dragstart', ['$event'])
  onDragStart(e: any) {
    e.dataTransfer.setData('text', this.elemPosition);
    e.dataTransfer.setData('sadak', this.parentIndex);
  }

  @HostListener('drop', ['$event'])
  onDrop(e: any) {
    e.preventDefault();
    let sourceElementIndex = e.dataTransfer.getData('text');
    let sourceParentIndex = e.dataTransfer.getData('sadak');
    let destElementIndex = this.elemPosition;
    let destParentIndex = this.parentIndex;
    let clonedList = [...this.list];
    let dummyClonedList = [...this.fillList.rounds[0].matches];
    if (parseInt(sourceElementIndex) !== parseInt(destElementIndex)) {
      
      dummyClonedList.splice(destParentIndex, 1, this.fillList.rounds[0].matches[sourceParentIndex]);
      dummyClonedList.splice(sourceParentIndex, 1, this.fillList.rounds[0].matches[destParentIndex]);
      dummyClonedList.splice(destParentIndex, 1, dummyClonedList[sourceElementIndex].splice(destElementIndex, 1, this.list[sourceElementIndex]));
      dummyClonedList.splice(sourceParentIndex, 1, dummyClonedList[destElementIndex].splice(sourceElementIndex, 1, this.list[destElementIndex]));
      clonedList.splice(destElementIndex, 1, this.list[sourceElementIndex]);
      clonedList.splice(sourceElementIndex, 1, this.list[destElementIndex]);
      this.returnUpdatedList.emit(clonedList);
      this.returnUpdatedPullList.emit(dummyClonedList);
    } else {
      
    }
  }

  @HostListener('dragover', ['$event'])
  onDragOver(e: any) {
    e.preventDefault();
  }

}
