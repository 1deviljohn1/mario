import type { Canvas } from './Canvas'
import { Platform } from './Platform'

export class Сharacter {
    private width = 50
    height = 50
    speed = 0
    private maxSpeed = 40
    private gravity = 2
    private jumpSpeed = 40
    private canJumping = false

    constructor(
        public position: {
            x: number
            y: number
        }
    ) {}

    get sides() {
        return {
            bottom: this.position.y + this.height,
            right: this.position.x + this.width,
        }
    }

    private draw(canvas: Canvas) {
        canvas.ctx.fillStyle = 'red'
        canvas.ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    private hasCollisionWithPlatform(platform: Platform) {
        return (
            this.position.y + this.height <= platform.position.y &&
            this.sides.bottom + this.speed >= platform.position.y &&
            this.sides.right >= platform.position.x &&
            this.position.x <= platform.sides.right
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
