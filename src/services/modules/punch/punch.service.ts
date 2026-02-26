import { apiClient } from "../../api/apiclient";

/** Punch Response */
export interface PunchDataResponse {
  valid: string;
  message: string;
}

/** Punch Request */
export interface PunchDataRequest {
  emplId: string;
}

/** Punch Data Service */
export const punchService = async (
  payload: PunchDataRequest,
): Promise<PunchDataResponse> => {
  return apiClient.createRequest<PunchDataResponse, PunchDataRequest>(
    "/api/biometric/punch",
    payload,
  );
};

// Punch Latest Respose

/** Punch Latest Response */
export interface PunchLatestResponse {
  emplId: string;
  punchIn: string;
  punchOut: string;
  punchDate: string;
}

/** Get today punch data for an employee */
export const getLatestPunch = async (emplId: string): Promise<PunchLatestResponse> => {
  return apiClient.getRequest<PunchLatestResponse>(`/api/biometric/today/${emplId}`);
};