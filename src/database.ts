import * as RxDB from 'rxdb';
import counterSchema from './schema';

RxDB.QueryChangeDetector.enableDebugging();
RxDB.plugin(require('pouchdb-adapter-idb'));

const collections = [
  {
    name: 'counter',
    schema: counterSchema,
  },
];

let dbPromise = null;

async function init() {
  console.log('DatabaseService: creating database..');

  const db = await RxDB.create({
    name: 'counter', // <- name
    adapter: 'idb', // <- storage-adapter
  });

  console.log('DatabaseService: created database');
  window['db'] = db; // write to window for debugging

  // show leadership in title
  db.waitForLeadership().then(() => {
    console.log('isLeader now');
    document.title = '♛ ' + document.title;
  });

  console.log('DatabaseService: create collections');
  await Promise.all(collections.map(colData => db.collection(colData)));

  console.log('DatabaseService: add initial data');
  db.counter.findOne().exec().then(counter => {
    if (!counter) {
      db.counter.insert({ number: 0 });
    }
  });

  return db;
}

export const get = () => {
  if (!dbPromise) {
    dbPromise = init();
  }
  return dbPromise;
};
