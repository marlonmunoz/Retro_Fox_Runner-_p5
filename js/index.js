const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const dpr = window.devicePixelRatio || 1

canvas.width = 2924 * dpr // 2924
canvas.height = 1640 * dpr // 1340

const seaSkyLayerData = {
  l_Sea_Sky: l_Sea_Sky,
}

const mointainsLayerData = {
  l_Mountains: l_Mountains,
}

const layersData = {
   l_Home_Plus_Trees: l_Home_Plus_Trees,
   l_BG_Tiles: l_BG_Tiles,
   l_Ground: l_Ground,
   l_embelishments: l_embelishments,
   l_Rewards: l_Rewards,
   l_enemies: l_enemies,
   l_Collitions: l_Collitions,
};

const tilesets = {
  l_Sea_Sky: { imageUrl: './images/decorations.png', tileSize: 16 },
  l_Mountains: { imageUrl: './images/decorations.png', tileSize: 16 },
  l_Home_Plus_Trees: { imageUrl: './images/decorations.png', tileSize: 16 },
  l_BG_Tiles: { imageUrl: './images/tileset.png', tileSize: 16 },
  l_Ground: { imageUrl: './images/tileset.png', tileSize: 16 },
  l_embelishments: { imageUrl: './images/decorations.png', tileSize: 16 },
  l_Rewards: { imageUrl: './images/decorations.png', tileSize: 16 },
  l_enemies: { imageUrl: './images/decorations.png', tileSize: 16 },
  l_Collitions: { imageUrl: './images/tileset.png', tileSize: 16 },
};


// Tile setup
const collisionBlocks = []
const platforms = []
const blockSize = 16 // Assuming each tile is 16x16 pixels

collisions.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 1) {
      collisionBlocks.push(
        new CollisionBlock({
          x: x * blockSize,
          y: y * blockSize,
          size: blockSize,
        }),
      )
    } else if (symbol === 2) {
      platforms.push(
        new Platform({
          x: x * blockSize,
          y: y * blockSize + blockSize,
          width: 16,
          height: 4,
        }),
      )
    }
  })
})

const renderLayer = (tilesData, tilesetImage, tileSize, context) => {
  tilesData.forEach((row, y) => {
    row.forEach((symbol, x) => {
      if (symbol !== 0) {
        const srcX = ((symbol - 1) % (tilesetImage.width / tileSize)) * tileSize
        const srcY =
          Math.floor((symbol - 1) / (tilesetImage.width / tileSize)) * tileSize

        context.drawImage(
          tilesetImage, // source image
          srcX,
          srcY, // source x, y
          tileSize,
          tileSize, // source width, height
          x * 16,
          y * 16, // destination x, y
          16,
          16, // destination width, height
        )
      }
    })
  })
}

const renderStaticLayers = async (layersData) => {
  const offscreenCanvas = document.createElement('canvas')
  offscreenCanvas.width = canvas.width
  offscreenCanvas.height = canvas.height
  const offscreenContext = offscreenCanvas.getContext('2d')

  for (const [layerName, tilesData] of Object.entries(layersData)) {
    const tilesetInfo = tilesets[layerName]
    if (tilesetInfo) {
      try {
        const tilesetImage = await loadImage(tilesetInfo.imageUrl)
        renderLayer(
          tilesData,
          tilesetImage,
          tilesetInfo.tileSize,
          offscreenContext,
        )
      } catch (error) {
        console.error(`Failed to load image for layer ${layerName}:`, error)
      }
    }
  }

  // Optionally draw collision blocks and platforms for debugging
  // collisionBlocks.forEach(block => block.draw(offscreenContext));
  // platforms.forEach((platform) => platform.draw(offscreenContext))

  return offscreenCanvas
}

// END - Tile setup

// Change xy coordinates to move player's default position
const player = new Player({
  x: 100,
  y: 100,
  size: 32,
  velocity: { x: 0, y: 0 },
})

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
}

// ===========================================================================
// ===========================================================================

let lastTime = performance.now()
const camera = {
  x: 0,
  y: 0,
}


// const gameMapWidth = 20000; // Example width of the game map
// const gameMapHeight = 1000;

// First scroll post
const SCROLL_POST_RIGHT = 550
const SCROLL_POST_TOP = 100
const SCROLL_POST_BOTTOM = 280
const SCROLL_POST_LEFT = 6570



let seaSkyBackground = null
let mountainsBackground = null


function animate(backgroundCanvas) {
  // Calculate delta time
  const currentTime = performance.now()
  const deltaTime = (currentTime - lastTime) / 1000
  lastTime = currentTime

  // Update player position
  player.handleInput(keys)
  player.update(deltaTime, collisionBlocks)

  // Track scroll post distance 01
  if (player.x > SCROLL_POST_RIGHT) {
    const scrollPostDistance = player.x - SCROLL_POST_RIGHT;
    camera.x = scrollPostDistance 
  } 
  
  if (player.y < SCROLL_POST_TOP && camera.y > 0) {  // && camera.y > 0, ommit this condition to allow camera to go below 0
    const scrollPostDistance = SCROLL_POST_TOP - player.y
    camera.y = scrollPostDistance 
  }
  if (player.y > SCROLL_POST_BOTTOM) {
    const scrollPostDistance = player.y - SCROLL_POST_BOTTOM
    camera.y = -scrollPostDistance 
  }
  
  
  // Render scene
  c.save()
  c.scale(dpr, dpr)
  c.translate(-camera.x, camera.y) 
  c.clearRect(0, 0, canvas.width, canvas.height)
  c.drawImage(seaSkyBackgroundCanvas, camera.x * 0.32, 0) // 0.32 is the parallax effect
  c.drawImage(mountainsBackgroundCanvas, camera.x * 0.16, 0)  // 0.16 is the parallax effect
  c.drawImage(backgroundCanvas, 0, 0)
  player.draw(c)
  // c.fillRect(SCROLL_POST_RIGHT, 50, 10, 100)
  // c.fillRect(SCROLL_POST_LEFT, 50, 10, 100)
  // c.fillRect(350, SCROLL_POST_TOP, 100, 10)
  // c.fillRect(350, SCROLL_POST_BOTTOM, 100, 10)
  c.restore()

  requestAnimationFrame(() => animate(backgroundCanvas))
}


const startRendering = async () => {
  try {
    seaSkyBackgroundCanvas = await renderStaticLayers(seaSkyLayerData)
    mountainsBackgroundCanvas = await renderStaticLayers(mointainsLayerData)
    const backgroundCanvas = await renderStaticLayers(layersData)
    if (!backgroundCanvas) {
      console.error('Failed to create the background canvas')
      return
    }

    animate(backgroundCanvas)
  } catch (error) {
    console.error('Error during rendering:', error)
  }
}

startRendering()
