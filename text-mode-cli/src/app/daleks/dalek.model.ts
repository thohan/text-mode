interface ICharacter {
	xpos: number;
	ypos: number;
	image: HTMLImageElement;
	width: number;
	height: number;
}

enum Directions {
	// I don't know that these numbers are super-useful. I guess I can add behaviors based on them, we'll see...
	Stop = 0,
	East = 360,
	NorthEast = 45,
	North = 90,
	NorthWest = 135,
	West = 180,
	SouthWest = 225,
	South = 270,
	SouthEast = 315
};

export class Doctor implements ICharacter {
	// x and y positions in relation to canvas (upper-left corner of image)
	xpos: number;
	ypos: number;
	image: HTMLImageElement;
	width: number = 40;
	height: number = 40;
	arrowDirectionInDegrees: number;
	arrowDirection: number;

	// image file, behaviors, etc.
	getCenterX() {
		return this.xpos + (this.width / 2);
	}

	getCenterY() {
		return this.ypos + (this.height / 2);
	}

	setArrowDirection(cursor: Cursor) {
		// the idea is to compare the points between the cursor location and the center of the doctor.
		// In order to know the center, I'll have to know the size of the image.
		// I'm not sure if I can obtain this programmatically. We'll see...

		let xDiff: number = cursor.xpos - this.getCenterX();
		let yDiff: number = cursor.ypos - this.getCenterY();

		if (Math.abs(xDiff) <= this.width * 0.5 && Math.abs(yDiff) <= this.height * 0.5) {
			// skip turn
		} else if (Math.abs(xDiff) <= this.width * 1.5 && Math.abs(yDiff) <= this.height * 1.5) {
			// Use the square arrow location method
			this.calculateSquareDirection(xDiff, yDiff);
		} else {
			// use the 45 degree location method
			this.calculateDegreeDirection(xDiff, yDiff);
		}
	}

	calculateSquareDirection(xDiff, yDiff) {
		// if the x is less than half width, y is negative, you are north
		// if the x is less than half width, y is positive, you are south
		// if the y is less than half height, x is negative, you are west
		// if the y is less than half height, x is positive, you are east
		// if x and y are greater and both positive, it's southeast
		// if x and y are greater and both negative, it's northwest
		// if x and y are greater and x negative, it's southwest
		// if x and y are greater and y negative, it's northeast
		if (Math.abs(xDiff) <= this.width * 0.5 && yDiff < 0) {
			this.arrowDirection = Directions.North;
		} else if (Math.abs(xDiff) <= this.width * 0.5 && yDiff > 0) {
			this.arrowDirection = Directions.South;
		} else if (xDiff < 0 && Math.abs(yDiff) <= this.height * 0.5) {
			this.arrowDirection = Directions.West;
		} else if (xDiff > 0 && Math.abs(yDiff) <= this.height * 0.5) {
			this.arrowDirection = Directions.East;
		} else if (xDiff > 0 && yDiff > 0) {
			this.arrowDirection = Directions.SouthEast;
		} else if (xDiff < 0 && yDiff < 0) {
			this.arrowDirection = Directions.NorthWest;
		} else if (xDiff < 0 && yDiff > 0) {
			this.arrowDirection = Directions.SouthWest;
		} else if (xDiff > 0 && yDiff < 0) {
			this.arrowDirection = Directions.NorthEast;
		} else {
			// skip turn
		}
	}

	calculateDegreeDirection(xDiff, yDiff) {
		let theta = Math.atan2(-yDiff, xDiff);

		if (theta < 0) {
			theta += 2 * Math.PI;
		}

		this.arrowDirectionInDegrees = theta * 180 / Math.PI;

		// Now I need to calculate the appropriate enum based on arrowDirectionInDegrees
		const deg: number = this.arrowDirectionInDegrees;
		const halfWedge: number = 22.5;

		// Probably a way to simplify this code into one or two lines
		if ((deg >= 360 - halfWedge && deg <= 360) || (deg >= 0 && deg <= halfWedge)) {
			this.arrowDirection = Directions.East;
		} else if (deg >= 45 - halfWedge && deg <= 45 + halfWedge) {
			this.arrowDirection = Directions.NorthEast;
		} else if (deg >= 90 - halfWedge && deg <= 90 + halfWedge) {
			this.arrowDirection = Directions.North;
		} else if (deg >= 135 - halfWedge && deg <= 135 + halfWedge) {
			this.arrowDirection = Directions.NorthWest;
		} else if (deg >= 180 - halfWedge && deg <= 180 + halfWedge) {
			this.arrowDirection = Directions.West;
		} else if (deg >= 225 - halfWedge && deg <= 225 + halfWedge) {
			this.arrowDirection = Directions.SouthWest;
		} else if (deg >= 270 - halfWedge && deg <= 270 + halfWedge) {
			this.arrowDirection = Directions.South;
		} else if (deg >= 315 - halfWedge && deg <= 315 + halfWedge) {
			this.arrowDirection = Directions.SouthEast;
		} else {
			this.arrowDirection = Directions.Stop;
		}
	}
}

export class Dalek implements ICharacter {
	xpos: number;
	ypos: number;
	image: HTMLImageElement;
	width: number;
	height: number;
}

export class Cursor {
	xpos: number;
	ypos: number;
}
