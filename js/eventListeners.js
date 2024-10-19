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

// On return to game's tab, ensure delta time is reset
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    lastTime = performance.now()
  }
})