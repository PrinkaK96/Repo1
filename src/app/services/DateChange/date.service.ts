import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  // Format date to mm/dd/yy in UTC
  public fulldateFormatter(dateObject: Date) {
    return this.expandDigits(dateObject.getUTCMonth() + 1) + "/" + this.expandDigits(dateObject.getUTCDate()) + "/" + this.expandDigits(dateObject.getUTCFullYear());
  }

  public fullTimeFormatter(dateObject: Date) {
    return this.expandDigits(dateObject.getUTCHours()) + ":" + this.expandDigits(dateObject.getUTCMinutes());
  }

  // Format date to mm/dd/yy in local time zone
  public fulldateLocalFormatter(dateObject: Date) {
    return this.expandDigits(dateObject.getMonth() + 1) + "/" + this.expandDigits(dateObject.getDate()) + "/" + this.expandDigits(dateObject.getFullYear());
  }

  public fullTimeLocalFormatter(dateObject: Date) {
    return this.expandDigits(dateObject.getHours()) + ":" + this.expandDigits(dateObject.getMinutes());
  }

  public expandDigits(value: any) {
    return value < 10 ? "0" + value : value;
  }

  parseDateToLocalTimeZone(date: any) {
    return this.fulldateLocalFormatter(date) + "," + this.fullTimeLocalFormatter(date);
  }
  // Format date to yyyy/mm/dd 
  public dateFormatter(dateObject: any) {
    if (dateObject !== undefined && dateObject !== '') {
      return this.expandDigits(dateObject.getFullYear()) + "-" + this.expandDigits(dateObject.getMonth() + 1) + "-"
        + this.expandDigits(dateObject.getDate());
    } else {
      return '';
    }

  }
  //This will convert date into UTC
  public fulldateFormatterInUTC(dateObject: any) {
    var date = dateObject.getUTCFullYear() + '-' +
      ('00' + (dateObject.getUTCMonth() + 1)).slice(-2) + '-' +
      ('00' + dateObject.getUTCDate()).slice(-2) + ' ' +
      ('00' + dateObject.getUTCHours()).slice(-2) + ':' +
      ('00' + dateObject.getUTCMinutes()).slice(-2) + ':' +
      ('00' + dateObject.getUTCSeconds()).slice(-2);
    return date.slice(0, 10) + 'T' + date.slice(11, 19) + '.000Z'
  }
}