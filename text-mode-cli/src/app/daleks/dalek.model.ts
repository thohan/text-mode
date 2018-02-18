export interface ICharacter {
	xpos: number;
	ypos: number;
	name: string;
	image: HTMLImageElement;
	width: number;
	height: number;
}

class Description {
	short: string;
	long: string;
	// Move image to this class?
}

enum Direction {
	// I don't know that these numbers are super-useful. I guess I can add behaviors based on them, we'll see...
	None = 0,
	OnSelf = 1,
	East = 360,
	NorthEast = 45,
	North = 90,
	NorthWest = 135,
	West = 180,
	SouthWest = 225,
	South = 270,
	SouthEast = 315
};

const squareSize: number = 20;

export class Arrow {
	name: string;
	directionInDegrees: number;
	direction: number;
	hasChanged: boolean;
	width: number = squareSize;
	height: number = squareSize;
	xpos: number;
	ypos: number;

	setProperties() {
		this.name = 'arrow';

		switch (this.direction) {
			case Direction.NorthEast:
				this.name += 'ne';
				this.xpos = squareSize;
				this.ypos = -squareSize;
				break;
			case Direction.North:
				this.name += 'n';
				this.xpos = 0;
				this.ypos = -squareSize;
				break;
			case Direction.NorthWest:
				this.name += 'nw';
				this.xpos = -squareSize;
				this.ypos = -squareSize;
				break;
			case Direction.West:
				this.name += 'w';
				this.xpos = -squareSize;
				this.ypos = 0;
				break;
			case Direction.SouthWest:
				this.name += 'sw';
				this.xpos = -squareSize;
				this.ypos = squareSize;
				break;
			case Direction.South:
				this.name += 's';
				this.xpos = 0;
				this.ypos = squareSize;
				break;
			case Direction.SouthEast:
				this.name += 'se';
				this.xpos = squareSize;
				this.ypos = squareSize;
				break;
			case Direction.East:
				this.name += 'e';
				this.xpos = squareSize;
				this.ypos = 0;
				break;
			case Direction.OnSelf:
				this.name = '';
				this.xpos = 0;
				this.ypos = 0;
			default:
				break;
		}
	}
}

export class Doctor implements ICharacter {
	constructor() {
		this.arrow = new Arrow();
	}

	// x and y positions in relation to canvas (upper-left corner of image)
	xpos: number;
	ypos: number;
	image: HTMLImageElement;
	name: string = 'doctor';
	width: number = squareSize;
	height: number = squareSize;
	description: Description;
	arrow: Arrow;

	// image file, behaviors, etc.
	centerX(): number {
		return this.xpos + (this.width / 2);
	}

	centerY(): number {
		return this.ypos + (this.height / 2);
	}

	updateArrow(cursor: Cursor): Arrow {
		// the idea is to compare the points between the cursor location and the center of the doctor.
		// In order to know the center, I'll have to know the size of the image.
		// I'm not sure if I can obtain this programmatically. We'll see...

		let xDiff: number = cursor.xpos - this.centerX();
		let yDiff: number = cursor.ypos - this.centerY();
		let direction: Direction;

		if (Math.abs(xDiff) <= this.width * 0.5 && Math.abs(yDiff) <= this.height * 0.5) {
			// skip turn
			direction = Direction.OnSelf;
		} else if (Math.abs(xDiff) <= this.width * 1.5 && Math.abs(yDiff) <= this.height * 1.5) {
			// Use the square arrow location method
			direction = this.calculateSquareDirection(xDiff, yDiff);
		} else {
			// use the 45 degree location method
			direction = this.calculateDegreeDirection(xDiff, yDiff);
		}

		// The buffer isn't working right. That returns zero.
		if (direction === this.arrow.direction || direction === Direction.None) {
			this.arrow.hasChanged = false;
		} else {
			this.arrow.direction = direction;
			this.arrow.hasChanged = true;
			this.arrow.setProperties();
		}

		return this.arrow;
	}

	calculateSquareDirection(xDiff: number, yDiff: number): Direction {
		// if the x is less than half width, y is negative, you are north
		// if the x is less than half width, y is positive, you are south
		// if the y is less than half height, x is negative, you are west
		// if the y is less than half height, x is positive, you are east
		// if x and y are greater and both positive, it's southeast
		// if x and y are greater and both negative, it's northwest
		// if x and y are greater and x negative, it's southwest
		// if x and y are greater and y negative, it's northeast
		if (Math.abs(xDiff) <= this.width * 0.5 && yDiff < 0) {
			return Direction.North;
		} else if (Math.abs(xDiff) <= this.width * 0.5 && yDiff > 0) {
			return Direction.South;
		} else if (xDiff < 0 && Math.abs(yDiff) <= this.height * 0.5) {
			return Direction.West;
		} else if (xDiff > 0 && Math.abs(yDiff) <= this.height * 0.5) {
			return Direction.East;
		} else if (xDiff > 0 && yDiff > 0) {
			return Direction.SouthEast;
		} else if (xDiff < 0 && yDiff < 0) {
			return Direction.NorthWest;
		} else if (xDiff < 0 && yDiff > 0) {
			return Direction.SouthWest;
		} else if (xDiff > 0 && yDiff < 0) {
			return Direction.NorthEast;
		} else {
			return Direction.None;
		}
	}

	calculateDegreeDirection(xDiff: number, yDiff: number): Direction {
		let theta = Math.atan2(-yDiff, xDiff);

		if (theta < 0) {
			theta += 2 * Math.PI;
		}

		this.arrow.directionInDegrees = theta * 180 / Math.PI;

		// Now I need to calculate the appropriate enum based on arrowDirectionInDegrees
		const deg: number = this.arrow.directionInDegrees;
		// 22.5 makes each wedge abut the next. Maybe about 21 degrees will "pixel jumping" and unintended clicks in the wrong direction.
		const halfWedge: number = 21.0;

		// Probably a way to simplify this code into one or two lines
		if ((deg >= 360 - halfWedge && deg <= 360) || (deg >= 0 && deg <= halfWedge)) {
			return Direction.East;
		} else if (deg >= 45 - halfWedge && deg <= 45 + halfWedge) {
			return Direction.NorthEast;
		} else if (deg >= 90 - halfWedge && deg <= 90 + halfWedge) {
			return Direction.North;
		} else if (deg >= 135 - halfWedge && deg <= 135 + halfWedge) {
			return Direction.NorthWest;
		} else if (deg >= 180 - halfWedge && deg <= 180 + halfWedge) {
			return Direction.West;
		} else if (deg >= 225 - halfWedge && deg <= 225 + halfWedge) {
			return Direction.SouthWest;
		} else if (deg >= 270 - halfWedge && deg <= 270 + halfWedge) {
			return Direction.South;
		} else if (deg >= 315 - halfWedge && deg <= 315 + halfWedge) {
			return Direction.SouthEast;
		} else {
			return Direction.None;
		}
	}

	move(): void {
		// Should be a simple matter of placing the dr where the arrow is,let's try that:
		this.xpos += this.arrow.xpos;
		this.ypos += this.arrow.ypos;
	}
}

export class Dalek implements ICharacter {
	xpos: number;
	ypos: number;
	name: string;
	image: HTMLImageElement;
	width: number;
	height: number;
}

export class Cursor {
	xpos: number;
	ypos: number;
}
