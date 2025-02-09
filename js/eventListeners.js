
let isPaused = false
let isInstructions = false

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'w':
      if (!keys.w.pressed) {
        jumpSound.currentTime = 0
        jumpSound.play();
      }
      player.jump()
      keys.w.pressed = true
      break
    case 'a':
      keys.a.pressed = true
      break
    case 'd':
      keys.d.pressed = true
      break
    case 'p':
      isPaused = !isPaused
      const pauseText = document.getElementById('pauseText')
      if(isPaused) {
        console.log('Game paused');
        pauseText.style.display = 'block'
        backgroundMusic.pause() // Pause the background music
      } else {
        console.log('Game resumed');
        pauseText.style.display = 'none'
        backgroundMusic.play() // Resume the background music
        lastTime = performance.now()
      }
      break
    case 'i':
      isInstructions = !isInstructions
      const controllerText = document.getElementById('controllerText')
      if(isInstructions) {
        console.log('Instructions displayed');
        controllerText.style.display = 'block'
      } else {
        console.log('Instructions hidden');
        controllerText.style.display = 'none'
      }
      break
  }
})


window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'w':
      keys.w.pressed = false;
      jumpSound.pause();
      jumpSound.currentTime = 0;
      break;
    case 'a':
      keys.a.pressed = false
      break
    case 'd':
      keys.d.pressed = false
      break
    case ' ':
      player.roll()
      break
  }
})

// // Add event listener for user interaction
window.addEventListener('click', () => {
  if (backgroundMusic.paused) {
    backgroundMusic.volume = 1;
    let playPromise = backgroundMusic.play()

    if (playPromise !== undefined) {
      playPromise.then(_=> {
        // Automatic playback started!
        // Show playing UI
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          // Handle the AbortError specifically
          console.warn('Playback was interrupted by a call to pause():', error)
        } else {
          // Handle other errors
          console.error('Failed to play background music', error)
        }
        
      });
    }
  }
  startGame()
}, { once: true});

// On return to game's tab, ensure delta time is reset
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    lastTime = performance.now()
  }
})