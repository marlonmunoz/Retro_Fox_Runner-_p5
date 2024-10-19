const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const dpr = window.devicePixelRatio || 1

canvas.width = 2924 * dpr // 2924
canvas.height = 1540 * dpr // 1340

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
  //  l_Gems: l_Gems,
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
  l_Gems: { imageUrl: './images/decorations.png', tileSize: 16 },
  // l_enemies: { imageUrl: './images/decorations.png', tileSize: 16 },
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

// ===========================================================================
// ===========================================================================

// END - Tile setup

// Change xy coordinates to move player's default position
let player = new Player({
  x: 100,
  y: 100,
  size: 32,
})



let opossums = [ 
  new Opossum({   // add as many opossums as you want 
    x: 190,
    y: 100,
    size: 32,
    width: 36,
    height: 28,
  }),
  new Opossum({   // add as many opossums as you want 
    x: 750,
    y: 400,
    size: 32,
    width: 36,
    height: 28,
  }),

]

let sprites = []
//=================================================================================
let hearts = [ 
  new Heart ({
    x: 10, 
    y: 10, 
    width: 21, 
    height: 18, 
    imageSrc: './images/hearts.png', 
    spriteCropbox: {
      x: 0,
      y: 0,
      width: 21,
      height: 18,
      frames: 6,
    },
  }),
  new Heart ({
    x: 33, 
    y: 10, 
    width: 21, 
    height: 18, 
    imageSrc: './images/hearts.png', 
    spriteCropbox: {
      x: 0,
      y: 0,
      width: 21,
      height: 18,
      frames: 6,
    },
  }),
  new Heart ({
    x: 56, 
    y: 10, 
    width: 21, 
    height: 18, 
    imageSrc: './images/hearts.png', 
    spriteCropbox: {
      x: 0,
      y: 0,
      width: 21,
      height: 18,
      frames: 6,
    },
  })
]
//=================================================================================


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


let lastTime = performance.now()
let camera = {
  x: 0,
  y: 0,
}

// First scroll post
const SCROLL_POST_RIGHT = 240
const SCROLL_POST_TOP = 100
const SCROLL_POST_BOTTOM = 200
const SCROLL_POST_LEFT = 6570 
let seaSkyBackground = null
let mountainsBackground = null
let gems = []
let gemUI = new Sprite({
  x: 13, 
  y: 36, 
  width: 15, 
  height: 13, 
  imageSrc: './images/gem.png',
  spriteCropbox: {
    x: 0,
    y: 0,
    width:15,
    height: 13,
    frames: 5,
  },
})
let gemCount = 0
// GAME RESET
function init() {
  gems = []
  gemCount = 0
  gemUI = new Sprite({
    x: 13, 
    y: 36, 
    width: 15, 
    height: 13, 
    imageSrc: './images/gem.png',
    spriteCropbox: {
      x: 0,
      y: 0,
      width:15,
      height: 13,
      frames: 5,
    },
  })
  l_Gems.forEach((row, y) => {
    row.forEach((symbol, x) => {
      if (symbol === 18) {
        gems.push(
          new Sprite({
            x: x * 16, 
            y: y * 16, 
            width: 15, 
            height: 13, 
            imageSrc: './images/gem.png',
            spriteCropbox: {
              x: 0,
              y: 0,
              width:15,
              height: 13,
              frames: 5,
            },
            hitbox: {
              x: x * 16, 
              y: y * 16, 
              width: 15, 
              height: 13,
            }
          }),
        )
      } 
    })
  }) 

  player = new Player({
    x: 100,
    y: 100,
    size: 32,
    // velocity: {x: 0, y: 0},
  })
  opossums = [ 
    new Opossum({   // add as many opossums as you want 
      x: 190,
      y: 100,
      size: 32,
      width: 36,
      height: 28,
    }),
    new Opossum({   // add as many opossums as you want 
      x: 750,
      y: 400,
      size: 32,
      width: 36,
      height: 28,
    }),
  ]
  sprites = []
  hearts = [ 
    new Heart ({
      x: 10, 
      y: 10, 
      width: 21, 
      height: 18, 
      imageSrc: './images/hearts.png', 
      spriteCropbox: {
        x: 0,
        y: 0,
        width: 21,
        height: 18,
        frames: 6,
      },
    }),
    new Heart ({
      x: 33, 
      y: 10, 
      width: 21, 
      height: 18, 
      imageSrc: './images/hearts.png', 
      spriteCropbox: {
        x: 0,
        y: 0,
        width: 21,
        height: 18,
        frames: 6,
      },
    }),
    new Heart ({
      x: 56, 
      y: 10, 
      width: 21, 
      height: 18, 
      imageSrc: './images/hearts.png', 
      spriteCropbox: {
        x: 0,
        y: 0,
        width: 21,
        height: 18,
        frames: 6,
      },
    })
  ]
  camera = {
    x: 0,
    y: 0,
  }
}


