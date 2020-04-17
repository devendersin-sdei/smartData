import { ArrayHelper } from "../../../utilities/contracts/array-helper";
import { ApprovalCenterItem } from "./approval-center-item.model";

export class ChaseRequest {
  requestType: string;
  status: string;
  approvalItems: ApprovalCenterItem[];

  constructor(options: {
    requestType: string;
    status: string;
    approvalItems: ApprovalCenterItem[];
  }) {
    this.requestType = options.requestType;
    this.status = options.status;
    this.approvalItems = ArrayHelper.clean(options.approvalItems);
  }
}
