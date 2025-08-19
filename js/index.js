// Fox Run 2 - 2D Platformer Game
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const dpr = window.devicePixelRatio || 1

canvas.width = 2124 * dpr // 2924 - 1024
canvas.height = 1376 * dpr // 1576 - 756

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
  // l_embelishments: { imageUrl: './images/decorations.png', tileSize: 16 },
  // l_Gems: { imageUrl: './images/decorations.png', tileSize: 16 },
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

// const renderStaticLayers = async (layersData) => {
//   const offscreenCanvas = document.createElement('canvas')
//   offscreenCanvas.width = canvas.width
//   offscreenCanvas.height = canvas.height
//   const offscreenContext = offscreenCanvas.getContext('2d')


  const renderStaticLayers = async (layersData) => {
    const offscreenCanvas = document.createElement('canvas')
    const MAP_COLS = 500
    const MAP_WIDTH = 500 * 16
    offscreenCanvas.width = MAP_WIDTH
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

let opossums = []
let eagles = []
let vultures = []
let sprites = []
let hearts = []
//   new Heart ({ x: 10, y: 10, width: 21, height: 18, imageSrc: './images/hearts.png', spriteCropbox: {x: 0, y: 0, width: 21, height: 18, frames: 6, }, }),

//=================================================================================

const jumpSound = new Audio('./sound/jump.mp3');
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
  p: {
    pressed: false,
  },
  i: {
    pressed: false,
  }
}


let lastTime = performance.now()
let camera = {
  x: 0,
  y: 0,
}

// First scroll post
const SCROLL_POST_RIGHT = 200
const SCROLL_POST_TOP = 200
const SCROLL_POST_BOTTOM = 200
// const SCROLL_POST_LEFT = 6570
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

// const backgroundMusic = new Audio('./sound/vibe_fox.mp3')
const backgroundMusic = new Audio('./sound/Fox-Run-Theme.mp3')
// const backgroundMusic = new Audio('./sound/invincible-fox.mp3')
backgroundMusic.loop = true;

