"use client"

import { useEffect, useState } from "react"
import * as THREE from "three"
import { useAppContext } from "../context/AppContext"
import useRoomManager from "./useRoomManager"

export default function useDesignManager() {
  const {
    roomConfig,
    updateRoomConfig,
    placedItems,
    setPlacedItems,
    currentDesignName,
    setCurrentDesignName,
    roomGroupRef,
    showNotification,
  } = useAppContext()

  const roomManager = useRoomManager()

  // Method to save a new design
  const saveNewDesign = () => {
    const designNameInput = document.getElementById("design-name-input")
    if (!designNameInput) return

    const designName = designNameInput.value.trim()
    if (!designName) {
      showNotification("Please enter a design name")
      return
    }

    const designData = {
      name: designName,
      date: new Date().toISOString(),
      room: roomConfig,
      furniture: placedItems.map((item) => ({
        type: item.type,
        position: {
          x: item.mesh.position.x,
          y: item.mesh.position.y,
          z: item.mesh.position.z,
        },
        rotation: {
          x: item.mesh.rotation.x,
          y: item.mesh.rotation.y,
          z: item.mesh.rotation.z,
        },
        scale: item.scale,
        color: item.color,
      })),
    }

    const savedDesigns = JSON.parse(localStorage.getItem("roomDesigns") || "{}")
    savedDesigns[designName] = designData
    localStorage.setItem("roomDesigns", JSON.stringify(savedDesigns))

    designNameInput.value = ""
    setCurrentDesignName(designName)
    updateSavedDesignsMenu()
    showNotification(`Design "${designName}" saved successfully!`)
  }

  // Method to load a selected design
  const loadSelectedDesign = () => {
    const designMenu = document.getElementById("saved-designs-menu")
    if (!designMenu) return

    const designName = designMenu.value
    if (!designName) {
      showNotification("Please select a design to load")
      return
    }

    const savedDesigns = JSON.parse(localStorage.getItem("roomDesigns") || "{}")
    const designData = savedDesigns[designName]

    if (!designData) {
      showNotification("Design not found")
      return
    }

    // Clear existing items
    if (roomGroupRef.current) {
      placedItems.forEach((item) => {
        roomGroupRef.current.remove(item.mesh)

        // Clean up resources
        item.mesh.traverse((child) => {
          if (child.geometry) child.geometry.dispose()
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose())
            } else {
              child.material.dispose()
            }
          }
        })
      })
    }

    setPlacedItems([])

    // Update room config - pass true to suppress automatic notification
    updateRoomConfig(designData.room, true)

    // Update UI controls based on room config
    document.getElementById("roomSize").value = designData.room.size
    document.getElementById("wallColor").value = designData.room.color
    document.getElementById("floorColor").value = designData.room.floorColor
    document.getElementById("wallTexture").value = designData.room.texture || "none"

    // Place furniture
    designData.furniture.forEach((itemData) => {
      const position = new THREE.Vector3(itemData.position.x, itemData.position.y, itemData.position.z)

      // Set the furniture options based on saved data
      const furnitureOptions = {
        color: itemData.color,
        scale: itemData.scale,
      }

      // Add furniture using roomManager
      roomManager.addFurniture(itemData.type, position, furnitureOptions).then((mesh) => {
        if (mesh) {
          // Set rotation
          mesh.rotation.set(itemData.rotation.x, itemData.rotation.y, itemData.rotation.z)
        }
      })
    })

    // Set the current design name
    setCurrentDesignName(designName)

    showNotification(`Design "${designName}" loaded successfully!`)
  }

  // Method to edit a selected design
  const editSelectedDesign = () => {
    const designMenu = document.getElementById("saved-designs-menu")
    if (!designMenu) return

    const designName = designMenu.value
    if (!designName) {
      showNotification("Please select a design to edit")
      return
    }

    // If we already loaded this design, just update it
    if (currentDesignName === designName) {
      updateDesign(designName)
      return
    }

    // Otherwise, load it first then set for editing
    loadSelectedDesign()
    // Update design name input field for easy editing
    document.getElementById("design-name-input").value = designName

    showNotification(`Design "${designName}" ready for editing`)
  }

  // Method to update an existing design
  const updateDesign = (designName) => {
    if (!designName) {
      designName = currentDesignName
    }

    if (!designName) {
      showNotification("No design selected for update")
      return
    }

    const savedDesigns = JSON.parse(localStorage.getItem("roomDesigns") || "{}")

    // Make sure the design exists
    if (!savedDesigns[designName]) {
      showNotification(`Design "${designName}" not found`)
      return
    }

    // Prepare updated design data
    const designData = {
      name: designName,
      date: new Date().toISOString(), // Update timestamp to show it was modified
      room: roomConfig,
      furniture: placedItems.map((item) => ({
        type: item.type,
        position: {
          x: item.mesh.position.x,
          y: item.mesh.position.y,
          z: item.mesh.position.z,
        },
        rotation: {
          x: item.mesh.rotation.x,
          y: item.mesh.rotation.y,
          z: item.mesh.rotation.z,
        },
        scale: item.scale,
        color: item.color,
      })),
    }

    // Update in localStorage
    savedDesigns[designName] = designData
    localStorage.setItem("roomDesigns", JSON.stringify(savedDesigns))

    // Update the design menu to show the new date
    updateSavedDesignsMenu()

    showNotification(`Design "${designName}" updated successfully!`)
  }

  // Add state for delete confirmation dialog
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [designToDelete, setDesignToDelete] = useState("")

  // Method to initiate delete process
  const initiateDeleteDesign = () => {
    const designMenu = document.getElementById("saved-designs-menu")
    if (!designMenu) return

    const designName = designMenu.value
    if (!designName) {
      showNotification("Please select a design to delete")
      return
    }

    setDesignToDelete(designName)
    setShowConfirmDialog(true)
  }

  // Method to confirm deletion
  const confirmDeleteDesign = () => {
    if (!designToDelete) return

    const savedDesigns = JSON.parse(localStorage.getItem("roomDesigns") || "{}")
    delete savedDesigns[designToDelete]
    localStorage.setItem("roomDesigns", JSON.stringify(savedDesigns))

    // If we deleted the current design, reset the current design name and clear the scene
    if (currentDesignName === designToDelete) {
      setCurrentDesignName(null)
      document.getElementById("design-name-input").value = ""

      // Clear all furniture from the scene
      if (roomGroupRef.current) {
        placedItems.forEach((item) => {
          roomGroupRef.current.remove(item.mesh)

          // Clean up resources
          item.mesh.traverse((child) => {
            if (child.geometry) child.geometry.dispose()
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((m) => m.dispose())
              } else {
                child.material.dispose()
              }
            }
          })
        })
      }

      // Reset placed items
      setPlacedItems([])

      // Reset to default room config - pass true to suppress automatic notification
      updateRoomConfig(
        {
          size: "medium",
          color: "#ffffff",
          texture: "none",
          floorColor: "#cccccc",
        },
        true,
      )

      // Update UI controls
      document.getElementById("roomSize").value = "medium"
      document.getElementById("wallColor").value = "#ffffff"
      document.getElementById("floorColor").value = "#cccccc"
      document.getElementById("wallTexture").value = "none"
    }

    updateSavedDesignsMenu()
    showNotification(`Design "${designToDelete}" deleted`)

    // Close the confirmation dialog
    setShowConfirmDialog(false)
    setDesignToDelete("")
  }

  // Method to cancel deletion
  const cancelDeleteDesign = () => {
    setShowConfirmDialog(false)
    setDesignToDelete("")
  }

  // Method to update saved designs menu
  const updateSavedDesignsMenu = () => {
    const menu = document.getElementById("saved-designs-menu")
    if (!menu) return

    menu.innerHTML = '<option value="" disabled selected>Select a saved design</option>'

    const savedDesigns = JSON.parse(localStorage.getItem("roomDesigns") || "{}")
    const sortedDesigns = Object.entries(savedDesigns).sort((a, b) => new Date(b[1].date) - new Date(a[1].date))

    sortedDesigns.forEach(([name, design]) => {
      const option = document.createElement("option")
      option.value = name
      option.textContent = `${name} (${new Date(design.date).toLocaleDateString()})`

      // Select currently loaded design if there is one
      if (name === currentDesignName) {
        option.selected = true
      }

      menu.appendChild(option)
    })
  }

  // Initialize saved designs menu
  useEffect(() => {
    updateSavedDesignsMenu()
  }, [currentDesignName])

  // Return the updated methods and state
  return {
    saveNewDesign,
    loadSelectedDesign,
    editSelectedDesign,
    updateDesign,
    initiateDeleteDesign,
    confirmDeleteDesign,
    cancelDeleteDesign,
    showConfirmDialog,
    designToDelete,
    updateSavedDesignsMenu,
  }
}
