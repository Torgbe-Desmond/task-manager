const { CustomAPIError } = require('./custom-error');
const { StatusCodes } = require('http-status-codes');

class NOT_FOUND extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

module.exports = NOT_FOUND;
