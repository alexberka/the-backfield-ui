/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../utils/context/authContext';
import { createPlay } from '../../api/playData';
import PlayerSelect from '../PlayerSelect';

const initialState = {
  id: 0,
  prevPlayId: -1,
  gameId: 0,
  teamId: 0,
  fieldPositionStart: null,
  fieldPositionEnd: null,
  down: 0,
  toGain: null,
  clockStart: null,
  clockEnd: null,
  gamePeriod: null,
  notes: '',
  passerId: null,
  receiverId: null,
  completion: false,
  rusherId: null,
  tacklerIds: [],
  passDefenderIds: [],
  kickoff: false,
  punt: false,
  fieldGoal: false,
  kickerId: null,
  kickReturnerId: null,
  kickFieldedAt: null,
  kickFairCatch: false,
  kickGood: false,
  kickTouchback: false,
  kickFake: false,
  touchdownPlayerId: null,
  extraPoint: false,
  conversion: false,
  extraPointKickerId: null,
  extraPointGood: false,
  extraPointFake: false,
  conversionPasserId: null,
  conversionReceiverId: null,
  conversionRusherId: null,
  conversionGood: false,
  defensiveConversion: false,
  conversionReturnerId: null,
  safety: false,
  cedingPlayerId: null,
  fumbles: [],
  interceptedById: null,
  interceptedAt: null,
  kickBlocked: false,
  kickBlockedById: null,
  kickBlockRecoveredById: null,
  kickBlockRecoveredAt: null,
  laterals: [],
  penalties: [],
  sessionKey: '',
};

const initialDisplay = {
  pass: false,
  rush: false,
  kickoff: false,
  fieldgoal: false,
  punt: false,
};

const retainHeaders = {
  passerId: null,
  receiverId: null,
  completion: false,
  rusherId: null,
  tacklerIds: [],
  passDefenderIds: [],
  kickoff: false,
  punt: false,
  fieldGoal: false,
  kickerId: null,
  kickReturnerId: null,
  kickFieldedAt: null,
  kickFairCatch: false,
  kickGood: false,
  kickTouchback: false,
  kickFake: false,
  touchdownPlayerId: null,
  extraPoint: false,
  conversion: false,
  extraPointKickerId: null,
  extraPointGood: false,
  extraPointFake: false,
  conversionPasserId: null,
  conversionReceiverId: null,
  conversionRusherId: null,
  conversionGood: false,
  defensiveConversion: false,
  conversionReturnerId: null,
  safety: false,
  cedingPlayerId: null,
  fumbles: [],
  interceptedById: null,
  interceptedAt: null,
  kickBlocked: false,
  kickBlockedById: null,
  kickBlockRecoveredById: null,
  kickBlockRecoveredAt: null,
  laterals: [],
  penalties: [],
};

