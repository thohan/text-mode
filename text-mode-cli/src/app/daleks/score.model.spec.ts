import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import * as ScoreModel from './score.model';

let score: ScoreModel.Score;

describe('ScoreModel.Score', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule
			],
			declarations: [
				ScoreModel
			],
		}).compileComponents();

		let score = new ScoreModel.Score();
	}));
	it('to have a Combos object defined upon construction', (() => {
		
		expect(score.combos).toBeDefined();
	}));
});