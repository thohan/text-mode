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
				//ScoreModel
			],
		}).compileComponents();

		 
	}));
	it('to have a Combos object defined upon construction', (() => {
		score = new ScoreModel.Score();
		expect(score.combos).toBeDefined();
	}));
});