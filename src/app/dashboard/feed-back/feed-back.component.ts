import { Component } from '@angular/core';

@Component({
  selector: 'stupa-feed-back',
  templateUrl: './feed-back.component.html',
  styleUrls: ['./feed-back.component.scss']
})
export class FeedBackComponent {
  _currentSelectedEmoji = 4;
  _currentNumber = 9;
  isSbmmited: boolean = false;
  _emojiList = ["😤", "😑", "🙄", "🙂", "😍"];
  _recommendNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  ShowGreetMsg() {
    this.isSbmmited = true
  }
  SelectedEmoji(index: any) {
    this._currentSelectedEmoji = index
  }
  SelectedNumber(i: any) {
    this._currentNumber = i
  }
}
