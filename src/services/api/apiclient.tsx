import type { AxiosInstance } from "axios";
import axios from "axios";

const GATEWAY_BASE = import.meta.env.VITE_GATEWAY_BASE as string;
const API_BASE = import.meta.env.VITE_API_BASE as string;
const REG_ID = import.meta.env.VITE_OAUTH2_REGISTRATION_ID as string;

if (!GATEWAY_BASE || !API_BASE || !REG_ID) {
  console.error(
    " Missing environment variables: VITE_GATEWAY_BASE / VITE_API_BASE / VITE_OAUTH2_REGISTRATION_ID",
  );
}

export class ApiClient {
  private axios: AxiosInstance;
  defaultParams?: Record<string, string | number>;

  constructor() {
    this.axios = axios.create({
      baseURL: API_BASE,
      withCredentials: true,
      timeout: 30000,
    });

    //  Request Interceptor (Attach Token)
    this.axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("accessToken");

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    //  Response Interceptor (Handle Expired Token)
    this.axios.interceptors.response.use(
      (res) => res,
      (err) => {
        const status = err?.response?.status;
        const message = err?.response?.data?.message;

        if (status === 401) {
          console.warn("Unauthorized:", message);

          // Only logout if token expired
          if (message === "Token has expired") {
            localStorage.removeItem("accessToken");

            alert("Session expired. Please relogin.");

            window.location.href = "/";
          }
        }

        return Promise.reject(err);
      },
    );
  }

  // constructor() {
  //   this.axios = axios.create({
  //     baseURL: API_BASE,
  //     withCredentials: true,
  //     timeout: 30000,
  //   });

  //   this.axios.interceptors.request.use(
  //     (config) => {
  //       const token = localStorage.getItem("accessToken");

  //       if (token) {
  //         config.headers.Authorization = `Bearer ${token}`;
  //       }

  //       return config;
  //     },
  //     (error) => Promise.reject(error),
  //   );

  //   // Response interceptor
  //   this.axios.interceptors.response.use(
  //     (res) => res,
  //     (err) => {
  //       if (err?.response?.status === 401) {
  //         console.warn("Unauthorized - token expired or invalid");
  //       }
  //       return Promise.reject(err);
  //     },
  //   );
  // }

  async getRequest<T>(url: string, config: any = {}): Promise<T> {
    const res = await this.axios.get<T>(url, config);
    return res.data;
  }

  /** POST (With optional config override) */
  async postRequest<T>(url: string, data: any, config: any = {}): Promise<T> {
    const res = await this.axios.post<T>(url, data, config);
    return res.data;
  }

  /** POST with payload + optional timeout */
  async createRequest<T, U = T>(
    endpoint: string,
    payload: U,
    config: any = {},
  ): Promise<T> {
    const res = await this.axios.post<T>(endpoint, payload, config);
    return res.data;
  }

  //  PUT Request
  async putRequest<T>(url: string, data: any): Promise<T> {
    const res = await this.axios.put<T>(url, data);
    return res.data;
  }

  //  DELETE Request
  async deleteRequest<T, P = unknown>(url: string, payload?: P): Promise<T> {
    const res = await this.axios.delete<T>(url, {
      data: payload, //  Axios delete payload support
    });

    return res.data;
  }

  private createURL(
    endpoint: string,
    params?: Record<string, string | number>,
  ): string {
    const searchParam = new URLSearchParams({
      ...this.defaultParams,
      ...params,
    } as Record<string, string>);
    return `${endpoint}${searchParam.toString()}`;
  }

  /** GET /resource/:id?params */
  async getRequestByParam<T>(
    endpoint: string,
    id: string | number | null | undefined,
    params?: Record<string, string | number>,
  ): Promise<T> {
    const url = this.createURL(`${endpoint}/${id}`, params);
    const { data } = await this.axios.get<T>(url);
    return data;
  }

  async updateRequest<T, U = Partial<T>>(
    endpoint: string,
    idOrPayload: string | number | U,
    payload?: U,
  ): Promise<T> {
    let url = endpoint;
    let dataToSend: U;

    if (typeof idOrPayload === "string" || typeof idOrPayload === "number") {
      url = `${endpoint}/${idOrPayload}`;
      dataToSend = payload!;
    } else {
      dataToSend = idOrPayload as U;
    }

    const { data } = await this.axios.put<T>(url, dataToSend);
    return data;
  }

  async putFormDataRequest<T>(
    endpoint: string,
    formData: FormData,
  ): Promise<T> {
    const { data } = await this.axios.put<T>(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  }

  async postFormDataRequest<T>(
    endpoint: string,
    formData: FormData,
  ): Promise<T> {
    const { data } = await this.axios.post<T>(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  }

  async getBlobRequest(
    endpoint: string,
    params?: Record<string, string | number>,
  ): Promise<Blob> {
    const url = this.createURL(endpoint, params);
    const { data } = await this.axios.get(url, { responseType: "blob" });
    return data;
  }

  async getBlobRequestByParam(
    endpoint: string,
    id: string | number | null | undefined,
    params?: Record<string, string | number>,
  ): Promise<Blob> {
    const url = this.createURL(`${endpoint}/${id}`, params);
    const { data } = await this.axios.get(url, { responseType: "blob" });
    return data;
  }

  async uploadFileRequest<T>(
    endpoint: string,
    formData: FormData,
    extraHeaders?: Record<string, string>,
  ): Promise<T> {
    const { data } = await this.axios.put<T>(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...extraHeaders,
      },
    });
    return data;
  }

  async uploadFileRequestDoc<T>(
    endpoint: string,
    formData: FormData,
    extraHeaders?: Record<string, string>,
  ): Promise<T> {
    const { data } = await this.axios.post<T>(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...extraHeaders,
      },
    });
    return data;
  }

  async uploadAttachment<T>(
    endpoint: string,
    formData: FormData,
    extraHeaders?: Record<string, string>,
  ): Promise<T> {
    const { data } = await this.axios.post<T>(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...extraHeaders,
      },
    });
    return data;
  }

  async getRaw<T>(url: string, config: Record<string, any> = {}): Promise<T> {
    const { data } = await this.axios.get<T>(url, config);
    return data;
  }
  async postBlobRequest(
    endpoint: string,
    payload: any,
    config: any = {},
  ): Promise<Blob> {
    const res = await this.axios.post(endpoint, payload, {
      responseType: "blob",
      ...config,
    });
    return res.data; // raw blob
  }
}
export const apiClient = new ApiClient();
