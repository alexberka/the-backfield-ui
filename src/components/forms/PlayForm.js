/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../utils/context/authContext';
import { createPlay } from '../../api/playData';
import PlayerSelect from '../PlayerSelect';
import FieldPositionSlider from '../FieldPositionSlider';

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
  fieldGoal: false,
  punt: false,
  interception: false,
  fakeToPass: false,
  fakeToRush: false,
};

const retainPlay = {
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

export default function PlayForm({ gameId, homeTeam, awayTeam, onUpdate, playEdit = initialState }) {
  const [newPlay, setNewPlay] = useState(false);
  const [formData, setFormData] = useState({});
  const [formDisplay, setFormDisplay] = useState(initialDisplay);
  const { user } = useAuth();

  // const addToArray = (item, array) => {

  // }

  // const removeFromArray = (item, array) => {

  // }

  const handleDisplay = (e = { target: { name: '' } }) => {
    const { name, value } = e.target;
    if (name === 'pass' || name === 'rush' || name === 'fieldGoal' || name === 'kickoff' || name === 'punt') {
      let { down, toGain } = formData;

      if (!formDisplay.kickoff && name === 'kickoff') {
        down = 0;
        toGain = null;
      } else if (formDisplay.kickoff && (value === 'false' || name !== 'kickoff')) {
        down = playEdit.down || 0;
        toGain = playEdit.toGain || null;
      }

      setFormDisplay({ ...initialDisplay, [name]: value !== 'false' });
      setFormData((prev) => ({
        ...prev,
        ...retainPlay,
        down,
        toGain,
      }));

      if (name === 'fieldGoal' || name === 'kickoff' || name === 'punt') {
        setFormData((prev) => ({
          ...prev,
          [name]: value !== 'false',
        }));
      }
    } else if (name.toLowerCase().includes('fake')) {
      setFormDisplay((prev) => ({ ...prev, fakeToPass: false, fakeToRush: false, [name]: value !== 'false' }));

      if (value === 'false' || (value === 'true' && !formDisplay[name])) {
        setFormData((prev) => ({
          ...prev,
          ...retainPlay,
          kickerId: formData.kickerId,
          kickFake: name !== 'kickFake',
        }));
      }
    } else if (name === '') {
      setFormData((prev) => ({ ...prev, ...retainPlay }));
    } else if (value === 'true' || value === 'false') {
      setFormDisplay((prev) => ({ ...prev, [name]: value !== 'false' }));
    } else {
      setFormDisplay((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value === 'true' || value === 'false') {
      setFormData((prev) => ({
        ...prev,
        [name]: value !== 'false',
      }));
    } else if (!Number.isNaN(parseInt(value, 10)) && Number(value) !== null) {
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

  const handleClockChange = (e) => {
    const [name, place] = e.target.name.split('-');
    if (name === 'clockEnd' && formData.clockEnd === null && formData.clockStart !== null) {
      handleChange({ target: { name: 'clockEnd', value: formData.clockStart } });
    } else {
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
      if (name === 'clockStart' && value < formData.clockStart && formData.clockEnd === formData.clockStart) {
        handleChange({ target: { name: 'clockStart', value } });
        handleChange({ target: { name: 'clockEnd', value } });
      } else if (value !== null) {
        handleChange({ target: { name, value } });
      }
    }
  };

  const allReset = () => {
    const reset = playEdit || initialState;
    setFormData(() => ({ ...reset, sessionKey: user.sessionKey, gameId }));
    setFormDisplay(initialDisplay);
  };

  const selectiveReset = (keys = []) => {
    const resetValues = {};
    keys.forEach((key) => {
      resetValues[key] = playEdit[key] || initialState[key];
    });
    setFormData((prev) => ({ ...prev, ...resetValues }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.warn(formData);
    if (formData.fieldPositionStart != null && formData.fieldPositionEnd != null && formData.teamId != null && formData.gameId != null) {
      createPlay(formData).then(() => {
        onUpdate();
        allReset();
        setNewPlay((prev) => !prev);
      });
    }
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
    allReset();
  }, [playEdit]);

  if (!newPlay) {
    return (
      <div className="playform">
        <button type="button" onClick={() => setNewPlay((prev) => !prev)}>
          Add Play
        </button>
      </div>
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
              handleDisplay();
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
              handleDisplay();
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
        {!formData.kickoff && (
          <select name="down" onChange={handleChange} value={formData.down} disabled={formDisplay.kickoff}>
            <option value={0}>No Down</option>
            <option value={1}>1st</option>
            <option value={2}>2nd</option>
            <option value={3}>3rd</option>
            <option value={4}>4th</option>
          </select>
        )}
        {!!formData.down && <div className="playform-to-go"> & {Math.abs(formData.toGain) === 50 ? 'Goal' : (formData.toGain - formData.fieldPositionStart) * (formData.teamId === awayTeam.id ? -1 : 1)}</div>}
        {formData.fieldPositionStart !== null && (
          <div className="playform-line-of-scrimmage">
            {formData.kickoff && 'Ball'} on {fieldPositionToString(formData.fieldPositionStart)}
          </div>
        )}
      </div>
      <div>
        <i>Starting Field Position</i>
      </div>
      <FieldPositionSlider name="fieldPositionStart" value={formData?.fieldPositionStart} onChange={handleChange} possession={formData.teamId === homeTeam.id ? 'home' : 'away'} clearOption={false} />
      {formData.down !== 0 && (
        <>
          <div>
            <i>To Gain</i> {fieldPositionToString(formData.toGain)}
          </div>
          <FieldPositionSlider name="toGain" value={formData?.toGain} onChange={handleChange} color="red" clearOption={false} />
        </>
      )}
      <div className="playform-type-radios">
        <label>
          <input type="radio" name="pass" readOnly value={!formDisplay.pass} checked={formDisplay.pass} onClick={handleDisplay} />
          Pass
        </label>
        <label>
          <input type="radio" name="rush" readOnly value={!formDisplay.rush} checked={formDisplay.rush} onClick={handleDisplay} />
          Rush
        </label>
        <label>
          <input type="radio" name="punt" readOnly value={!formDisplay.punt} checked={formDisplay.punt} onClick={handleDisplay} />
          Punt
        </label>
        <label>
          <input type="radio" name="fieldGoal" readOnly value={!formDisplay.fieldGoal} checked={formDisplay.fieldGoal} onClick={handleDisplay} />
          Field Goal
        </label>
        <label>
          <input type="radio" name="kickoff" readOnly value={!formDisplay.kickoff} checked={formDisplay.kickoff} onClick={handleDisplay} />
          Kickoff
        </label>
      </div>
      {formDisplay.punt && (
        <div className="pf-punt">
          <p>Kicker:</p>
          <PlayerSelect name="kickerId" players={(formData.teamId === homeTeam.id ? homeTeam : awayTeam).players} onChange={handleChange} value={formData.kickerId || 'null'} />
          <label>
            Fake:
            <input
              type="checkbox"
              name="kickFake"
              value={!formData.kickFake}
              checked={formData.kickFake}
              onChange={(e) => {
                handleChange(e);
                if (e.target.value === 'true') {
                  selectiveReset(['kickFieldedAt', 'kickReturnerId', 'kickFairCatch', 'kickTouchback']);
                }
                if (e.target.value === 'false') {
                  handleDisplay(e);
                }
              }}
            />
          </label>
          {!formData.kickFake && (
            <>
              <p>Returner:</p>
              <PlayerSelect name="kickReturnerId" players={(formData.teamId === homeTeam.id ? awayTeam : homeTeam).players} onChange={handleChange} value={formData.kickReturnerId || 'null'} />
            </>
          )}
          {!formData.kickFake && (
            <>
              <label>
                <p>Touchback</p>
                <input
                  type="checkbox"
                  name="kickTouchback"
                  value={!formData.kickTouchback}
                  checked={formData.kickTouchback}
                  onChange={(e) => {
                    handleChange(e);
                    selectiveReset(['kickFieldedAt']);
                  }}
                />
              </label>
              <label>
                Fair Catch:
                <input
                  type="checkbox"
                  name="kickFairCatch"
                  value={!formData.kickFairCatch}
                  checked={formData.kickFairCatch}
                  onChange={(e) => {
                    handleChange(e);
                    selectiveReset(['kickFieldedAt']);
                  }}
                />
              </label>
            </>
          )}
          {!formData.kickFake && <FieldPositionSlider name="kickFieldedAt" value={formData?.kickFieldedAt} onChange={handleChange} possession={formData.teamId === homeTeam.id ? 'away' : 'home'} />}
        </div>
      )}
      {formDisplay.fieldGoal && (
        <div className="pf-fieldgoal">
          <p>Kicker:</p>
          <PlayerSelect name="kickerId" players={(formData.teamId === homeTeam.id ? homeTeam : awayTeam).players} onChange={handleChange} value={formData.kickerId || 'null'} />
          <label>
            <p>Fake</p>
            <input
              type="checkbox"
              name="kickFake"
              value={!formData.kickFake}
              checked={formData.kickFake}
              onChange={(e) => {
                handleChange(e);
                if (e.target.value === 'true') {
                  selectiveReset(['kickGood']);
                }
                if (e.target.value === 'false') {
                  handleDisplay(e);
                }
              }}
            />
          </label>
          {!formData.kickFake && (
            <label>
              <p>Good</p>
              <input type="checkbox" name="kickGood" value={!formData.kickGood} checked={formData.kickGood} onChange={handleChange} />
            </label>
          )}
        </div>
      )}
      {formData.kickFake && (
        <div className="pf-fake-play-toggles">
          <label>
            <input type="radio" name="fakeToPass" readOnly value={!formDisplay.fakeToPass} checked={formDisplay.fakeToPass} onClick={handleDisplay} />
            Pass
          </label>
          <label>
            <input type="radio" name="fakeToRush" readOnly value={!formDisplay.fakeToRush} checked={formDisplay.fakeToRush} onClick={handleDisplay} />
            Rush
          </label>
        </div>
      )}
      {(formDisplay.pass || formDisplay.fakeToPass) && (
        <div className="pf-pass">
          <div className="pf-pass-root">
            <p>Passer:</p>
            <PlayerSelect name="passerId" players={(formData.teamId === homeTeam.id ? homeTeam : awayTeam).players} onChange={handleChange} value={formData.passerId || 'null'} />
            <p>Receiver:</p>
            <PlayerSelect name="receiverId" players={(formData.teamId === homeTeam.id ? homeTeam : awayTeam).players} onChange={handleChange} value={formData.receiverId || 'null'} />
            <label>
              Complete:
              <input
                type="checkbox"
                name="completion"
                value={!formData.completion}
                checked={formData.completion}
                onChange={(e) => {
                  handleChange(e);
                  selectiveReset(['interceptedById', 'interceptedAt']);
                  handleDisplay({ target: { name: 'interception', value: 'false' } });
                }}
              />
            </label>
            <label>
              Interception:
              <input
                type="checkbox"
                name="interception"
                value={!formDisplay.interception}
                checked={formDisplay?.interception}
                onChange={(e) => {
                  handleDisplay(e);
                  selectiveReset(['completion']);
                }}
              />
            </label>
          </div>
          {/* <div>
            {formData.passDefenderIds.map((defenderId) => (
              <div key={defenderId}>{awayTeam.players.filter((player) => player.id === defenderId)}</div>
            ))}
            <PlayerSelect name="Id" onChange={handleChange} 
              players={(formData.teamId === homeTeam.id ? awayTeam : homeTeam).players.filter((p) => !formData.passDefenderIds.includes(p.id))} />
          </div> */}
          {formDisplay?.interception && (
            <div className="playform-interception">
              <div className="pf-int-statline">
                <p>Intercepted by</p>
                <PlayerSelect name="interceptedById" players={(formData.teamId === homeTeam.id ? awayTeam : homeTeam).players} onChange={handleChange} value={formData.interceptedById || 'null'} />
                <div>at: {fieldPositionToString(formData.interceptedAt)}</div>
              </div>
              <FieldPositionSlider name="interceptedAt" value={formData?.interceptedAt} onChange={handleChange} possession={formData.teamId === homeTeam.id ? 'away' : 'home'} />
            </div>
          )}
        </div>
      )}
      {(formDisplay.rush || formDisplay.fakeToRush) && (
        <div className="pf-rush">
          <p>Rusher:</p>
          <PlayerSelect name="rusherId" players={(formData.teamId === homeTeam.id ? homeTeam : awayTeam).players} onChange={handleChange} value={formData.rusherId || 'null'} />
        </div>
      )}
      {formDisplay.kickoff && (
        <div className="pf-kickoff">
          <p>Kicker:</p>
          <PlayerSelect name="kickerId" players={(formData.teamId === homeTeam.id ? homeTeam : awayTeam).players} onChange={handleChange} value={formData.kickerId || 'null'} />
          <p>Returner:</p>
          <PlayerSelect name="kickReturnerId" players={(formData.teamId === homeTeam.id ? awayTeam : homeTeam).players} onChange={handleChange} value={formData.kickReturnerId || 'null'} />
          <label>
            Touchback:
            <input
              type="checkbox"
              name="kickTouchback"
              value={!formData.kickTouchback}
              checked={formData.kickTouchback}
              onChange={(e) => {
                handleChange(e);
                handleChange({ target: { name: 'kickFieldedAt', value: 'null' } });
              }}
            />
          </label>
          {!formData.kickTouchback && (
            <>
              <div>
                <i>Fielded at</i> {fieldPositionToString(formData.kickFieldedAt)}
              </div>
              <FieldPositionSlider name="kickFieldedAt" value={formData?.kickFieldedAt} onChange={handleChange} possession={formData.teamId === homeTeam.id ? 'away' : 'home'} />
            </>
          )}
        </div>
      )}
      <input
        className="playform-timebox"
        name="clockEnd-minutes"
        type="number"
        min={0}
        max={Math.floor((formData.clockStart || 0) / 60)}
        value={
          formData.clockEnd === null
            ? ''
            : Math.floor((formData.clockEnd || 0) / 60)
                .toString()
                .padStart(2, 0)
        }
        onChange={handleClockChange}
      />
      <input className="playform-timebox" name="clockEnd-seconds" type="number" min={!formData.clockEnd ? 0 : -1} max={formData.clockEnd < formData.clockStart ? 60 : (formData.clockStart || 0) % 60} value={formData.clockEnd === null ? '' : ((formData.clockEnd || 0) % 60).toString().padStart(2, '0')} onChange={handleClockChange} />
      <div>
        <i>Ending Field Position</i> {fieldPositionToString(formData.fieldPositionEnd)}
      </div>
      <FieldPositionSlider name="fieldPositionEnd" value={formData?.fieldPositionEnd} onChange={handleChange} />
      <div className="playform-buttons">
        <button type="submit">Submit</button>
        <button type="button" onClick={allReset}>
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
  onUpdate: PropTypes.func.isRequired,
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
