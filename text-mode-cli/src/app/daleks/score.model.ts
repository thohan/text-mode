import CharacterModel = require('./character.model');
import ICharacter = CharacterModel.ICharacter;
import DoctorModel = require('./doctor.model');
import Doctor = DoctorModel.Doctor;

export class Combos {
	comboJunk = 0;
	comboTwoWayCollision = 0;
	comboTwoWayJunkPile = 0;
	comboThreeWayCollision = 0;
	comboThreeWayJunkPile = 0;
	comboSonicScrewdriver = 0;
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

export class Points {
	readonly junkPile = 10;			// The most common occurrence.
	readonly twoWayJunkPile = 25;		// In my unscientific sample, this was as common as a three-way collision. Somewhat uncommon, maybe one in ten or so.
	readonly threeWayJunkPile = 40;	// This seems to be a very rare event!
	readonly twoWayCollision = 25;	// Very common event, almost as common as a single junk pile.
	readonly threeWayCollision = 40;	// Uncommon, about one in ten or so.
	readonly sonicScrewdriver = 10;	// Not implemented yet.
	readonly roundComplete = 10;		// Not sure about this one. Seems like I'd really want to reward finishing a round. Maybe 10 * the round, e.g. 30 for completing the third round.

	// score multipliers
	// I have no idea what would be appropriate.
	// Maybe use an arbitrary point value rather than a multiplier.
	readonly junkPileCombox2 = 5;
	readonly junkPileCombox3 = 10;
	readonly twoWayJunkPileCombox2 = 10;
	readonly twoWayJunkPileCombox3 = 20;
	readonly twoWayCollisionCombox2 = 10;
	readonly twoWayCollisionCombox3 = 20;
	readonly threeWayJunkPileCombox2 = 20;
	readonly threeWayJunkPileCombox3 = 40;
	readonly threeWayCollisionCombox2 = 20;
	readonly threeWayCollisionCombox3 = 40;
	readonly twoPlusOneCombo = 15;
	readonly threePlusOneCombo = 20;
	readonly threePlusTwoCombo = 30;
	readonly threePlusTwoPlusOneCombo = 50;
}

export class Counts {
	junkPile = 0;
	twoWayJunkPile = 0;
	threeWayJunkPile = 0;
	twoWayCollision = 0;
	threeWayCollision = 0;
	sonicScrewDriver = 0;
	roundComplete = 0;
	// combo counters:
	junkPileCombox2 = 0;
	junkPileCombox3 = 0;
	// possibly go x4, x5, x6, etc.
	twoWayJunkPileCombox2 = 0;
	twoWayJunkPileCombox3 = 0;
	twoWayCollisionCombox2 = 0;
	twoWayCollisionCombox3 = 0;
	// maybe go x4, x5, etc.
	threeWayJunkPileCombox2 = 0;
	threeWayJunkPileCombox3 = 0;
	threeWayCollisionCombox2 = 0;
	threeWayCollisionCombox3 = 0;
	// maybe go x4, x5, etc.
	twoPlusOneCombo = 0;
	threePlusOneCombo = 0;
	threePlusTwoCombo = 0;
	threePlusTwoPlusOneCombo = 0;

	roundFiveComplete = 0;
	roundTenComplete = 0;
	roundFifteenComplete = 0;
	roundTwentyComplete = 0;
	roundTwentyFiveComplete = 0;
	roundThirtyCompleteAllTime = 0;
}

export class HighScore {
	name: string;
	score: number;
}

// A lightweight container for the information I want to store.
export class SavedScore {
	counts: Counts;
	highScores: HighScore[];

	constructor() {
		this.counts = new Counts();
		this.highScores = new Array<HighScore>();
	}
}

export class Score {
	// total score:
	scoreCurrent = 0;

	points: Points;
	counts: Counts;
	combos: Combos;
	savedScore: SavedScore;

	constructor() {
		this.scoreCurrent = 0;
		this.points = new Points();
		this.counts = new Counts();
		this.combos = new Combos();
		this.savedScore = new SavedScore();
	}

