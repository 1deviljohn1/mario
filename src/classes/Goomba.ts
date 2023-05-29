export class Goomba {
    width = 50
    height = 60
    falling = 0
    speed = -(1 + Math.random())
    private gravity = 1
    private maxSpeed = 40
    private image: HTMLImageElement
    private currentFrame = 0
    private frames = 60
    private distance = 0

    constructor(
        public position: {
            x: number
            y: number
        },
        public limit = 100
    ) {
        this.image = new Image()
        this.image.src = './img/spriteGoomba.png'
    }

    get sides() {
        return {
            bottom: this.position.y + this.height,
            right: this.position.x + this.width,
        }
    }

    private draw(ctx: CanvasRenderingContext2D) {
        const cropWidth = this.image.width / this.frames

        ctx.drawImage(
            this.image,
            cropWidth * this.currentFrame,
            0,
            cropWidth,
            this.image.height,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }

    update(ctx: CanvasRenderingContext2D) {
        this.draw(ctx)

        this.currentFrame++

        if (this.currentFrame === this.frames) {
            this.currentFrame = 0
        }

        if (Math.abs(this.distance) >= this.limit) {
            this.distance = 0
            this.speed = -this.speed
        }

        this.position.y += this.falling
        this.position.x += this.speed
        this.distance += this.speed

        const newSpeed = this.falling + this.gravity
        this.falling = newSpeed > this.maxSpeed ? this.maxSpeed : newSpeed
    }
}
