import type { Canvas } from './Canvas'

export class Platform {
    constructor(
        public position: {
            x: number
            y: number
        },
        public width: number,
        public height: number
    ) {}

    public get sides() {
        return {
            right: this.position.x + this.width,
        }
    }

    public draw(canvas: Canvas) {
        canvas.ctx.fillStyle = 'red'
        canvas.ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}
