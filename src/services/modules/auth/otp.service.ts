import { apiClient } from "../../api/apiclient";




/** OTP Send Response */
export interface OtpSendResponse {
  message: string;
}

/** OTP Send Request */
export interface OtpSendRequest {
  emplId: string;
  phoneNumber: string;
}

/** Send OTP Service */
export const sendOtpService = async (
  payload: OtpSendRequest
): Promise<OtpSendResponse> => {
  return apiClient.createRequest<OtpSendResponse, OtpSendRequest>(
    "/auth/otp/send",
    payload
  );
};