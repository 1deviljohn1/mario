import './assets/scss/app.scss'
import { Canvas } from './classes/Canvas'
import { Platform } from './classes/Platform'
import { Сharacter, type SpriteKey } from './classes/Сharacter'
import { ImageObject } from './classes/ImageObject'

const speed = 12
const leftEdge = 200
const rightEdge = 700
const platformWidth = 578

type ImageData = {
    image: ImageObject
    speed: number
}

const canvas = new Canvas('canvas')
let platforms: Platform[]
let images: ImageData[]
let player: Сharacter
let playerOffset: number
let lastDirection: SpriteKey | null = null

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

function animate() {
    canvas.ctx.clearRect(0, 0, canvas.el.width, canvas.el.height)
    window.requestAnimationFrame(animate)

    images.forEach((item) => {
        item.image.draw(canvas.ctx)
    })

    platforms.forEach((platform) => {
        platform.draw(canvas.ctx)
    })

    player.update(canvas, platforms)

    if (keys.KeyA.pressed && player.position.x >= leftEdge) {
        player.position.x -= speed
    } else if (keys.KeyD.pressed && player.sides.right <= rightEdge) {
        player.position.x += speed
    } else {
        if (playerOffset === 0 && keys.KeyA.pressed) {
            return
        } else {
            if (keys.KeyA.pressed || keys.KeyD.pressed) {
                keys.KeyA.pressed ? playerOffset-- : playerOffset++

                platforms.forEach((platform) => {
                    platform.position.x = keys.KeyA.pressed ? platform.position.x + speed : platform.position.x - speed
                })

                images.forEach((item) => {
                    const coord = item.image.position.x
                    const speed = item.speed

                    item.image.position.x = keys.KeyA.pressed ? coord + speed : coord - speed
                })
            }
        }
    }

    if (player.position.y > canvas.el.height) {
        init()
    }
}

function init() {
    playerOffset = 0
    player = new Сharacter({ x: leftEdge, y: 100 }, lastDirection)

    platforms = [
        new Platform({ x: platformWidth * 4 - 290, y: 590 }, './img/platformSmallTall.png'),
        new Platform({ x: 0, y: 804 }, './img/platform.png'),
        new Platform({ x: platformWidth, y: 804 }, './img/platform.png'),
        new Platform({ x: platformWidth * 2 + 200, y: 804 }, './img/platform.png'),
        new Platform({ x: platformWidth * 3, y: 804 }, './img/platform.png'),
        new Platform({ x: platformWidth * 5 - 30, y: 804 }, './img/platform.png'),
    ]

    images = [
        {
            image: new ImageObject({ x: -1, y: -1 }, './img/background.png'),
            speed: 2,
        },
        {
            image: new ImageObject({ x: -1, y: 500 }, './img/background.png'),
            speed: 2,
        },
        {
            image: new ImageObject({ x: 0, y: 350 }, './img/hills.png'),
            speed: 5,
        },
    ]
}

window.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'KeyW':
        case 'Space':
            player.jump()
            break

        case 'KeyA':
            player.setCurrentSprite('runLeft')
            lastDirection = 'runLeft'
            keys.KeyA.pressed = true
            keys.KeyD.pressed = false
            break

        case 'KeyD':
            player.setCurrentSprite('runRight')
            lastDirection = 'runRight'
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
            player.setCurrentSprite('idleLeft')
            lastDirection = null
            keys.KeyA.pressed = false
            break

        case 'KeyD':
            player.setCurrentSprite('idleRight')
            lastDirection = null
            keys.KeyD.pressed = false
            break

        default:
            break
    }
})

init()
animate()
