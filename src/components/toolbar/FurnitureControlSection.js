"use client"
import { useAppContext } from "../../context/AppContext"

const FurnitureControlSection = () => {
  const {
    setMode,
    selectedFurniture,
    setSelectedFurniture,
    furnitureOptions,
    setFurnitureOptions,
    furnitureShade,
    setFurnitureShade,
    currentMode,
  } = useAppContext()

  const handleFurnitureTypeChange = (e) => {
    setSelectedFurniture(e.target.value)
    setMode("place")
  }

  const handleFurnitureColorChange = (e) => {
    setFurnitureOptions({
      ...furnitureOptions,
      color: e.target.value,
    })

    if (currentMode === "edit-color") {
      // Ideally we would call the furniture manager here
    }
  }

  const handleFurnitureSizeChange = (e) => {
    setFurnitureOptions({
      ...furnitureOptions,
      scale: Number.parseFloat(e.target.value),
    })

    if (currentMode === "edit-size") {
      // Ideally we would call the furniture manager here
    }
  }

  const handleFurnitureShadeChange = (e) => {
    setFurnitureShade({
      ...furnitureShade,
      intensity: Number.parseFloat(e.target.value),
    })

    if (currentMode === "edit-shade") {
      // Shade will be applied when clicking on furniture
    }
  }

  return (
    <div className="control-group">
      <h2 className="control-group-title">Furniture</h2>
      <div className="form-group control-buttons">
        <button id="place-btn" className={currentMode === "place" ? "active" : ""} onClick={() => setMode("place")}>
          <i className="ri-add-circle-line"></i>
          Place
        </button>
        <button id="move-btn" className={currentMode === "move" ? "active" : ""} onClick={() => setMode("move")}>
          <i className="ri-drag-move-line"></i>
          Move
        </button>
        <button
          id="rotate-item-btn"
          className={currentMode === "rotate-item" ? "active" : ""}
          onClick={() => setMode("rotate-item")}
        >
          <i className="ri-refresh-line"></i>
          Rotate
        </button>
        <button id="delete-btn" className={currentMode === "delete" ? "active" : ""} onClick={() => setMode("delete")}>
          <i className="ri-delete-bin-line"></i>
          Delete
        </button>
      </div>

      <div className="form-group">
        <label htmlFor="furnitureColor" className="toolbar-text">Furniture Color:</label>
        <input type="color" id="furnitureColor" value={furnitureOptions.color} onChange={handleFurnitureColorChange} />
        <button
          id="edit-color-btn"
          className={`normal-btn ${currentMode === "edit-color" ? "active" : ""}`}
          onClick={() => setMode("edit-color")}
        >
          Change Color
        </button>
      </div>

      <div className="form-group">
        <label htmlFor="furnitureSize" className="toolbar-text">Furniture Size:</label>
        <input
          type="range"
          id="furnitureSize"
          min="0.5"
          max="2.0"
          step="0.1"
          value={furnitureOptions.scale}
          onChange={handleFurnitureSizeChange}
        />
        <button
          id="edit-size-btn"
          className={`normal-btn ${currentMode === "edit-size" ? "active" : ""}`}
          onClick={() => setMode("edit-size")}
        >
          Change Size
        </button>
      </div>

      {/* Add new furniture shade control */}
      <div className="form-group">
        <label htmlFor="furnitureShade" className="toolbar-text">Furniture Shade:</label>
        <input
          type="range"
          id="furnitureShade"
          min="0"
          max="1.0"
          step="0.05"
          value={furnitureShade.intensity}
          onChange={handleFurnitureShadeChange}
        />
        <button
          id="edit-shade-btn"
          className={`normal-btn ${currentMode === "edit-shade" ? "active" : ""}`}
          onClick={() => setMode("edit-shade")}
        >
          Apply Shade
        </button>
      </div>

      <div className="form-group">
        <label className="toolbar-text">Select Furniture:</label>
        <select id="furnitureType" value={selectedFurniture || ""} onChange={handleFurnitureTypeChange}>
          <option value="">Choose...</option>
          <option value="chair">Wooden Chair</option>
          <option value="table">Coffee Table (Wood)</option>
          <option value="sofa">Corner Sofa</option>
          <option value="lamp">Floor Lamp</option>
          <option value="armchair">Leather Armchair</option>
          <option value="stool">Velvet Sofa</option>
          <option value="stool">Radio Stool</option>
          <option value="stool">Accent Chair</option>
          <option value="stool">Magazine Rack</option>
        </select>
      </div>
      <p className="hint">Click anywhere in the room to place selected furniture</p>
    </div>
  )
}

export default FurnitureControlSection
