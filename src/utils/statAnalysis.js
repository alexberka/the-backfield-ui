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

  return null;
};

const parsePossessionChanges = (formData) => {
  const possessionChanges = [];
  if (formData.kickerId !== null && !formData.kickFake) {
    possessionChanges.push({
      ballFrom: null,
      ballTo: formData.kickerId,
    });
    if (formData.kickBlocked) {
      possessionChanges.push({
        ballFrom: formData.kickerId,
        ballTo: formData.kickBlockRecoveredById,
      });
    } else {
      possessionChanges.push({
        ballFrom: formData.kickerId,
        ballTo: formData.kickReturnerId,
      });
    }
  } else if (formData.passerId !== null) {
    possessionChanges.push({
      ballFrom: null,
      ballTo: formData.passerId,
    });
    let ballTo = null;
    if (formData.completion) {
      ballTo = formData.receiverId;
    } else if (formData.interceptedById) {
      ballTo = formData.interceptedById;
    }
    possessionChanges.push({
      ballFrom: formData.passerId,
      ballTo,
    });
  } else if (formData.rusherId !== null) {
    possessionChanges.push({
      ballFrom: null,
      ballTo: formData.rusherId,
    });
  }

  if (formData.fumbles.length === 0 && formData.laterals.length === 0) {
    return [possessionChanges];
  }

  const toPlace = [];

  formData.fumbles?.forEach((fumble) => {
    if (fumble.fumbleCommittedById !== fumble.fumbleRecoveredById) {
      toPlace.push({
        ballFrom: fumble.fumbleCommittedById,
        ballTo: fumble.fumbleRecoveredById,
        placed: false,
        id: `fumble-${fumble.id}`,
        changeIndex: toPlace.length + 1,
      });
    }
  });
  formData.laterals?.forEach((lateral) => {
    toPlace.push({
      ballFrom: lateral.prevCarrierId,
      ballTo: lateral.newCarrierId,
      placed: false,
      id: `lateral-${lateral.id}`,
      changeIndex: toPlace.length + 1,
    });
  });

  const paths = [[]];

  const checkPlacementLayer = (compareLength) => {
    if (toPlace.length === 0) {
      return true;
    }
    paths
      .filter((p) => p.length === compareLength - 1)
      .forEach((p) => {
        let afterPlayerCompare = possessionChanges[possessionChanges.length - 1].ballTo;
        let beforePlayerCompare = possessionChanges[0].ballTo;
        if (p.some((index) => index > 0)) {
          const afterChangeIndices = p.filter((index) => index > 0);
          afterPlayerCompare = toPlace[afterChangeIndices[afterChangeIndices.length - 1] - 1].ballTo;
        }
        if (p.some((index) => index < 0)) {
          const beforeChangeIndices = p.filter((index) => index < 0);
          beforePlayerCompare = toPlace[Math.abs(beforeChangeIndices[beforeChangeIndices.length - 1]) - 1].ballFrom;
        }

        toPlace
          .filter((change) => !p.some((index) => Math.abs(index) === change.changeIndex))
          .forEach((change) => {
            if (change.ballFrom === afterPlayerCompare) {
              if (p.length === compareLength) {
                const divergence = p.slice(0, -1);
                divergence.push(change.changeIndex);
                paths.push(divergence);
              } else {
                p.push(change.changeIndex);
              }
            }
            if (change.ballTo === beforePlayerCompare) {
              if (p.length === compareLength) {
                const divergence = p.slice(0, -1);
                divergence.push(-1 * change.changeIndex);
                paths.push(divergence);
              } else {
                p.push(-1 * change.changeIndex);
              }
            }
          });
      });
    if (paths.some((path) => path.length === compareLength)) {
      if (compareLength === toPlace.length) {
        return true;
      }
      return checkPlacementLayer(compareLength + 1);
    }
    return false;
  };

  const fitFound = checkPlacementLayer(1);

  if (fitFound) {
    return paths
      .filter((path) => path.length === toPlace.length)
      .map((path) => {
        const newChain = [...possessionChanges];
        path.forEach((index) => {
          const addChange = toPlace.find((change) => change.changeIndex === Math.abs(index));
          if (index > 0) {
            newChain.push(addChange);
          } else {
            newChain.shift();
            newChain.unshift(addChange);
            newChain.unshift({
              ballFrom: null,
              ballTo: addChange.ballFrom,
            });
          }
        });
        return newChain;
      });
  }
  return [[]];
};

export { parsePlayerPossession, parsePossessionChanges };
