export interface registerPayload {
  name: string;
  email: string;
  password: string;
  image_url?: string;
  phone_number?: string;
}
export interface loginPayload {
  email: string;
  password: string;
}
export interface verifyPayload {
  email: string;
  otp: string;
}
export interface resetPassPayload {
  email: string;
  otp: string;
  newPassword: string;
}
