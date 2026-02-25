export default class Unauthorized extends Error {
  statusCode: number;
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "Unauthorized";
    this.statusCode = 401;
  }
}
