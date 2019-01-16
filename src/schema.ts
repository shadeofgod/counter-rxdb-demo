import { RxJsonSchema } from 'rxdb';

const counterSchema: RxJsonSchema = {
  title: 'counter scheme',
  description: 'a simple counter',
  version: 0,
  type: 'object',
  properties: {
    number: {
      type: 'number',
      default: 0
    }
  }
};

export default counterSchema;
