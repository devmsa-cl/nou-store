export default class BadRequest extends Error {
  statusCode: number;
  constructor(message = "Bad Request") {
    super(message);
    this.name = "BadRequest";
    this.statusCode = 400;
  }
}
