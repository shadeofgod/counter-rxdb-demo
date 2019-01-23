import * as React from 'react';
import getDatabase from './database';

const { createFactory } = React;

const mapDatabaseToProps = propsMapper => BaseComponent => {
  const factory = createFactory(BaseComponent);

  class MapDatabaseToProps extends React.Component<{}, {}> {
    constructor(props) {
      super(props);
      this.state = {};
    }

    private subs = [];

    async componentDidMount() {
      const db = await getDatabase();
      const props = await propsMapper(db);

      Object.keys(props).forEach(key => {
        this.subs.push(props[key].subscribe(value => {
          this.setState({
            [key]: value,
          });
        }));
      });
    }

    componentWillUnmount() {
      if (this.subs.length > 0) {
        this.subs.forEach(sub => sub.unsubscribe());
      }
    }

    render() {
      return factory({
        ...this.props,
        ...this.state,
      })
    }
  }

  return MapDatabaseToProps;
}

export default mapDatabaseToProps;
