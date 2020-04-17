import { HttpClient, HttpResponse } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AutomapperService } from "../../../core/automapper/automapper.service";
import { BASE_API_URL } from "../../../core/environment.tokens";
import { SelectableInput } from "../../../dynamic-forms/inputs/selectable-input.model";
import { ChaseRequest } from "./chase-request.model";

@Injectable({
  providedIn: "root",
})
export class ApprovalCenterService {

  constructor(
    @Inject(BASE_API_URL)
    private readonly baseApiUrl: string,
    private readonly automapper: AutomapperService,
    private http: HttpClient
  ) { }

  getApprovalStatuses(): Observable<SelectableInput[]> {
    const url = `${this.baseApiUrl}approvalCenter/statuses`;
    return this.http.get(url).pipe(
      map(this.automapper.curryMany("default", "SelectableInput"))
    );
  }

  chaseMoveRequestAction(requestItems: ChaseRequest): Observable<HttpResponse<null>> {
    const url = `${this.baseApiUrl}approvalCenter/chaseMoveAction`;

    return this.http.post(url, requestItems) as Observable<HttpResponse<null>>;
  }

  getPursuitTypes(): Observable<SelectableInput[]> {
    const url = `${this.baseApiUrl}approvalcenter/pursuittypes`;
    return this.http.get(url).pipe(
      map(this.automapper.curryMany("PursuitType", "SelectableInput"))
    );
  }

}
