import CharacterModel = require('./character.model');
import Direction = CharacterModel.Direction;
import ICharacter = CharacterModel.ICharacter;
import IDescription = CharacterModel.IDescription;
import ConfigModel = require('./config.model');
import squareSize = ConfigModel.squareSize;
import squareWidth = ConfigModel.squareWidth;
import squareHeight = ConfigModel.squareHeight;
import ArrowModel = require('./arrow.model');
import Arrow = ArrowModel.Arrow;
import InputModel = require('./input.model');
import Input = InputModel.Input;
import ICursor = InputModel.ICursor;

export class Doctor implements ICharacter {
	xpos: number;
	ypos: number;
	image: HTMLImageElement;
	name: string = 'doctor';
	width = squareSize;
	height = squareSize;
	description: IDescription;
	arrow: Arrow;

	constructor() {
		this.arrow = new Arrow();
	}

	centerX(): number {
		return this.xpos + (this.width / 2);
	}

	centerY(): number {
		return this.ypos + (this.height / 2);
	}

	teleport(): void {
		this.xpos = Math.ceil(Math.random() * squareWidth) * squareSize - squareSize;
		this.ypos = Math.ceil(Math.random() * squareHeight) * squareSize - squareSize;
	}

	updateArrow(cursor: ICursor): Arrow {
		const xDiff = cursor.xpos - this.centerX();
		const yDiff = cursor.ypos - this.centerY();
		let direction: Direction;

		if (Math.abs(xDiff) <= this.width * 0.5 && Math.abs(yDiff) <= this.height * 0.5) {
			// skip turn
			direction = Direction.OnSelf;
		} else if (Math.abs(xDiff) <= this.width * 1.5 && Math.abs(yDiff) <= this.height * 1.5) {
			// Use the square location method
			direction = this.calculateSquareDirection(xDiff, yDiff);
		} else {
			// use the 45 degree wedge location method
			direction = this.calculateDegreeDirection(xDiff, yDiff);
		}

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
		const deg = this.arrow.directionInDegrees;

		// 22.5 makes each wedge abut the next.
		// Maybe about 21 degrees will help avoid "pixel jumping" and unintended clicks in the wrong direction.
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

	checkNoCollision(inputType: Input, xlimit: number, ylimit: number, keyCode: number = 0): boolean {
		if (inputType === Input.Mouse) {
			if (this.xpos + this.arrow.xpos >= 0
				&& this.xpos + this.arrow.xpos <= xlimit
				&& this.ypos + this.arrow.ypos >= 0
				&& this.ypos + this.arrow.ypos <= ylimit
			) {
				return true;
			} else {
				return false;
			}
		}

		if (inputType === Input.Keyboard) {
			switch (keyCode) {
				case 81:	// NW
					return this.xpos - squareSize >= 0 && this.ypos - squareSize >= 0;
				case 87:	// N
					return this.ypos - squareSize >= 0;
				case 69:	// NE
					return this.xpos + squareSize <= xlimit - squareSize && this.ypos - squareSize >= 0;
				case 65:	// W
					return this.xpos - squareSize >= 0;
				case 83:	// on self
					return true;
				case 68:	// E
					return this.xpos + squareSize <= xlimit - squareSize;
				case 90:	// SW
					return this.xpos - squareSize >= 0 && this.ypos <= ylimit;
				case 88:	// S
					return this.ypos + squareSize <= ylimit - squareSize;
				case 67:	// SE
					return this.xpos + squareSize <= xlimit - squareSize && this.ypos + squareSize <= ylimit - squareSize;
				default:
					return false;
			}
		}

		return false;
	}

	move(inputType: Input, xLimit: number, yLimit: number): void {
		if (inputType === Input.Mouse) {
			if (this.checkNoCollision(Input.Mouse, xLimit, yLimit)) {
				this.xpos += this.arrow.xpos;
				this.ypos += this.arrow.ypos;
			}
		}

		if (inputType === Input.Keyboard) {
			if (this.checkNoCollision(Input.Keyboard, xLimit, yLimit, (event as KeyboardEvent).keyCode)) {
				switch ((event as KeyboardEvent).keyCode) {
					case 81: // q - NW
						this.xpos += -squareSize;
						this.ypos += -squareSize;
						break;
					case 87: // w - N
						this.ypos += -squareSize;
						break;
					case 69: // e - NE
						this.xpos += squareSize;
						this.ypos += -squareSize;
						break;
					case 65: // a - W
						this.xpos += -squareSize;
						break;
					case 83: // s - in place
						break;
					case 68: // d - E
						this.xpos += squareSize;
						break;
					case 90: // z - SW
						this.xpos += -squareSize;
						this.ypos += squareSize;
						break;
					case 88: // x - S
						this.ypos += squareSize;
						break;
					case 67: // c - SE
						this.xpos += squareSize;
						this.ypos += squareSize;
						break;
				}
			}
		}
	}
}
