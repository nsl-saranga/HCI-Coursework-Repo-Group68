"use client"

import { createContext, useContext, useState, useRef } from "react"
import * as THREE from "three"

// Create the context
const AppContext = createContext()

// Custom hook for using the context
export const useAppContext = () => useContext(AppContext)

export const AppProvider = ({ children }) => {
  // Room configuration
  const [roomConfig, setRoomConfig] = useState({
    size: "medium",
    color: "#ffffff",
    texture: "none",
    floorColor: "#cccccc",
  })

  // Furniture options
  const [furnitureOptions, setFurnitureOptions] = useState({
    color: "#8B4513", // Default wood brown color
    scale: 1.0, // Default scale (100%)
  })

  // Add furnitureShade to the state after furnitureOptions
  const [furnitureShade, setFurnitureShade] = useState({
    intensity: 0.5, // Default shade intensity (0 = dark, 1 = bright)
  })

  // Light settings
  const [shadeOptions, setShadeOptions] = useState({
    globalIntensity: 0.5, // Default ambient light intensity
  })

  // App state
  const [selectedFurniture, setSelectedFurniture] = useState(null)
  const [currentMode, setCurrentMode] = useState("place")
  const [placedItems, setPlacedItems] = useState([])
  const [currentDesignName, setCurrentDesignName] = useState(null)
  const [viewMode, setViewMode] = useState("3d")
  const [notification, setNotification] = useState({ message: "", visible: false })

  // Add this after the viewMode state
  const [roomType, setRoomType] = useState("living")

  // Three.js utilities
  const raycaster = useRef(new THREE.Raycaster())
  const mouse = useRef(new THREE.Vector2())

  // Move state tracking
  const moveState = useRef({
    active: false,
    selectedObject: null,
    offset: new THREE.Vector3(),
    roomBounds: null,
  })

  // Refs for Three.js objects
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const controlsRef = useRef(null)
  const roomGroupRef = useRef(null)
  const ambientLightRef = useRef(null)

  // Show notification helper
  const showNotification = (message) => {
    console.log("Notification:", message) // Debug log
    setNotification({ message, visible: true })

    // Clear any existing timeout
    if (window.notificationTimeout) {
      clearTimeout(window.notificationTimeout)
    }

    // Hide after 3 seconds
    window.notificationTimeout = setTimeout(() => {
      setNotification((prev) => ({ ...prev, visible: false }))
    }, 3000)
  }

  // Update room config
  const updateRoomConfig = (newConfig, suppressNotification = false) => {
    setRoomConfig((prev) => {
      const updated = { ...prev, ...newConfig }
      if (!suppressNotification) {
        showNotification(`Room ${Object.keys(newConfig)[0]} updated`)
      }
      return updated
    })
  }

  // Set app mode
  const setMode = (mode) => {
    setCurrentMode(mode)

    // Reset move state when changing modes
    if (mode !== "move" && moveState.current) {
      moveState.current.active = false
      moveState.current.selectedObject = null
    }

    // Enable/disable orbit controls based on mode
    if (controlsRef.current) {
      controlsRef.current.enabled = mode !== "move"
    }

    const msgMap = {
      place: "Place mode: Click to place furniture",
      "rotate-item": "Rotate mode: Click on item to rotate it",
      delete: "Delete mode: Click on item to remove",
      move: "Move mode: Click and drag to reposition furniture",
      "edit-color": "Color mode: Click on furniture to change its color",
      "edit-size": "Size mode: Click on furniture to change its size",
      "shade-global": "Room Light mode: Adjust the slider to change room brightness",
      "shade-selective": "Selective Shade mode: Click on furniture to apply shade effect",
    }

    showNotification(msgMap[mode] || "")
  }

  // Function to update global shade
  const updateGlobalShade = (intensity) => {
    setShadeOptions((prev) => ({ ...prev, globalIntensity: intensity }))

    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = intensity
      showNotification(`Room brightness set to ${Math.round(intensity * 100)}%`)
    }
  }

  // Context value
  const contextValue = {
    roomConfig,
    updateRoomConfig,
    furnitureOptions,
    setFurnitureOptions,
    shadeOptions,
    setShadeOptions,
    updateGlobalShade,
    selectedFurniture,
    setSelectedFurniture,
    currentMode,
    setMode,
    placedItems,
    setPlacedItems,
    currentDesignName,
    setCurrentDesignName,
    viewMode,
    setViewMode,
    notification,
    showNotification,
    // Add these to the contextValue object
    roomType,
    setRoomType,
    furnitureShade,
    setFurnitureShade,

    // Refs
    raycaster: raycaster.current,
    mouse: mouse.current,
    moveState: moveState.current,
    sceneRef,
    cameraRef,
    rendererRef,
    controlsRef,
    roomGroupRef,
    ambientLightRef,
  }

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}
