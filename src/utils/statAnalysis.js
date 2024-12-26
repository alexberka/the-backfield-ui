const parsePlayerPossession = (formData) => {
  const hasPossession = [];
  const cedesPossession = [];

  hasPossession.push(formData.passerId ?? 0);
  hasPossession.push(formData.completion ? (formData.receiverId ?? 0) : 0);
  hasPossession.push(formData.rusherId ?? 0);
  hasPossession.push(formData.kickReturnerId ?? 0);
  hasPossession.push(formData.interceptedById ?? 0);
  hasPossession.push(formData.kickBlockRecoveredById ?? 0);
  if (formData.fieldGoal && formData.kickGood) {
    hasPossession.push(formData.kickerId);
  }

  formData.fumbles?.forEach((fumble) => {
    cedesPossession.push(fumble.fumbleCommittedById);
    hasPossession.push(fumble.fumbleRecoveredById ?? 0);
  });
  formData.laterals?.forEach((lateral) => {
    cedesPossession.push(lateral.prevCarrierId);
    hasPossession.push(lateral.newCarrierId ?? 0);
  });

  if (formData?.completion || formData?.interceptedById != null) {
    cedesPossession.push(formData.passerId ?? 0);
  }
  const hasIds = hasPossession.filter((id) => id !== 0);
  const cedesIds = cedesPossession.filter((id) => id !== 0);

  cedesIds.forEach((id) => {
    if (hasIds.includes(id)) {
      const removeIndex = hasIds.indexOf(id);
      delete hasIds[removeIndex];
    }
  });

  const endPossession = hasIds.filter((id) => id !== undefined);

  if (endPossession.length === 1) {
    return endPossession[0];
  }
  if (formData.fieldGoal && formData.kickGood) {
    return formData.kickerId;
  }

  if (endPossession.length === 0 && formData.fumbles.length > 0) {
    const unrecoveredIndex = formData.fumbles.findIndex((f) => f.fumbleRecoveredById === null);
    if (unrecoveredIndex >= 0) {
      return formData.fumbles[unrecoveredIndex].fumbleCommittedById;
    }
  }
  // if (hasPossession.Count == 0)
  // {
  //     if (formData.FieldGoal && formData.KickGood)
  //     {
  //         return (formData.TeamId, false);
  //     }
  //     FumbleSubmitDTO? notRecovered = formData.Fumbles.SingleOrDefault(f => f.FumbleRecoveredById == null);
  //     if (notRecovered != null)
  //     {
  //         Player? fumbler = await _playerRepository.GetSinglePlayerAsync(notRecovered.FumbleCommittedById);
  //         if (fumbler == null || (fumbler.TeamId != homeTeamId && fumbler.TeamId != awayTeamId))
  //         {
  //             return (0, false);
  //         }
  //         if (Math.Abs(formData.FieldPositionEnd ?? 0) == 50)
  //         {
  //             return (fumbler.TeamId == homeTeamId ? awayTeamId : homeTeamId, false);
  //         }
  //         return (fumbler.TeamId, false);
  //     }
  //     if (((formData.Kickoff || formData.Punt) && formData.KickReturnerId == null)
  //         || (formData.KickBlocked && formData.KickBlockRecoveredById == null))
  //     {
  //         return (formData.TeamId == homeTeamId ? awayTeamId : homeTeamId, false);
  //     }
  //     return (0, true);
  // }

  return null;
  // if ((formData.TouchdownPlayerId != null && hasPossession[0] != formData.TouchdownPlayerId)
  //     || (formData.CedingPlayerId != null && hasPossession[0] != formData.CedingPlayerId))
  // {
  //     return (0, true);
  // }

  // Player? player = await _playerRepository.GetSinglePlayerAsync(hasPossession[0]);
  // if (player == null || (player.TeamId != homeTeamId && player.TeamId != awayTeamId))
  // {
  //     return (0, false);
  // }

  // return (player.TeamId == homeTeamId ? homeTeamId : awayTeamId, false);
};

const validatePlayData = (formData, homeTeam, awayTeam) => {
  if (formData.fieldPositionStart === null || formData.teamId === null || formData.gameId === null) {
    return null;
  }

  const updatedFormData = { ...formData };
  const playerId = parsePlayerPossession(formData);
  let playerWithBall = {};
  if (homeTeam?.players.filter((p) => p.id === playerId).length > 0) {
    const index = homeTeam.players.findIndex((p) => p.id === playerId);
    playerWithBall = { ...homeTeam.players[index] };
  } else if (awayTeam?.players.filter((p) => p.id === playerId).length > 0) {
    const index = awayTeam.players.findIndex((p) => p.id === playerId);
    playerWithBall = { ...awayTeam.players[index] };
  }

  if (formData.fieldPositionEnd === null && !formData.kickGood) {
    return null;
  }
  if (formData.fieldGoal && formData.kickGood) {
    updatedFormData.fieldPositionEnd = 50 * (playerWithBall.teamId === homeTeam.id ? 1 : -1);
  }

  if ((playerWithBall.teamId === homeTeam.id && formData.fieldPositionEnd === 50) || (playerWithBall.teamId === awayTeam.id && formData.fieldPositionEnd === -50)) {
    updatedFormData.touchdownPlayerId = playerWithBall.id;
  } else {
    updatedFormData.extraPoint = false;
    updatedFormData.conversion = false;
    updatedFormData.extraPointKickerId = null;
    updatedFormData.extraPointGood = false;
    updatedFormData.extraPointFake = false;
    updatedFormData.conversionPasserId = null;
    updatedFormData.conversionReceiverId = null;
    updatedFormData.conversionRusherId = null;
    updatedFormData.conversionGood = false;
    updatedFormData.defensiveConversion = false;
    updatedFormData.conversionReturnerId = null;
  }
  return updatedFormData;
};

export { parsePlayerPossession, validatePlayData };
