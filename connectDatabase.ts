import * as React from 'react';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import withStateHandlers from 'recompose/withStateHandlers';
import mapProps from 'recompose/mapProps';
import withHandlers from 'recompose/withHandlers';

import * as Database from './database';

const connectDatabase = (queryFn, updateFn) => BaseComponent =>
  compose(
    withStateHandlers(
      { __dbstate: Object.create(null), },
      { __setState: () => __dbstate => ({ __dbstate }) },
    ),
    lifecycle({
      async componentDidMount() {
        this.__sub = await queryFn(Database, this.props.__setState);
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
      ...updateFn(Database),
    }),
  )(BaseComponent);


export default connectDatabase;
