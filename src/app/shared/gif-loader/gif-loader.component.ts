import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'stupa-gif-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gif-loader.component.html',
  styleUrls: ['./gif-loader.component.scss']
})
export class GifLoaderComponent {
  imageSrc = '../../../assets/GIF/.common-tabView_500_lbqgwl39.gif';
}
