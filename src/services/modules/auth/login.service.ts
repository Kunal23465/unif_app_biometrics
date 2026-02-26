import { apiClient } from "../../api/apiclient";



/** Request payload */
export interface LoginRequest {
  emplId: string;
  password: string;
}

/** Response */
export interface LoginResponse {
  emplId: string;
  phoneNumber:string;
  accessToken: string;
  refreshToken: string;
}

/** Login Service */
export const loginService = async (
  payload: LoginRequest
): Promise<LoginResponse> => {
  return apiClient.createRequest<LoginResponse, LoginRequest>(
    "/api/v1/auth/login",
    payload
  );
};