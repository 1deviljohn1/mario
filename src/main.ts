import './assets/scss/app.scss'
import { Canvas } from './classes/Canvas'
import { Platform } from './classes/Platform'
import { Сharacter } from './classes/Сharacter'

const speed = 8
const leftEdge = 200
const rightEdge = 700

const canvas = new Canvas('canvas')
const platforms = [new Platform({ x: 300, y: 600 }, 300, 50), new Platform({ x: 600, y: 400 }, 300, 50)]
const player = new Сharacter({ x: leftEdge, y: 100 })

const keys = {
    KeyW: {
        pressed: false,
    },
    KeyD: {
        pressed: false,
    },
    KeyA: {
        pressed: false,
    },
    Space: {
        pressed: false,
    },
}

const animate = () => {
    window.requestAnimationFrame(animate)
    player.update(canvas, platforms)
    platforms.forEach((platform) => {
        platform.draw(canvas)
    })

    if (keys.KeyA.pressed && player.position.x >= leftEdge) {
        player.position.x -= speed
    } else if (keys.KeyD.pressed && player.sides.right <= rightEdge) {
        player.position.x += speed
    } else {
        if (keys.KeyA.pressed || keys.KeyD.pressed) {
            platforms.forEach((platform) => {
                platform.position.x = keys.KeyA.pressed ? platform.position.x + speed : platform.position.x - speed
            })
        }
    }
}

window.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'KeyW':
        case 'Space':
            player.jump()
            break

        case 'KeyA':
            keys.KeyA.pressed = true
            keys.KeyD.pressed = false
            break

        case 'KeyD':
            keys.KeyD.pressed = true
            keys.KeyA.pressed = false
            break

        default:
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'KeyA':
            keys.KeyA.pressed = false
            break

        case 'KeyD':
            keys.KeyD.pressed = false
            break

        default:
            break
    }
})

animate()
