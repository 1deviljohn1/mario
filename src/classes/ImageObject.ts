export class ImageObject {
    private image: HTMLImageElement

    constructor(
        public position: {
            x: number
            y: number
        },
        public imageSrc: string
    ) {
        this.image = new Image()
        this.image.src = this.imageSrc
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.image, this.position.x, this.position.y)
    }
}