function startGame() {
  init();
  startRendering();
}



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
    x: 90,
    y: 100,
    size: 32,
    velocity: {x: 0, y: 0},
  })

  vultures = [
    new Vulture ({ x: 600, y: 16, size: 32, width: 36, height: 28,}),
    new Vulture ({ x: 1728, y: 64, size: 32, width: 36, height: 28,}),
    new Vulture ({ x: 2700, y: 160, size: 32, width: 36, height: 28,}),
    new Vulture ({ x: 3040, y: 32, size: 32, width: 36, height: 28,}),
  ]

  eagles = [
    new Eagle ({x: 224, w: 32, width: 40, height: 41,}),
    new Eagle ({x: 800, y: 56, width: 40, height: 41,}),
    new Eagle ({x: 1520, y: 80, width: 40, height: 41,}),
    new Eagle ({x: 1920, y: 160, width: 40, height: 41,}),
    new Eagle ({x: 2384, y: 48, width: 40, height: 41,}),
    new Eagle ({x: 3120, y: 272, width: 40, height: 41,}),

    new Eagle ({x: 5840, y: 64, width: 40, height: 41,}),
    new Eagle ({x: 5840, y: 64, width: 40, height: 41,}),
    new Eagle ({x: 6320, y: 64, width: 40, height: 41,}),
    new Eagle ({x: 6960, y: 192, width: 40, height: 41,}),
    new Eagle ({x: 7312, y: 32, width: 40, height: 41,}),
    new Eagle ({x: 7312, y: 32, width: 40, height: 41,}),
    new Eagle ({x: 7632, y: 208, width: 40, height: 41,}),
  ]

  
  opossums = [
    new Opossum({ x: 300, y: 240, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 410, y: 180, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 620, y: 95, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 600, y: 256, size: 32, width: 36, height: 28,}), 
    new Opossum({ x: 500, y: 256, size: 32, width: 36, height: 28,}), 
    new Opossum({ x: 900, y: 220, size: 32, width: 36, height: 28,}),//
    new Opossum({ x: 880, y: 100, size: 32, width: 36, height: 28,}), 
    new Opossum({ x: 850, y: 400, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 800, y: 400, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 1100, y: 60, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 1200, y: 60, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 1200, y: 350, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 1150, y: 350, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 1420, y: 350, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 1360, y: 280, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 1520, y: 170, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 1520, y: 170, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 1600, y: 240, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 2080, y: 370, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 1824, y: 240, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 2208, y: 112, size: 32, width: 36, height: 28,}),

    new Opossum({ x: 2464, y: 368, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 2400, y: 368, size: 32, width: 36, height: 28,}),

    new Opossum({ x: 2688, y: 96, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 2784, y: 208, size: 32, width: 36, height: 28,}),

    new Opossum({ x: 3136, y: 112, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 3360, y: 112, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 3520, y: 80, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 3696, y: 48, size: 32, width: 36, height: 28,}),

    new Opossum({ x: 4048, y: 96, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 4000, y: 96, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 4176, y: 336, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 4252, y: 192, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 4352, y: 112, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 4368, y: 304, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 4464, y: 224, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 4384, y: 432, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 4320, y: 432, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 4672, y: 176, size: 32, width: 36, height: 28,}),

    new Opossum({ x: 4896, y: 96, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 5024, y: 176, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 5232, y: 288, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 5376, y: 80, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 5280, y: 80, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 5264, y: 144, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 5440, y: 128, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 5424, y: 128, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 5392, y: 448, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 3200, y: 384, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 3136, y: 384, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 2960, y: 384, size: 32, width: 36, height: 28,}),

    new Opossum({ x: 5872, y: 288, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 5760, y: 288, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 5936, y: 384, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 5744, y: 384, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 5680, y: 448, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 5872, y: 448, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 6416, y: 192, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 6304, y: 192, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 6320, y: 240, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 6368, y: 336, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 6288, y: 400, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 6512, y: 400, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 6656, y: 208, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 7040, y: 416, size: 32, width: 36, height: 28,}),

    new Opossum({ x: 7120, y: 176, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 7408, y: 320, size: 32, width: 36, height: 28,}), ///
    new Opossum({ x: 7296, y: 320, size: 32, width: 36, height: 28,}),

    new Opossum({ x: 7504, y: 432, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 7360, y: 432, size: 32, width: 36, height: 28,}),
    new Opossum({ x: 7232, y: 432, size: 32, width: 36, height: 28,}),
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
    }),
    new Heart ({
      x: 79,
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
      x: 102,
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
    // new Heart ({
    //   x: 125,
    //   y: 10,
    //   width: 21,
    //   height: 18,
    //   imageSrc: './images/hearts.png',
    //   spriteCropbox: {
    //     x: 0,
    //     y: 0,
    //     width: 21,
    //     height: 18,
    //     frames: 6,
    //   },
    // })
  ]
  camera = {
    x: 0,
    y: 0,
  }
}

const FALL_THRESHOLD = 600 // when player falls below this 