export default function PlayForm({ gameId, homeTeam, awayTeam, playEdit = initialState }) {
  const [newPlay, setNewPlay] = useState(false);
  const [formData, setFormData] = useState({});
  const [formDisplay, setFormDisplay] = useState(initialDisplay);
  const { user } = useAuth();

  const handleDisplayToggle = (e = { target: { name: '' } }) => {
    const { name } = e.target;
    if (name === 'pass' || name === 'rush' || name === 'fieldgoal' || name === 'kickoff' || name === 'punt') {
      setFormDisplay({ ...initialDisplay, [name]: e.target.value !== 'false' });
      setFormData((prev) => ({
        ...prev,
        ...retainHeaders,
      }));
    } else if (name === '') {
      setFormData((prev) => ({
        ...prev,
        ...retainHeaders,
      }));
    } else {
      setFormDisplay({ ...initialDisplay, [e.target.name]: true });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!Number.isNaN(parseInt(value, 10)) && Number(value) !== null) {
      const valueInt = Number(value);
      setFormData((prev) => ({
        ...prev,
        [name]: valueInt,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value === 'null' ? null : value,
      }));
    }
  };

  const handleBoolChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value !== 'false',
    }));
  };

  const handleClockChange = (e) => {
    console.warn(e);
    const [name, place] = e.target.name.split('-');
    let value = null;
    switch (place) {
      case 'minutes':
        if (e.target.valueAsNumber < 100 && e.target.valueAsNumber >= 0) {
          value = Number(e.target.value) * 60 + (formData[name] % 60);
        }
        break;
      case 'seconds':
        if (e.target.valueAsNumber <= 60 && e.target.valueAsNumber >= -1) {
          value = Number(e.target.value) + Math.floor(formData[name] / 60) * 60;
        }
        break;
      default:
        break;
    }
    if (value !== null) {
      handleChange({ target: { name, value } });
    }
  };

  // const handlePlayerChange = (e) => {
  //   const []
  // }

  const handleReset = () => {
    const reset = playEdit || initialState;
    setFormData(() => ({ ...reset, sessionKey: user.sessionKey, gameId }));
    setFormDisplay(initialDisplay);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createPlay(formData).then(() => {
      handleReset();
      setNewPlay((prev) => !prev);
    });
  };

  const fieldPositionToString = (fpAsInt) => {
    if (fpAsInt == null) {
      return '';
    }
    let asText = '';

    if (fpAsInt > 0) {
      asText += `${awayTeam.locationName || awayTeam.nickname} `;
    } else if (fpAsInt < 0) {
      asText += `${homeTeam.locationName || homeTeam.nickname} `;
    }
    const fieldNumber = 50 - Math.abs(fpAsInt);
    if (fieldNumber <= 0) {
      asText += 'Endzone';
    } else {
      asText += `${fieldNumber}`;
    }

    return asText;
  };

  useEffect(() => {
    if (newPlay) {
      setFormData((prev) => ({ ...prev, sessionKey: user.sessionKey, gameId }));
    }
  }, [newPlay]);

  useEffect(() => {
    handleReset();
  }, [playEdit]);

  if (!newPlay) {
    return (
      <button type="button" onClick={() => setNewPlay((prev) => !prev)}>
        Add Play
      </button>
    );
  }

  return (
    <form className="playform" onSubmit={handleSubmit}>
      <div className="playform-team-select">
        <label>
          <input
            type="radio"
            name="teamId"
            readOnly
            value={homeTeam.id}
            checked={formData.teamId === homeTeam.id}
            onClick={(e) => {
              handleDisplayToggle();
              handleChange(e);
            }}
          />
          {homeTeam.locationName}
        </label>
        <div>Possession</div>
        <label>
          {awayTeam.locationName}
          <input
            type="radio"
            name="teamId"
            readOnly
            value={awayTeam.id}
            checked={formData.teamId === awayTeam.id}
            onClick={(e) => {
              handleDisplayToggle();
              handleChange(e);
            }}
          />
        </label>
      </div>
      <div className="playform-game-status">
        <input className="playform-game-period" name="gamePeriod" type="number" min={0} onChange={handleChange} placeholder="Quarter" value={formData.gamePeriod || 0} />
        <input
          className="playform-timebox"
          name="clockStart-minutes"
          type="number"
          min={0}
          max={99}
          value={Math.floor((formData.clockStart || 0) / 60)
            .toString()
            .padStart(2, 0)}
          onChange={handleClockChange}
        />
        <input className="playform-timebox" name="clockStart-seconds" type="number" min={formData.clockStart === 0 ? 0 : -1} max={60} value={((formData.clockStart || 0) % 60).toString().padStart(2, '0')} onChange={handleClockChange} />
        <select name="down" onChange={handleChange} value={formData.down}>
          <option value={0}>None</option>
          <option value={1}>1st</option>
          <option value={2}>2nd</option>
          <option value={3}>3rd</option>
          <option value={4}>4th</option>
        </select>
        {!!formData.down && <div className="playform-to-go"> & {Math.abs(formData.toGain) === 50 ? 'Goal' : (formData.toGain - formData.fieldPositionStart) * (formData.teamId === awayTeam.id ? -1 : 1)}</div>}
        <div className="playform-line-of-scrimmage">on {fieldPositionToString(formData.fieldPositionStart)}</div>
      </div>
      <div className="field-position-slider">
        <div>
          <i>Starting Field Position</i>
        </div>
        <input className={`playform-fieldPosition slider-${formData.teamId === homeTeam.id ? 'home' : 'away'}`} type="range" name="fieldPositionStart" min="-50" max="50" onChange={handleChange} value={formData.fieldPositionStart || 0} />
      </div>
      <div className="field-position-slider">
        <div>
          <i>To Gain:</i> {fieldPositionToString(formData.toGain)}
        </div>
        <input className="playform-fieldPosition" type="range" name="toGain" min="-50" max="50" onChange={handleChange} style={{ border: '1px solid red' }} value={formData.toGain || 0} />
      </div>
      <div className="playform-type-radios">
        <label>
          <input type="radio" name="pass" readOnly value={!formDisplay.pass} checked={formDisplay.pass} onClick={handleDisplayToggle} />
          Pass
        </label>
        <label>
          <input type="radio" name="rush" readOnly value={!formDisplay.rush} checked={formDisplay.rush} onClick={handleDisplayToggle} />
          Rush
        </label>
        <label>
          <input type="radio" name="punt" readOnly value={!formDisplay.punt} checked={formDisplay.punt} onClick={handleDisplayToggle} />
          Punt
        </label>
        <label>
          <input type="radio" name="fieldgoal" readOnly value={!formDisplay.fieldgoal} checked={formDisplay.fieldgoal} onClick={handleDisplayToggle} />
          Field Goal
        </label>
        <label>
          <input type="radio" name="kickoff" readOnly value={!formDisplay.kickoff} checked={formDisplay.kickoff} onClick={handleDisplayToggle} />
          Kickoff
        </label>
      </div>
      {formDisplay.pass && (
        <div className="pf-pass">
          Passer:
          <PlayerSelect name="passerId" players={(formData.teamId === homeTeam.id ? homeTeam : awayTeam).players} onChange={handleChange} value={formData.passerId || 'null'} />
          Receiver:
          <PlayerSelect name="receiverId" players={(formData.teamId === homeTeam.id ? homeTeam : awayTeam).players} onChange={handleChange} value={formData.receiverId || 'null'} />
          <label>
            Complete:
            <input type="checkbox" name="completion" value={!formData.completion} checked={formData.completion} onChange={handleBoolChange} />
          </label>
        </div>
      )}
      {formDisplay.rush && <div>IT&apos;S A RUSH</div>}
      {formDisplay.punt && <div>IT&apos;S A PUNT</div>}
      {formDisplay.fieldgoal && <div>IT&apos;S A FIELD GOAL</div>}
      {formDisplay.kickoff && <div>IT&apos;S A KICKOFF</div>}
      <input
        className="playform-timebox"
        name="clockEnd-minutes"
        type="number"
        min={0}
        value={Math.floor((formData.clockEnd || 0) / 60)
          .toString()
          .padStart(2, 0)}
        onChange={handleClockChange}
      />
      <input className="playform-timebox" name="clockEnd-seconds" type="number" min={!formData.clockEnd ? 0 : -1} max={60} value={((formData.clockEnd || 0) % 60).toString().padStart(2, '0')} onChange={handleClockChange} />
      <div>
        <i>Ending Field Position:</i> {fieldPositionToString(formData.fieldPositionEnd)}
      </div>
      <div className="field-position-slider">
        <input className="playform-fieldPosition" type="range" name="fieldPositionEnd" min="-50" max="50" onChange={handleChange} value={formData.fieldPositionEnd || 0} />
      </div>
      <div className="playform-buttons">
        <button type="submit">Submit</button>
        <button type="button" onClick={handleReset}>
          Reset
        </button>
        <button type="button" onClick={() => setNewPlay(false)}>
          Collapse
        </button>
      </div>
    </form>
  );
}

