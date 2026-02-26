import { apiClient } from "../../api/apiclient";



/** OTP Validate Response */
export interface OtpValidateResponse {
  valid: string;   
  message: string;
}

/** OTP Validation Request */
export interface OtpValidationRequest {
  emplId: string;
  otp: string;
}

/** OTP Validation Service */
export const sendValidationService = async (
  payload: OtpValidationRequest
): Promise<OtpValidateResponse> => {
  return apiClient.createRequest<OtpValidateResponse, OtpValidationRequest>(
    "/auth/otp/validate",
    payload
  );
};