import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { delay, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CommonApiService {
  _monthNames = ["01", "02", "03", "04", "05", "06",
    "07", "08", "09", "10", "11", "12"
  ];
  //This Service Is Only For Common API Methods
  constructor(private readonly httpClient: HttpClient) { }
  skipParameter(body: any, parameter: any) {
    // Check if the parameter should be skipped.
    if (parameter === null || parameter === undefined || body[parameter].split(' ')[0] == 'Invalid') {
      // Remove the parameter from the body.
      delete body[parameter];
    }

    // Convert the body to JSON and return it.
    return body;
  }
  skipParameterOne(body: any, parameter: any) {
    // Check if the parameter should be skipped.
    if (body[parameter] === null) {
      // Remove the parameter from the body.
      delete body[parameter];
    }

    // Convert the body to JSON and return it.
    return body;
  }
  getCityList(state_id: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
    });
    return this.httpClient.get(environment.global_url + 'get_cities?state_id=' + state_id, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map(
      (response: any) => {
        return response;
      })
      ,);
  }
  getStateList(country_id: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
    });
    return this.httpClient.get(environment.global_url + 'get_states?country_id=' + country_id, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map(
      (response: any) => {
        return response;
      })
      ,);
  }
  getFed(country_id: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
    });
    return this.httpClient.get(environment.global_url + 'user/get_state_fed_by_country_id?country_id=' + country_id, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map(
      (response: any) => {
        return response;
      })
      ,);
  }
  getClubsByStateFed(state_fed_id: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
    });
    return this.httpClient.get(environment.global_url + 'user/get_clubs_by_state_fed?state_fed_id=' + state_fed_id, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map(
      (response: any) => {
        return response;
      })
      ,);
  }
  getCountriesList() {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
    });
    return this.httpClient.get(environment.global_url + 'get_countries', {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map(
      (response: any) => {
        return response;
      })
      ,);
  }
  convertUTCDateToLocalDate(date: any) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));

  }
  convertUTCDateTimeToLocal(utcDateTime: any) {
    if (utcDateTime == 'Invalid Date' || utcDateTime == '' || utcDateTime == null || utcDateTime == undefined) {
      return ''
    }
    else {
      const date = new Date(utcDateTime);
      return date.toISOString().split('T')[0];
    }

  }
  convertUTCDateTimeToLocalT(utcDateTime: any) {
    if (utcDateTime == 'Invalid Date' || utcDateTime == '' || utcDateTime == null || utcDateTime == undefined) {
      return ''
    }
    else {
      const date = new Date(utcDateTime);
      return date.getFullYear() + '-' + this._monthNames[new Date(date).getMonth()] + '-' + date.getDate();
    }

  }


  createUTCDate(date: any) {
    var now = new Date();
    var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000)
    return utc
  }
  getPdf(pdfUrl: any) {
    return of(pdfUrl).pipe(delay(3000));
  }
  generateRandomNumberInRange(min: any, max: any) {
    // Generate a random number between 0 and 1.
    let randomNumber = Math.random();

    // Multiply the random number by the desired range and round the result.
    let randomNumberInRange = Math.floor(randomNumber * (max - min + 1)) + min;

    // Return the random number in range.
    return randomNumberInRange;
  }
}
