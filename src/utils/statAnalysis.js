const parsePlayerPossession = (formData) => {
  const hasPossession = [];
  const cedesPossession = [];

  hasPossession.push(formData.passerId ?? 0);
  hasPossession.push(formData.completion ? (formData.receiverId ?? 0) : 0);
  hasPossession.push(formData.rusherId ?? 0);
  hasPossession.push(formData.kickReturnerId ?? 0);
  hasPossession.push(formData.interceptedById ?? 0);
  hasPossession.push(formData.kickBlockRecoveredById ?? 0);

  // foreach (FumbleSubmitDTO fumble in formData.Fumbles)
  // {
  //     cedesPossession.push(fumble.FumbleCommittedById);
  //     hasPossession.push(fumble.FumbleRecoveredById ?? 0);
  // }
  // foreach (LateralSubmitDTO lateral in formData.Laterals)
  // {
  //     cedesPossession.push(lateral.PrevCarrierId);
  //     hasPossession.push(lateral.NewCarrierId);
  // }
  if (formData?.completion || formData?.interceptedById != null) {
    cedesPossession.push(formData.passerId ?? 0);
  }
  const hasIds = hasPossession.filter((id) => id !== 0);
  const cedesIds = cedesPossession.filter((id) => id !== 0);

  cedesIds.foreach((id) => {
    if (hasIds.includes(id)) {
      const removeIndex = hasIds.indexOf(id);
      delete hasIds[removeIndex];
    }
  });

  const endPossession = hasIds.filter((id) => id !== undefined);

  if (endPossession.length === 1) {
    return endPossession[0];
  } if (formData.fieldGoal && formData.kickGood) {
    return formData.kickerId;
  }

  return null;
  // if (hasPossession.Count > 1)
  // {
  //     return (0, true);
  // }

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

export default parsePlayerPossession;
