"use client"

import { useEffect, useCallback } from "react"
import * as THREE from "three"
import { useAppContext } from "../context/AppContext"
import useTextureManager from "./useTextureManager"
import useModelManager from "./useModelManager"

export default function useRoomManager() {
  const { sceneRef, roomGroupRef, roomConfig, roomType, placedItems, setPlacedItems, showNotification } =
    useAppContext()

  const textureManager = useTextureManager()
  const modelManager = useModelManager()

  // Room sizes configuration
  const roomSizes = {
    small: { width: 3, height: 2.5, depth: 3 },
    medium: { width: 4, height: 3, depth: 4 },
    large: { width: 5, height: 3.5, depth: 5 },
  }

  // Create grid
  useEffect(() => {
    if (!sceneRef.current) return

    const gridSize = 10
    const grid = new THREE.GridHelper(gridSize, gridSize, 0xcccccc, 0xcccccc)
    grid.material.opacity = 0.3
    grid.material.transparent = true
    sceneRef.current.add(grid)

    return () => {
      sceneRef.current?.remove(grid)
      grid.material.dispose()
    }
  }, [sceneRef])

  // Build room whenever room config or room type changes
  useEffect(() => {
    if (!roomGroupRef.current) return

    buildRoom()

    // Make one wall invisible
    setTimeout(() => makeWallInvisible(), 0)
  }, [roomConfig, roomType])

  const buildRoom = () => {
    if (!roomGroupRef.current) return

    // First, preserve existing non-wall, non-floor objects (furniture)
    const objectsToKeep = []
    roomGroupRef.current.children.forEach((child) => {
      if (
        !child.isWall &&
        !child.isCeiling &&
        !child.isFixture &&
        child.name !== "floor" &&
        child.name !== "carpet" &&
        child.name !== "windowFrame" &&
        child.name !== "windowGlass" &&
        child.name !== "curtainRod" &&
        child.name !== "curtain" &&
        child.name !== "baseboard" &&
        child.name !== "crownMolding" &&
        child.name !== "counter" &&
        child.name !== "cabinet" &&
        child.name !== "sink" &&
        child.name !== "stove" &&
        child.name !== "refrigerator" &&
        child.name !== "kitchenIsland" &&
        child.name !== "backsplash"
      ) {
        objectsToKeep.push(child)
      }
    })

    // Clear all current objects
    while (roomGroupRef.current.children.length) {
      const child = roomGroupRef.current.children[0]
      if (child.geometry) child.geometry.dispose()
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose())
        } else {
          child.material.dispose()
        }
      }
      roomGroupRef.current.remove(child)
    }

    // Add back preserved objects
    objectsToKeep.forEach((obj) => {
      roomGroupRef.current.add(obj)
    })

    const roomSize = roomSizes[roomConfig.size]

    // Build the appropriate room type
    switch (roomType) {
      case "kitchen":
        buildKitchenRoom(roomSize)
        break
      case "dining":
      case "bedroom":
      case "office":
        // For now, these room types just show the living room
        buildLivingRoom(roomSize)
        showNotification(`${roomType} room design coming soon! Showing living room for now.`)
        break
      case "living":
      default:
        buildLivingRoom(roomSize)
        break
    }
  }

  const buildLivingRoom = (roomSize) => {
    // Floor - Use the floorColor from config
    const floorColor = roomConfig.floorColor || "#cccccc"

    // Create a nicer floor with wood texture
    const floorTexture = textureManager.getTexture("wood")
    let floorMaterial

    if (floorTexture) {
      floorTexture.wrapS = THREE.RepeatWrapping
      floorTexture.wrapT = THREE.RepeatWrapping
      floorTexture.repeat.set(2, 2)
      floorMaterial = new THREE.MeshStandardMaterial({
        map: floorTexture,
        color: new THREE.Color(floorColor),
        roughness: 0.8,
      })
    } else {
      floorMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(floorColor),
        roughness: 0.8,
      })
    }

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(roomSize.width, roomSize.depth), floorMaterial)
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    floor.name = "floor"
    roomGroupRef.current.add(floor)

    // Add a carpet/rug
    const carpetSize = {
      width: roomSize.width * 0.7,
      depth: roomSize.depth * 0.7,
    }
    const carpet = new THREE.Mesh(
      new THREE.PlaneGeometry(carpetSize.width, carpetSize.depth),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#e0c9a6"),
        roughness: 0.9,
      }),
    )
    carpet.rotation.x = -Math.PI / 2
    carpet.position.y = 0.005 // Slightly above the floor to prevent z-fighting
    carpet.receiveShadow = true
    carpet.name = "carpet"
    roomGroupRef.current.add(carpet)

    // Create wall material based on texture setting
    let wallMaterial

    // Check if texture is specified and loaded
    if (roomConfig.texture !== "none" && textureManager.isTextureLoaded(roomConfig.texture)) {
      // Create material with both texture and color applied
      const texture = textureManager.getTexture(roomConfig.texture)
      wallMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        color: roomConfig.color,
        side: THREE.DoubleSide,
        roughness: 0.7,
      })
    } else {
      // Just color, no texture
      wallMaterial = new THREE.MeshStandardMaterial({
        color: roomConfig.color,
        side: THREE.DoubleSide,
        roughness: 0.7,
      })
    }

    // Create walls with identifiers for easier reference
    const wallPositions = [
      { pos: new THREE.Vector3(0, roomSize.height / 2, roomSize.depth / 2), rot: 0, name: "frontWall" },
      { pos: new THREE.Vector3(0, roomSize.height / 2, -roomSize.depth / 2), rot: Math.PI, name: "backWall" },
      { pos: new THREE.Vector3(-roomSize.width / 2, roomSize.height / 2, 0), rot: Math.PI / 2, name: "leftWall" },
      { pos: new THREE.Vector3(roomSize.width / 2, roomSize.height / 2, 0), rot: -Math.PI / 2, name: "rightWall" },
    ]

    wallPositions.forEach((wallData) => {
      const wallSize = wallData.name === "frontWall" || wallData.name === "backWall" ? roomSize.width : roomSize.depth

      const wall = new THREE.Mesh(new THREE.PlaneGeometry(wallSize, roomSize.height), wallMaterial.clone())

      wall.position.copy(wallData.pos)
      wall.rotation.y = wallData.rot
      wall.receiveShadow = true
      wall.name = wallData.name
      wall.isWall = true // Add a property to identify walls
      roomGroupRef.current.add(wall)

      // Add baseboards to each wall
      const baseboard = new THREE.Mesh(
        new THREE.BoxGeometry(wallSize, 0.1, 0.02),
        new THREE.MeshStandardMaterial({ color: "#ffffff" }),
      )
      baseboard.position.set(wallData.pos.x, 0.05, wallData.pos.z)
      baseboard.rotation.y = wallData.rot
      baseboard.name = "baseboard"
      roomGroupRef.current.add(baseboard)

      // Add crown molding to each wall
      const crownMolding = new THREE.Mesh(
        new THREE.BoxGeometry(wallSize, 0.1, 0.05),
        new THREE.MeshStandardMaterial({ color: "#ffffff" }),
      )
      crownMolding.position.set(wallData.pos.x, roomSize.height - 0.05, wallData.pos.z)
      crownMolding.rotation.y = wallData.rot
      crownMolding.name = "crownMolding"
      roomGroupRef.current.add(crownMolding)

      // Add windows to side walls
      if (wallData.name === "leftWall" || wallData.name === "rightWall") {
        // Window frame
        const windowWidth = 1.2
        const windowHeight = 1.5
        const windowY = roomSize.height / 2 + 0.2

        // Create window frame
        const windowFrame = new THREE.Mesh(
          new THREE.BoxGeometry(windowWidth + 0.1, windowHeight + 0.1, 0.1),
          new THREE.MeshStandardMaterial({ color: "#ffffff" }),
        )
        windowFrame.position.set(wallData.pos.x, windowY, 0)
        windowFrame.rotation.y = wallData.rot
        windowFrame.name = "windowFrame"
        roomGroupRef.current.add(windowFrame)

        // Create window glass
        const windowGlass = new THREE.Mesh(
          new THREE.PlaneGeometry(windowWidth, windowHeight),
          new THREE.MeshStandardMaterial({
            color: "#a5d6f7",
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide,
          }),
        )
        windowGlass.position.set(wallData.pos.x + (wallData.name === "leftWall" ? 0.06 : -0.06), windowY, 0)
        windowGlass.rotation.y = wallData.rot
        windowGlass.name = "windowGlass"
        roomGroupRef.current.add(windowGlass)

        // Add curtain rod
        const curtainRod = new THREE.Mesh(
          new THREE.CylinderGeometry(0.02, 0.02, windowWidth + 0.4, 8),
          new THREE.MeshStandardMaterial({ color: "#5c3c10" }),
        )
        curtainRod.position.set(wallData.pos.x, windowY + windowHeight / 2 + 0.1, 0)
        curtainRod.rotation.z = Math.PI / 2
        curtainRod.rotation.y = wallData.rot
        curtainRod.name = "curtainRod"
        roomGroupRef.current.add(curtainRod)

        // Add curtains on both sides
        const curtainWidth = 0.4
        const curtainHeight = windowHeight + 0.2
        const curtainMaterial = new THREE.MeshStandardMaterial({
          color: "#d4c1a8",
          side: THREE.DoubleSide,
          roughness: 1.0,
        })

        // Left curtain
        const leftCurtain = new THREE.Mesh(new THREE.PlaneGeometry(curtainWidth, curtainHeight), curtainMaterial)
        leftCurtain.position.set(
          wallData.pos.x + (wallData.name === "leftWall" ? 0.07 : -0.07),
          windowY - 0.1,
          windowWidth / 2 - curtainWidth / 2,
        )
        leftCurtain.rotation.y = wallData.rot
        leftCurtain.name = "curtain"
        roomGroupRef.current.add(leftCurtain)

        // Right curtain
        const rightCurtain = new THREE.Mesh(new THREE.PlaneGeometry(curtainWidth, curtainHeight), curtainMaterial)
        rightCurtain.position.set(
          wallData.pos.x + (wallData.name === "leftWall" ? 0.07 : -0.07),
          windowY - 0.1,
          -windowWidth / 2 + curtainWidth / 2,
        )
        rightCurtain.rotation.y = wallData.rot
        rightCurtain.name = "curtain"
        roomGroupRef.current.add(rightCurtain)
      }
    })

    // Add ceiling
    const ceilingTexture = textureManager.getTexture("concrete")
    let ceilingMaterial

    if (ceilingTexture) {
      ceilingTexture.wrapS = THREE.RepeatWrapping
      ceilingTexture.wrapT = THREE.RepeatWrapping
      ceilingTexture.repeat.set(2, 2)
      ceilingMaterial = new THREE.MeshStandardMaterial({
        map: ceilingTexture,
        color: "#f5f5f5",
        roughness: 0.8,
      })
    } else {
      ceilingMaterial = new THREE.MeshStandardMaterial({
        color: "#f5f5f5",
        roughness: 0.8,
      })
    }

    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomSize.width, roomSize.depth), ceilingMaterial)
    ceiling.rotation.x = Math.PI / 2
    ceiling.position.y = roomSize.height
    ceiling.receiveShadow = true
    ceiling.name = "ceiling"
    ceiling.isCeiling = true
    roomGroupRef.current.add(ceiling)

    // Add a simple chandelier/light fixture
    const lightFixtureBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 0.05, 16),
      new THREE.MeshStandardMaterial({ color: "#e0e0e0" }),
    )
    lightFixtureBase.position.y = roomSize.height - 0.03
    lightFixtureBase.name = "lightFixture"
    lightFixtureBase.isFixture = true
    roomGroupRef.current.add(lightFixtureBase)

    // Add the hanging part
    const lightFixtureHang = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8),
      new THREE.MeshStandardMaterial({ color: "#a0a0a0" }),
    )
    lightFixtureHang.position.y = roomSize.height - 0.3
    lightFixtureHang.name = "lightFixture"
    lightFixtureHang.isFixture = true
    roomGroupRef.current.add(lightFixtureHang)

    // Add the lamp shade
    const lampShade = new THREE.Mesh(
      new THREE.ConeGeometry(0.3, 0.4, 16, 1, true),
      new THREE.MeshStandardMaterial({
        color: "#f0f0f0",
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
      }),
    )
    lampShade.position.y = roomSize.height - 0.6
    lampShade.rotation.x = Math.PI
    lampShade.name = "lightFixture"
    lampShade.isFixture = true
    roomGroupRef.current.add(lampShade)

    // Add a point light inside the lamp
    const lampLight = new THREE.PointLight(0xffffcc, 0.8, 10)
    lampLight.position.y = roomSize.height - 0.7
    lampLight.name = "lampLight"
    roomGroupRef.current.add(lampLight)
  }

  const buildKitchenRoom = (roomSize) => {
    // Floor - Use the floorColor from config
    const floorColor = roomConfig.floorColor || "#cccccc"

    // Create a kitchen floor with tile texture
    const floorTexture = textureManager.getTexture("concrete") // Using concrete as tile for now
    let floorMaterial

    if (floorTexture) {
      floorTexture.wrapS = THREE.RepeatWrapping
      floorTexture.wrapT = THREE.RepeatWrapping
      floorTexture.repeat.set(4, 4) // More tiles
      floorMaterial = new THREE.MeshStandardMaterial({
        map: floorTexture,
        color: new THREE.Color(floorColor),
        roughness: 0.7,
      })
    } else {
      floorMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(floorColor),
        roughness: 0.7,
      })
    }

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(roomSize.width, roomSize.depth), floorMaterial)
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    floor.name = "floor"
    roomGroupRef.current.add(floor)

    // Create wall material based on texture setting
    let wallMaterial

    // Check if texture is specified and loaded
    if (roomConfig.texture !== "none" && textureManager.isTextureLoaded(roomConfig.texture)) {
      // Create material with both texture and color applied
      const texture = textureManager.getTexture(roomConfig.texture)
      wallMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        color: roomConfig.color,
        side: THREE.DoubleSide,
        roughness: 0.7,
      })
    } else {
      // Just color, no texture
      wallMaterial = new THREE.MeshStandardMaterial({
        color: roomConfig.color,
        side: THREE.DoubleSide,
        roughness: 0.7,
      })
    }

    // Create walls with identifiers for easier reference
    const wallPositions = [
      { pos: new THREE.Vector3(0, roomSize.height / 2, roomSize.depth / 2), rot: 0, name: "frontWall" },
      { pos: new THREE.Vector3(0, roomSize.height / 2, -roomSize.depth / 2), rot: Math.PI, name: "backWall" },
      { pos: new THREE.Vector3(-roomSize.width / 2, roomSize.height / 2, 0), rot: Math.PI / 2, name: "leftWall" },
      { pos: new THREE.Vector3(roomSize.width / 2, roomSize.height / 2, 0), rot: -Math.PI / 2, name: "rightWall" },
    ]

    wallPositions.forEach((wallData) => {
      const wallSize = wallData.name === "frontWall" || wallData.name === "backWall" ? roomSize.width : roomSize.depth

      const wall = new THREE.Mesh(new THREE.PlaneGeometry(wallSize, roomSize.height), wallMaterial.clone())

      wall.position.copy(wallData.pos)
      wall.rotation.y = wallData.rot
      wall.receiveShadow = true
      wall.name = wallData.name
      wall.isWall = true // Add a property to identify walls
      roomGroupRef.current.add(wall)

      // Add baseboards to each wall
      const baseboard = new THREE.Mesh(
        new THREE.BoxGeometry(wallSize, 0.1, 0.02),
        new THREE.MeshStandardMaterial({ color: "#ffffff" }),
      )
      baseboard.position.set(wallData.pos.x, 0.05, wallData.pos.z)
      baseboard.rotation.y = wallData.rot
      baseboard.name = "baseboard"
      roomGroupRef.current.add(baseboard)

      // Add crown molding to each wall
      const crownMolding = new THREE.Mesh(
        new THREE.BoxGeometry(wallSize, 0.1, 0.05),
        new THREE.MeshStandardMaterial({ color: "#ffffff" }),
      )
      crownMolding.position.set(wallData.pos.x, roomSize.height - 0.05, wallData.pos.z)
      crownMolding.rotation.y = wallData.rot
      crownMolding.name = "crownMolding"
      roomGroupRef.current.add(crownMolding)

      // Add a window to the back wall
      if (wallData.name === "backWall") {
        // Window frame
        const windowWidth = 1.2
        const windowHeight = 1.0
        const windowY = roomSize.height / 2 + 0.5

        // Create window frame
        const windowFrame = new THREE.Mesh(
          new THREE.BoxGeometry(windowWidth + 0.1, windowHeight + 0.1, 0.1),
          new THREE.MeshStandardMaterial({ color: "#ffffff" }),
        )
        windowFrame.position.set(wallData.pos.x, windowY, wallData.pos.z + 0.01)
        windowFrame.rotation.y = wallData.rot
        windowFrame.name = "windowFrame"
        roomGroupRef.current.add(windowFrame)

        // Create window glass
        const windowGlass = new THREE.Mesh(
          new THREE.PlaneGeometry(windowWidth, windowHeight),
          new THREE.MeshStandardMaterial({
            color: "#a5d6f7",
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide,
          }),
        )
        windowGlass.position.set(wallData.pos.x, windowY, wallData.pos.z + 0.02)
        windowGlass.rotation.y = wallData.rot
        windowGlass.name = "windowGlass"
        roomGroupRef.current.add(windowGlass)
      }

      // Add kitchen cabinets and counters to the back wall
      if (wallData.name === "backWall") {
        // Add backsplash
        const backsplashHeight = 0.6
        const backsplashY = 1.0 + backsplashHeight / 2
        const backsplash = new THREE.Mesh(
          new THREE.PlaneGeometry(roomSize.width - 0.4, backsplashHeight),
          new THREE.MeshStandardMaterial({
            color: "#e0e0e0",
            roughness: 0.2,
          }),
        )
        backsplash.position.set(0, backsplashY, -roomSize.depth / 2 + 0.01)
        backsplash.name = "backsplash"
        roomGroupRef.current.add(backsplash)

        // Add counter
        const counterDepth = 0.6
        const counterHeight = 0.05
        const counterY = 1.0
        const counter = new THREE.Mesh(
          new THREE.BoxGeometry(roomSize.width - 0.4, counterHeight, counterDepth),
          new THREE.MeshStandardMaterial({
            color: "#d0d0d0", // Granite-like color
            roughness: 0.4,
          }),
        )
        counter.position.set(0, counterY, -roomSize.depth / 2 + counterDepth / 2)
        counter.name = "counter"
        roomGroupRef.current.add(counter)

        // Add cabinets below counter
        const cabinetHeight = 0.9
        const cabinetY = counterY - cabinetHeight / 2 - counterHeight / 2
        const cabinet = new THREE.Mesh(
          new THREE.BoxGeometry(roomSize.width - 0.4, cabinetHeight, counterDepth - 0.05),
          new THREE.MeshStandardMaterial({
            color: "#5c4033", // Brown wood color
            roughness: 0.8,
          }),
        )
        cabinet.position.set(0, cabinetY, -roomSize.depth / 2 + (counterDepth - 0.05) / 2)
        cabinet.name = "cabinet"
        roomGroupRef.current.add(cabinet)

        // Add upper cabinets
        const upperCabinetHeight = 0.7
        const upperCabinetY = counterY + backsplashHeight + upperCabinetHeight / 2 + 0.1
        const upperCabinetDepth = 0.35
        const upperCabinet = new THREE.Mesh(
          new THREE.BoxGeometry(roomSize.width - 0.4, upperCabinetHeight, upperCabinetDepth),
          new THREE.MeshStandardMaterial({
            color: "#5c4033", // Match lower cabinets
            roughness: 0.8,
          }),
        )
        upperCabinet.position.set(0, upperCabinetY, -roomSize.depth / 2 + upperCabinetDepth / 2)
        upperCabinet.name = "cabinet"
        roomGroupRef.current.add(upperCabinet)

        // Add sink
        const sinkWidth = 0.6
        const sinkDepth = 0.4
        const sinkHeight = 0.1
        const sink = new THREE.Mesh(
          new THREE.BoxGeometry(sinkWidth, sinkHeight, sinkDepth),
          new THREE.MeshStandardMaterial({
            color: "#c0c0c0", // Silver color
            roughness: 0.2,
            metalness: 0.8,
          }),
        )
        sink.position.set(-0.8, counterY + 0.01, -roomSize.depth / 2 + sinkDepth / 2 + 0.1)
        sink.name = "sink"
        roomGroupRef.current.add(sink)

        // Add stove/cooktop
        const stoveWidth = 0.6
        const stoveDepth = 0.5
        const stoveHeight = 0.03
        const stove = new THREE.Mesh(
          new THREE.BoxGeometry(stoveWidth, stoveHeight, stoveDepth),
          new THREE.MeshStandardMaterial({
            color: "#101010", // Black color
            roughness: 0.5,
          }),
        )
        stove.position.set(0.8, counterY + 0.01, -roomSize.depth / 2 + stoveDepth / 2 + 0.05)
        stove.name = "stove"
        roomGroupRef.current.add(stove)

        // Add burners to stove
        const burnerRadius = 0.08
        const burnerPositions = [
          { x: 0.65, z: -roomSize.depth / 2 + 0.2 },
          { x: 0.95, z: -roomSize.depth / 2 + 0.2 },
          { x: 0.65, z: -roomSize.depth / 2 + 0.4 },
          { x: 0.95, z: -roomSize.depth / 2 + 0.4 },
        ]

        burnerPositions.forEach((pos) => {
          const burner = new THREE.Mesh(
            new THREE.CircleGeometry(burnerRadius, 16),
            new THREE.MeshStandardMaterial({
              color: "#303030",
              roughness: 0.8,
            }),
          )
          burner.rotation.x = -Math.PI / 2
          burner.position.set(pos.x, counterY + 0.02, pos.z)
          burner.name = "stove"
          roomGroupRef.current.add(burner)
        })
      }

      // Add refrigerator to the right wall
      if (wallData.name === "rightWall") {
        const fridgeWidth = 0.8
        const fridgeDepth = 0.7
        const fridgeHeight = 2.0
        const fridgeX = roomSize.width / 2 - fridgeDepth / 2 - 0.05
        const fridgeY = fridgeHeight / 2
        const fridgeZ = -roomSize.depth / 2 + 1.0

        const fridge = new THREE.Mesh(
          new THREE.BoxGeometry(fridgeWidth, fridgeHeight, fridgeDepth),
          new THREE.MeshStandardMaterial({
            color: "#c0c0c0", // Silver color
            roughness: 0.3,
            metalness: 0.7,
          }),
        )
        fridge.position.set(fridgeX, fridgeY, fridgeZ)
        fridge.name = "refrigerator"
        roomGroupRef.current.add(fridge)

        // Add fridge door handle
        const handleWidth = 0.03
        const handleHeight = 0.5
        const handleDepth = 0.05
        const handle = new THREE.Mesh(
          new THREE.BoxGeometry(handleWidth, handleHeight, handleDepth),
          new THREE.MeshStandardMaterial({
            color: "#a0a0a0",
            metalness: 0.9,
            roughness: 0.2,
          }),
        )
        handle.position.set(fridgeX - fridgeWidth / 2 - handleWidth / 2, fridgeY, fridgeZ + fridgeDepth / 4)
        handle.name = "refrigerator"
        roomGroupRef.current.add(handle)
      }
    })

    // Add kitchen island in the center
    const islandWidth = roomSize.width * 0.4
    const islandDepth = roomSize.depth * 0.3
    const islandHeight = 0.9
    const islandY = islandHeight / 2

    const island = new THREE.Mesh(
      new THREE.BoxGeometry(islandWidth, islandHeight, islandDepth),
      new THREE.MeshStandardMaterial({
        color: "#5c4033", // Match cabinets
        roughness: 0.8,
      }),
    )
    island.position.set(0, islandY, 0.3)
    island.name = "kitchenIsland"
    roomGroupRef.current.add(island)

    // Add island countertop
    const islandTop = new THREE.Mesh(
      new THREE.BoxGeometry(islandWidth + 0.1, 0.05, islandDepth + 0.1),
      new THREE.MeshStandardMaterial({
        color: "#d0d0d0", // Match counter
        roughness: 0.4,
      }),
    )
    islandTop.position.set(0, islandHeight + 0.025, 0.3)
    islandTop.name = "counter"
    roomGroupRef.current.add(islandTop)

    // Add ceiling
    const ceilingTexture = textureManager.getTexture("concrete")
    let ceilingMaterial

    if (ceilingTexture) {
      ceilingTexture.wrapS = THREE.RepeatWrapping
      ceilingTexture.wrapT = THREE.RepeatWrapping
      ceilingTexture.repeat.set(2, 2)
      ceilingMaterial = new THREE.MeshStandardMaterial({
        map: ceilingTexture,
        color: "#f5f5f5",
        roughness: 0.8,
      })
    } else {
      ceilingMaterial = new THREE.MeshStandardMaterial({
        color: "#f5f5f5",
        roughness: 0.8,
      })
    }

    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomSize.width, roomSize.depth), ceilingMaterial)
    ceiling.rotation.x = Math.PI / 2
    ceiling.position.y = roomSize.height
    ceiling.receiveShadow = true
    ceiling.name = "ceiling"
    ceiling.isCeiling = true
    roomGroupRef.current.add(ceiling)

    // Add recessed lights to ceiling
    const lightPositions = [
      { x: -roomSize.width / 4, z: -roomSize.depth / 4 },
      { x: roomSize.width / 4, z: -roomSize.depth / 4 },
      { x: -roomSize.width / 4, z: roomSize.depth / 4 },
      { x: roomSize.width / 4, z: roomSize.depth / 4 },
    ]

    lightPositions.forEach((pos, index) => {
      // Light fixture
      const light = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16),
        new THREE.MeshStandardMaterial({ color: "#f0f0f0" }),
      )
      light.position.set(pos.x, roomSize.height - 0.03, pos.z)
      light.name = "lightFixture"
      light.isFixture = true
      roomGroupRef.current.add(light)

      // Add a point light
      const pointLight = new THREE.PointLight(0xffffcc, 0.5, 5)
      pointLight.position.set(pos.x, roomSize.height - 0.1, pos.z)
      pointLight.name = `ceilingLight${index}`
      roomGroupRef.current.add(pointLight)
    })

    // Add pendant lights over island
    const pendantPositions = [
      { x: -islandWidth / 4, z: 0.3 },
      { x: islandWidth / 4, z: 0.3 },
    ]

    pendantPositions.forEach((pos) => {
      // Pendant cord
      const cord = new THREE.Mesh(
        new THREE.CylinderGeometry(0.01, 0.01, roomSize.height - (islandHeight + 0.6), 8),
        new THREE.MeshStandardMaterial({ color: "#202020" }),
      )
      cord.position.set(pos.x, (roomSize.height + islandHeight + 0.6) / 2, pos.z)
      cord.name = "lightFixture"
      cord.isFixture = true
      roomGroupRef.current.add(cord)

      // Pendant shade
      const shade = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.2, 0.3, 16),
        new THREE.MeshStandardMaterial({
          color: "#e0e0e0",
          side: THREE.DoubleSide,
        }),
      )
      shade.position.set(pos.x, islandHeight + 0.6, pos.z)
      shade.name = "lightFixture"
      shade.isFixture = true
      roomGroupRef.current.add(shade)

      // Add a point light inside the pendant
      const pendantLight = new THREE.PointLight(0xffffcc, 0.6, 3)
      pendantLight.position.set(pos.x, islandHeight + 0.5, pos.z)
      pendantLight.name = "pendantLight"
      roomGroupRef.current.add(pendantLight)
    })
  }

  const makeWallInvisible = () => {
    if (!roomGroupRef.current) return

    const wallToHide = roomGroupRef.current.children.find((child) => {
      // use isWall flag first
      if (child.isWall && child.position.z > 0) return true
      // only check mesh geometries
      if (
        child.isMesh &&
        child.geometry &&
        child.geometry.type === "PlaneGeometry" &&
        child.position.z > 0 &&
        Math.abs(child.position.x) < 0.1
      ) {
        return true
      }
      return false
    })

    if (wallToHide) {
      wallToHide.visible = false

      // Also hide any window frames, curtains, etc. on this wall
      roomGroupRef.current.children.forEach((child) => {
        if (
          (child.name === "windowFrame" ||
            child.name === "windowGlass" ||
            child.name === "curtainRod" ||
            child.name === "curtain" ||
            child.name === "baseboard" ||
            child.name === "crownMolding") &&
          child.position.z > 0 &&
          Math.abs(child.position.x) < 0.1
        ) {
          child.visible = false
        }
      })
    }
  }

  const addFurniture = useCallback(
    async (type, position, options = {}) => {
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

        return model
      } catch (error) {
        console.error("Error adding furniture:", error)
        showNotification(`Error adding furniture: ${error.message}`)
        return null
      }
    },
    [roomGroupRef, modelManager, setPlacedItems, showNotification],
  )

  const updateWallTransparency = (camera) => {
    if (!roomGroupRef.current || !camera) return

    const raycaster = new THREE.Raycaster()
    const directions = [new THREE.Vector3(0, 0, -1), new THREE.Vector3(0.33, 0, -1), new THREE.Vector3(-0.33, 0, -1)]

    roomGroupRef.current.children.forEach((child) => {
      if (child.material && child.material.opacity !== 1) {
        child.material.opacity = 1
        child.material.needsUpdate = true
      }
    })

    directions.forEach((dir) => {
      raycaster.setFromCamera(dir, camera)
      const intersects = raycaster.intersectObjects(roomGroupRef.current.children)

      if (intersects.length > 0 && intersects[0].object.material) {
        intersects[0].object.material.opacity = 0.2
        intersects[0].object.material.transparent = true
        intersects[0].object.material.needsUpdate = true
      }
    })
  }

  const removeObject = (object) => {
    if (!object || !roomGroupRef.current) return

    // Remove from scene
    roomGroupRef.current.remove(object)

    // Remove from tracking array
    setPlacedItems((prev) => prev.filter((item) => item.mesh !== object))
  }

  // Return public methods
  return {
    buildRoom,
    makeWallInvisible,
    updateWallTransparency,
    addFurniture,
    removeObject,
  }
}
