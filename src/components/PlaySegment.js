import React from 'react';
import PropTypes from 'prop-types';

export default function PlaySegment({ playSegment }) {
  return (
    <div className="play-segment">
      {playSegment.fieldEnd != null && (
        <div className="gamestream-field" style={{ height: '40px' }}>
          <div className="gsf-yardline" />
          <div className="gsf-yardline" />
          <div className="gsf-yardline" />
          <div className="gsf-yardline" />
          <div className="gsf-yardline" />
          <div className="gsf-yardline" />
          <div className="gsf-yardline" />
          <div className="gsf-yardline" />
          <div className="gsf-yardline" />
          <div className="gsf-yardline" />
          <div className="gsf-yardline" />
          <div className="gsf-yardline" />
          <div
            className="play-segment-line"
            style={{
              width: Math.abs(playSegment.fieldEnd - playSegment.fieldStart) * 5,
              left: 300 - 1 + (playSegment.fieldEnd > playSegment.fieldStart ? playSegment.fieldStart : playSegment.fieldEnd) * 5,
            }}
          />
          <div
            className="play-segment-marker"
            style={{
              left: 300 - 5 + playSegment.fieldEnd * 5,
            }}
          />
        </div>
      )}
      <p className="play-segment-text">{playSegment.segmentText}</p>
    </div>
  );
}

PlaySegment.propTypes = {
  playSegment: PropTypes.shape({
    index: PropTypes.number,
    fieldStart: PropTypes.number,
    fieldEnd: PropTypes.number,
    teamId: PropTypes.number,
    segmentText: PropTypes.string,
    lineType: PropTypes.string,
    endpointType: PropTypes.string,
  }).isRequired,
};
