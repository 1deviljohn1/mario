export class Particle {
    private gravity = 1
    speed = (Math.random() - 0.5) * 2
    ttl = 100

    constructor(
        public position: {
            x: number
            y: number
        },
        public falling: number,
        public radius: number
    ) {}

    update(ctx: CanvasRenderingContext2D) {
        this.ttl--
        this.draw(ctx)

        this.position.x += this.speed
        this.position.y += this.falling
        this.falling += this.gravity
    }

    get sides() {
        return {
            bottom: this.position.y + this.radius * 2,
            right: this.position.x + this.radius * 2,
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = '#d6a780'
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI)
        ctx.fill()
    }
}
