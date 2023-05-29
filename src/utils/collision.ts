type StaticObject = {
    sides: {
        right: number
        bottom: number
    }
    position: {
        x: number
        y: number
    }
}

type MovingObject = StaticObject & {
    falling: number
    speed: number
}

export const topCollision = (object: MovingObject, blockObject: StaticObject, objectOffset = 0) => {
    return (
        object.sides.bottom <= blockObject.position.y &&
        object.sides.bottom + object.falling >= blockObject.position.y &&
        object.sides.right - objectOffset >= blockObject.position.x &&
        object.position.x + objectOffset <= blockObject.sides.right
    )
}

export const bottomCollision = (object: MovingObject, blockObject: StaticObject, objectOffset = 0) => {
    return (
        object.position.y + object.falling <= blockObject.sides.bottom &&
        object.position.y - object.falling >= blockObject.sides.bottom &&
        object.sides.right - objectOffset >= blockObject.position.x &&
        object.position.x + objectOffset <= blockObject.sides.right
    )
}

export const horizontalCollision = (object: MovingObject, blockObject: StaticObject, objectOffset = 0) => {
    return (
        object.sides.right - objectOffset + object.speed >= blockObject.position.x &&
        object.position.x + objectOffset + object.speed <= blockObject.sides.right &&
        object.sides.bottom >= blockObject.position.y &&
        object.position.y <= blockObject.sides.bottom
    )
}
