window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'w':
      // player.jump()
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
  }
})

// // Add event listener for user interaction
window.addEventListener('click', () => {
  if (backgroundMusic.paused) {
    backgroundMusic.volume = 0.5;
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