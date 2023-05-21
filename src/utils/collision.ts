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

type FallingObject = StaticObject & {
    falling: number
}

export const topCollision = (object: FallingObject, blockObject: StaticObject, objectOffset = 0) => {
    return (
        object.sides.bottom <= blockObject.position.y &&
        object.sides.bottom + object.falling >= blockObject.position.y &&
        object.sides.right - objectOffset >= blockObject.position.x &&
        object.position.x + objectOffset <= blockObject.sides.right
    )
}

export const horizontalCollision = (object: FallingObject, blockObject: StaticObject, objectOffset = 0) => {
    return (
        object.sides.right - objectOffset >= blockObject.position.x &&
        object.position.x + objectOffset <= blockObject.sides.right &&
        object.sides.bottom >= blockObject.position.y &&
        object.position.y <= blockObject.sides.bottom
    )
}
