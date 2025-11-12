import type { AxiosInstance } from "axios";
import type { User, ApiResponse } from "~/types";

export class AuthService {
  private api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async login(
    email: string,
    password: string
  ): Promise<
    ApiResponse<{
      token: string;
      user: User;
    }>
  > {
    const response = await this.api.post("/login", { email, password });
    return response.data;
  }

  async logout(): Promise<ApiResponse<void>> {
    const response = await this.api.post("/logout");
    return response.data;
  }

  async me(): Promise<ApiResponse<User>> {
    const response = await this.api.get("/user");
    return response.data;
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await this.api.post("/refresh");
    return response.data;
  }

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    const response = await this.api.post("/forgot-password", { email });
    return response.data;
  }

  async resetPassword(
    token: string,
    password: string,
    password_confirmation: string
  ): Promise<ApiResponse<void>> {
    const response = await this.api.post("/reset-password", {
      token,
      password,
      password_confirmation,
    });
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    const response = await this.api.put("/profile", data);
    return response.data;
  }

  async changePassword(
    current_password: string,
    new_password: string,
    password_confirmation: string
  ): Promise<ApiResponse<void>> {
    const response = await this.api.post("/change-password", {
      current_password,
      new_password,
      password_confirmation,
    });
    return response.data;
  }
}
