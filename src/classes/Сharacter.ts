import type { Canvas } from './Canvas'
import { Platform } from './Platform'

export type SpriteKey = 'idleRight' | 'idleLeft' | 'runRight' | 'runLeft'
type Sprite = {
    src: string
    frames: number
    cropWidth: number
    cropOffset: number
}

export class Сharacter {
    private sprites = {
        idleRight: {
            src: './img/spriteStandRight.png',
            frames: 60,
            cropWidth: 66,
            cropOffset: 30,
        },
        idleLeft: {
            src: './img/spriteStandLeft.png',
            frames: 60,
            cropWidth: 66,
            cropOffset: 30,
        },
        runRight: {
            src: './img/spriteRunRight.png',
            frames: 30,
            cropWidth: 127.875,
            cropOffset: 0,
        },
        runLeft: {
            src: './img/spriteRunLeft.png',
            frames: 30,
            cropWidth: 127.875,
            cropOffset: 0,
        },
    }
    private width = 127.875
    height = 150
    speed = 0
    private maxSpeed = 40
    private gravity = 2
    private jumpSpeed = 40
    private canJumping = false
    private currrentFrame = 0
    private currentSprite: Sprite = this.sprites['idleRight']
    private currentSpriteKey: SpriteKey | null = null
    private image: HTMLImageElement

    constructor(
        public position: {
            x: number
            y: number
        },
        public lastDirection: SpriteKey | null
    ) {
        this.image = new Image()
        this.setCurrentSprite(lastDirection || 'idleRight')
    }

    get sides() {
        return {
            bottom: this.position.y + this.height,
            right: this.position.x + this.width,
        }
    }

    setCurrentSprite(sprite: SpriteKey) {
        if (sprite === this.currentSpriteKey) {
            return
        }

        this.currentSprite = this.sprites[sprite]
        this.currentSpriteKey = sprite
        this.currrentFrame = 0
        this.image.src = this.currentSprite.src
    }

    private draw(canvas: Canvas) {
        const cropWidth = this.image.width / this.currentSprite.frames

        canvas.ctx.drawImage(
            this.image,
            cropWidth * this.currrentFrame,
            0,
            cropWidth,
            this.image.height,
            this.position.x + this.currentSprite.cropOffset,
            this.position.y,
            this.currentSprite.cropWidth,
            this.height
        )

        this.currrentFrame++
        if (this.currrentFrame === this.currentSprite.frames - 1) {
            this.currrentFrame = 0
        }
    }

    private hasCollisionWithPlatform(platform: Platform) {
        return (
            this.position.y + this.height <= platform.position.y &&
            this.sides.bottom + this.speed >= platform.position.y &&
            this.sides.right - this.currentSprite.cropOffset >= platform.position.x &&
            this.position.x + this.currentSprite.cropOffset <= platform.sides.right
        )
    }

    update(canvas: Canvas, platforms: Platform[]) {
        this.draw(canvas)

        this.position.y += this.speed
        this.canJumping = false

        const newSpeed = this.speed + this.gravity
        this.speed = newSpeed > this.maxSpeed ? this.maxSpeed : newSpeed

        platforms.forEach((platform) => {
            if (this.hasCollisionWithPlatform(platform)) {
                this.speed = 0
                this.position.y = platform.position.y - this.height
                this.canJumping = true
            }
        })
    }

    jump() {
        if (this.canJumping) {
            this.speed -= this.jumpSpeed
        }
    }
}