function animate(backgroundCanvas) {
  // Calculate delta time
  const currentTime = performance.now()
  const deltaTime = (currentTime - lastTime) / 1000
  lastTime = currentTime

  // Update player position
  player.handleInput(keys)
  player.update(deltaTime, collisionBlocks)

  // Update Opossum Position
  for (let i = opossums.length - 1; i >= 0; i--) {
    const opossum = opossums[i]
    opossum.update(deltaTime, collisionBlocks)

    // Jump on an enemy
    const collisionDirection = checkCollitions(player, opossum)
    if (collisionDirection) { // if collision exits, remove enemy from the game
      // console.log(collisionDirection);
      if (collisionDirection === 'bottom' && !player.isOnGround) {
        player.velocity.y = -200
        sprites.push(
          new Sprite({
            x: opossum.x, 
            y: opossum.y, 
            width: 32, 
            height: 32, 
            imageSrc: './images/enemy-death.png',
            spriteCropbox: {
              x: 0,
              y: 0,
              width:40,
              height: 41,
              frames: 6,
            },
          }),
        )
        opossums.splice(i, 1) // this will remove the enemies when you jump on top
      } else if (
        collisionDirection === 'left' || 
        collisionDirection === 'right'
      ) {

        const fullHearts = hearts.filter((heart) => {
          return !heart.depleted
        })
        if (!player.isInvincible && fullHearts.length > 0){
          fullHearts[fullHearts.length -1].depleted = true
        } else if (fullHearts.length === 0) {
          init()
        }
        player.setIsInvincible()
      }
    }
  }

  //for loop iterate backwards [explotion enemy death sprite]
  for (let i = sprites.length - 1; i >= 0; i--) {
    const sprite = sprites [i] // this will grab only one sprite and store it into the array
    sprite.update(deltaTime)

    if (sprite.iteration === 1) {
      sprites.splice(i, 1) // find the index, in which we want to cut out, and cut out one instance
    }
  }

  // gems
  for (let i = gems.length - 1; i >= 0; i--) {
    const gem = gems [i] // this will grab only one sprite and store it into the array
    gem.update(deltaTime)

    // THIS IS WHERE WE ARE COLLECTING GEMS
    const collisionDirection = checkCollitions(player, gem)
    if (collisionDirection) {
      // create an item feedback animation
      sprites.push(
        new Sprite({
          x: gem.x - 8, 
          y: gem.y - 8, 
          width: 32, 
          height: 32, 
          imageSrc: './images/item-feedback.png',
          spriteCropbox: {
            x: 0,
            y: 0,
            width:32,
            height: 32,
            frames: 5,
          },
        }),
      )
      //remove a gem from the game
      gems.splice(i, 1)
      gemCount++
      if (gems.length === 0) {
        console.log('YOU WIN');
        
      }
    }
  }
  

  // Track scroll post distance 01
  if (player.x > SCROLL_POST_RIGHT && player.x < 7488) {
    const scrollPostDistance = player.x - SCROLL_POST_RIGHT  
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
  c.scale(dpr + 1, dpr + 1)
  c.translate(-camera.x, camera.y) 
  c.clearRect(0, 0, canvas.width, canvas.height)
  c.drawImage(seaSkyBackgroundCanvas, camera.x * 0.32, 0) // 0.32 is the parallax effect
  c.drawImage(mountainsBackgroundCanvas, camera.x * 0.16, 0)  // 0.16 is the parallax effect
  c.drawImage(backgroundCanvas, 0, 0)
  player.draw(c)

  // opossums = enemies
  for (let i = opossums.length - 1; i >= 0; i--) {
    const opossum = opossums[i]
    opossum.draw(c)
  }
  
  // explotion on enemy deaths
  for (let i = sprites.length - 1; i >= 0; i--) {
    const sprite = sprites [i] // this will grab only one sprite and store it into the array
    sprite.draw(c)
  }

  // gems FX
  for (let i = gems.length - 1; i >= 0; i--) {
    const gem = gems [i] 
    gem.draw(c)
  }

  
  // hearts displayed on upperleft screen
  // c.fillRect(SCROLL_POST_RIGHT, 50, 10, 100)
  // c.fillRect(350, SCROLL_POST_TOP, 100, 10)
  // c.fillRect(350, SCROLL_POST_BOTTOM, 100, 10)
  // c.fillRect(SCROLL_POST_LEFT, 50, 10, 100)
  c.restore()
  
  c.save()
  c.scale(dpr + 1, dpr + 1)
  for (let i = hearts.length - 1; i >= 0; i--) {
    const heart = hearts [i] // this will grab only one sprite and store it into the array
    heart.draw(c)
  }
  gemUI.draw(c)
  c.fillText(gemCount, 33, 46)
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

init()
startRendering()