function animate(backgroundCanvas) {
  if (isPaused) {
    requestAnimationFrame(() => animate(backgroundCanvas))
    return 
  }
 

  // Calculate delta time
  const currentTime = performance.now()
  const deltaTime = (currentTime - lastTime) / 1000
  lastTime = currentTime

  const  enemyDeathSound = new Audio('./sound/enemy_death.mp3')

  // Update player position
  player.handleInput(keys)
  player.update(deltaTime, collisionBlocks)

  // Check if player falls below the threshold
  if (player.y > FALL_THRESHOLD) {
    init();
    return;
  }

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
        enemyDeathSound.play()
        opossums.splice(i, 1) // this will remove the enemies when you jump on top
      } else if ( // remove opossum with roll action
        (collisionDirection === 'left' || collisionDirection === 'right') && 
        player.isOnGround && 
        player.isRolling
      ) {
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
        enemyDeathSound.play()
        opossums.splice(i, 1) 
      } else if (
        collisionDirection === 'left' ||
        collisionDirection === 'right'
      ) {

        // Heart Lives
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

  // Update EAGLE Position ***
  for (let i = eagles.length - 1; i >= 0; i--) {
    const eagle = eagles[i]
    eagle.update(deltaTime, collisionBlocks)

    // Jump on an enemy
    const collisionDirection = checkCollitions(player, eagle)
    if (collisionDirection) { // if collision exits, remove enemy from the game
      if (collisionDirection === 'bottom' && !player.isOnGround) {
        player.velocity.y = -200
        sprites.push(
          new Sprite({
            x: eagle.x,
            y: eagle.y,
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
        enemyDeathSound.play()
        eagles.splice(i, 1) // this will remove the enemies when you jump on top
      } else if ( // remove opossum with roll action
        collisionDirection === 'left' || 
        collisionDirection === 'right' || 
        collisionDirection === 'top'
      ) {
        // Heart Lives
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


  // Update VULTURE Position ***
  for (let i = vultures.length - 1; i >= 0; i--) {
    const vulture = vultures[i]
    vulture.update(deltaTime, collisionBlocks)

    // Jump on an enemy
    const collisionDirection = checkCollitions(player, vulture)
    if (collisionDirection) { // if collision exits, remove enemy from the game
      if (collisionDirection === 'bottom' && !player.isOnGround) {
        player.velocity.y = -200
        sprites.push(
          new Sprite({
            x: vulture.x,
            y: vulture.y,
            width: 32,
            height: 32,
            imageSrc: './images/enemy-death.png',
            spriteCropbox: {
              x: 0,
              y: 0,
              width:40,
              height: 41,
              frames: 4,
            },
          }),
        )
        enemyDeathSound.play()
        vultures.splice(i, 1) // this will remove the enemies when you jump on top
      } else if ( // remove opossum with roll action
        collisionDirection === 'left' || 
        collisionDirection === 'right' || 
        collisionDirection === 'top'
      ) {
        // Heart Lives
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

  // gems sound
  const gemCollectionSound = new Audio('./sound/gem_coin.mp3')
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
      gemCollectionSound.play()
      if (gems.length === 0) {
        console.log('YOU WIN');

      }
    }
  }


  // Track scroll post distance 01
  if (player.x > SCROLL_POST_RIGHT && player.x < 7620) {
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
  c.scale(dpr + 3.9, dpr + 3.9)
  c.translate(-camera.x, camera.y)
  c.clearRect(0, 0, canvas.width, canvas.height)
  c.drawImage(seaSkyBackgroundCanvas, camera.x * 0.32, 0) // 0.32 is the parallax effect
  c.drawImage(mountainsBackgroundCanvas, camera.x * 0.16, 0)  // 0.16 is the parallax effect
  c.drawImage(backgroundCanvas, 0, 0)
  player.draw(c)

  
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
  // opossums = enemies
  for (let i = opossums.length - 1; i >= 0; i--) {
    const opossum = opossums[i]
    opossum.draw(c)
  }
  // eagles = enemies
  for (let i = eagles.length - 1; i >= 0; i--) {
    const eagle = eagles[i]
    eagle.draw(c)
  }

  // vulture = enemies
  for (let i = vultures.length - 1; i >= 0; i--) {
    const vulture = vultures[i]
    vulture.draw(c)
  }
  
  
  // c.fillRect(SCROLL_POST_RIGHT, 50, 10, 100)
  // c.fillRect(350, SCROLL_POST_TOP, 100, 10)
  // c.fillRect(350, SCROLL_POST_BOTTOM, 100, 10)
  // c.fillRect(SCROLL_POST_LEFT, 50, 10, 100)

  // Hearts displayed on upperleft screen
  c.restore()

  c.save()
  c.scale(dpr + 2, dpr + 2)
  
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
