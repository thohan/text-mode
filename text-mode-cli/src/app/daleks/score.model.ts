import CharacterModel = require('./character.model');
import ICharacter = CharacterModel.ICharacter;
import DoctorModel = require('./doctor.model');
import Doctor = DoctorModel.Doctor;

export class Combos {
	comboSingleCount = 0;
	comboTwoWayCollision = 0;
	comboTwoWayJunkPile = 0;
	comboThreeWayCollision = 0;
	comboThreeWayJunkPile = 0;
}

export class Score {
	// event scores:
	readonly JunkPile = 10;
	readonly TwoWayJunkPile = 25;
	readonly ThreeWayJunkPile = 40;
	readonly TwoWay = 25;
	readonly ThreeWay = 40;
	readonly SonicScrewdriver = 10;
	readonly RoundComplete = 50;	// Not sure about this one. Seems like I'd really want to reward finishing a round. Maybe 10 * the round, e.g. 30 for completing the third round.

	// score multipliers
	// I have no idea what would be appropriate.
	// Maybe use an arbitrary point value rather than a multiplier.
	readonly TwoPlusOneCombox2 = 1.2;
	readonly TwoPlusOneCombox3 = 1.5;
	readonly ThreePlusOneCombox2 = 1.25;
	readonly ThreePlusOneCombox3 = 1.6;
	readonly ThreePlusTwoCombox2 = 1.3;
	readonly ThreePlusTwoCombox3 = 1.7;
	readonly ThreePlusTwoPlusOneCombox2 = 2;
	readonly ThreePlusTwoPlusOneCombox3 = 3;

	// total score:
	scoreCurrent = 0;
	scoreAllTime = 0;

	// event counters:
	countJunkPileCurrent = 0;
	countJunkPileAllTime = 0;
	countTwoWayJunkPileCurrent = 0;
	countTwoWayJunkPileAllTime = 0;
	countThreeWayJunkPileCurrent = 0;
	countThreeWayJunkPileAllTime = 0;
	countTwoWayCollisionCurrent = 0;
	countTwoWayCollisionAllTime = 0;
	countThreeWayCollisionCurrent = 0;
	countThreeWayCollisionAllTime = 0;
	countSonicScrewDriverCurrent = 0;
	countSonicScrewDriverAllTime = 0;
	countRoundsCompleteAllTime = 0;
	countRoundFiveCompleteAllTime = 0;
	countRoundTenCompleteAllTime = 0;
	countRoundFifteenCompleteAllTime = 0;
	countRoundTwentyCompleteAllTime = 0;
	countRoundTwentyFiveCompleteAllTime = 0;
	countRoundThirtyCompleteAllTime = 0;

	// combo counters:
	countJunkPilex2Current = 0;
	countJunkPilex2AllTime = 0;
	countJunkPilex3Current = 0;
	countJunkPilex3AllTime = 0;
	// possibly go x4, x5, x6, etc.
	countTwoWayJunkPilex2Current = 0;
	countTwoWayJunkPilex2AllTime = 0;
	countTwoWayJunkPilex3Current = 0;
	countTwoWayJunkPilex3AllTime = 0;
	countTwoWayCollisionx2Current = 0;
	countTwoWayCollisionx2AllTime = 0;
	countTwoWayCollisionx3Current = 0;
	countTwoWayCollisionx3AllTime = 0;
	// maybe go x4, x5, etc.
	countThreeWayJunkPilex2Current = 0;
	countThreeWayJunkPilex2AllTime = 0;
	countThreeWayJunkPilex3Current = 0;
	countThreeWayJunkPilex3AllTime = 0;
	countThreeWayCollisionx2Current = 0;
	countThreeWayCollisionx2AllTime = 0;
	countThreeWayCollisionx3Current = 0;
	countThreeWayCollisionx3AllTime = 0;
	// maybe go x4, x5, etc.
	countTwoPlusOneComboCurrent = 0;
	countTwoPlusOneComboAllTime = 0;
	countThreePlusOneComboCurrent = 0;
	countThreePlusOneComboAllTime = 0;
	countThreePlusTwoComboCurrent = 0;
	countThreePlusTwoComboAllTime = 0;
	countThreePlusTwoPlusOneComboCurrent = 0;
	countThreePlusTwoPlusOneComboAllTime = 0;

	combos: Combos;

	constructor() {
		this.scoreCurrent = 0;
		this.combos = new Combos;
	}

	processCombos() {
		switch (this.combos.comboSingleCount) {
			case 2:
				this.countJunkPilex2Current++;
				this.countJunkPilex2AllTime++;
				break;
			case 3:
				this.countJunkPilex3Current++;
				this.countJunkPilex3AllTime++;
				break;
		}

		switch (this.combos.comboTwoWayJunkPile) {
			case 2:
				this.countTwoWayJunkPilex2Current++;
				this.countTwoWayJunkPilex2AllTime++;
				break;
			case 3:
				this.countTwoWayJunkPilex3Current++;
				this.countTwoWayJunkPilex3AllTime++;
				break;
		}

		switch (this.combos.comboTwoWayCollision) {
			case 2:
				this.countTwoWayCollisionx2Current++;
				this.countTwoWayCollisionx2AllTime++;
				break;
			case 3:
				this.countTwoWayCollisionx3Current++;
				this.countTwoWayCollisionx3AllTime++;
				break;
		}

		switch (this.combos.comboThreeWayJunkPile) {
			case 2:
				this.countThreeWayJunkPilex2Current++;
				this.countThreeWayJunkPilex2AllTime++;
				break;
			case 3:
				this.countThreeWayJunkPilex3Current++;
				this.countThreeWayJunkPilex3AllTime++;
				break;
		}

		switch (this.combos.comboThreeWayCollision) {
			case 2:
				this.countThreeWayCollisionx2Current++;
				this.countThreeWayCollisionx2AllTime++;
				break;
			case 3:
				this.countThreeWayCollisionx3Current++;
				this.countThreeWayCollisionx3AllTime++;
				break;
		}

		// Now for the combo combos. I'm not distinguishing between junkpiles and non-junkpile collisions for these
		if (this.combos.comboSingleCount > 0
			&& (this.combos.comboTwoWayJunkPile > 0 || this.combos.comboTwoWayCollision)
			&& (this.combos.comboThreeWayJunkPile > 0 || this.combos.comboThreeWayCollision)
		) {
			this.countThreePlusTwoPlusOneComboCurrent++;
			this.countThreePlusTwoPlusOneComboAllTime++;
		} else if ((this.combos.comboTwoWayJunkPile > 0 || this.combos.comboTwoWayCollision)
			&& (this.combos.comboThreeWayJunkPile > 0 || this.combos.comboThreeWayCollision)
		) {
			this.countThreePlusTwoComboCurrent++;
			this.countThreePlusTwoComboAllTime++;
		} else if ((this.combos.comboThreeWayJunkPile > 0 || this.combos.comboThreeWayCollision)
			&& this.combos.comboSingleCount > 0
		) {
			this.countThreePlusOneComboCurrent++;
			this.countThreePlusOneComboAllTime++;
		} else if ((this.combos.comboTwoWayJunkPile > 0 || this.combos.comboTwoWayCollision)
			&& this.combos.comboSingleCount
		) {
			this.countTwoPlusOneComboCurrent++;
			this.countTwoPlusOneComboAllTime++;
		}
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
