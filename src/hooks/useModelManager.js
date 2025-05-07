"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"

export default function useModelManager() {
  const loader = useRef(new GLTFLoader())
  const modelCache = useRef(new Map())
  const modelPaths = useRef({
    chair: "/models/chair.glb",
    table: "/models/table.glb",
    sofa: "/models/sofa.glb",
    lamp: "/models/lamp.glb",
  })

  useEffect(() => {
    return () => {
      // Clean up models on unmount
      modelCache.current.forEach((model) => {
        model.traverse((child) => {
          if (child.geometry) {
            child.geometry.dispose()
          }

          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((material) => material.dispose())
            } else {
              child.material.dispose()
            }
          }
        })
      })

      modelCache.current.clear()
    }
  }, [])

  const loadModel = async (type) => {
    if (modelCache.current.has(type)) {
      return modelCache.current.get(type).clone()
    }

    try {
      const gltf = await loader.current.loadAsync(modelPaths.current[type])
      const model = gltf.scene

      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })

      // Normalize model scale
      const box = new THREE.Box3().setFromObject(model)
      const size = box.getSize(new THREE.Vector3()).length()
      model.scale.multiplyScalar(1 / size)

      modelCache.current.set(type, model)
      return model.clone()
    } catch (error) {
      console.error("Error loading model:", error)
      return createFallbackGeometry()
    }
  }

  const createFallbackGeometry = () => {
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 })
    return new THREE.Mesh(geometry, material)
  }

  return {
    loadModel,
  }
}
