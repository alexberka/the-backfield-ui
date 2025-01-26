import React from 'react';
import PropTypes from 'prop-types';
import ModalWrapper from './ModalWrapper';

export default function DeletePlayModal({ onClose }) {
  return (
    <ModalWrapper onHide={onClose}>
      <div className="delete-play-modal std-mod">
        <p className="dp-mod-text">Are you sure you want to delete the last play? This action cannot be undone.</p>
        <div className="dp-mod-buttons">
          <button type="button" className="button" onClick={() => onClose('abort')}>
            Abort
          </button>
          <button type="button" className="button button-red" onClick={() => onClose('confirm')}>
            Confirm Delete
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}

DeletePlayModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};
