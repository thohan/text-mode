import CharacterModel = require('./character.model');
import ICharacter = CharacterModel.ICharacter;
import IDescription = CharacterModel.IDescription;
import Direction = CharacterModel.Direction;
import DoctorModel = require('./doctor.model');
import Doctor = DoctorModel.Doctor;
import ConfigModel = require('./config.model');
import squareSize = ConfigModel.squareSize;
import squareWidth = ConfigModel.squareWidth;
import squareHeight = ConfigModel.squareHeight;

export class Dalek implements ICharacter {
	xpos: number;
	ypos: number;
	name: string = 'dalek';
	image: HTMLImageElement;
	width = squareSize;
	height = squareSize;
	description: IDescription;

	teleport(): void {
		this.xpos = Math.ceil(Math.random() * squareWidth) * squareSize - squareSize;
		this.ypos = Math.ceil(Math.random() * squareHeight) * squareSize - squareSize;
	}

	// There may be different responses. This one is the most simple.
	respondToMove(doctor: Doctor) {
		if (this.xpos === doctor.xpos) {
			// don't change xpos
		} else if (this.xpos > doctor.xpos) {
			this.xpos -= squareSize;
		} else if (this.xpos < doctor.xpos) {
			this.xpos += squareSize;
		}

		if (this.ypos === doctor.ypos) {
			// don't change ypos
		} else if (this.ypos > doctor.ypos) {
			this.ypos -= squareSize;
		} else if (this.ypos < doctor.ypos) {
			this.ypos += squareSize;
		}
	}
}
