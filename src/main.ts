import './assets/scss/app.scss'
import { Canvas } from './classes/Canvas'
import { Platform } from './classes/Platform'
import { PlatformSmallTall } from './classes/PlatformSmallTall'
import { Сharacter, type SpriteKey } from './classes/Сharacter'
import { ImageObject } from './classes/ImageObject'
import { Goomba } from './classes/Goomba'
import { topCollision, horizontalCollision } from './utils/collision'

const speed = 12
const rightEdge = window.innerWidth * 0.4

type ImageData = {
    image: ImageObject
    speed: number
}

const canvas = new Canvas('canvas')
let platforms: Platform[]
let environment: ImageData[]
let goombas: Goomba[]
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

    player.canJumping = false

    environment.forEach((item) => {
        item.image.draw(canvas.ctx)
    })

    platforms.forEach((platform) => {
        platform.draw(canvas.ctx)

        if (topCollision(player, platform, player.currentSprite.cropOffset)) {
            player.canJumping = true
            player.speed = 0
            player.position.y = platform.position.y - player.height
        }

        goombas.forEach((goomba) => {
            if (topCollision(goomba, platform)) {
                goomba.speed = 0
                goomba.position.y = platform.position.y - goomba.height
            }
        })
    })

    goombas.forEach((goomba, index) => {
        goomba.update(canvas.ctx)

        if (topCollision(player, goomba, player.currentSprite.cropOffset)) {
            player.canJumping = true
            player.jump()
            setTimeout(() => {
                goombas.splice(index, 1)
            }, 100)
        }

        if (horizontalCollision(player, goomba, player.currentSprite.cropOffset)) {
            init()
        }
    })

    player.update(canvas)

    if (keys.KeyA.pressed && playerOffset === 0 && player.position.x > 0) {
        player.position.x -= speed
    } else if (keys.KeyD.pressed && player.sides.right <= rightEdge) {
        player.position.x += speed
    } else {
        if (playerOffset === 0 && keys.KeyA.pressed) {
            return
        }

        if (keys.KeyA.pressed || keys.KeyD.pressed) {
            keys.KeyA.pressed ? playerOffset-- : playerOffset++

            platforms.forEach((platform) => {
                platform.position.x = keys.KeyA.pressed ? platform.position.x + speed : platform.position.x - speed
            })

            goombas.forEach((goomba) => {
                goomba.position.x = keys.KeyA.pressed ? goomba.position.x + speed : goomba.position.x - speed
            })

            environment.forEach((item) => {
                const coord = item.image.position.x
                const speed = item.speed

                item.image.position.x = keys.KeyA.pressed ? coord + speed : coord - speed
            })
        }
    }

    if (player.position.y > canvas.el.height) {
        init()
    }
}

function init() {
    playerOffset = 0
    player = new Сharacter({ x: 100, y: 100 }, lastDirection)

    platforms = [
        new PlatformSmallTall(Platform.width * 4 - 290),
        new Platform(0),
        new Platform(Platform.width),
        new Platform(Platform.width * 2 + 200),
        new Platform(Platform.width * 3),
        new Platform(Platform.width * 5 - 30),
    ]

    environment = [
        { image: new ImageObject({ x: -1, y: -1 }, './img/background.png'), speed: 2 },
        { image: new ImageObject({ x: -1, y: 500 }, './img/background.png'), speed: 2 },
        { image: new ImageObject({ x: 0, y: canvas.el.height - 580 }, './img/hills.png'), speed: 5 },
    ]

    goombas = [new Goomba({ x: 1000, y: 200 })]
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
