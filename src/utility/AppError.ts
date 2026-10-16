export class AppError extends Error {
  public statusCode: number;
  constructor(statusCode: number, messege: string) {
    super(messege);
    this.statusCode = statusCode;
  }
}
