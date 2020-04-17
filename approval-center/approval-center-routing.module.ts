import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ChasemovementsComponent } from "./chasemovements/chasemovements.component";
import { DocumentsComponent } from "./documents/documents.component";
import { InvoicesComponent } from "./invoices/invoices.component";
import { PursuitsComponent } from "./pursuits/pursuits.component";

const routes: Routes = [
    { path: "", component: ChasemovementsComponent },
    { path: "chasemovements", component: ChasemovementsComponent },
    { path: "pursuits", component: PursuitsComponent },
    { path: "documents", component: DocumentsComponent },
    { path: "invoices", component: InvoicesComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ApprovalCenterRoutingModule { }
