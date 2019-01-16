import * as React from 'react';
import connectDatabase from './connectDatabase';

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

export default connectDatabase(
  async (getDatabase, setState) => {
    const db = await getDatabase();
    const sub = await db.counter.findOne().$.subscribe(counterDocument => {
      if (!counterDocument) return;
      setState({ counter: counterDocument.get('number') });
    });
    return sub;
  },
  getDatabase => ({
    increment: () => async () => {
      const db = await getDatabase();
      db.counter
        .findOne()
        .exec()
        .then(counterDocument => {
          counterDocument.update({ $inc: { number: 1 } });
        });
    },
  })
)(App);
