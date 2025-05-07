"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { useAppContext } from "../context/AppContext"
import useRoomManager from "../hooks/useRoomManager"
import useEventManager from "../hooks/useEventManager"

const ThreeCanvas = () => {
  const canvasRef = useRef(null)
  const {
    sceneRef,
    cameraRef,
    rendererRef,
    controlsRef,
    ambientLightRef,
    roomGroupRef,
    shadeOptions,
    viewMode,
    showNotification,
  } = useAppContext()

  // Initialize managers
  const roomManager = useRoomManager()
  const eventManager = useEventManager()

  // Initialize scene
  useEffect(() => {
    if (!canvasRef.current) return

    // Initialize scene
    sceneRef.current = new THREE.Scene()

    // Initialize camera
    cameraRef.current = new THREE.PerspectiveCamera(75, (window.innerWidth - 300) / window.innerHeight, 0.1, 1000)
    cameraRef.current.position.set(6, 3, 6)
    cameraRef.current.lookAt(0, 1, 0)

    // Initialize renderer
    rendererRef.current = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    })
    rendererRef.current.shadowMap.enabled = true

    // Initialize controls
    controlsRef.current = new OrbitControls(cameraRef.current, rendererRef.current.domElement)
    controlsRef.current.enableDamping = true
    controlsRef.current.dampingFactor = 0.05
    controlsRef.current.minDistance = 2
    controlsRef.current.maxDistance = 10
    controlsRef.current.maxPolarAngle = Math.PI / 2 // Limit to not go below the floor
    controlsRef.current.target.set(0, 1, 0)

    // Initialize lights
    ambientLightRef.current = new THREE.AmbientLight(0xffffff, shadeOptions.globalIntensity)
    const directional = new THREE.DirectionalLight(0xffffff, 0.8)
    directional.position.set(5, 5, 5)
    directional.castShadow = true
    sceneRef.current.add(ambientLightRef.current, directional)

    // Initialize room group
    roomGroupRef.current = new THREE.Group()
    sceneRef.current.add(roomGroupRef.current)

    // Handle resize
    const handleResize = () => {
      const w = window.innerWidth - 300
      const h = window.innerHeight
      cameraRef.current.aspect = w / h
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(w, h)
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    // Animation loop
    const animate = () => {
      if (controlsRef.current) controlsRef.current.update()
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
      requestAnimationFrame(animate)
    }

    animate()

    // Build initial room
    setTimeout(() => {
      if (roomManager.buildRoom) {
        roomManager.buildRoom()
        roomManager.makeWallInvisible()
        showNotification("Room initialized")
      }
    }, 100)

    // Clean up on unmount
    return () => {
      window.removeEventListener("resize", handleResize)

      if (rendererRef.current) {
        rendererRef.current.dispose()
      }

      if (controlsRef.current) {
        controlsRef.current.dispose()
      }

      // Clean up all Three.js objects
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object.geometry) {
            object.geometry.dispose()
          }

          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose())
            } else {
              object.material.dispose()
            }
          }
        })
      }
    }
  }, [])

  // Update camera position when viewMode changes
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return

    if (viewMode === "2d") {
      // Switch to top-down 2D view
      cameraRef.current.position.set(0, 10, 0)
      cameraRef.current.lookAt(0, 0, 0)
      cameraRef.current.near = 0.1
      cameraRef.current.far = 20
      cameraRef.current.updateProjectionMatrix()

      // Disable orbit controls rotation
      controlsRef.current.minPolarAngle = 0
      controlsRef.current.maxPolarAngle = 0
      controlsRef.current.enableRotate = false
      controlsRef.current.target.set(0, 0, 0)
    } else {
      // Switch back to 3D view
      cameraRef.current.position.set(6, 3, 6)
      cameraRef.current.lookAt(0, 1, 0)
      cameraRef.current.near = 0.1
      cameraRef.current.far = 1000
      cameraRef.current.updateProjectionMatrix()

      // Re-enable orbit controls
      controlsRef.current.minPolarAngle = 0
      controlsRef.current.maxPolarAngle = Math.PI / 2
      controlsRef.current.enableRotate = true
      controlsRef.current.target.set(0, 1, 0)
    }

    controlsRef.current.update()
  }, [viewMode])

  return <canvas id="canvas3d" ref={canvasRef} />
}

export default ThreeCanvas
