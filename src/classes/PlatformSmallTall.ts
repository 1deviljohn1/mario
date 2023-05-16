import { Platform } from './Platform'

export class PlatformSmallTall extends Platform {
    protected imageSrc = './img/platformSmallTall.png'
    private width = 291
    private height = 227

    constructor(public xCoord: number) {
        super(xCoord)
        this.image.src = this.imageSrc
    }

    get sides() {
        return {
            right: this.xCoord + this.width,
            top: window.innerHeight - this.height - Platform.height,
        }
    }
}
