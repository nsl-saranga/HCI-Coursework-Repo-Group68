"use client"

import { useEffect } from "react"
import * as THREE from "three"
import { useAppContext } from "../context/AppContext"
import useRoomManager from "./useRoomManager"

export default function useEventManager() {
  const {
    rendererRef,
    sceneRef,
    cameraRef,
    controlsRef,
    mouse,
    raycaster,
    currentMode,
    moveState,
    showNotification,
    selectedFurniture,
    furnitureOptions,
    roomConfig,
    placedItems,
    setPlacedItems,
    furnitureShade,
  } = useAppContext()

  const roomManager = useRoomManager()

  // Setup event listeners
  useEffect(() => {
    if (!rendererRef.current) return

    const renderer = rendererRef.current

    const handleCanvasClick = (event) => {
      // Handle move mode in mouse down/move/up events instead
      if (currentMode === "move") return

      if (!rendererRef.current || !cameraRef.current) return

      const rect = rendererRef.current.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, cameraRef.current)

      console.log(`Canvas clicked in mode: ${currentMode}`)

      // Handle different modes
      switch (currentMode) {
        case "delete":
          deleteFurniture()
          break
        case "rotate-item":
          rotateFurniture()
          break
        case "place":
          placeFurniture(event)
          break
        case "edit-color":
          changeFurnitureColor()
          break
        case "edit-size":
          changeFurnitureSize()
          break
        case "edit-shade":
          applyFurnitureShade()
          break
        default:
          console.log(`No handler for mode: ${currentMode}`)
      }
    }

    const handleMouseDown = (event) => {
      if (currentMode !== "move" || !rendererRef.current || !cameraRef.current) return

      // Calculate the current mouse position
      const rect = rendererRef.current.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, cameraRef.current)

      // Get the room bounds for constraining movement
      const cfg = { small: 3, medium: 4, large: 5 }[roomConfig.size]
      moveState.roomBounds = {
        minX: -cfg / 2,
        maxX: cfg / 2,
        minZ: -cfg / 2,
        maxZ: cfg / 2,
      }

      // Check for intersections with furniture
      const meshes = placedItems.map((i) => i.mesh)
      const hits = raycaster.intersectObjects(meshes, true)

      if (hits.length) {
        // Find the root object from hit
        let obj = hits[0].object
        while (obj.parent && !meshes.includes(obj)) obj = obj.parent

        // Prepare for move
        moveState.active = true
        moveState.selectedObject = obj

        // Calculate mouse position on the floor
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
        const mousePos = new THREE.Vector3()
        raycaster.ray.intersectPlane(plane, mousePos)

        // Calculate offset between object position and mouse position
        moveState.offset.copy(obj.position).sub(mousePos)

        // Disable orbit controls during move
        if (controlsRef.current) controlsRef.current.enabled = false

        showNotification("Moving furniture")
      }
    }

    const handleMouseMove = (event) => {
      if (!moveState.active || !moveState.selectedObject) return

      if (!rendererRef.current || !cameraRef.current) return

      // Calculate the current mouse position
      const rect = rendererRef.current.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, cameraRef.current)

      // Calculate new position
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
      const mousePos = new THREE.Vector3()

      if (raycaster.ray.intersectPlane(plane, mousePos)) {
        // Apply offset
        const newPos = mousePos.add(moveState.offset)

        // Constrain to room bounds
        const bounds = moveState.roomBounds
        newPos.x = Math.max(bounds.minX, Math.min(bounds.maxX, newPos.x))
        newPos.z = Math.max(bounds.minZ, Math.min(bounds.maxZ, newPos.z))

        // Update position (keeping y the same)
        const currentY = moveState.selectedObject.position.y
        moveState.selectedObject.position.set(newPos.x, currentY, newPos.z)
      }
    }

    const handleMouseUp = () => {
      if (moveState.active && moveState.selectedObject) {
        showNotification("Furniture repositioned")
        moveState.active = false
        moveState.selectedObject = null

        // Re-enable orbit controls if still in move mode
        if (currentMode === "move") {
          if (controlsRef.current) controlsRef.current.enabled = false
        } else {
          if (controlsRef.current) controlsRef.current.enabled = true
        }
      }
    }

    // Furniture management functions
    const deleteFurniture = () => {
      const meshes = placedItems.map((i) => i.mesh)
      if (!meshes.length) return showNotification("No items to delete.")

      const hits = raycaster.intersectObjects(meshes, true)
      if (!hits.length) return showNotification("Click on a furniture to remove")

      // find root object from hit
      let obj = hits[0].object
      while (obj.parent && !meshes.includes(obj)) obj = obj.parent

      const idx = placedItems.findIndex((i) => i.mesh === obj)
      if (idx < 0) return

      roomManager.removeObject(obj)
      showNotification("Item removed")
    }

    const rotateFurniture = () => {
      const meshes = placedItems.map((i) => i.mesh)
      const hits = raycaster.intersectObjects(meshes, true)
      if (!hits.length) return

      let obj = hits[0].object
      while (obj.parent && !meshes.includes(obj)) obj = obj.parent

      obj.rotation.y += Math.PI / 4
      showNotification("Item rotated")
    }

    const placeFurniture = (event) => {
      if (!selectedFurniture) {
        console.log("No furniture selected")
        return
      }

      console.log("Placing furniture:", selectedFurniture)

      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
      const pt = new THREE.Vector3()

      if (raycaster.ray.intersectPlane(plane, pt)) {
        console.log("Intersection point:", pt)
        const cfg = { small: 3, medium: 4, large: 5 }[roomConfig.size]

        if (Math.abs(pt.x) <= cfg / 2 && Math.abs(pt.z) <= cfg / 2) {
          console.log("Point is within room bounds, adding furniture")
          roomManager.addFurniture(selectedFurniture, pt, furnitureOptions).then((mesh) => {
            if (mesh) {
              showNotification("Furniture placed")
            } else {
              console.error("Failed to add furniture, mesh is null")
            }
          })
        } else {
          console.log("Point is outside room bounds")
        }
      } else {
        console.log("No intersection with floor plane")
      }
    }

    const changeFurnitureColor = () => {
      const meshes = placedItems.map((i) => i.mesh)
      const hits = raycaster.intersectObjects(meshes, true)
      if (!hits.length) return

      // Find the root object from hit
      let obj = hits[0].object
      while (obj.parent && !meshes.includes(obj)) obj = obj.parent

      const itemIndex = placedItems.findIndex((i) => i.mesh === obj)
      if (itemIndex < 0) return

      // Apply color to all child meshes
      obj.traverse((child) => {
        if (child.isMesh && child.material) {
          // If material is an array, update all materials
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => {
              mat.color.set(furnitureOptions.color)
            })
          } else {
            child.material.color.set(furnitureOptions.color)
          }
        }
      })

      // Update stored color
      const newPlacedItems = [...placedItems]
      newPlacedItems[itemIndex] = {
        ...newPlacedItems[itemIndex],
        color: furnitureOptions.color,
      }

      setPlacedItems(newPlacedItems)

      showNotification("Furniture color updated")
    }

    const changeFurnitureSize = () => {
      const meshes = placedItems.map((i) => i.mesh)
      const hits = raycaster.intersectObjects(meshes, true)
      if (!hits.length) return

      // Find the root object from hit
      let obj = hits[0].object
      while (obj.parent && !meshes.includes(obj)) obj = obj.parent

      const itemIndex = placedItems.findIndex((i) => i.mesh === obj)
      if (itemIndex < 0) return

      // Get the original scale or use 1 as default
      const originalScale = placedItems[itemIndex].originalScale || 1

      // If this is the first resize, store the original scale
      if (!placedItems[itemIndex].originalScale) {
        const newPlacedItems = [...placedItems]
        newPlacedItems[itemIndex] = {
          ...newPlacedItems[itemIndex],
          originalScale: obj.scale.x,
        }
        setPlacedItems(newPlacedItems)
      }

      // Apply new scale based on original scale
      const newScale = originalScale * furnitureOptions.scale
      obj.scale.set(newScale, newScale, newScale)

      // Update stored scale
      const newPlacedItems = [...placedItems]
      newPlacedItems[itemIndex] = {
        ...newPlacedItems[itemIndex],
        scale: furnitureOptions.scale,
      }
      setPlacedItems(newPlacedItems)

      showNotification("Furniture size updated")
    }

    const applyFurnitureShade = () => {
      const meshes = placedItems.map((i) => i.mesh)
      const hits = raycaster.intersectObjects(meshes, true)
      if (!hits.length) return

      // Find the root object from hit
      let obj = hits[0].object
      while (obj.parent && !meshes.includes(obj)) obj = obj.parent

      const itemIndex = placedItems.findIndex((i) => i.mesh === obj)
      if (itemIndex < 0) return

      // Apply shade to all child meshes
      obj.traverse((child) => {
        if (child.isMesh && child.material) {
          // If material is an array, update all materials
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => {
              applyShadeToMaterial(mat, furnitureShade.intensity)
            })
          } else {
            applyShadeToMaterial(child.material, furnitureShade.intensity)
          }
        }
      })

      // Update stored shade
      const newPlacedItems = [...placedItems]
      newPlacedItems[itemIndex] = {
        ...newPlacedItems[itemIndex],
        shade: furnitureShade.intensity,
      }

      setPlacedItems(newPlacedItems)

      showNotification("Furniture shade updated")
    }

    const applyShadeToMaterial = (material, intensity) => {
      // Adjust material properties based on shade intensity
      // 0 = dark, 1 = bright

      // Adjust the emissive color for glow effect at higher intensities
      const emissiveIntensity = Math.max(0, intensity - 0.5) * 2
      material.emissive = new THREE.Color(emissiveIntensity * 0.2, emissiveIntensity * 0.2, emissiveIntensity * 0.2)

      // Adjust the base color brightness
      const baseColor = new THREE.Color(material.color.getHex())
      const targetColor = new THREE.Color()

      // Darken for low intensity, keep original for mid, brighten for high
      if (intensity < 0.5) {
        // Darken (blend with black)
        targetColor.setRGB(baseColor.r * (intensity * 2), baseColor.g * (intensity * 2), baseColor.b * (intensity * 2))
      } else {
        // Brighten (blend with white)
        const brightFactor = (intensity - 0.5) * 2
        targetColor.setRGB(
          baseColor.r + (1 - baseColor.r) * brightFactor,
          baseColor.g + (1 - baseColor.g) * brightFactor,
          baseColor.b + (1 - baseColor.b) * brightFactor,
        )
      }

      material.color.copy(targetColor)

      // Adjust material roughness based on intensity
      material.roughness = Math.max(0.1, 1 - intensity * 0.5)

      material.needsUpdate = true
    }

    renderer.domElement.addEventListener("click", handleCanvasClick)
    renderer.domElement.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      renderer.domElement.removeEventListener("click", handleCanvasClick)
      renderer.domElement.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [
    rendererRef,
    currentMode,
    roomManager,
    selectedFurniture,
    furnitureOptions,
    roomConfig,
    placedItems,
    setPlacedItems,
    furnitureShade,
  ])

  return {}
}
