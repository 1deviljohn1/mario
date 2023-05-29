import type { Canvas } from './Canvas'

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
            cropOffset: 35,
        },
        idleLeft: {
            src: './img/spriteStandLeft.png',
            frames: 60,
            cropWidth: 66,
            cropOffset: 35,
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
    falling = 0
    speed = 0
    private maxSpeed = 40
    private gravity = 2
    jumpSpeed = 35
    canJumping = false
    private currentFrame = 0
    currentSprite: Sprite = this.sprites['idleRight']
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
        this.currentFrame = 0
        this.image.src = this.currentSprite.src
    }

    private draw(canvas: Canvas) {
        const cropWidth = this.image.width / this.currentSprite.frames

        this.currentFrame++

        if (this.currentFrame === this.currentSprite.frames) {
            this.currentFrame = 0
        }

        canvas.ctx.fillStyle = 'green'
        canvas.ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
        canvas.ctx.drawImage(
            this.image,
            cropWidth * this.currentFrame,
            0,
            cropWidth,
            this.image.height,
            this.position.x + this.currentSprite.cropOffset,
            this.position.y,
            this.currentSprite.cropWidth,
            this.height
        )
    }

    update(canvas: Canvas) {
        this.draw(canvas)

        this.position.x += this.speed
        this.position.y += this.falling
        const newSpeed = this.falling + this.gravity
        this.falling = newSpeed > this.maxSpeed ? this.maxSpeed : newSpeed
    }

    jump() {
        if (this.canJumping) {
            this.falling = -this.jumpSpeed
        }
    }
}
