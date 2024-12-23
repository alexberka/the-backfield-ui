/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../utils/context/authContext';
import { createPlay } from '../../api/playData';
import PlayerSelect from '../PlayerSelect';
import FieldPositionSlider from '../FieldPositionSlider';
import { parsePlayerPossession, validatePlayData } from '../../utils/statAnalysis';
import PlayerMultiSelect from '../PlayerMultiSelect';
import getAllPenalties from '../../api/penaltyData';

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

const initialFumbleCreator = {
  id: null,
  fumbleCommittedById: null,
  fumbledAt: null,
  fumbleForcedById: null,
  fumbleRecoveredById: null,
  fumbleRecoveredAt: null,
};

const initialLateralCreator = {
  id: null,
  prevCarrierId: null,
  newCarrierId: null,
  possessionAt: null,
  carriedTo: null,
};

const initialPenaltyCreator = {
  id: null,
  penaltyId: null,
  playerId: null,
  teamId: null,
  enforced: false,
  enforcedFrom: null,
  noPlay: false,
  lossOfDown: false,
  autoFirstDown: false,
  yardage: null,
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
  twoPointPass: false,
  twoPointRush: false,
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
  const [playerWithBall, setPlayerWithBall] = useState({});
  const [fumbleCreator, setFumbleCreator] = useState(initialFumbleCreator);
  const [lateralCreator, setLateralCreator] = useState(initialLateralCreator);
  const [penaltyCreator, setPenaltyCreator] = useState(initialPenaltyCreator);
  const [penalties, setPenalties] = useState([]);

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

  const playerById = (playerId) => {
    if (homeTeam?.players.filter((p) => p.id === playerId).length > 0) {
      const index = homeTeam.players.findIndex((p) => p.id === playerId);
      return homeTeam.players[index];
    }
    if (awayTeam?.players.filter((p) => p.id === playerId).length > 0) {
      const index = awayTeam.players.findIndex((p) => p.id === playerId);
      return awayTeam.players[index];
    }
    return {};
  };

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
    } else if (name.toLowerCase().includes('twopoint')) {
      setFormDisplay((prev) => ({ ...prev, twoPointPass: false, twoPointRush: false, [name]: value !== 'false' }));
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
    if (Array.isArray(value)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else if (value === 'true' || value === 'false') {
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

  const handleFumbleChange = (e) => {
    const { name, value } = e.target;
    setFumbleCreator((prev) => ({ ...prev, [name]: value !== 'null' ? Number(value) : null }));
  };

  const handleFumbleAdd = () => {
    if (fumbleCreator.fumbleCommittedById !== null) {
      let nextFumbleId = 0;
      formData.fumbles.forEach((fumble) => {
        if (fumble.id > nextFumbleId) {
          nextFumbleId = fumble.id;
        }
      });
      setFormData((prev) => ({
        ...prev,
        fumbles: [
          ...formData.fumbles,
          {
            ...fumbleCreator,
            id: nextFumbleId + 1,
          },
        ],
      }));
      setFumbleCreator(initialFumbleCreator);
    }
  };

  const handleFumbleRemove = (removeId) => {
    setFormData((prev) => ({
      ...prev,
      fumbles: formData.fumbles.filter((f) => f.id !== removeId),
    }));
  };

  const handleLateralChange = (e) => {
    const { name, value } = e.target;
    setLateralCreator((prev) => ({ ...prev, [name]: value !== 'null' ? Number(value) : null }));
  };

  const handleLateralAdd = () => {
    if (lateralCreator.prevCarrierId !== null && lateralCreator.newCarrierId !== null) {
      let nextLateralId = 0;
      formData.laterals.forEach((lateral) => {
        if (lateral.id > nextLateralId) {
          nextLateralId = lateral.id;
        }
      });
      setFormData((prev) => ({
        ...prev,
        laterals: [
          ...formData.laterals,
          {
            ...lateralCreator,
            id: nextLateralId + 1,
          },
        ],
      }));
      setLateralCreator(initialLateralCreator);
    }
  };

  const handleLateralRemove = (removeId) => {
    setFormData((prev) => ({
      ...prev,
      laterals: formData.laterals.filter((l) => l.id !== removeId),
    }));
  };

  const handlePlayPenaltyChange = (e) => {
    const { name, value } = e.target;
    const [key] = name.split('-');
    if (value === 'true' || value === 'false') {
      setPenaltyCreator((prev) => ({ ...prev, [key]: value !== 'false' }));
    } else {
      setPenaltyCreator((prev) => ({ ...prev, [key]: value !== 'null' ? Number(value) : null }));
    }

    if (key === 'playerId' && value !== 'null') {
      setPenaltyCreator((prev) => ({ ...prev, teamId: playerById(Number(value)).teamId }));
    }
    if (key === 'teamId' && playerById(penaltyCreator.playerId).teamId !== Number(value)) {
      setPenaltyCreator((prev) => ({ ...prev, playerId: null }));
    }

    if (key === 'penaltyId') {
      const index = penalties.findIndex((p) => p.id === Number(value));
      setPenaltyCreator((prev) => ({
        ...prev,
        noPlay: penalties[index].noPlay,
        lossOfDown: penalties[index].lossOfDown,
        autoFirstDown: penalties[index].autoFirstDown,
        yardage: penalties[index].yardage,
      }));
    }
  };

  const handlePlayPenaltyAdd = () => {
    if (penaltyCreator.teamId !== null && penaltyCreator.penaltyId !== null && (!penaltyCreator.enforced || (penaltyCreator.enforced && penaltyCreator.enforcedFrom != null))) {
      let nextPenaltyId = 0;
      formData.penalties.forEach((penalty) => {
        if (penalty.id > nextPenaltyId) {
          nextPenaltyId = penalty.id;
        }
      });
      setFormData((prev) => ({
        ...prev,
        penalties: [
          ...formData.penalties,
          {
            ...penaltyCreator,
            id: nextPenaltyId + 1,
          },
        ],
      }));
      setPenaltyCreator(initialPenaltyCreator);
    }
  };

  const handlePlayPenaltyRemove = (removeId) => {
    setFormData((prev) => ({
      ...prev,
      penalties: formData.penalties.filter((p) => p.id !== removeId),
    }));
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
    const validatedFormData = validatePlayData(formData, homeTeam, awayTeam);
    if (validatedFormData) {
      createPlay(validatedFormData).then(() => {
        onUpdate();
        allReset();
        setNewPlay((prev) => !prev);
      });
    }
  };

  useEffect(() => {
    if (newPlay) {
      setFormData((prev) => ({ ...prev, sessionKey: user.sessionKey, gameId }));
    }
  }, [newPlay]);

  useEffect(() => {
    allReset();
  }, [playEdit]);

  useEffect(() => {
    const playerId = parsePlayerPossession(formData);
    setPlayerWithBall(playerById(playerId));
  }, [formData]);

  useEffect(() => {
    getAllPenalties(user.sessionKey).then(setPenalties);
  }, []);

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
        {/* {!formData.kickoff && ( */}
        <select name="down" onChange={handleChange} value={formData.down} disabled={formDisplay.kickoff}>
          <option value={0}>No Down</option>
          <option value={1}>1st</option>
          <option value={2}>2nd</option>
          <option value={3}>3rd</option>
          <option value={4}>4th</option>
        </select>
        {/* )} */}
        {/* {!!formData.down && ( */}
        <div className="playform-to-go"> & {Math.abs(formData.toGain) === 50 ? 'Goal' : (formData.toGain - formData.fieldPositionStart) * (formData.teamId === awayTeam.id ? -1 : 1)}</div>
        {/* )} */}
        {/* {formData.fieldPositionStart !== null && ( */}
        <div className="playform-line-of-scrimmage">
          {formData.kickoff && 'Ball'} on {fieldPositionToString(formData.fieldPositionStart)}
        </div>
        {/* )} */}
      </div>
      <FieldPositionSlider name="fieldPositionStart" value={formData?.fieldPositionStart} onChange={handleChange} possession={formData.teamId === homeTeam.id ? 'home' : 'away'} clearOption={false} />
      {/* {formData.down !== 0 && ( */}
      <div>
        <div>
          <i>To Gain</i> {fieldPositionToString(formData.toGain)}
        </div>
        <FieldPositionSlider name="toGain" value={formData?.toGain} onChange={handleChange} color="red" clearOption={false} />
      </div>
      {/* )} */}
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
      {/* {formDisplay.punt && ( */}
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
        {/* {!formData.kickFake && ( */}
        <div>
          <p>Returner:</p>
          <PlayerSelect name="kickReturnerId" players={(formData.teamId === homeTeam.id ? awayTeam : homeTeam).players} onChange={handleChange} value={formData.kickReturnerId || 'null'} />
        </div>
        {/* )} */}
        {/* {!formData.kickFake && ( */}
        <div>
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
            Fair Catch
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
        </div>
        {/* )} */}
        {/* {!formData.kickFake && ( */}
        <FieldPositionSlider name="kickFieldedAt" value={formData?.kickFieldedAt} onChange={handleChange} possession={formData.teamId === homeTeam.id ? 'away' : 'home'} />
        {/* )} */}
      </div>
      {/* )} */}
      {/* {formDisplay.fieldGoal && ( */}
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
        {/* {!formData.kickFake && ( */}
        <label>
          <p>Good</p>
          <input type="checkbox" name="kickGood" value={!formData.kickGood} checked={formData.kickGood} onChange={handleChange} />
        </label>
        {/* )} */}
      </div>
      {/* )} */}
      <div className="pf-kickblock">
        <label>
          <p>Blocked</p>
          <input type="checkbox" name="kickBlocked" value={!formData.kickBlocked} checked={formData.kickBlocked} onChange={handleChange} />
        </label>
        <div>
          <p>Blocked by</p>
          <PlayerSelect name="kickBlockedById" players={(formData.teamId === homeTeam.id ? awayTeam : homeTeam).players} onChange={handleChange} value={formData.kickBlockedById || 'null'} />
          <p>Recovered by</p>
          <PlayerSelect name="kickBlockRecoveredById" players={[...homeTeam.players, ...awayTeam.players]} onChange={handleChange} value={formData.kickBlockRecoveredById || 'null'} />
          <div>at {fieldPositionToString(formData.kickBlockRecoveredAt)}</div>
        </div>
        <FieldPositionSlider name="kickBlockRecoveredAt" value={formData?.kickBlockRecoveredAt} onChange={handleChange} possession={playerById(formData.kickBlockRecoveredById)?.teamId === homeTeam.id ? 'home' : 'away'} />
      </div>
      {/* {formData.kickFake && ( */}
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
      {/* )} */}
      {/* {(formDisplay.pass || formDisplay.fakeToPass) && ( */}
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
        <p>Pass Defenders</p>
        <PlayerMultiSelect name="passDefenderIds" players={(formData.teamId === homeTeam.id ? awayTeam : homeTeam).players} onChange={handleChange} value={formData.passDefenderIds} />
        {/* {formDisplay?.interception && ( */}
        <div className="playform-interception">
          <div className="pf-int-statline">
            <p>Intercepted by</p>
            <PlayerSelect name="interceptedById" players={(formData.teamId === homeTeam.id ? awayTeam : homeTeam).players} onChange={handleChange} value={formData.interceptedById || 'null'} />
            <div>at {fieldPositionToString(formData.interceptedAt)}</div>
          </div>
          <FieldPositionSlider name="interceptedAt" value={formData?.interceptedAt} onChange={handleChange} possession={formData.teamId === homeTeam.id ? 'away' : 'home'} />
        </div>
        {/* )} */}
      </div>
      {/* )} */}
      {/* {(formDisplay.rush || formDisplay.fakeToRush) && ( */}
      <div className="pf-rush">
        <p>Rusher:</p>
        <PlayerSelect name="rusherId" players={(formData.teamId === homeTeam.id ? homeTeam : awayTeam).players} onChange={handleChange} value={formData.rusherId || 'null'} />
      </div>
      {/* )} */}
      {/* {formDisplay.kickoff && ( */}
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
        {/* {!formData.kickTouchback && ( */}
        <div>
          <div>
            <i>Fielded at</i> {fieldPositionToString(formData.kickFieldedAt)}
          </div>
          <FieldPositionSlider name="kickFieldedAt" value={formData?.kickFieldedAt} onChange={handleChange} possession={formData.teamId === homeTeam.id ? 'away' : 'home'} />
        </div>
        {/* )} */}
      </div>
      {/* )} */}
      <div className="pf-laterals">
        <p>Laterals</p>
        <div>
          <p>From</p>
          <PlayerSelect name="prevCarrierId" players={[...(playerById(lateralCreator.newCarrierId)?.teamId === awayTeam.id ? [] : homeTeam.players.filter((p) => p.id !== lateralCreator.newCarrierId)), ...(playerById(lateralCreator.newCarrierId)?.teamId === homeTeam.id ? [] : awayTeam.players.filter((p) => p.id !== lateralCreator.newCarrierId))]} onChange={handleLateralChange} value={lateralCreator.prevCarrierId || 'null'} />
          <p>to</p>
          <PlayerSelect name="newCarrierId" players={[...(playerById(lateralCreator.prevCarrierId)?.teamId === awayTeam.id ? [] : homeTeam.players.filter((p) => p.id !== lateralCreator.prevCarrierId)), ...(playerById(lateralCreator.prevCarrierId)?.teamId === homeTeam.id ? [] : awayTeam.players.filter((p) => p.id !== lateralCreator.prevCarrierId))]} onChange={handleLateralChange} value={lateralCreator.newCarrierId || 'null'} />
          <p>at {fieldPositionToString(lateralCreator.possessionAt)}</p>
          <FieldPositionSlider name="possessionAt" value={lateralCreator?.possessionAt} onChange={handleLateralChange} possession={lateralCreator.newCarrierId && (playerById(lateralCreator.newCarrierId).teamId === homeTeam.id ? 'home' : 'away')} />
          <p>Advanced to {fieldPositionToString(fumbleCreator.fumbleRecoveredAt)}</p>
          <FieldPositionSlider name="carriedTo" value={lateralCreator?.carriedTo} onChange={handleLateralChange} possession={lateralCreator.newCarrierId && (playerById(lateralCreator.newCarrierId).teamId === homeTeam.id ? 'home' : 'away')} />
          <button type="button" onClick={handleLateralAdd}>
            Add
          </button>
        </div>
        <div>
          {formData.laterals.map((l) => {
            const prevCarrier = playerById(l.prevCarrierId);
            const newCarrier = playerById(l.newCarrierId);
            return (
              <div key={l.id}>
                <p>
                  {prevCarrier.lastName}, {prevCarrier?.firstName[0]}. #{prevCarrier.jerseyNumber} lateral to {newCarrier.lastName}, {newCarrier?.firstName[0]}. #{newCarrier.jerseyNumber}
                  {l.possessionAt !== null ? ` at ${fieldPositionToString(l.possessionAt)}` : ''}.{l.carriedTo !== null && l.possessionAt != null && ` Advanced ${(l.carriedTo - l.possessionAt) * (newCarrier.teamId === homeTeam.id ? 1 : -1)} yard${Math.abs(l.carriedTo - l.possessionAt) !== 1 && 's'} to ${fieldPositionToString(l.carriedTo)}.`}
                </p>
                <button type="button" onClick={() => handleLateralRemove(l.id)}>
                  X
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="pf-fumbles">
        <p>Fumbles</p>
        <div>
          <p>Committed by</p>
          <PlayerSelect name="fumbleCommittedById" players={[...homeTeam.players, ...awayTeam.players]} onChange={handleFumbleChange} value={fumbleCreator.fumbleCommittedById || 'null'} />
          <p>Forced by</p>
          <PlayerSelect name="fumbleForcedById" players={[...homeTeam.players, ...awayTeam.players]} onChange={handleFumbleChange} value={fumbleCreator.fumbleForcedById || 'null'} />
          <p>at {fieldPositionToString(fumbleCreator.fumbledAt)}</p>
          <FieldPositionSlider name="fumbledAt" value={fumbleCreator?.fumbledAt} onChange={handleFumbleChange} possession={fumbleCreator.fumbleCommittedById && (playerById(fumbleCreator.fumbleCommittedById).teamId === homeTeam.id ? 'home' : 'away')} />
          <p>Recovered by</p>
          <PlayerSelect name="fumbleRecoveredById" players={[...homeTeam.players, ...awayTeam.players]} onChange={handleFumbleChange} value={fumbleCreator.fumbleRecoveredById || 'null'} />
          <p>at {fieldPositionToString(fumbleCreator.fumbleRecoveredAt)}</p>
          <FieldPositionSlider name="fumbleRecoveredAt" value={fumbleCreator?.fumbleRecoveredAt} onChange={handleFumbleChange} possession={fumbleCreator.fumbleRecoveredById && (playerById(fumbleCreator.fumbleRecoveredById).teamId === homeTeam.id ? 'home' : 'away')} />
          <button type="button" onClick={handleFumbleAdd}>
            Add
          </button>
        </div>
        <div>
          {formData.fumbles.map((f) => {
            const committedBy = playerById(f.fumbleCommittedById);
            const forcedBy = playerById(f.fumbleForcedById);
            const recoveredBy = playerById(f.fumbleRecoveredById);
            return (
              <div key={f.id}>
                <p>
                  {committedBy.lastName}, {committedBy?.firstName[0]}. #{committedBy.jerseyNumber} fumble{f.fumbledAt !== null ? ` at ${fieldPositionToString(f.fumbledAt)}` : ''}
                  {forcedBy.id !== undefined && `, Forced by ${forcedBy.lastName}, ${forcedBy?.firstName[0]}. #${forcedBy.jerseyNumber}`}
                </p>
                {recoveredBy.id !== undefined && (
                  <p>
                    Recovered by {recoveredBy.lastName}, {recoveredBy?.firstName[0]}. #{recoveredBy.jerseyNumber}
                    {f.fumbleRecoveredAt !== null ? ` at ${fieldPositionToString(f.fumbleRecoveredAt)}` : ''}
                  </p>
                )}
                <button type="button" onClick={() => handleFumbleRemove(f.id)}>
                  X
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <p>Tacklers</p>
      <PlayerMultiSelect name="tacklerIds" players={(playerWithBall.teamId === homeTeam.id ? awayTeam : homeTeam).players} onChange={handleChange} value={formData.tacklerIds} />
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
      {/* {!formData.kickGood && ( */}
      <div>
        <div>
          <i>Ending Field Position</i> {fieldPositionToString(formData.fieldPositionEnd)}
        </div>
        <FieldPositionSlider name="fieldPositionEnd" value={formData?.fieldPositionEnd} onChange={handleChange} possession={playerWithBall.teamId && (playerWithBall.teamId === homeTeam.id ? 'home' : 'away')} />
      </div>
      {/* )} */}
      <div className="pf-play-penalties">
        <p>Penalties</p>
        <div>
          <select className="penalty-select" name="penaltyId" onChange={handlePlayPenaltyChange} value={penaltyCreator.penaltyId || 1}>
            {penalties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <div>
            <label>
              <input type="radio" name="teamId-penalty" value={homeTeam.id} checked={penaltyCreator.teamId === homeTeam.id} readOnly onClick={handlePlayPenaltyChange} />
              {homeTeam.locationName}
            </label>
            <label>
              {awayTeam.locationName}
              <input type="radio" name="teamId-penalty" value={awayTeam.id} checked={penaltyCreator.teamId === awayTeam.id} onChange={handlePlayPenaltyChange} />
            </label>
          </div>
          <p>Penalized Player</p>
          <PlayerSelect name="playerId" players={[...(penaltyCreator.teamId !== homeTeam.id ? awayTeam.players : []), ...(penaltyCreator.teamId !== awayTeam.id ? homeTeam.players : [])]} onChange={handlePlayPenaltyChange} value={penaltyCreator.playerId || 'null'} />
          <label>
            Enforced:
            <input type="checkbox" name="enforced" value={!penaltyCreator.enforced} checked={penaltyCreator.enforced} onChange={handlePlayPenaltyChange} />
          </label>
          <p>Enforced at {fieldPositionToString(penaltyCreator.enforcedFrom)}</p>
          <FieldPositionSlider name="enforcedFrom" value={penaltyCreator?.enforcedFrom} onChange={handlePlayPenaltyChange} possession={penaltyCreator.teamId !== null && (penaltyCreator.teamId === homeTeam.id ? 'away' : 'home')} />
          <label>
            <p>Yardage</p>
            <input type="number" name="yardage" min={0} max={100} value={penaltyCreator.yardage || 0} onChange={handlePlayPenaltyChange} />
          </label>
          <label>
            No Play:
            <input type="checkbox" name="noPlay" value={!penaltyCreator.noPlay} checked={penaltyCreator.noPlay} onChange={handlePlayPenaltyChange} />
          </label>
          <label>
            Loss Of Down:
            <input type="checkbox" name="lossOfDown" value={!penaltyCreator.lossOfDown} checked={penaltyCreator.lossOfDown} onChange={handlePlayPenaltyChange} />
          </label>
          <label>
            Automatic First Down:
            <input type="checkbox" name="autoFirstDown" value={!penaltyCreator.autoFirstDown} checked={penaltyCreator.autoFirstDown} onChange={handlePlayPenaltyChange} />
          </label>
          <button type="button" onClick={handlePlayPenaltyAdd}>
            Add
          </button>
        </div>
        <div>
          {formData.penalties.map((pp) => {
            const player = playerById(pp.playerId);
            const penaltyIndex = penalties.findIndex((penalty) => penalty.id === pp.penaltyId);
            const playPenaltyName = penalties[penaltyIndex].name;
            const teamName = pp.teamId === homeTeam.id ? homeTeam.locationName : awayTeam.locationName;
            return (
              <div key={pp.id}>
                <p>
                  {playPenaltyName}, {teamName}
                  {player.id ? ` (${player.lastName}, ${player?.firstName[0]}. #${player.jerseyNumber})` : ''}.{pp.enforced ? ` Enforced ${pp.yardage} yard${Math.abs(pp.yardage) !== 1 && 's'} from ${fieldPositionToString(pp.enforcedFrom)}.${pp.noPlay ? ' No Play.' : ''}${pp.lossOfDown ? ' Loss of Down.' : ''}${pp.autoFirstDown ? ' Automatic First Down.' : ''}` : ' Declined.'}
                </p>
                {/* <p>
                  {prevCarrier.lastName}, {prevCarrier?.firstName[0]}. #{prevCarrier.jerseyNumber} lateral to {newCarrier.lastName}, {newCarrier?.firstName[0]}. #{newCarrier.jerseyNumber}
                  {l.possessionAt !== null ? ` at ${fieldPositionToString(l.possessionAt)}` : ''}.{l.carriedTo !== null && l.possessionAt != null && ` Advanced ${(l.carriedTo - l.possessionAt) * (newCarrier.teamId === homeTeam.id ? 1 : -1)} yard${Math.abs(l.carriedTo - l.possessionAt) !== 1 && 's'} to ${fieldPositionToString(l.carriedTo)}.`}
                </p> */}
                <button type="button" onClick={() => handlePlayPenaltyRemove(pp.id)}>
                  X
                </button>
              </div>
            );
          })}
        </div>
      </div>
      {/* {!formData.fieldGoal && */}
      {((playerWithBall.teamId === homeTeam.id && formData.fieldPositionEnd === 50) || (playerWithBall.teamId === awayTeam.id && formData.fieldPositionEnd === -50)) && (
        // (
        <p>Touchdown {playerWithBall.teamId === homeTeam.id ? `${homeTeam.locationName} ${homeTeam.nickname}` : `${awayTeam.locationName} ${awayTeam.nickname}`}!</p>
      )}
      {((playerWithBall.teamId === homeTeam.id && formData.fieldPositionEnd === -50) || (playerWithBall.teamId === awayTeam.id && formData.fieldPositionEnd === 50)) && (
        // (
        <p>Safety {playerWithBall.teamId === homeTeam.id ? `${awayTeam.locationName} ${awayTeam.nickname}` : `${homeTeam.locationName} ${homeTeam.nickname}`}!</p>
      )}
      <div>
        <div className="pf-touchdown-toggles">
          <label>
            <input
              type="radio"
              name="extraPoint"
              readOnly
              value={!formData.extraPoint}
              checked={formData.extraPoint}
              onClick={(e) => {
                if (e.target.value === 'true') {
                  selectiveReset(['conversion', 'conversionPasserId', 'conversionReceiverId', 'conversionRusherId', 'defensiveConversion', 'conversionReturnerId']);
                } else {
                  selectiveReset(['extraPoint', 'extraPointGood', 'extraPointFake', 'defensiveConversion', 'extraPointKickerId']);
                }
                handleChange(e);
              }}
            />
            Extra Point
          </label>
          <label>
            <input
              type="radio"
              name="conversion"
              readOnly
              value={!formData.conversion}
              checked={formData.conversion}
              onClick={(e) => {
                if (e.target.value === 'true') {
                  selectiveReset(['extraPoint', 'extraPointGood', 'extraPointFake', 'defensiveConversion', 'extraPointKickerId']);
                } else {
                  selectiveReset(['conversion', 'conversionPasserId', 'conversionReceiverId', 'conversionRusherId', 'defensiveConversion', 'conversionReturnerId']);
                }
                handleChange(e);
              }}
            />
            2pt Conversion
          </label>
        </div>
        <div>
          <p>Kicker:</p>
          <PlayerSelect name="extraPointKickerId" players={(playerWithBall.teamId === homeTeam.id ? homeTeam : awayTeam).players} onChange={handleChange} value={formData.extraPointKickerId || 'null'} />
          <label>
            Extra Point Good:
            <input type="checkbox" name="extraPointGood" value={!formData.extraPointGood} checked={formData.extraPointGood} onChange={handleChange} />
          </label>
          <label>
            Fake:
            <input type="checkbox" name="extraPointFake" value={!formData.extraPointFake} checked={formData.extraPointFake} onChange={handleChange} />
          </label>
        </div>
        {/* {(formData.conversion || formData.extraPointFake) && ( */}
        <div className="pf-two-point-toggles">
          <label>
            <input type="radio" name="twoPointPass" readOnly value={!formDisplay.twoPointPass} checked={formDisplay.twoPointPass} onClick={handleDisplay} />
            Pass
          </label>
          <label>
            <input type="radio" name="twoPointRush" readOnly value={!formDisplay.twoPointRush} checked={formDisplay.twoPointRush} onClick={handleDisplay} />
            Rush
          </label>
        </div>
        <div>
          <p>Passer:</p>
          <PlayerSelect name="conversionPasserId" players={(playerWithBall.teamId === homeTeam.id ? homeTeam : awayTeam).players} onChange={handleChange} value={formData.conversionPasserId || 'null'} />
          <p>Receiver:</p>
          <PlayerSelect name="conversionReceiverId" players={(playerWithBall.teamId === homeTeam.id ? homeTeam : awayTeam).players} onChange={handleChange} value={formData.conversionReceiverId || 'null'} />
          <p>Rusher:</p>
          <PlayerSelect name="conversionRusherId" players={(playerWithBall.teamId === homeTeam.id ? homeTeam : awayTeam).players} onChange={handleChange} value={formData.conversionRusherId || 'null'} />
          <label>
            Conversion Good:
            <input type="checkbox" name="conversionGood" value={!formData.conversionGood} checked={formData.conversionGood} onChange={handleChange} />
          </label>
        </div>
        {/* )} */}
      </div>
      <div>
        <label>
          Defensive Conversion:
          <input type="checkbox" name="defensiveConversion" value={!formData.defensiveConversion} checked={formData.defensiveConversion} onChange={handleChange} />
        </label>
        <p>Returned by</p>
        <PlayerSelect name="conversionReturnerId" players={(playerWithBall.teamId === homeTeam.id ? awayTeam : homeTeam).players} onChange={handleChange} value={formData.conversionReturnerId || 'null'} />
      </div>
      {/* ) */}
      {/* )
        } */}
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
    sessionKey: PropTypes.string,
  }),
};
