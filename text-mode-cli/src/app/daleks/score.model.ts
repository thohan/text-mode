import CharacterModel = require('./character.model');
import ICharacter = CharacterModel.ICharacter;
import DoctorModel = require('./doctor.model');
import Doctor = DoctorModel.Doctor;

export class Score {
	readonly JunkPile = 5;
	readonly TwoWayJunkPile = 10;
	readonly ThreeWayJunkPile = 20;
	readonly TwoWay = 10;
	readonly ThreeWay = 20;
	readonly SonicScrewdriver = 10;
	// TODO: If two or more collisions happen at the same time at different locations, do a multiplier
	readonly RoundComplete = 10;
	// Other stuff

	scoreCurrent: number = 0;
	scoreAllTime: number = 0;
	countJunkPileCurrent: number = 0;
	countJunkPileAllTime: number = 0;
	countTwoWayJunkPileCurrent: number = 0;
	countTwoWayJunkPileAllTime: number = 0;
	countThreeWayJunkPileCurrent: number = 0;
	countThreeWayJunkPileAllTime: number = 0;
	countTwoWayCollisionCurrent: number = 0;
	countTwoWayCollisionAllTime: number = 0;
	countThreeWayCollisionCurrent: number = 0;
	countThreeWayCollisionAllTime: number = 0;
	countSonicScrewDriverCurrent: number = 0;
	countSonicScrewDriverAllTime: number = 0;
	countRoundsCompleteAllTime: number = 0;
	countRoundFiveCompleteAllTime: number = 0;
	countRoundTenCompleteAllTime: number = 0;
	countRoundFifteenCompleteAllTime: number = 0;
	countRoundTwentyCompleteAllTime: number = 0;
	countRoundTwentyFiveCompleteAllTime: number = 0;
	countRoundThirtyCompleteAllTime: number = 0;

	constructor() {
		this.scoreCurrent = 0;
	}

	update(chars: ICharacter[]): void {
		for (let charA of chars) {
			for (let charB of chars) {
				// if not a doctor, do the rest of the checks
				if (
					!(charA instanceof Doctor)
					&& !(charB instanceof Doctor)
					&& charA !== charB
				) {
					// Types of dalek destruction:
					// One dalek running into a pile
					// Two daleks running into a pile
					// Three daleks running into a pile
					// Two daleks colliding
					// Three daleks colliding
					// A sonic screwdriver at some point in the future, I suppose

					// if hasCountedScore = true and isDead = true, the dalek is a pile, otherwise, a fresh kill

				}
			}
		}
	}
}
