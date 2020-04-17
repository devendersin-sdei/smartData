import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit } from "@angular/core";
import { map, tap } from "rxjs/operators";
import { AutomapperService } from "../../../../core/automapper/automapper.service";
import { BASE_API_URL } from "../../../../core/environment.tokens";
import { MessagingService } from "../../../../core/messaging/messaging.service";
import { SeverityType } from "../../../../core/messaging/severity-type.enum";
import { UserService } from "../../../../core/user/user.service";
import { FormService } from "../../../../dynamic-forms/form.service";
import { Autocomplete } from "../../../../dynamic-forms/inputs/autocomplete/autocomplete.model";
import { CheckboxGroup } from "../../../../dynamic-forms/inputs/checkbox-group/checkbox-group.model";
import { DynamicInput } from "../../../../dynamic-forms/inputs/dynamic-input.model";
import { SelectableInput } from "../../../../dynamic-forms/inputs/selectable-input.model";
import { Textbox } from "../../../../dynamic-forms/inputs/textbox/textbox.model";
import { BulkAction } from "../../../../shared/grid/bulk-actions/bulk-action.model";
import { GridColumnDefinition } from "../../../../shared/grid/models/grid-column-definition.model";
import { GridConfiguration } from "../../../../shared/grid/models/grid-configuration.model";
import { GridFilter } from "../../../../shared/grid/models/grid-filter.model";
import { GridRequest } from "../../../../shared/grid/models/grid-request.model";
import { ArrayHelper } from "../../../../utilities/contracts/array-helper";
import { ActionButton } from "../../../../zdevcontrols/action-button/action-button.model";
import { DevControllerService } from "../../../../zdevcontrols/dev-controller/dev-controller.service";
import { ClinicalPageService } from "../../clinical/clinical-page/clinical-page.service";
import { RetrievalPageService } from "../../retrieval/retrieval-page/retrieval-page.service";
import { ApprovalCenterItem } from "../approval-center-item.model";
import { ApprovalCenterService } from "../approval-center.service";
import { ChaseRequest } from "../chase-request.model";

