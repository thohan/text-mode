import CharacterModel = require('./character.model');
import ICharacter = CharacterModel.ICharacter;
import DoctorModel = require('./doctor.model');
import Doctor = DoctorModel.Doctor;

export class Combos {
	comboSingle = 0;
	comboTwoWayCollision = 0;
	comboTwoWayJunkPile = 0;
	comboThreeWayCollision = 0;
	comboThreeWayJunkPile = 0;
	comboSonicScrewdriver = 0;
}

export class HighScore {
	name: string;
	score: number;
}

// A lightweight container for the information I want to store.
export class SavedScore {
	// Put the all-time counters here. This will be necessary for achievements and such.
	countJunkPile = 0;
	countTwoWayJunkPile = 0;
	countTwoWayCollision = 0;
	countThreeWayJunkPile = 0;
	countThreeWayCollision = 0;
	countJunkPileCombox2 = 0;
	countJunkPileCombox3 = 0;
	countTwoWayJunkPileCombox2 = 0;
	countTwoWayJunkPileCombox3 = 0;
	countTwoWayCollisionCombox2 = 0;
	countTwoWayCollisionCombox3 = 0;
	countThreeWayJunkPileCombox2 = 0;
	countThreeWayJunkPileCombox3 = 0;
	countThreeWayCollisionCombox2 = 0;
	countThreeWayCollisionCombox3 = 0;
	countThreePlusTwoPlusOneCombo = 0;
	countThreePlusTwoCombo = 0;
	countThreePlusOneCombo = 0;
	countTwoPlusOneCombo = 0;
	countSonicScrewDriver = 0;
	countRoundsComplete = 0;

	countRoundFiveComplete = 0;
	countRoundTenComplete = 0;
	countRoundFifteenComplete = 0;
	countRoundTwentyComplete = 0;
	countRoundTwentyFiveComplete = 0;
	countRoundThirtyCompleteAllTime = 0;

	highScores: HighScore[];

	constructor() {
		this.highScores = new Array<HighScore>();
	}
}

export enum Events {
	junkPile,
	twoWayJunkPile,
	twoWayCollision,
	threeWayJunkPile,
	threeWayCollision,
	junkPileCombox2,
	junkPileCombox3,
	twoWayJunkPileCombox2,
	twoWayJunkPileCombox3,
	twoWayCollisionCombox2,
	twoWayCollisionCombox3,
	threeWayJunkPileCombox2,
	threeWayJunkPileCombox3,
	threeWayCollisionCombox2,
	threeWayCollisionCombox3,
	threePlusTwoPlusOneCombo,
	threePlusTwoCombo,
	threePlusOneCombo,
	twoPlusOneCombo,
	sonicScrewdriver,
	roundComplete
}

export class Score {
	// event scores:
	readonly pointsJunkPile = 10;			// The most common occurrence.
	readonly pointsTwoWayJunkPile = 25;		// In my unscientific sample, this was as common as a three-way collision. Somewhat uncommon, maybe one in ten or so.
	readonly pointsThreeWayJunkPile = 40;	// This seems to be a very rare event!
	readonly pointsTwoWayCollision = 25;	// Very common event, almost as common as a single junk pile.
	readonly pointsThreeWayCollision = 40;	// Uncommon, about one in ten or so.
	readonly pointsSonicScrewdriver = 10;	// Not implemented yet.
	readonly pointsRoundComplete = 10;		// Not sure about this one. Seems like I'd really want to reward finishing a round. Maybe 10 * the round, e.g. 30 for completing the third round.

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

	// event counters:
	countJunkPile = 0;
	countTwoWayJunkPile = 0;
	countThreeWayJunkPile = 0;
	countTwoWayCollision = 0;
	countThreeWayCollision = 0;
	countSonicScrewDriver = 0;
	countRoundsComplete = 0;
	// combo counters:
	countJunkPileCombox2 = 0;
	countJunkPileCombox3 = 0;
	// possibly go x4, x5, x6, etc.
	countTwoWayJunkPileCombox2 = 0;
	countTwoWayJunkPileCombox3 = 0;
	countTwoWayCollisionCombox2 = 0;
	countTwoWayCollisionCombox3 = 0;
	// maybe go x4, x5, etc.
	countThreeWayJunkPileCombox2 = 0;
	countThreeWayJunkPileCombox3 = 0;
	countThreeWayCollisionCombox2 = 0;
	countThreeWayCollisionCombox3 = 0;
	// maybe go x4, x5, etc.
	countTwoPlusOneCombo = 0;
	countThreePlusOneCombo = 0;
	countThreePlusTwoCombo = 0;
	countThreePlusTwoPlusOneCombo = 0;

