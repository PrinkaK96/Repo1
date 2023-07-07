import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JsonDataCallingService {

  constructor(private http: HttpClient) { }
  getMemberShipType(): Observable<any> {
    return this.http.get("./assets/JsonData/MemberShipManagement/memberShipTypeJson.json");
  }
  getValidTill(): Observable<any> {
    return this.http.get("./assets/JsonData/MemberShipManagement/validDate.json");
  }
  getIsPublishOrNot(): Observable<any> {
    return this.http.get("./assets/JsonData/CommonJson/isPublishOrNot.json");
  }
  getPermissions(): Observable<any> {
    return this.http.get("./assets/JsonData/RoleManagement/permissions.json");
  }
  getLevels(): Observable<any> {
    return this.http.get("./assets/JsonData/RoleManagement/eventLevels.json");
  }
  getAuthentication(): Observable<any> {

    return this.http.get("assets/AuthenticationAdmin/AuthenticationAdmin.json");
    // return this.httpClient.get("http://20.83.52.157:8000/role/get_roles/");

    //return this.httpClient.get("assets/DummyJsonData/UserRoles.json");
  }
  eventsType(): Observable<any> {

    return this.http.get("assets/JsonData/EventScreenWeb/eventType.json");
  }
  eventsStatus(): Observable<any> {

    return this.http.get("assets/JsonData/EventScreenWeb/eventStatus.json");
  }
  eventsParticipantType(): Observable<any> {

    return this.http.get("assets/JsonData/EventScreenWeb/participantType.json");
  }
  eventsFixtureFormat(): Observable<any> {

    return this.http.get("assets/JsonData/EventScreenWeb/fixtureFormat.json");
  }
  eventsClass(): Observable<any> {

    return this.http.get("assets/JsonData/EventScreenWeb/selectClass.json");
  }
  getGender(): Observable<any> {

    return this.http.get("assets/JsonData/EventScreenWeb/gender.json");
  }
  getEventCycle() {
    return this.http.get("assets/JsonData/EventScreenWeb/eventCycle.json");
  }
  getCountry() {
    return this.http.get("assets/JsonData/CountryList/countryList.json");
  }
  getRoles() {
    return this.http.get("assets/JsonData/EventScreenWeb/canSendEntries.json");
  }
  selectBestOf(): Observable<any> {
    return this.http.get("assets/JsonData/EventScreenWeb/bestOf.json");
  }
  selectRulePoint(): Observable<any> {
    return this.http.get("assets/JsonData/EventScreenWeb/rulePoint.json");
  }
  getCompetitionStandard(): Observable<any> {
    return this.http.get("assets/JsonData/EventScreenWeb/competitionStandard.json");
  }
  verificationStatus(): Observable<any> {
    return this.http.get("assets/JsonData/EventScreenWeb/verificationStatus.json");
  }

}
