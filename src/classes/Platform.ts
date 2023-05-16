export class Platform {
    protected image: HTMLImageElement
    protected imageSrc = './img/platform.png'
    static width = 578
    protected static height = 125

    constructor(public xCoord: number) {
        this.image = new Image()
        this.image.src = this.imageSrc
    }

    get sides() {
        return {
            right: this.xCoord + Platform.width,
            top: window.innerHeight - Platform.height,
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.image, this.xCoord, this.sides.top)
    }
}