	combos: Combos;
	savedScore: SavedScore;

	constructor() {
		this.scoreCurrent = 0;
		this.combos = new Combos();
		this.savedScore = new SavedScore();
	}

	processCombos() {
		switch (this.combos.comboSingle) {
			case 2:
				this.update(Events.junkPileCombox2);
				break;
			case 3:
			case 4:
			case 5:	// What am I going to do when I have a count on any of these higher than 3? I don't want to just ignore those multipliers/bonuses.
				this.update(Events.junkPileCombox3);
				break;
		}

		switch (this.combos.comboTwoWayJunkPile) {
			case 2:
				this.update(Events.twoWayJunkPileCombox2);
				break;
			case 3:
				this.update(Events.twoWayJunkPileCombox3);
				break;
		}

		switch (this.combos.comboTwoWayCollision) {
			case 2:
				this.update(Events.twoWayCollisionCombox2);
				break;
			case 3:
				this.update(Events.twoWayCollisionCombox3);
				break;
		}

		switch (this.combos.comboThreeWayJunkPile) {
			case 2:
				this.update(Events.threeWayJunkPileCombox2);
				break;
			case 3:
				this.update(Events.threeWayJunkPileCombox3);
				break;
		}

		switch (this.combos.comboThreeWayCollision) {
			case 2:
				this.update(Events.threeWayCollisionCombox2);
				break;
			case 3:
				this.update(Events.threeWayCollisionCombox3);
				break;
		}

		// Now for the combo combos. I'm not distinguishing between junkpiles and non-junkpile collisions for these
		if (this.combos.comboSingle > 0
			&& (this.combos.comboTwoWayJunkPile > 0 || this.combos.comboTwoWayCollision)
			&& (this.combos.comboThreeWayJunkPile > 0 || this.combos.comboThreeWayCollision)
		) {
			this.update(Events.threePlusTwoPlusOneCombo);
		} else if ((this.combos.comboTwoWayJunkPile > 0 || this.combos.comboTwoWayCollision)
			&& (this.combos.comboThreeWayJunkPile > 0 || this.combos.comboThreeWayCollision)
		) {
			this.update(Events.threePlusTwoCombo);
		} else if ((this.combos.comboThreeWayJunkPile > 0 || this.combos.comboThreeWayCollision)
			&& this.combos.comboSingle > 0
		) {
			this.update(Events.threePlusOneCombo);
		} else if ((this.combos.comboTwoWayJunkPile > 0 || this.combos.comboTwoWayCollision)
			&& this.combos.comboSingle
		) {
			this.update(this.pointsTwoPlusOneCombo);
		}

		this.clearCombos();
	}

	clearCombos() {
		this.combos.comboSingle = 0;
		this.combos.comboThreeWayCollision = 0;
		this.combos.comboThreeWayJunkPile = 0;
		this.combos.comboTwoWayCollision = 0;
		this.combos.comboTwoWayJunkPile = 0;
		this.combos.comboSonicScrewdriver = 0;
	}

