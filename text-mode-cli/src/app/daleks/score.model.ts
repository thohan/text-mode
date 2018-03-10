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
	readonly pointsJunkPile = 10;			// The most common occurrence.
	readonly pointsTwoWayJunkPile = 25;		// In my unscientific sample, this was as common as a three-way collision. Somewhat uncommon, maybe one in ten or so.
	readonly pointsThreeWayJunkPile = 50;	// This seems to be a very rare event!
	readonly pointsTwoWayCollision = 20;	// Very common event, almost as common as a single junk pile.
	readonly pointsThreeWayCollision = 35;	// Uncommon, about one in ten or so.
	readonly pointsSonicScrewdriver = 10;	// Not implemented yet.
	readonly pointsRoundComplete = 50;		// Not sure about this one. Seems like I'd really want to reward finishing a round. Maybe 10 * the round, e.g. 30 for completing the third round.

	// score multipliers
	// I have no idea what would be appropriate.
	// Maybe use an arbitrary point value rather than a multiplier.
	readonly pointsJunkPileCombox2 = 5;
	readonly pointsJunkPileCombox3 = 10;
	readonly pointsTwoWayJunkPileCombox2 = 10;
	readonly pointsTwoWayJunkPileCombox3 = 20;
	readonly pointsTwoWayCollisionCombox2 = 10;
	readonly pointsTwoWayCollisionCombox3 = 20;
	readonly pointsThreeWayJunkPileCombox2 = 20;
	readonly pointsThreeWayJunkPileCombox3 = 40;
	readonly pointsThreeWayCollisionCombox2 = 20;
	readonly pointsThreeWayCollisionCombox3 = 40;
	readonly pointsTwoPlusOneCombo = 15;
	readonly pointsThreePlusOneCombo = 20;
	readonly pointsThreePlusTwoCombo = 30;
	readonly pointsThreePlusTwoPlusOneCombo = 50;

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
				this.update(this.pointsJunkPileCombox2);
				break;
			case 3:
				this.countJunkPilex3Current++;
				this.countJunkPilex3AllTime++;
				this.update(this.pointsJunkPileCombox3);
				break;
		}

		switch (this.combos.comboTwoWayJunkPile) {
			case 2:
				this.countTwoWayJunkPilex2Current++;
				this.countTwoWayJunkPilex2AllTime++;
				this.update(this.pointsTwoWayJunkPileCombox2);
				break;
			case 3:
				this.countTwoWayJunkPilex3Current++;
				this.countTwoWayJunkPilex3AllTime++;
				this.update(this.pointsTwoWayJunkPileCombox3);
				break;
		}

		switch (this.combos.comboTwoWayCollision) {
			case 2:
				this.countTwoWayCollisionx2Current++;
				this.countTwoWayCollisionx2AllTime++;
				this.update(this.pointsTwoWayCollisionCombox2);
				break;
			case 3:
				this.countTwoWayCollisionx3Current++;
				this.countTwoWayCollisionx3AllTime++;
				this.update(this.pointsTwoWayCollisionCombox3);
				break;
		}

		switch (this.combos.comboThreeWayJunkPile) {
			case 2:
				this.countThreeWayJunkPilex2Current++;
				this.countThreeWayJunkPilex2AllTime++;
				this.update(this.pointsThreeWayJunkPileCombox2);
				break;
			case 3:
				this.countThreeWayJunkPilex3Current++;
				this.countThreeWayJunkPilex3AllTime++;
				this.update(this.pointsThreeWayJunkPileCombox3);
				break;
		}

		switch (this.combos.comboThreeWayCollision) {
			case 2:
				this.countThreeWayCollisionx2Current++;
				this.countThreeWayCollisionx2AllTime++;
				this.update(this.pointsThreeWayCollisionCombox2);
				break;
			case 3:
				this.countThreeWayCollisionx3Current++;
				this.countThreeWayCollisionx3AllTime++;
				this.update(this.pointsThreeWayCollisionCombox3);
				break;
		}

		// Now for the combo combos. I'm not distinguishing between junkpiles and non-junkpile collisions for these
		if (this.combos.comboSingleCount > 0
			&& (this.combos.comboTwoWayJunkPile > 0 || this.combos.comboTwoWayCollision)
			&& (this.combos.comboThreeWayJunkPile > 0 || this.combos.comboThreeWayCollision)
		) {
			this.countThreePlusTwoPlusOneComboCurrent++;
			this.countThreePlusTwoPlusOneComboAllTime++;
			this.update(this.pointsThreePlusTwoPlusOneCombo);
		} else if ((this.combos.comboTwoWayJunkPile > 0 || this.combos.comboTwoWayCollision)
			&& (this.combos.comboThreeWayJunkPile > 0 || this.combos.comboThreeWayCollision)
		) {
			this.countThreePlusTwoComboCurrent++;
			this.countThreePlusTwoComboAllTime++;
			this.update(this.pointsThreePlusTwoCombo);
		} else if ((this.combos.comboThreeWayJunkPile > 0 || this.combos.comboThreeWayCollision)
			&& this.combos.comboSingleCount > 0
		) {
			this.countThreePlusOneComboCurrent++;
			this.countThreePlusOneComboAllTime++;
			this.update(this.pointsThreePlusOneCombo);
		} else if ((this.combos.comboTwoWayJunkPile > 0 || this.combos.comboTwoWayCollision)
			&& this.combos.comboSingleCount
		) {
			this.countTwoPlusOneComboCurrent++;
			this.countTwoPlusOneComboAllTime++;
			this.update(this.pointsTwoPlusOneCombo);
		}

		this.clearCombos();
	}

	clearCombos() {
		this.combos.comboSingleCount = 0;
		this.combos.comboThreeWayCollision = 0;
		this.combos.comboThreeWayJunkPile = 0;
		this.combos.comboTwoWayCollision = 0;
		this.combos.comboTwoWayJunkPile = 0;
	}

	update(points: number): void {
		this.scoreCurrent += points;
		this.scoreAllTime += points;
	}

	// perhaps several score update methods in addition to the one above...
}
