import { IAutoMapper } from "../../../core/automapper/interfaces";

export const mapApprovalCenterItemEntity = (automapper: IAutoMapper): void => {
  automapper
    .createMap("default", "ApprovalCenterItem")
    .forMember("chaseRequestId", o => o.chaseRequestId)
    .forMember("chaseId", o => o.chaseId)
    .forMember("originalMasterDocumentSourceId", o => o.originalMasterDocumentSourceId)
    .forMember("destinationMasterDocumentSourceId", o => o.destinationMasterDocumentSourceId);
};

export class ApprovalCenterItem {
  chaseRequestId: number;
  chaseId: number;
  originalMasterDocumentSourceId: number;
  destinationMasterDocumentSourceId: number;

  constructor(options: {
    chaseRequestId: number;
    chaseId: number;
    originalMasterDocumentSourceId: number;
    destinationMasterDocumentSourceId: number;
  }) {
    this.chaseRequestId = options.chaseRequestId;
    this.chaseId = options.chaseId;
    this.originalMasterDocumentSourceId = options.originalMasterDocumentSourceId;
    this.destinationMasterDocumentSourceId = options.destinationMasterDocumentSourceId;
  }
}
