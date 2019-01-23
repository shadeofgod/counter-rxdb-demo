import * as React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import mapDatabaseToProps from './mapDatabaseToProps';
import getDatabase from './database';

interface IAppProps {
  counter: number;
  increment: () => void;
}

class App extends React.Component<IAppProps> {
  render() {
    const { counter, increment } = this.props;
    return (
      <div>
        <h1>Counter Example - react + rxdb</h1>
        <h2>{counter === undefined ? 'loading' : counter}</h2>
        <button onClick={increment}>+</button>
      </div>
    );
  }
}
export default compose(
  mapDatabaseToProps(async (db) => {
    const counterDoc = await db.counter.findOne().exec();
    return {
      counter: counterDoc.get$('number'),
    }
  }),
  withHandlers({
    increment: () => async () => {
      const db = await getDatabase();
      db.counter.findOne().exec().then(counterDocument => {
        counterDocument.update({ $inc: { number: 1 } });
      });
    }
  })
)(App)
