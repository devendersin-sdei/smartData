import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TabViewModule } from "primeng/tabview";
import { TreeModule } from "primeng/tree";
import { InvoiceGridModule } from "../../../shared/invoice-grid/invoice-grid.module";
import { SharedModule } from "../../../shared/shared.module";
import { ApprovalCenterGridComponent } from "./approval-center-grid/approval-center-grid.component";
import { ApprovalCenterRoutingModule } from "./approval-center-routing.module";
import { ApprovalCenterService } from "./approval-center.service";
import { ChasemovementsComponent } from "./chasemovements/chasemovements.component";
import { DocumentsComponent } from "./documents/documents.component";
import { InvoicesComponent } from "./invoices/invoices.component";
import { PursuitsComponent } from "./pursuits/pursuits.component";

@NgModule({
    imports: [
        ApprovalCenterRoutingModule,
        SharedModule,
        FormsModule, // TODO: Remove when forms are done.
        TreeModule,
        TabViewModule,
        CommonModule,
        InvoiceGridModule,
    ],
    declarations: [
        ChasemovementsComponent,
        PursuitsComponent,
        DocumentsComponent,
        ApprovalCenterGridComponent,
        InvoicesComponent,
    ],
    providers: [
        ApprovalCenterService,
    ],
})
export class ApprovalCenterModule { }
