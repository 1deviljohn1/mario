export class Goomba {
    private width = 50
    height = 60
    private gravity = 1
    private maxSpeed = 40
    speed = 0
    private image: HTMLImageElement
    private currentFrame = 0
    private frames = 60

    constructor(
        public position: {
            x: number
            y: number
        }
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

        this.position.y += this.speed
        this.position.x -= 1
        const newSpeed = this.speed + this.gravity
        this.speed = newSpeed > this.maxSpeed ? this.maxSpeed : newSpeed
    }
}