PlayForm.propTypes = {
  gameId: PropTypes.number,
  homeTeam: PropTypes.shape({
    id: PropTypes.number,
    locationName: PropTypes.string,
    nickname: PropTypes.string,
    colorPrimaryHex: PropTypes.string,
    colorSecondaryHex: PropTypes.string,
    players: PropTypes.arrayOf({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      teamId: PropTypes.number,
      jerseyNumber: PropTypes.number,
    }),
  }).isRequired,
  awayTeam: PropTypes.shape({
    id: PropTypes.number,
    locationName: PropTypes.string,
    nickname: PropTypes.string,
    colorPrimaryHex: PropTypes.string,
    colorSecondaryHex: PropTypes.string,
    players: PropTypes.arrayOf({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      teamId: PropTypes.number,
      jerseyNumber: PropTypes.number,
    }),
  }).isRequired,
  playEdit: PropTypes.shape({
    id: PropTypes.number,
    prevPlayId: PropTypes.number,
    gameId: PropTypes.number,
    teamId: PropTypes.number,
    fieldPositionStart: PropTypes.number,
    fieldPositionEnd: PropTypes.number,
    down: PropTypes.number,
    toGain: PropTypes.number,
    clockStart: PropTypes.number,
    clockEnd: PropTypes.number,
    gamePeriod: PropTypes.number,
    notes: PropTypes.string,
    passerId: PropTypes.number,
    receiverId: PropTypes.number,
    completion: PropTypes.bool,
    rusherId: PropTypes.number,
    tacklerIds: PropTypes.arrayOf(PropTypes.number),
    passDefenderIds: PropTypes.arrayOf(PropTypes.number),
    kickoff: PropTypes.bool,
    punt: PropTypes.bool,
    fieldGoal: PropTypes.bool,
    kickerId: PropTypes.number,
    kickReturnerId: PropTypes.number,
    kickFieldedAt: PropTypes.number,
    kickFairCatch: PropTypes.bool,
    kickGood: PropTypes.bool,
    kickTouchback: PropTypes.bool,
    kickFake: PropTypes.bool,
    touchdownPlayerId: PropTypes.number,
    extraPoint: PropTypes.bool,
    conversion: PropTypes.bool,
    extraPointKickerId: PropTypes.number,
    extraPointGood: PropTypes.bool,
    extraPointFake: PropTypes.bool,
    conversionPasserId: PropTypes.number,
    conversionReceiverId: PropTypes.number,
    conversionRusherId: PropTypes.number,
    conversionGood: PropTypes.bool,
    defensiveConversion: PropTypes.bool,
    conversionReturnerId: PropTypes.number,
    safety: PropTypes.bool,
    cedingPlayerId: PropTypes.number,
    fumbles: PropTypes.shape({
      id: PropTypes.number,
      playId: PropTypes.number,
      fumbleCommittedById: PropTypes.number,
      fumbledAt: PropTypes.number,
      fumbleForcedById: PropTypes.number,
      fmbleRecoveredById: PropTypes.number,
      fumbleRecoveredAt: PropTypes.number,
    }),
    interceptedById: PropTypes.number,
    interceptedAt: PropTypes.number,
    kickBlocked: PropTypes.bool,
    kickBlockedById: PropTypes.number,
    kickBlockRecoveredById: PropTypes.number,
    kickBlockRecoveredAt: PropTypes.number,
    laterals: PropTypes.shape({
      id: PropTypes.number,
      playId: PropTypes.number,
      prevCarrierId: PropTypes.number,
      newCarrierId: PropTypes.number,
      possessionAt: PropTypes.number,
      carriedTo: PropTypes.number,
    }),
    penalties: PropTypes.shape({
      id: PropTypes.number,
      playId: PropTypes.number,
      penaltyId: PropTypes.number,
      playerId: PropTypes.number,
      teamId: PropTypes.number,
      enforced: PropTypes.bool,
      enforcedFrom: PropTypes.number,
      noPlay: PropTypes.bool,
      lossOfDown: PropTypes.bool,
      autoFirstDown: PropTypes.bool,
      yardage: PropTypes.number,
    }),
    sessionKey: PropTypes.string,
  }),
};
