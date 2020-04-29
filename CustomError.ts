class CustomError {
  code: number;
  error: Error;

  constructor(code: number, message: string) {
    this.code = code;
    this.error = new Error(message);
  }
}

export default CustomError;
