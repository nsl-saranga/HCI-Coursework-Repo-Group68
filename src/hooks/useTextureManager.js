"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function useTextureManager() {
  const textureLoader = useRef(new THREE.TextureLoader())
  const textures = useRef({
    brick: { loaded: false, texture: null },
    wood: { loaded: false, texture: null },
    concrete: { loaded: false, texture: null },
    carpet: { loaded: false, texture: null },
  })

  useEffect(() => {
    loadTextures()

    return () => {
      // Clean up textures on unmount
      Object.values(textures.current).forEach((textureObj) => {
        if (textureObj.texture) {
          textureObj.texture.dispose()
        }
      })
    }
  }, [])

  const loadTextures = () => {
    // Load brick texture
    textureLoader.current.load("/textures/brick.jpg", (texture) => {
      // Set wrapping and repeat for tiling
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(4, 2) // Adjust repeating pattern

      textures.current.brick.texture = texture
      textures.current.brick.loaded = true
    })

    // Load wood texture
    textureLoader.current.load("/textures/wood.jpg", (texture) => {
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(4, 2)

      textures.current.wood.texture = texture
      textures.current.wood.loaded = true
    })

    // Load concrete texture
    textureLoader.current.load("/textures/concrete.jpg", (texture) => {
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(2, 1)

      textures.current.concrete.texture = texture
      textures.current.concrete.loaded = true
    })

    // Load carpet texture
    textureLoader.current.load("/textures/carpet.png", (texture) => {
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(2, 2)

      textures.current.carpet.texture = texture
      textures.current.carpet.loaded = true
    })
  }

  const getTexture = (textureName) => {
    return textures.current[textureName]?.texture || null
  }

  const isTextureLoaded = (textureName) => {
    return textures.current[textureName]?.loaded || false
  }

  return {
    getTexture,
    isTextureLoaded,
    loadTextures,
  }
}
