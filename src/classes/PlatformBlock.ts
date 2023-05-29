import { Platform } from './Platform'

export class PlatformBlock extends Platform {
    protected imageSrc = './img/platformBlock.png'
    private width = 152
    private height = 251

    constructor(public position: { x: number; y: number }) {
        super(position.x)
        this.image.src = this.imageSrc
    }

    get sides() {
        return {
            right: this.position.x + this.width,
            bottom: this.position.y + this.height,
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'red'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
        ctx.drawImage(this.image, this.position.x, this.position.y)
    }
}
