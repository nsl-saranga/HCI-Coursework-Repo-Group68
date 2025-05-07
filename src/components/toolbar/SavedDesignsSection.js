"use client"

import { useEffect } from "react"
import { useAppContext } from "../../context/AppContext"
import useDesignManager from "../../hooks/useDesignManager"

const SavedDesignsSection = () => {
  const { currentDesignName } = useAppContext()
  const { 
    saveNewDesign, 
    loadSelectedDesign, 
    editSelectedDesign, 
    initiateDeleteDesign, 
    confirmDeleteDesign,
    cancelDeleteDesign,
    showConfirmDialog,
    designToDelete,
    updateSavedDesignsMenu 
  } = useDesignManager()

  useEffect(() => {
    updateSavedDesignsMenu()
  }, [currentDesignName])

  const handleLoadDesign = () => {
    loadSelectedDesign()
  }

  const handleSaveDesign = () => {
    saveNewDesign()
  }

  const handleDeleteDesign = () => {
    initiateDeleteDesign()
  }

  const handleEditDesign = () => {
    editSelectedDesign()
  }

  return (
    <div className="control-group">
      <h2 className="control-group-title">Saved Designs</h2>

      <div className="form-group">
        <select id="saved-designs-menu" size="5" defaultValue="">
          <option value="" disabled>
            Select a saved design
          </option>
        </select>

        <div className="form-group design-control-buttons">
          <button id="load-selected-btn" className="design-btn load-btn" onClick={handleLoadDesign}>
            <i className="ri-folder-open-line"></i>
            Load
          </button>
          <button id="delete-selected-btn" className="design-btn delete-btn" onClick={handleDeleteDesign}>
            <i className="ri-delete-bin-line"></i>
            Delete
          </button>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="design-name-input" className="toolbar-text">Design Name:</label>
        <input type="text" id="design-name-input" placeholder="Design name" />
      </div>

      <div className="form-group">
        <div className="form-group design-control-buttons">
          <button id="save-new-btn" className="design-btn save-btn" onClick={handleSaveDesign}>
            <i className="ri-save-line"></i>
            Save
          </button>
          <button id="edit-selected-btn" className="design-btn update-btn" onClick={handleEditDesign}>
            <i className="ri-refresh-line"></i>
            Update
          </button>
        </div>
      </div>

      {showConfirmDialog && (
        <div className="confirmation-dialog">
          <div className="confirmation-dialog-content">
            <p>Are you sure you want to delete "{designToDelete}"?</p>
            <div className="confirmation-buttons">
              <button onClick={confirmDeleteDesign} className="confirm-btn">
                Yes, Delete
              </button>
              <button onClick={cancelDeleteDesign} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SavedDesignsSection