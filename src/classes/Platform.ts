export class Platform {
    private image: HTMLImageElement
    public width = 0

    constructor(
        public position: {
            x: number
            y: number
        },
        public imageSrc: string
    ) {
        this.image = new Image()
        this.image.src = this.imageSrc
        this.image.onload = () => {
            this.width = this.image.width
        }
    }

    public get sides() {
        return {
            right: this.position.x + this.width,
        }
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.image, this.position.x, this.position.y)
    }
}
