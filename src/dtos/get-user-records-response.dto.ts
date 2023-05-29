import { UserRecordDTO } from "./user-record.dto";

export class GetUserRecordsResponseDTO {
  records: UserRecordDTO[];
  total: number;
  totalPages: number;
  previousPage: boolean;
  nextPage: boolean;
}
