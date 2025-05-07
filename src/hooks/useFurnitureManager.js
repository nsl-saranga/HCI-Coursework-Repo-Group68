import * as THREE from "three"
import { useAppContext } from "../context/AppContext"
import useModelManager from "./useModelManager"

export default function useFurnitureManager() {
  const {
    roomGroupRef,
    raycaster,
    mouse,
    placedItems,
    setPlacedItems,
    selectedFurniture,
    furnitureOptions,
    roomConfig,
    showNotification,
    sceneRef,
    cameraRef,
    furnitureShade,
  } = useAppContext()

  const modelManager = useModelManager()

  // Add furniture to the scene
  const addFurniture = async (type, position, options = {}) => {
    if (!roomGroupRef.current) return null

    try {
      console.log(`Attempting to load model: ${type}`)
      const model = await modelManager.loadModel(type)

      if (!model) {
        console.error(`Failed to load model: ${type}`)
        showNotification(`Failed to load ${type} model`)
        return null
      }

      console.log(`Model loaded successfully: ${type}`)
      model.position.copy(position)

      // Adjust position to sit on the floor
      const box = new THREE.Box3().setFromObject(model)
      model.position.y = -box.min.y

      // Apply custom color if provided
      if (options.color) {
        model.traverse((node) => {
          if (node.isMesh) {
            // Handle array of materials
            if (Array.isArray(node.material)) {
              node.material = node.material.map((mat) => {
                const newMat = mat.clone()
                newMat.color.set(options.color)
                return newMat
              })
            } else {
              // Single material
              const newMaterial = node.material.clone()
              newMaterial.color.set(options.color)
              node.material = newMaterial
            }
          }
        })
      }

      // Apply custom scale if provided
      if (options.scale) {
        const scaleFactor = options.scale
        // Store original scale before applying new scale
        const originalScale = {
          x: model.scale.x,
          y: model.scale.y,
          z: model.scale.z,
        }

        model.scale.multiplyScalar(scaleFactor)

        // Store original scale in userData for reference when scaling later
        model.userData.originalScale = originalScale
      }

      // Store the type and other metadata in userData
      model.userData = {
        ...model.userData, // Preserve existing userData (including originalScale)
        type: type,
        movable: true,
        color: options.color || "#8B4513",
        scale: options.scale || 1.0,
      }

      roomGroupRef.current.add(model)
      console.log(`Added ${type} to scene at position:`, position)

      // Add to placed items
      setPlacedItems((prev) => [
        ...prev,
        {
          mesh: model,
          type: type,
          color: options.color || "#8B4513",
          scale: options.scale || 1.0,
        },
      ])

      showNotification(`Added ${type} to room`)
      return model
    } catch (error) {
      console.error("Error adding furniture:", error)
      showNotification(`Error adding furniture: ${error.message}`)
      return null
    }
  }

  // Place furniture
  const placeFurniture = (event) => {
    if (!selectedFurniture || !roomGroupRef.current || !cameraRef.current) {
      console.log("Cannot place furniture:", {
        selectedFurniture,
        roomGroupExists: !!roomGroupRef.current,
        cameraExists: !!cameraRef.current,
      })
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
        addFurniture(selectedFurniture, pt, furnitureOptions).then((mesh) => {
          if (mesh) {
            showNotification(`Placed ${selectedFurniture} in room`)
          } else {
            console.error("Failed to add furniture, mesh is null")
          }
        })
      } else {
        console.log("Point is outside room bounds")
        showNotification("Cannot place furniture outside room bounds")
      }
    } else {
      console.log("No intersection with floor plane")
    }
  }

  // Delete furniture
  const deleteFurniture = () => {
    if (!roomGroupRef.current) return

    const meshes = placedItems.map((i) => i.mesh)
    if (!meshes.length) return showNotification("No items to delete.")

    const hits = raycaster.intersectObjects(meshes, true)
    if (!hits.length) return showNotification("Click on a furniture to remove")

    // find root object from hit
    let obj = hits[0].object
    while (obj.parent && !meshes.includes(obj)) obj = obj.parent

    const idx = placedItems.findIndex((i) => i.mesh === obj)
    if (idx < 0) return

    roomGroupRef.current.remove(obj)

    // Clean up resources
    obj.traverse((child) => {
      if (child.geometry) child.geometry.dispose()
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose())
        } else {
          child.material.dispose()
        }
      }
    })

    const newPlacedItems = [...placedItems]
    const removedItem = newPlacedItems[idx]
    newPlacedItems.splice(idx, 1)
    setPlacedItems(newPlacedItems)

    showNotification(`Removed ${removedItem.type} from room`)
  }

  // Rotate furniture
  const rotateFurniture = () => {
    const meshes = placedItems.map((i) => i.mesh)
    const hits = raycaster.intersectObjects(meshes, true)
    if (!hits.length) return

    let obj = hits[0].object
    while (obj.parent && !meshes.includes(obj)) obj = obj.parent

    obj.rotation.y += Math.PI / 4
    showNotification("Rotated furniture")
  }

  // Change furniture color
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

  // Change furniture size
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

  // Change furniture shade
  const changeFurnitureShade = () => {
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

  // Add this helper function
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

  return {
    addFurniture,
    deleteFurniture,
    rotateFurniture,
    placeFurniture,
    changeFurnitureColor,
    changeFurnitureSize,
    changeFurnitureShade,
  }
}
