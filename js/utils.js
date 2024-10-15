const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function checkCollitions(object1, object2) {
  return (
    object1.hitbox.x + object1.hitbox.width >= object2.hitbox.x &&  // left
    object1.hitbox.x <= object2.hitbox.x + object2.hitbox.width && // right
    object1.hitbox.y <= object2.hitbox.y + object2.hitbox.height && // top
    object1.hitbox.y + object1.hitbox.height >= object2.hitbox.y // bottom

  )
}