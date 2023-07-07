import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { BannerManagementService } from './banner-management.service';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';
@Component({
  selector: 'app-banner-management',
  templateUrl: './banner-management.component.html',
  styleUrls: ['./banner-management.component.scss'],
  providers: [MessageService, ConfirmationDialogService],
})
export class BannerManagementComponent implements OnInit {
  files: any[] = [];
  imageUrl: any;
  fileToUpload: any;
  imagePublished: any;
  publishFlag: any;
  uploadTrigger: any;
  imageUnPublished: any;
  tabIndex: any;
  containerMenu: any;
  _showDialog: boolean = false;
  imagePublishSlider: OwlOptions = {
    loop: false,
    mouseDrag: false,
    autoplay: true,
    autoplaySpeed: 1000,
    //autoplayTimeout:1000,
    //autoplayHoverPause:true,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,

    //lazyLoad : false,

    navText: [
      '<i class="pi pi-chevron-left"></i>',
      '<i class="pi pi-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 1,
      },
      940: {
        items: 1,
      },
    },
    nav: true,
  };
  image_Id: any;
  publishedArray: any;
  updatedPublishedArray: any;
  unPublishedArray: any;
  fileName: string | undefined;
  index: any;
  public dragIconId: number | undefined;
  public dropTileId: number | undefined;
  responsiveOptions;
  _showLoader: boolean = false;
  _arrayAfterSwap: any = [];
  azureLoggerConversion: Error = new Error();
  _tabIndex: number = 0;
  constructor(private messageService: MessageService, private router: Router, private bannerService: BannerManagementService,
    private azureLoggerService: MyMonitoringService,
    private confirmationDialogService: ConfirmationDialogService) {
    this.responsiveOptions = [
      {
        numVisible: 1,
        numScroll: 1,
      },
      {
        numVisible: 1,
        numScroll: 1,
      },
      {
        numVisible: 1,
        numScroll: 1,
      }
    ];
  }

  ngOnInit() {
    this.getPublish();
  }

  onFileDropped($event: any) {
    this.uploadFilesSimulator($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files: any) {
    // (files[0].type != 'image/png'
    //this.uploadFilesSimulator(files);
    if (files[0].size < 20000) {
      this.messageService.add({
        key: 'bc',
        severity: 'info',
        summary: 'Info',
        detail: 'Upload correct size image(1980*480)',
        life: 2000,
      });
    }
    else {
      this._showDialog = true;
      this.uploadFilesSimulator(files);
    }
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(file: FileList) {
    this.fileToUpload = file.item(0);
    //Show image preview
    this.fileName = file[0].name;
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    };
    reader.addEventListener('load', () => { });
    reader.readAsDataURL(this.fileToUpload);
  }

  formatBytes(bytes: any, decimals: any) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  getPublish() {
    this._showLoader = true;
    this.bannerService.getPublish().subscribe({
      next: (res: any) => {
        this._showLoader = false;
        this.imagePublished = res.body.published.map((urlImg: any) => urlImg.url);
        this.publishedArray = res.body.published;
        this.unPublishedArray = res.body.unpublished;
        //this.image_Id = res.body.map((urlImg: any) => urlImg.url);
        this.imageUnPublished = res.body.unpublished.map((urlImg: any) => urlImg.url);
        if (this.publishedArray.length > 0 || this.unPublishedArray.length > 0) {
          this.publishFlag = true;
        } else {
          this.publishFlag = false;
        }

      },
      error: (result: any) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this._showLoader = false;
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Error',
          detail: 'Some Error Occured',
          life: 3000,
        });
      },
      complete: () => {

      }
    })
  }
  publishUnpublishBanner(publishUnpublishImage: any) {
    this._showLoader = true;
    const formData = new FormData();
    formData.append('banner', this.fileToUpload)
    this.bannerService.publishBanner(formData, publishUnpublishImage).subscribe({
      next: (data: any) => {
        this._showLoader = false;
        this.getPublish();
        this.imageUrl = false;

      },
      error: (result: any) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this._showLoader = false;
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Error',
          detail: result.error.msg,
          life: 3000,
        });
      },
      complete: () => {

      }
    })

  }
  updateSelection() {
    for (let i = 0; i < this.updatedPublishedArray.length; i++) {
      const data = {
        banner_id: this.updatedPublishedArray[i].banner_id,
        order_idx: i,
        published: this.updatedPublishedArray[i].published,
        url: this.updatedPublishedArray[i].url,
      }
      this._arrayAfterSwap.push(data)
    }
    const updatedArrangeView = this._arrayAfterSwap;
    this.bannerService.updateBanner(updatedArrangeView).subscribe({
      next: (data: any) => {
        this.getPublish();
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Success',
          detail: data.body.msg,
          life: 3000,
        });
      },
      error: (result: any) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Error',
          detail: result.error.msg,
          life: 3000,
        });
      },
      complete: () => {

      }
    })
  }

  removeImage(bannerId: any) {
    const obj = {
      banner_id: bannerId,
    };

    const stringify = JSON.stringify(obj);
    this.bannerService.deleteBanner(stringify).subscribe({
      next: (data: any) => {
        this.getPublish();
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Success',
          detail: data.body.msg,
          life: 3000,
        });
      },
      error: (result: any) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Error',
          detail: result.error.msg,
          life: 3000,
        });
      },
      complete: () => {

      },
    });
  }

  updatePublishUnpublish(banner_id: any, order_idx: any, published: any) {
    const obj = [
      {
        banner_id: banner_id,
        order_idx: published === true ? order_idx - 1 : order_idx,
        published: published === true ? false : true,
      },
    ];
    const stringifyObj = JSON.stringify(obj);
    this.bannerService.updateBanner(stringifyObj).subscribe({
      next: (data: any) => {
        this.getPublish();
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Success',
          detail: data.body.msg,
          life: 3000,
        });
      },
      error: (result: any) => {
        this.azureLoggerConversion = result.error.msg;
        this.azureLoggerService.logException(this.azureLoggerConversion);
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Error',
          detail: result.error.msg,
          life: 3000,
        });
      },
      complete: () => {

      },
    });
  }

  public onIconDropped(ev: any) {
    ev.drag.dropFinished();
  }

  public onEnterHandler(ev: any): void {
    this.dropTileId = parseInt(ev.owner.element.nativeElement.id, 10);
    // the event gets raised immediately, but we want to swap only when we drag over another icon
    if (this.dragIconId === this.dropTileId) {
      return;
    }
    const dragIndex = this.publishedArray.findIndex(
      (order: any) => order.order_idx === this.dragIconId
    );
    const dropIndex = this.publishedArray.findIndex(
      (order: any) => order.order_idx === this.dropTileId
    );
    this.swapIcons(dragIndex, dropIndex);
    this.updatedPublishedArray = this.publishedArray;
    // this.updatedPublishedArray.forEach((element:any)=> {
    //   element.order_idx = this.updatedPublishedArray.indexOf(this.updatedPublishedArray);
    // });
  }

  public dragStartHandler(id: number): void {
    this.dragIconId = id;
  }

  public dragEndHandler(dragRef: HTMLElement) {
    dragRef.style.visibility = 'visible';
  }

  public ghostCreateHandler(dragRef: HTMLElement) {
    dragRef.style.visibility = 'hidden';
  }

  private swapIcons(dragIndex: number, dropIndex: number) {
    const tempObj = this.publishedArray[dragIndex];
    this.publishedArray.splice(dragIndex, 1);
    this.publishedArray.splice(dropIndex, 0, tempObj);
  }

  openPrev() {
    this.index = this.index === 1 ? this.index - 1 : this.index - 1;
  }
  getTabIndexx(detail: any) {
    this._tabIndex = detail.index;
    if (this.index == 0) {
      if (!this.imageUrl) {
        this._tabIndex = detail.index;
      } else {
        this.confirmationDialogService
          .confirm(
            'Please confirm..',
            'Are you sure ,you want to lose your data.'
          )
          .then((confirmed: any) => {
            if (confirmed) {
              this._tabIndex = this.index
            } else {

            }
          })
          .catch(() => { });
      }
    } else {
      if (!this.updatedPublishedArray) {
        this._tabIndex = this.index
      } else {
        this.confirmationDialogService
          .confirm(
            'Please confirm..',
            'Are you sure ,you want to lose your data.'
          )
          .then((confirmed: any) => {
            if (confirmed) {

            } else {

            }
          })
          .catch(() => { });
      }
    }
  }
  goback() {
    if (this._tabIndex == 0) {
      if (!this.imageUrl) {
        this.router.navigate(['/admin/settings']);
      } else {
        this.confirmationDialogService
          .confirm(
            'Please confirm..',
            'Are you sure ,you want to lose your data.'
          )
          .then((confirmed: any) => {
            if (confirmed) {
              this.router.navigate(['/admin/settings']);
            } else {

            }
          })
          .catch(() => { });
      }
    } else {
      if (!this.updatedPublishedArray) {
        this.router.navigate(['/admin/settings']);
      } else {
        this.confirmationDialogService
          .confirm(
            'Please confirm..',
            'Are you sure ,you want to lose your data.'
          )
          .then((confirmed: any) => {
            if (confirmed) {
              this.router.navigate(['/admin/settings']);
            } else {

            }
          })
          .catch(() => { });
      }
    }
    // this.router.navigate(['/admin/settings']);

  }
}
