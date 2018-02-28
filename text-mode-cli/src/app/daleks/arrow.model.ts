import ConfigModel = require('./config.model');
import squareSize = ConfigModel.squareSize;
import CharacterModel = require('./character.model');
import Direction = CharacterModel.Direction;

export class Arrow {
	name: string;
	directionInDegrees: number;
	direction: number;
	hasChanged: boolean;
	width = squareSize;
	height = squareSize;
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
