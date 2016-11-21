import React from 'react'
import './NAICSCompatibilityModal.css'

function NAICSCompatibilityModal (props) {
  return (
    <div className="compatibility-modal-container">
      <div className="compatibility-modal-background" onClick={props.closeModal} />
      <div className="compatibility-modal">
        <div className="compatibility-modal-text">
          <p>WRITEME</p>
        </div>
        <div className="compatibility-modal-buttons">
          <button onClick={props.closeModal}>OK</button>
        </div>
      </div>
    </div>
  )
}

NAICSCompatibilityModal.propTypes = {
  closeModal: React.PropTypes.func.isRequired
}

export default NAICSCompatibilityModal
