import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VideosService {

  constructor(private httpClient: HttpClient) { }
  getMatchLiveStream(match_id: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.get(environment.global_url + 'tms/get_match_live_stream?match_id=' + match_id,
      {
        headers: reqHeader,
        params: {

        },
        observe: 'response',
      }
    ).pipe(
      map((response: any) => {
        return response;
      }));
  }
  createMatchLiveStream(match_id: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.get(environment.global_url + 'tms/create_match_live_stream?match_id=' + match_id,
      {
        headers: reqHeader,
        params: {

        },
        observe: 'response',
      }
    ).pipe(
      map((response: any) => {
        return response;
      }));
  }
  getEventStreamedMatches(event_id: any, category_id: any, type: any) {
    // if (localStorage.getItem('reqToken') == null) {
    //   var reqHeader = new HttpHeaders({
    //     'Content-Type': 'application/json'
    //   });
    // }
    // else {
    //   var reqHeader = new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     'tenant': environment.tenant_Name,
    //     'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    //   });
    // }
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.get(environment.global_url + 'tms/get_event_live_matches?event_id=' + event_id + '&category_id=' + category_id + '&type=' + type,
      {
        headers: reqHeader,
        params: {

        },
        observe: 'response',
      }
    ).pipe(
      map((response: any) => {
        return response;
      }));
  }
  getEventLiveMatches(event_id: any) {
    var reqHeader
    reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
    });
    // if (localStorage.getItem('reqToken') === null) {
    //   reqHeader = new HttpHeaders({
    //     'Content-Type': 'application/json',
    //'tenant': environment.tenant_Name,
    //   });
    // } else {
    //   reqHeader = new HttpHeaders({
    //     'Content-Type': 'application/json',
    //'tenant': environment.tenant_Name,
    //     'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    //   });
    // }
    return this.httpClient.get(environment.global_url + 'tms/get_event_live_matches?event_id=' + event_id + '&type=live',
      {
        headers: reqHeader,
        params: {

        },
        observe: 'response',
      }
    ).pipe(
      map((response: any) => {
        return response;
      }));
  }
  getLiveMatches(utc_time: any, page_num: any, per_page: any) {
    var reqHeader
    reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
    });
    // if (localStorage.getItem('reqToken') === null) {
    //   reqHeader = new HttpHeaders({
    //     'Content-Type': 'application/json'
    //   });
    // } else {
    //   reqHeader = new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    //   });
    // }
    return this.httpClient.get(environment.global_url + 'tms/get_live_matches?utc_time=' + utc_time + '&page_num=' + page_num + '&per_page=' + per_page,
      {
        headers: reqHeader,
        params: {

        },
        observe: 'response',
      }
    ).pipe(
      map((response: any) => {
        return response;
      }));
  }
  updateMatchStatus(event_id: any, match_id: any, status: any, isPublish = true) {
    const dd = {}
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.patch(environment.global_url + 'tms/update_match_status?event_id=' + event_id + '&match_id=' + match_id + '&live=' + status + '&published=' + isPublish, dd,
      {
        headers: reqHeader,
        params: {},
        observe: 'response',
      }
    ).pipe(
      map((response: any) => {
        return response;
      }));
  }
  getRecentMatches(utc_time: any, page_num: any, event_id: any, category_id: any, round_level: any, per_page: any) {
    var reqHeader
    reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
    });
    // if (localStorage.getItem('reqToken') === null) {
    //   reqHeader = new HttpHeaders({
    //     'Content-Type': 'application/json'
    //   });
    // } else {
    //   reqHeader = new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    //   });
    // }
    return this.httpClient.get(environment.global_url + 'tms/get_recent_matches?utc_time=' + utc_time + '&event_id=' + event_id + '&category_id=' + category_id + '&round_level=' + round_level + '&page_num=' + page_num + '&per_page=' + per_page,
      {
        headers: reqHeader,
        params: {

        },
        observe: 'response',
      }
    ).pipe(
      map((response: any) => {
        return response;
      }));
  }
  getRecentMatchesList(utc_time: any, page_num: any, per_page: any) {
    var reqHeader
    reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
    });
    // if (localStorage.getItem('reqToken') === null) {
    //   reqHeader = new HttpHeaders({
    //     'Content-Type': 'application/json'
    //   });
    // } else {
    //   reqHeader = new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    //   });
    // }

    return this.httpClient.get(environment.global_url + 'tms/get_recent_matches?utc_time=' + utc_time + '&page_num=' + page_num + '&per_page=' + per_page,
      {
        headers: reqHeader,
        params: {

        },
        observe: 'response',
      }
    ).pipe(
      map((response: any) => {
        return response;
      }));
  }
  getRecentStreamedEvents(utc_time: any, page_num: any, per_page: any) {
    var reqHeader
    reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
    });

    return this.httpClient.get(environment.global_url + 'tms/get_recent_streamed_events?utc_time=' + utc_time + '&page_num=' + page_num + '&per_page=' + per_page,
      {
        headers: reqHeader,
        params: {

        },
        observe: 'response',
      }
    ).pipe(
      map((response: any) => {
        return response;
      }));
  }
  getEventRecentMatchesList(utc_time: any, page_num: any, per_page: any, event_id: any) {
    var reqHeader
    reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
    });

    return this.httpClient.get(environment.global_url + 'tms/get_recent_matches?utc_time=' + utc_time + '&page_num=' + page_num + '&per_page=' + per_page + '&event_id=' + event_id,
      {
        headers: reqHeader,
        params: {

        },
        observe: 'response',
      }
    ).pipe(
      map((response: any) => {
        return response;
      }));
  }
  getStreamStats(playback_id: any) {
    var reqHeader
    reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
    });

    return this.httpClient.get(environment.global_url + 'tms/get_stream_stats?playback_id=' + playback_id,
      {
        headers: reqHeader,
        params: {

        },
        observe: 'response',
      }
    ).pipe(
      map((response: any) => {
        return response;
      }));
  }
  updateMatchViews(event_id:any,match_id: any) {
    var body = {
    }
    var reqHeader
    reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
    });

    return this.httpClient.put(environment.global_url + 'tms/update_match_views?match_id=' + match_id+'&event_id='+event_id, body,
      {
        headers: reqHeader,
        params: {

        },
        observe: 'response',
      }
    ).pipe(
      map((response: any) => {
        return response;
      }));
  }
  updateVideosStatus(event_id: any, match_id: any, status: any, isPublish = true) {
    const dd = {}
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.patch(environment.global_url + 'tms/update_match_status?event_id=' + event_id + '&match_id=' + match_id + '&published=' + status , dd,
      {
        headers: reqHeader,
        params: {},
        observe: 'response',
      }
    ).pipe(
      map((response: any) => {
        return response;
      }));
  }
  getRecentMatchesListWithEvent_ID(utc_time: any, page_num: any, per_page: any,event_id:any) {
    var reqHeader
    reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
    });
    // if (localStorage.getItem('reqToken') === null) {
    //   reqHeader = new HttpHeaders({
    //     'Content-Type': 'application/json'
    //   });
    // } else {
    //   reqHeader = new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    //   });
    // }

    return this.httpClient.get(environment.global_url + 'tms/get_recent_matches?utc_time=' + utc_time + '&event_id='+ event_id+'&page_num=' + page_num + '&per_page=' + per_page,
      {
        headers: reqHeader,
        params: {

        },
        observe: 'response',
      }
    ).pipe(
      map((response: any) => {
        return response;
      }));
  }
}
