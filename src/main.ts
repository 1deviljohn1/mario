import './assets/scss/app.scss'
import { Canvas } from './classes/Canvas'
import { Platform } from './classes/Platform'
import { PlatformSmallTall } from './classes/PlatformSmallTall'
import { PlatformBlock } from './classes/PlatformBlock'
import { Сharacter, type SpriteKey } from './classes/Сharacter'
import { ImageObject } from './classes/ImageObject'
import { Goomba } from './classes/Goomba'
import { topCollision, bottomCollision, horizontalCollision } from './utils/collision'
import { Particle } from './classes/Particle'

type ImageData = {
    image: ImageObject
    speed: number
}

const canvas = new Canvas('canvas')

class App {
    private speed = 10
    private playerOffset = 0
    private particlesNumber = 50
    private rightEdge = window.innerWidth * 0.4
    private platforms: Platform[] = []
    private environment: ImageData[] = []
    private goombas: Goomba[] = []
    private particles: Particle[] = []
    private lastDirection: SpriteKey | null = null
    private player = new Сharacter({ x: 100, y: 100 }, this.lastDirection)
    private keys = {
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

    init() {
        this.playerOffset = 0
        this.player = new Сharacter({ x: 100, y: 100 }, this.lastDirection)

        this.platforms = [
            new PlatformSmallTall(Platform.width * 4 - 90),
            new PlatformBlock({ x: 800, y: 500 }),
            new Platform(0),
            new Platform(Platform.width),
            new Platform(Platform.width * 2 + 200),
            new Platform(Platform.width * 3 + 200),
            new Platform(Platform.width * 5 + 100),
        ]

        this.environment = [
            { image: new ImageObject({ x: -1, y: -1 }, './img/background.png'), speed: 2 },
            { image: new ImageObject({ x: -1, y: 500 }, './img/background.png'), speed: 2 },
            { image: new ImageObject({ x: 0, y: canvas.el.height - 580 }, './img/hills.png'), speed: 5 },
        ]

        this.goombas = [new Goomba({ x: 2000, y: 200 }, 600), new Goomba({ x: 2450, y: 500 }, 200)]
    }

    animate() {
        canvas.ctx.clearRect(0, 0, canvas.el.width, canvas.el.height)
        window.requestAnimationFrame(() => this.animate())

        this.player.canJumping = false

        this.environment.forEach((item) => {
            item.image.draw(canvas.ctx)
        })

        this.drawPlatforms()
        this.drawGoombas()
        this.drawParticles()

        this.player.update(canvas)
        this.handleScroll()

        if (this.player.position.y > canvas.el.height) {
            setTimeout(() => {
                this.init()
            }, 50)
        }
    }

    private handleScroll() {
        if (this.keys.KeyA.pressed && this.playerOffset === 0 && this.player.position.x > 0) {
            this.player.speed = -this.speed
        } else if (this.keys.KeyD.pressed && this.player.sides.right <= this.rightEdge) {
            this.player.speed = this.speed
        } else {
            this.player.speed = 0

            if (this.playerOffset === 0 && this.keys.KeyA.pressed) {
                return
            }

            if (this.keys.KeyA.pressed || this.keys.KeyD.pressed) {
                this.keys.KeyA.pressed ? this.playerOffset-- : this.playerOffset++

                this.platforms.forEach((platform) => {
                    platform.position.x = this.keys.KeyA.pressed
                        ? platform.position.x + this.speed
                        : platform.position.x - this.speed
                })

                this.goombas.forEach((goomba) => {
                    goomba.position.x = this.keys.KeyA.pressed
                        ? goomba.position.x + this.speed
                        : goomba.position.x - this.speed
                })

                this.particles.forEach((particle) => {
                    particle.position.x = this.keys.KeyA.pressed
                        ? particle.position.x + this.speed
                        : particle.position.x - this.speed
                })

                this.environment.forEach((item) => {
                    const coord = item.image.position.x
                    const speed = item.speed

                    item.image.position.x = this.keys.KeyA.pressed ? coord + speed : coord - speed
                })
            }
        }
    }

    private drawPlatforms() {
        this.platforms.forEach((platform) => {
            platform.draw(canvas.ctx)

            if (topCollision(this.player, platform, this.player.currentSprite.cropOffset)) {
                this.player.canJumping = true
                this.player.falling = 0
                this.player.position.y = platform.position.y - this.player.height - 0.01
            }

            if (platform instanceof PlatformBlock) {
                if (bottomCollision(this.player, platform, this.player.currentSprite.cropOffset)) {
                    this.player.falling = 0
                }

                if (horizontalCollision(this.player, platform)) {
                    this.player.speed = 0
                }
            }

            this.goombas.forEach((goomba) => {
                if (topCollision(goomba, platform)) {
                    goomba.falling = 0
                    goomba.position.y = platform.position.y - goomba.height
                }
            })

            this.particles.forEach((particle, index) => {
                if (topCollision(particle, platform)) {
                    particle.falling = -particle.falling * 0.5

                    if (particle.radius - 0.4 > 0) {
                        particle.radius -= 0.4
                    }
                }

                if (particle.ttl <= 0) {
                    this.particles.splice(index, 1)
                }
            })
        })
    }

    private drawGoombas() {
        this.goombas.forEach((goomba, index) => {
            goomba.update(canvas.ctx)

            if (topCollision(this.player, goomba, this.player.currentSprite.cropOffset)) {
                this.player.canJumping = true
                this.player.jump()
                this.goombas.splice(index, 1)

                for (let i = 0; i < this.particlesNumber; i++) {
                    this.particles.push(
                        new Particle(
                            { x: goomba.position.x + goomba.width / 2, y: goomba.position.y + goomba.height / 2 },
                            -5 - (Math.random() - 0.5) * 5,
                            2 + Math.random()
                        )
                    )
                }
            }

            if (horizontalCollision(this.player, goomba, this.player.currentSprite.cropOffset)) {
                setTimeout(() => {
                    this.init()
                }, 50)
            }
        })
    }

    private drawParticles() {
        this.particles.forEach((particle) => {
            particle.update(canvas.ctx)
        })
    }

    handleKeys() {
        window.addEventListener('keydown', (event) => {
            switch (event.code) {
                case 'KeyW':
                case 'Space':
                    this.player.jump()
                    break

                case 'KeyA':
                    this.player.setCurrentSprite('runLeft')
                    this.lastDirection = 'runLeft'
                    this.keys.KeyA.pressed = true
                    this.keys.KeyD.pressed = false
                    break

                case 'KeyD':
                    this.player.setCurrentSprite('runRight')
                    this.lastDirection = 'runRight'
                    this.keys.KeyD.pressed = true
                    this.keys.KeyA.pressed = false
                    break

                default:
                    break
            }
        })

        window.addEventListener('keyup', (event) => {
            switch (event.code) {
                case 'KeyA':
                    this.player.setCurrentSprite('idleLeft')
                    this.lastDirection = null
                    this.keys.KeyA.pressed = false
                    break

                case 'KeyD':
                    this.player.setCurrentSprite('idleRight')
                    this.lastDirection = null
                    this.keys.KeyD.pressed = false
                    break

                default:
                    break
            }
        })
    }
}

const app = new App()

app.handleKeys()
app.init()
window.requestAnimationFrame(() => app.animate())