@Component({
  selector: "app-approval-center-grid",
  templateUrl: "./approval-center-grid.component.html",
  styleUrls: ["./approval-center-grid.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalCenterGridComponent implements OnInit {
  @Input() url = `${this.baseApiUrl}approvalCenter/grid?approvalRequestType=chase move`;
  @Input() approvalRequestType: string;
  @Input() additionalColumns: GridColumnDefinition[] = [];
  @Input() additionalFilters: GridFilter[] = [];
  @Input() additionalBulkActions: BulkAction[] = [];

  approvalCenterGridConfiguration = new GridConfiguration();
  approvalCenterGridRequest: GridRequest;
  approvalCenterGridSelection: any;
  actions: BulkAction[];
  selectedChases: ApprovalCenterItem[];
  refreshGrid = new EventEmitter<boolean>(true);

  get showRequestIdFilter(): boolean {
    const filter = this.approvalCenterGridRequest.getFilter("RequestId");
    return filter.show;
  }
  get requestIdInput(): Textbox {
    return this.getInput("RequestId") as Textbox;
  }

  get chaseIdInput(): Textbox {
    return this.getInput("ChaseId") as Textbox;
  }

  get projectsInput(): CheckboxGroup {
    return this.getInput("ProjectIdsCsv") as CheckboxGroup;
  }
  set projectsInput(value: CheckboxGroup) {
    this.setInput("ProjectIdsCsv", value);
  }

  get measuresInput(): CheckboxGroup {
    return this.getInput("MeasureIdsCsv") as CheckboxGroup;
  }
  set measuresInput(value: CheckboxGroup) {
    this.setInput("MeasureIdsCsv", value);
  }

  get showOriginalAIDFilter(): boolean {
    const filter = this.approvalCenterGridRequest.getFilter("OriginalAID");
    return filter.show;
  }
  get originalAIDInput(): Textbox {
    return this.getInput("OriginalAID") as Textbox;
  }

  get showDestinationAIDFilter(): boolean {
    const filter = this.approvalCenterGridRequest.getFilter("DestinationAID");
    return filter.show;
  }

  get showPursuitTypeFilter(): boolean {
    const filter = this.approvalCenterGridRequest.getFilter("PursuitTypeCsv");
    return filter.show;
  }

  get destinationAIDInput(): Textbox {
    return this.getInput("DestinationAID") as Textbox;
  }

  get requestedByInput(): Autocomplete {
    return this.getInput("RequestedBy") as Autocomplete;
  }
  set requestedByInput(value: Autocomplete) {
    this.setInput("RequestedBy", value);
  }

  get statusInput(): CheckboxGroup {
    return this.getInput("ApprovalStatusCsv") as CheckboxGroup;
  }
  set statusInput(value: CheckboxGroup) {
    this.setInput("ApprovalStatusCsv", value);
  }

  get pursuitTypeInput(): CheckboxGroup {
    return this.getInput("PursuitTypeCsv") as CheckboxGroup;
  }
  set pursuitTypeInput(value: CheckboxGroup) {
    this.setInput("PursuitTypeCsv", value);
  }
  get requestType(): string {
    return this.approvalRequestType === "Pursuit" ? "Pursuit(s)" : "Chase(s)";
  }

  constructor(
    @Inject(BASE_API_URL) private readonly baseApiUrl: string,
    private readonly devService: DevControllerService,
    private readonly retrievalService: RetrievalPageService,
    private readonly clinicalPageService: ClinicalPageService,
    private readonly approvalCenterService: ApprovalCenterService,
    private readonly userService: UserService,
    private readonly formService: FormService,
    private readonly messagingService: MessagingService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly automapper: AutomapperService
  ) { }

  ngOnInit() {
    this.devService.push([new ActionButton({ name: "Refresh Grid", action: () => this.refreshGrid.emit() })]);
    this.createGrid();
    if (this.additionalFilters.findIndex(x => x.key === "PursuitTypeCsv") > 0) {
      this.getPursuitTypes();
    } else {
      this.loadGrid();
    }
  }


  createGrid(): void {
    this.approvalCenterGridConfiguration = new GridConfiguration({
      columns: this.getColumns(),
      selectionMode: "multiple",
      pageSize: 10,
      pageSizeOptions: [10, 25, 50, 100],
    });

    this.actions = this.getActions();
  }

  private getColumns(): GridColumnDefinition[] {
    const totalColumns = [
      new GridColumnDefinition({ field: "chaseRequestId", header: "Request ID" }),
      new GridColumnDefinition({ field: "chaseId", header: "Chase ID", routeUrl: "/members/chase/:chaseId" }),
      new GridColumnDefinition({ field: "requestType", header: "Pursuit Type", show: false }),
      new GridColumnDefinition({ field: "projectName", header: "Project" }),
      new GridColumnDefinition({ field: "measureCode", header: "Measure" }),
      new GridColumnDefinition({ field: "originalMasterDocumentSourceId", header: "Original AID", routeUrl: "/retrieval/addressdetail/:originalMasterDocumentSourceId" }),
      new GridColumnDefinition({ field: "destinationMasterDocumentSourceId", header: "Destination AID", routeUrl: "/retrieval/addressdetail/:destinationMasterDocumentSourceId" }),
      new GridColumnDefinition({ field: "notes", header: "Notes", isSortableColumn: false }),
      new GridColumnDefinition({ field: "requestedBy", header: "Requested By" }),
      new GridColumnDefinition({ field: "pursuitRequestedBy", header: "Pursuit requested by" }),
      new GridColumnDefinition({ field: "requestedDate", header: "Date Requested" }),
      new GridColumnDefinition({ field: "status", header: "Status" }),
    ];

    // https://stackoverflow.com/questions/37585309/replacing-objects-in-array
    const distinctColumns = totalColumns.map(obj =>
      this.additionalColumns.find(col =>
        col.field === obj.field) || obj);

    return distinctColumns;
  }

  private getActions(): BulkAction[] {
    const totalBulkActions = [
      ...this.additionalBulkActions,
      new BulkAction({
        name: "Approve",
        action: this.approveRequestItem,
        showBulkAction: true,
      }),
      new BulkAction({
        name: "Deny",
        action: this.denyRequestItem,
      }),
    ];

    const distinctBulkActions = totalBulkActions.filter((filter, i, filters) => {
      return filters.findIndex(a => a.name === filter.name) === i;
    });

    return distinctBulkActions;
  }

  private loadGrid(): void {
    this.approvalCenterGridRequest = new GridRequest({
      url: this.url,
      filters: this.getFilters(),
    });
    this.getAllSelectableInputs();
    this.refreshGrid.emit();
  }

  private getFilters(): GridFilter[] {
    const totalFilters = [
      ...this.additionalFilters,
      new GridFilter({
        input: new Textbox(),
        key: "RequestId",
        name: "Request ID",
      }),
      new GridFilter({
        input: new Textbox(),
        key: "ChaseId",
        name: "Chase ID",
      }),
      new GridFilter({
        input: new CheckboxGroup(),
        key: "ProjectIdsCsv",
        name: "Projects",
      }),
      new GridFilter({
        input: new CheckboxGroup(),
        key: "MeasureIdsCsv",
        name: "Measures",
      }),
      new GridFilter({
        input: new Textbox(),
        key: "OriginalAID",
        name: "Original AID",
      }),
      new GridFilter({
        input: new Textbox(),
        key: "DestinationAID",
        name: "Destination AID",
      }),
      new GridFilter({
        input: new Autocomplete({
          placeholder: "Select Requested By...",
        }),
        key: "RequestedBy",
        name: "Requested By",
      }),
      new GridFilter({
        input: new CheckboxGroup(),
        key: "ApprovalStatusCsv",
        name: "Status",
        show: false,
      }),
      new GridFilter({
        input: new CheckboxGroup(),
        key: "PursuitTypeCsv",
        name: "Pursuit Type",
        show: false,

      }),
    ];

    const distinctFilters = totalFilters.filter((filter, i, filters) => {
      return filters.findIndex(a => a.key === filter.key) === i;
    });

    return distinctFilters;
  }

  private getAllSelectableInputs(): void {
    this.getProjects();
    this.getMeasures();
    this.getRequestedByUsers();
    this.getApprovalStatuses();
  }

  getProjects(): void {
    this.retrievalService
      .getProjectList()
      .pipe(map(this.automapper.curryMany("LookupModel", "SelectableInput")))
      .subscribe(result => {
        this.projectsInput = { ...this.projectsInput, options: result } as any;
        this.formService.updateDom.next();
      });
  }

  getMeasures(): void {
    this.clinicalPageService
      .getMeasuresList()
      .pipe(map(this.automapper.curryMany("ClinicalMeasureListItem", "SelectableInput")))
      .subscribe(options => {
        this.measuresInput = { ...this.measuresInput, options } as any;
        this.formService.updateDom.next();
      });
  }


  getRequestedByUsers(): void {
    this.userService
      .getOrganizationUsers()
      .pipe(
        map(this.automapper.curryMany("UserModel", "SelectableInput")),
        tap(clients => clients.unshift(new SelectableInput({ text: "*clear filter", value: "" })))
      )
      .subscribe(options => {
        this.requestedByInput = { ...this.requestedByInput, options } as any;
        this.formService.updateDom.next();
      });
  }

  getApprovalStatuses(): void {
    const options = [
      new SelectableInput({ text: "Pending Approval", value: "Pending Approval" }),
      new SelectableInput({ text: "Approved", value: "Approved,Completed" }),
      new SelectableInput({ text: "Denied", value: "Denied" }),
    ];
    const defaultStatuses = [new SelectableInput({ text: "Pending Approval", value: "Pending Approval" })];
    this.statusInput = { ...this.statusInput, options, value: defaultStatuses } as any;
    this.changeDetector.markForCheck();
  }

  getPursuitTypes(): void {
    this.approvalCenterService
      .getPursuitTypes()
      .subscribe(result => {
        this.loadGrid();
        this.pursuitTypeInput = { ...this.pursuitTypeInput, options: result, value: result } as any;
        this.changeDetector.markForCheck();
      });
  }

  approveRequestItem = (rowData: any): void => {
    this.setSelectedChases(rowData);
    const chaseApprovalRequestModel = new ChaseRequest({
      requestType: this.approvalRequestType,
      status: "Approved",
      approvalItems: this.selectedChases
        .map(this.automapper.curry("default", "ApprovalCenterItem")) as ApprovalCenterItem[],
    });
    this.approvalCenterService.chaseMoveRequestAction(chaseApprovalRequestModel).subscribe(
      () => {
        this.messagingService.showToast(`${this.selectedChases.length} ${this.requestType} Requests successfully approved.`, SeverityType.SUCCESS);
        this.approvalCenterGridSelection = [];
        this.refreshGrid.emit();
      },
      err => {
        this.messagingService.showToast(`Error while approving Request, please try again.`, SeverityType.ERROR);
        this.approvalCenterGridSelection = [];
      }
    );
  }

  denyRequestItem = (rowData: any): void => {
    this.setSelectedChases(rowData);

    const chaseMoveRequestModel = new ChaseRequest({
      requestType: this.approvalRequestType,
      status: "Denied",
      approvalItems: this.selectedChases
        .map(this.automapper.curry("default", "ApprovalCenterItem")) as ApprovalCenterItem[],
    });
    this.approvalCenterService.chaseMoveRequestAction(chaseMoveRequestModel).subscribe(
      () => {
        this.messagingService.showToast(`${this.selectedChases.length} ${this.requestType} requests denied.`, SeverityType.SUCCESS);
        this.approvalCenterGridSelection = [];
        this.refreshGrid.emit();
      },
      err => {
        this.messagingService.showToast(`Error while denying Chase Request, please try again.`, SeverityType.ERROR);
        this.approvalCenterGridSelection = [];
      }
    );
  }

  private setSelectedChases(rowData: any): void {
    this.selectedChases = ArrayHelper.isAvailable(rowData) ? rowData : [rowData];
  }

  getInput<T extends DynamicInput>(key: string): T {
    if (this.approvalCenterGridRequest == null) {
      return null;
    }

    return this.approvalCenterGridRequest.getInput<T>(key);
  }

  setInput<T extends DynamicInput>(key: string, value: T): void {
    if (this.approvalCenterGridRequest == null) {
      return null;
    }

    this.approvalCenterGridRequest.setInput<T>(key, value);
  }

  trackByIndex(index, item) {
    return index;
  }

  gridDataLoaded(data: any) {
    this.changeDetector.markForCheck();
    this.approvalCenterGridSelection = [];
  }
}
