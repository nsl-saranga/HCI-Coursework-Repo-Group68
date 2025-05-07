import RoomConfigSection from "./toolbar/RoomConfigSection"
import FurnitureControlSection from "./toolbar/FurnitureControlSection"
import SavedDesignsSection from "./toolbar/SavedDesignsSection"

const Toolbar = () => {
  return (
    <div className="toolbar">
      <RoomConfigSection />
      <FurnitureControlSection />
      <SavedDesignsSection />
    </div>
  )
}

export default Toolbar
