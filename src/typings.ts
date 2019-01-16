import { RxDatabase, RxCollection, RxDocument } from 'rxdb';

export type CounterDocType = {
  number: number,
};

export type CounterDocument = RxDocument<CounterDocType>;

export type CounterCollection = RxCollection<CounterDocType>;

export type CounterDatabaseCollections = {
  counter: CounterCollection
}

export type MyDatabase = RxDatabase<CounterDatabaseCollections>;
