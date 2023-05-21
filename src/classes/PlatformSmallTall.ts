import { Platform } from './Platform'

export class PlatformSmallTall extends Platform {
    protected imageSrc = './img/platformSmallTall.png'
    private width = 291
    private height = 227
    public position = { x: 0, y: 0 }

    constructor(public xCoord: number) {
        super(xCoord)
        this.image.src = this.imageSrc
        this.position.x = xCoord
        this.position.y = window.innerHeight - this.height - Platform.height
    }

    get sides() {
        return {
            right: this.position.x + this.width,
            bottom: this.position.y + this.height,
        }
    }
}
