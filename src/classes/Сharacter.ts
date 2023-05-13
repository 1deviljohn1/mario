import type { Canvas } from './Canvas'
import { Platform } from './Platform'

export class Сharacter {
    private width = 50
    height = 50
    speed = { x: 10, y: 0 }
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
        canvas.ctx.fillStyle = 'blue'
        canvas.ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    private hasCollisionWithCanvas(canvas: Canvas) {
        return this.sides.bottom + this.speed.y >= canvas.el.height
    }

    private hasCollisionWithPlatform(platform: Platform) {
        return (
            this.position.y + this.height <= platform.position.y &&
            this.sides.bottom + this.speed.y >= platform.position.y &&
            this.sides.right >= platform.position.x &&
            this.position.x <= platform.sides.right
        )
    }

    update(canvas: Canvas, platforms: Platform[]) {
        this.clear(canvas)
        this.draw(canvas)
        this.displayInfo(canvas)

        this.position.y += this.speed.y
        this.canJumping = false

        if (this.hasCollisionWithCanvas(canvas)) {
            this.speed.y = 0
            this.position.y = canvas.el.height - this.height
            this.canJumping = true
        } else {
            const newSpeed = this.speed.y + this.gravity
            this.speed.y = newSpeed > this.maxSpeed ? this.maxSpeed : newSpeed
        }

        platforms.forEach((platform) => {
            if (this.hasCollisionWithPlatform(platform)) {
                this.speed.y = 0
                this.position.y = platform.position.y - this.height
                this.canJumping = true
            }
        })
    }

    private clear(canvas: Canvas) {
        canvas.ctx.clearRect(0, 0, canvas.el.width, canvas.el.height)
    }

    jump() {
        if (this.canJumping) {
            this.speed.y -= this.jumpSpeed
        }
    }

    private displayInfo(canvas: Canvas) {
        canvas.ctx.font = '18px Arial'
        canvas.ctx.fillStyle = '#000000'
        canvas.ctx.fillText(`x: ${this.position.x}`, canvas.el.width - 100, 50)
        canvas.ctx.fillText(`y: ${this.position.y}`, canvas.el.width - 100, 70)
        canvas.ctx.fillText(`speed: ${this.speed.y}`, canvas.el.width - 100, 90)
    }
}
