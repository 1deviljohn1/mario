export class Platform {
    protected image: HTMLImageElement
    protected imageSrc = './img/platform.png'
    static width = 578
    protected static height = 125
    public position = { x: 0, y: 0 }

    constructor(public xCoord: number) {
        this.image = new Image()
        this.image.src = this.imageSrc
        this.position.x = xCoord
        this.position.y = window.innerHeight - Platform.height
    }

    get sides() {
        return {
            right: this.position.x + Platform.width,
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.image, this.position.x, this.position.y)
    }
}
