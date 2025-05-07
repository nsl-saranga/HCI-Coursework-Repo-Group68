"use client"
import { useAppContext } from "../../context/AppContext"

const RoomConfigSection = () => {
  const {
    roomConfig,
    updateRoomConfig,
    shadeOptions,
    updateGlobalShade,
    viewMode,
    setViewMode,
    showNotification,
    roomType,
    setRoomType,
  } = useAppContext()

  const toggle2D3DView = () => {
    const newViewMode = viewMode === "3d" ? "2d" : "3d"
    setViewMode(newViewMode)

    if (newViewMode === "2d") {
      document.getElementById("toggle-view-btn").textContent = "Switch to 3D View"
      showNotification("Switched to 2D top-down view")
    } else {
      document.getElementById("toggle-view-btn").textContent = "Switch to 2D View"
      showNotification("Switched to 3D view")
    }
  }

  const handleRoomSizeChange = (e) => {
    updateRoomConfig({ size: e.target.value })
  }

  const handleWallColorChange = (e) => {
    updateRoomConfig({ color: e.target.value })
  }

  const handleFloorColorChange = (e) => {
    updateRoomConfig({ floorColor: e.target.value })
  }

  const handleWallTextureChange = (e) => {
    updateRoomConfig({ texture: e.target.value })
  }

  const handleGlobalShadeChange = (e) => {
    updateGlobalShade(Number.parseFloat(e.target.value))
  }

  const handleRoomTypeChange = (e) => {
    setRoomType(e.target.value)
    showNotification(`Switched to ${e.target.value} room`)
  }

  return (
    <div className="control-group">
      <button id="toggle-view-btn" className="normal-btn" onClick={toggle2D3DView}>
        Switch to 2D View
      </button>
      <h2 className="control-group-title">Room Configuration</h2>

      <div className="form-group">
        <label className="toolbar-text">Room Type:</label>
        <select id="roomType" value={roomType} onChange={handleRoomTypeChange}>
          <option value="living">Living Room</option>
          <option value="kitchen">Kitchen</option>
          <option value="dining">Dining Room</option>
          <option value="bedroom">Bedroom</option>
          <option value="office">Home Office</option>
        </select>
      </div>
      
      <div className="form-group">
        <label className="toolbar-text">Room Size:</label>
        <select id="roomSize" value={roomConfig.size} onChange={handleRoomSizeChange}>
          <option value="small">Small (3x3x2.5m)</option>
          <option value="medium">Medium (4x4x3m)</option>
          <option value="large">Large (5x5x3.5m)</option>
        </select>
      </div>

      <div className="form-group">
        <label className="toolbar-text">Wall Color:</label>
        <input type="color" id="wallColor" value={roomConfig.color} onChange={handleWallColorChange} />
      </div>

      <div className="form-group">
        <label className="toolbar-text">Floor Color:</label>
        <input type="color" id="floorColor" value={roomConfig.floorColor} onChange={handleFloorColorChange} />
      </div>

      <div className="form-group">
        <label htmlFor="wallTexture" className="toolbar-text">Wall Texture:</label>
        <select id="wallTexture" value={roomConfig.texture} onChange={handleWallTextureChange}>
          <option value="none">No Texture</option>
          <option value="brick">Brick</option>
          <option value="wood">Wood</option>
          <option value="concrete">Concrete</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="globalShade" className="toolbar-text">Room Brightness:</label>
        <input
          type="range"
          id="globalShade"
          min="0.1"
          max="1.0"
          step="0.05"
          value={shadeOptions.globalIntensity}
          onChange={handleGlobalShadeChange}
        />
      </div>
    </div>
  )
}

export default RoomConfigSection
