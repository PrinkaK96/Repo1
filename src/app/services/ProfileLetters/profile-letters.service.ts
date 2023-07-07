import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileLettersService {

  constructor() { }
  getFirstLetters(data: any) {
    if (data !== null && data !== undefined) {
      if (data.split(' ').length > 1) {
        return (
          data.split(' ')[0].charAt(0).toUpperCase() +
          data.split(' ')[1].charAt(0).toUpperCase()
        );
      } else {
        return data.split(' ')[0].charAt(0).toUpperCase();
      }
    }

  }
  capitalizeAllFirstLetter(string: any) {
    //string
    //split the above string into an array of strings 
    //whenever a blank space is encountered
    const arr = string.split(" ");
    //loop through each element of the array and capitalize the first letter.
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    //Join all the elements of the array back into a string 
    //using a blankspace as a separator 
    return arr.join(" ");
  }
}
