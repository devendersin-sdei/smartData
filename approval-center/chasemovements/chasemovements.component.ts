import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, ViewChild } from "@angular/core";
import { BASE_API_URL } from "../../../../core/environment.tokens";
import { Textbox } from "../../../../dynamic-forms/inputs/textbox/textbox.model";
import { GridColumnDefinition } from "../../../../shared/grid/models/grid-column-definition.model";
import { GridFilter } from "../../../../shared/grid/models/grid-filter.model";

@Component({
  selector: "app-chasemovements",
  templateUrl: "./chasemovements.component.html",
  styleUrls: ["./chasemovements.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChasemovementsComponent implements OnInit {
  url = `${this.baseApiUrl}approvalCenter/grid?approvalRequestType=chase move`;
  approvalRequestType = "chase move";
  additionalFilters: GridFilter[] = [];
  additionalColumns: GridColumnDefinition[] = [];

  constructor(
    @Inject(BASE_API_URL) private readonly baseApiUrl: string
  ) { }

  ngOnInit() {
    this.createChaseMoveApprovalGrid();
  }

  private createChaseMoveApprovalGrid(): void {
    this.additionalFilters = [
      new GridFilter({
        input: new Textbox(),
        key: "RequestId",
        name: "Request ID",
        show: false,
      }),
    ];

    this.additionalColumns = [
      new GridColumnDefinition({
        field: "chaseRequestId",
        header: "Request ID",
        show: false,
      }),
      new GridColumnDefinition({
        field: "lastCodedBy",
        header: "Last Coded By",
        show: false,
      }),
    ];
  }
}
