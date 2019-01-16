import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import withStateHandlers from 'recompose/withStateHandlers';
import mapProps from 'recompose/mapProps';
import withHandlers from 'recompose/withHandlers';

import getDatabase, { GetDatabase } from './database';
import { Subscription } from 'rxjs';

type QueryFn = (getDatabase: GetDatabase, setState) => Promise<Subscription>;

type UpdateFn = (getDatabase: GetDatabase) => object;

const connectDatabase = (queryFn: QueryFn, updateFn: UpdateFn) =>
  compose(
    withStateHandlers(
      { __dbstate: Object.create(null), },
      { __setState: () => __dbstate => ({ __dbstate }) },
    ),
    lifecycle({
      async componentDidMount() {
        this.__sub = await queryFn(getDatabase, this.props.__setState);
      },
      componentWillUnmount() {
        if (this.__sub) {
          this.__sub.unsubscribe();
        }
      }
    }),
    mapProps(({ __dbstate, __setState, ...props }) => ({
      ...props,
      ...__dbstate,
    })),
    withHandlers({
      ...updateFn(getDatabase),
    }),
  );


export default connectDatabase;
