const counterSchema = {
  title: 'counter scheme',
  description: "a simple counter",
  version: 0,
  type: 'object',
  properties: {
    number: {
      type: 'number',
      default: 0,
    }
  }
}

export default counterSchema;