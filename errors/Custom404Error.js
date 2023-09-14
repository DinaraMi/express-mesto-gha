class Custom404Error extends Error {
  constructor(message) {
    super(message);
    this.name = 'Custom404Error';
    this.statusCode = 404;
  }
}

module.exports = Custom404Error;