	processCombos() {
		switch (this.combos.comboJunk) {
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
		if (this.combos.comboJunk > 0
			&& (this.combos.comboTwoWayJunkPile > 0 || this.combos.comboTwoWayCollision)
			&& (this.combos.comboThreeWayJunkPile > 0 || this.combos.comboThreeWayCollision)
		) {
			this.update(Events.threePlusTwoPlusOneCombo);
		} else if ((this.combos.comboTwoWayJunkPile > 0 || this.combos.comboTwoWayCollision)
			&& (this.combos.comboThreeWayJunkPile > 0 || this.combos.comboThreeWayCollision)
		) {
			this.update(Events.threePlusTwoCombo);
		} else if ((this.combos.comboThreeWayJunkPile > 0 || this.combos.comboThreeWayCollision)
			&& this.combos.comboJunk > 0
		) {
			this.update(Events.threePlusOneCombo);
		} else if ((this.combos.comboTwoWayJunkPile > 0 || this.combos.comboTwoWayCollision)
			&& this.combos.comboJunk
		) {
			this.update(Events.twoPlusOneCombo);
		}

		this.clearCombos();
	}

	clearCombos() {
		this.combos.comboJunk = 0;
		this.combos.comboThreeWayCollision = 0;
		this.combos.comboThreeWayJunkPile = 0;
		this.combos.comboTwoWayCollision = 0;
		this.combos.comboTwoWayJunkPile = 0;
		this.combos.comboSonicScrewdriver = 0;
	}

	update(event: Events, round = 0): void {
		switch (event) {
			case Events.junkPile:
				this.counts.junkPile++;
				this.combos.comboJunk++;
				this.updatePoints(this.points.junkPile);
				break;
			case Events.twoWayJunkPile:
				this.counts.twoWayJunkPile++;
				this.combos.comboTwoWayJunkPile++;
				this.updatePoints(this.points.twoWayJunkPile);
				break;
			case Events.twoWayCollision:
				this.counts.twoWayCollision++;
				this.combos.comboTwoWayCollision++;
				this.updatePoints(this.points.twoWayCollision);
				break;
			case Events.threeWayJunkPile:
				this.counts.threeWayJunkPile++;
				this.combos.comboThreeWayJunkPile++;
				this.updatePoints(this.points.threeWayJunkPile);
				break;
			case Events.threeWayCollision:
				this.counts.threeWayCollision++;
				this.combos.comboThreeWayCollision++;
				this.updatePoints(this.points.threeWayCollision);
				break;
			case Events.junkPileCombox2:
				this.counts.junkPileCombox2++;
				this.updatePoints(this.points.junkPileCombox2);
				break;
			case Events.junkPileCombox3:
				this.counts.junkPileCombox3++;
				this.updatePoints(this.points.junkPileCombox3);
				break;
			case Events.twoWayJunkPileCombox2:
				this.counts.twoWayJunkPileCombox2++;
				this.updatePoints(this.points.twoWayJunkPileCombox2);
				break;
			case Events.twoWayJunkPileCombox3:
				this.counts.twoWayJunkPileCombox3++;
				this.updatePoints(this.points.twoWayJunkPileCombox3);
				break;
			case Events.twoWayCollisionCombox2:
				this.counts.twoWayCollisionCombox2++;
				this.updatePoints(this.points.twoWayCollisionCombox2);
				break;
			case Events.twoWayCollisionCombox3:
				this.counts.twoWayCollisionCombox3++;
				this.updatePoints(this.points.twoWayCollisionCombox3);
				break;
			case Events.threeWayJunkPileCombox2:
				this.counts.threeWayJunkPileCombox2++;
				this.updatePoints(this.points.threeWayJunkPileCombox2);
				break;
			case Events.threeWayJunkPileCombox3:
				this.counts.threeWayJunkPileCombox3++;
				this.updatePoints(this.points.threeWayJunkPileCombox3);
				break;
			case Events.threeWayCollisionCombox2:
				this.counts.threeWayCollisionCombox2++;
				this.updatePoints(this.points.threeWayCollisionCombox2);
				break;
			case Events.threeWayCollisionCombox3:
				this.counts.threeWayCollisionCombox3++;
				this.updatePoints(this.points.threeWayCollisionCombox3);
				break;
			case Events.threePlusTwoPlusOneCombo:
				this.counts.threePlusTwoPlusOneCombo++;
				this.updatePoints(this.points.threePlusTwoPlusOneCombo);
				break;
			case Events.threePlusTwoCombo:
				this.counts.threePlusTwoCombo++;
				this.updatePoints(this.points.threePlusTwoCombo);
				break;
			case Events.threePlusOneCombo:
				this.counts.threePlusOneCombo++;
				this.updatePoints(this.points.threePlusOneCombo);
				break;
			case Events.twoPlusOneCombo:
				this.counts.twoPlusOneCombo++;
				this.updatePoints(this.points.twoPlusOneCombo);
				break;
			case Events.sonicScrewdriver:
				this.counts.sonicScrewDriver++;
				this.combos.comboSonicScrewdriver++;
				this.updatePoints(this.points.sonicScrewdriver);
				break;
			case Events.roundComplete:
				// Probably need to do some special logic in here if I'm going to support counts of 5/10/15/20 rounds, etc.
				// For now, I'll just update the score:
				this.counts.roundComplete++;
				this.updatePoints(this.points.roundComplete * round);
				break;
		}
	}

	updatePoints(points: number) {
		this.scoreCurrent += points;
	}

	// TODO: Increment the all-time counters by the in-game counter counts.
	updateSavedScore() {
		for (let evt in Events)
			if (isNaN(Number(evt))) {
				let command = ['this.savedScore.counts.', evt, ' += this.counts.', evt].join('');
				eval(command);
			}
		// TODO: Update the 5/10/15, etc round counts!
	}
}
