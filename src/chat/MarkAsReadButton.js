/* @flow strict-local */

import React, { useCallback } from 'react';

import type { Auth, Narrow, Stream, Dispatch } from '../types';
import { createStyleSheet } from '../styles';
import { connect } from '../react-redux';
import { ZulipButton } from '../common';
import * as api from '../api';
import { getAuth, getStreams } from '../selectors';
import {
  isHomeNarrow,
  isStreamNarrow,
  isTopicNarrow,
  streamNameOfNarrow,
  topicOfNarrow,
} from '../utils/narrow';

const styles = createStyleSheet({
  button: {
    borderRadius: 16,
    height: 32,
    paddingLeft: 12,
    paddingRight: 12,
  },
});

type Props = $ReadOnly<{|
  dispatch: Dispatch,
  auth: Auth,
  narrow: Narrow,
  streams: Stream[],
|}>;

function MarkAsReadButton(props: Props) {
  const { auth, narrow, streams } = props;

  const markAllAsRead = useCallback(() => {
    api.markAllAsRead(auth);
  }, [auth]);

  const markStreamAsRead = useCallback(() => {
    const streamName = streamNameOfNarrow(narrow);
    const stream = streams.find(s => s.name === streamName);
    if (stream) {
      api.markStreamAsRead(auth, stream.stream_id);
    }
  }, [auth, narrow, streams]);

  const markTopicAsRead = useCallback(() => {
    const streamName = streamNameOfNarrow(narrow);
    const stream = streams.find(s => s.name === streamName);
    if (stream) {
      api.markTopicAsRead(auth, stream.stream_id, topicOfNarrow(narrow));
    }
  }, [auth, narrow, streams]);

  if (isHomeNarrow(narrow)) {
    return <ZulipButton style={styles.button} text="Mark all as read" onPress={markAllAsRead} />;
  }

  if (isStreamNarrow(narrow)) {
    return (
      <ZulipButton style={styles.button} text="Mark stream as read" onPress={markStreamAsRead} />
    );
  }

  if (isTopicNarrow(narrow)) {
    return (
      <ZulipButton style={styles.button} text="Mark topic as read" onPress={markTopicAsRead} />
    );
  }

  return null;
}

export default connect(state => ({
  auth: getAuth(state),
  streams: getStreams(state),
}))(MarkAsReadButton);