	update(event: Events, round = 0): void {
		switch (event) {
			case Events.junkPile:
				this.countJunkPile++;
				this.combos.comboSingle++;
				this.updatePoints(this.pointsJunkPile);
				break;
			case Events.twoWayJunkPile:
				this.countTwoWayJunkPile++;
				this.combos.comboTwoWayJunkPile++;
				this.updatePoints(this.pointsTwoWayJunkPile);
				break;
			case Events.twoWayCollision:
				this.countTwoWayCollision++;
				this.savedScore.countTwoWayCollision++;
				this.combos.comboTwoWayCollision++;
				this.updatePoints(this.pointsTwoWayCollision);
				break;
			case Events.threeWayJunkPile:
				this.countThreeWayJunkPile++;
				this.savedScore.countThreeWayJunkPile++;
				this.combos.comboThreeWayJunkPile++;
				this.updatePoints(this.pointsThreeWayJunkPile);
				break;
			case Events.threeWayCollision:
				this.countThreeWayCollision++;
				this.savedScore.countThreeWayCollision++;
				this.combos.comboThreeWayCollision++;
				this.updatePoints(this.pointsThreeWayCollision);
				break;
			case Events.junkPileCombox2:
				this.countJunkPileCombox2++;
				this.updatePoints(this.pointsJunkPileCombox2);
				break;
			case Events.junkPileCombox3:
				this.countJunkPileCombox3++;
				this.updatePoints(this.pointsJunkPileCombox3);
				break;
			case Events.twoWayJunkPileCombox2:
				this.countTwoWayJunkPileCombox2++;
				this.updatePoints(this.pointsTwoWayJunkPileCombox2);
				break;
			case Events.twoWayJunkPileCombox3:
				this.countTwoWayJunkPileCombox3++;
				this.updatePoints(this.pointsTwoWayJunkPileCombox3);
				break;
			case Events.twoWayCollisionCombox2:
				this.countTwoWayCollisionCombox2++;
				this.updatePoints(this.pointsTwoWayCollisionCombox2);
				break;
			case Events.twoWayCollisionCombox3:
				this.countTwoWayCollisionCombox3++;
				this.updatePoints(this.pointsTwoWayCollisionCombox3);
				break;
			case Events.threeWayJunkPileCombox2:
				this.countThreeWayJunkPileCombox2++;
				this.updatePoints(this.pointsThreeWayJunkPileCombox2);
				break;
			case Events.threeWayJunkPileCombox3:
				this.countThreeWayJunkPileCombox3++;
				this.updatePoints(this.pointsThreeWayJunkPileCombox3);
				break;
			case Events.threeWayCollisionCombox2:
				this.countThreeWayCollisionCombox2++;
				this.updatePoints(this.pointsThreeWayCollisionCombox2);
				break;
			case Events.threeWayCollisionCombox3:
				this.countThreeWayCollisionCombox3++;
				this.updatePoints(this.pointsThreeWayCollisionCombox3);
				break;
			case Events.threePlusTwoPlusOneCombo:
				this.countThreePlusTwoPlusOneCombo++;
				this.updatePoints(this.pointsThreePlusTwoPlusOneCombo);
				break;
			case Events.threePlusTwoCombo:
				this.countThreePlusTwoCombo++;
				this.updatePoints(this.pointsThreePlusTwoCombo);
				break;
			case Events.threePlusOneCombo:
				this.countThreePlusOneCombo++;
				this.updatePoints(this.pointsThreePlusOneCombo);
				break;
			case Events.twoPlusOneCombo:
				this.countTwoPlusOneCombo++;
				this.updatePoints(this.pointsTwoPlusOneCombo);
				break;
			case Events.sonicScrewdriver:
				this.countSonicScrewDriver++;
				this.combos.comboSonicScrewdriver++;
				this.updatePoints(this.pointsSonicScrewdriver);
				break;
			case Events.roundComplete:
				// Probably need to do some special logic in here if I'm going to support counts of 5/10/15/20 rounds, etc.
				// For now, I'll just update the score:
				this.countRoundsComplete++;
				this.updatePoints(this.pointsRoundComplete * round);
				break;
		}
	}

	updatePoints(points: number) {
		this.scoreCurrent += points;
	}

	// TODO: Increment the all-time counters by the in-game counter counts.
	updateSavedScore() {
		this.savedScore.countJunkPile += this.countJunkPile;
		this.savedScore.countTwoWayJunkPile += this.countTwoWayJunkPile;
		this.savedScore.countTwoWayCollision += this.countTwoWayCollision;
		this.savedScore.countThreeWayJunkPile += this.countThreeWayJunkPile;
		this.savedScore.countThreeWayCollision += this.countThreeWayCollision;
		this.savedScore.countJunkPileCombox2 += this.countJunkPileCombox2;
		this.savedScore.countJunkPileCombox3 += this.countJunkPileCombox3;
		this.savedScore.countTwoWayJunkPileCombox2 += this.countTwoWayJunkPileCombox2;
		this.savedScore.countTwoWayJunkPileCombox3 += this.countTwoWayJunkPileCombox3;
		this.savedScore.countTwoWayCollisionCombox2 += this.countTwoWayCollisionCombox2;
		this.savedScore.countTwoWayCollisionCombox3 += this.countTwoWayCollisionCombox3;
		this.savedScore.countThreeWayJunkPileCombox2 += this.countThreeWayJunkPileCombox2;
		this.savedScore.countThreeWayJunkPileCombox3 += this.countThreeWayJunkPileCombox3;
		this.savedScore.countThreeWayCollisionCombox2 += this.countThreeWayCollisionCombox2;
		this.savedScore.countThreeWayCollisionCombox3 += this.countThreeWayCollisionCombox3;
		this.savedScore.countThreePlusTwoPlusOneCombo += this.countThreePlusTwoPlusOneCombo;
		this.savedScore.countThreePlusTwoCombo += this.countThreePlusTwoCombo;
		this.savedScore.countThreePlusOneCombo += this.countThreePlusOneCombo;
		this.savedScore.countTwoPlusOneCombo += this.countTwoPlusOneCombo;
		this.savedScore.countSonicScrewDriver += this.countSonicScrewDriver;
		this.savedScore.countRoundsComplete += this.countRoundsComplete;
		// TODO: Update the 5/10/15, etc round counts!
	}
}
