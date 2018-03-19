import { Component, ViewChild, OnInit, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import * as DalekModel from './dalek.model';
import DoctorModel = require('./doctor.model');
import Doctor = DoctorModel.Doctor;
import Dalek = DalekModel.Dalek;
import CharacterModel = require('./character.model');
import ICharacter = CharacterModel.ICharacter;
import StartScreenModel = require('./start-screen.model');
import StartScreen = StartScreenModel.StartScreen;
import InputModel = require('./input.model');
import Cursor = InputModel.Cursor;
import Input = InputModel.Input;
import ScoreModel = require('./score.model');
import Score = ScoreModel.Score;
import Events = ScoreModel.Events;
import ConfigModel = require('./config.model');
import { LocalStorageService } from '../shared/services/local-storage.service';
import { GameState } from './game-state.model';

@Component({
	selector: 'app-daleks',
	templateUrl: './dalek.component.html'
})

export class DalekComponent implements OnInit, AfterViewInit {
	cursor: Cursor;
	ctx: CanvasRenderingContext2D;
	doctor: Doctor;
	// not sure how best to model various buttons. Let's start with this:
	startScreen: StartScreen;
	charactersToRedraw: ICharacter[] = [];
	round = 0;
	score: Score;
	@ViewChild('canvas') canvas: ElementRef;
	squareSize = ConfigModel.squareSize;
	gameState: GameState;

	constructor(
		private localStorageService: LocalStorageService
	) {
		// will be injecting the localStorage service, other services...
	}

	getRect(): ClientRect {
		return this.canvas.nativeElement.getBoundingClientRect();
	}

	@HostListener('window:keyup') keyStroke() {
		if (this.gameState === GameState.GameInProgress) {
			this.updateGameBoard(Input.Keyboard);
		}
	}

	onClick(event): void {
		switch (this.gameState) {
			case GameState.StartScreen:
				if (this.startScreen.startButton.wasClicked(this.cursor.xpos, this.cursor.ypos)) {
					this.startGame();
				}
				break;
			case GameState.GameInProgress:
				this.updateGameBoard(Input.Mouse);
				break;
		}
	}

	updateGameBoard(inputType: Input): void {
		const rect = this.getRect();
		if (this.doctor.move(inputType, rect.width, rect.height)) {
			// The game elements respond:
			for (let char of this.charactersToRedraw) {
				if (char instanceof Dalek) {
					char.respondToMove(this.doctor);
				}
			}

			// Check for collisions/update isDead status/score/counts
			// Does this belong in score.model? It is for scoring and counts, but it also modifies the bots.
			for (let charA of this.charactersToRedraw) {
				let wayCount = 0;
				let isJunkPile = false;
				let collisionOccurred = false;

				for (let charB of this.charactersToRedraw) {
					if (charA !== charB
						&& (!charA.isDead || !charB.isDead)
						&& charA.xpos === charB.xpos
						&& charA.ypos === charB.ypos
					) {
						collisionOccurred = true;

						if (charA.isDead || charB.isDead) {
							isJunkPile = true;
						}

						if (!charA.markAsDead) {
							wayCount++;
						}

						if (!charB.markAsDead) {
							wayCount++;
						}

						charA.markAsDead = true;
						charB.markAsDead = true;
					}
				}

				if (collisionOccurred) {
					if (wayCount === 3) {
						if (isJunkPile) {
							this.score.update(Events.threeWayJunkPile)
						} else {
							this.score.update(Events.threeWayCollision);
						}
					} else if (wayCount === 2) {
						if (isJunkPile) {
							this.score.update(Events.twoWayJunkPile);
						} else {
							this.score.update(Events.twoWayCollision);
						}
					} else if (wayCount === 1) {
						this.score.update(Events.junkPile);
					} else {
						console.log(`error: the wayCount was ${wayCount}`);
					}
				}

				// Only set as dead after all of the iterations.
				for (let char of this.charactersToRedraw) {
					if (char.markAsDead) {
						char.isDead = true;
					}
				}
			}

			this.score.processCombos();

			if (this.doctor.isDead) {
				this.gameOver();
			} else if (this.roundIsComplete()) {
				this.score.update(Events.roundComplete)
				this.startNextRound();
			}

			this.redrawCanvas();
			this.drawArrow(true);
		}
	}

	roundIsComplete(): boolean {
		for (let char of this.charactersToRedraw) {
			if (!(char instanceof Doctor) && !char.isDead) {
				return false;
			}
		}

		return true;
	}

	startNextRound(): void {
		this.round++;
		this.charactersToRedraw.length = 0;
		this.doctor = new Doctor();
		this.doctor.teleport();
		this.charactersToRedraw.push(this.doctor);
		this.placeDaleks();
	}

	// This is for testing but it is possible that I might want to place bots arbitrarily , we'll see.
	startTestRound(): void {
		this.charactersToRedraw.length = 0;
		this.doctor = new Doctor();
		this.doctor.placeInCenter();
		this.charactersToRedraw.push(this.doctor);
		this.placeDaleksTest();
	}

	gameOver(): void {
		this.score.updateSavedScore();

		// show a game over screen with buttons and whatnot.
		// Splice current score to high scores if it is in the top ten.
		// Push out bottom score if current score in top ten.
		// save high scores to localStorage.


		// Save score to localStorage.
		this.localStorageService.addLocal('savedScore', this.score.savedScore);

		// TODO: Reset all the current-game points to zero as there is no current game!
	}

	updateCursorPosition(evt) {
		let rect = this.getRect();
		this.cursor.xpos = evt.clientX - rect.left;
		this.cursor.ypos = evt.clientY - rect.top;
	}

	onCursorMove(event) {
		// I believe I want to always update the cursor position on mouse move regardless.
		this.updateCursorPosition(event);

		if (this.gameState === GameState.GameInProgress) {
			this.drawArrow();
		}
	}

	drawArrow(force: boolean = false) {
		let arrow = this.doctor.updateArrow(this.cursor);

		if (arrow.hasChanged || force) {
			this.redrawCanvas();

			if (arrow.name || force) {
				let hoverArrowImage = <HTMLImageElement>document.getElementById(arrow.name);

				if (hoverArrowImage) {
					// TODO: Move drawing to arrow, passing context!
					this.ctx.drawImage(hoverArrowImage,
						this.doctor.xpos + arrow.xpos,
						this.doctor.ypos + arrow.ypos,
						arrow.width,
						arrow.height);
				}
			}
		}
	}

	clearCanvas(): void {
		const rect = this.getRect();
		this.ctx.clearRect(0, 0, rect.width, rect.height);
	}

	drawCharacters(): void {
		this.charactersToRedraw.forEach((char: ICharacter) => {
			if (char.isDead) {
				char.image = <HTMLImageElement>document.getElementById('junkheap');
			} else {
				char.image = <HTMLImageElement>document.getElementById(char.name);
			}

			if (char.image) {
				// TODO: move drawing to character, passing context.
				this.ctx.drawImage(char.image, char.xpos, char.ypos, char.width, char.height);
			}
		});
	}

	placeDaleks(): void {
		for (let i = 0; i < this.round * ConfigModel.daleksPerRound; i++) {
			let dalek = new Dalek();

			do {
				dalek.place();
			} while (!this.checkPositionNotTaken(dalek))

			this.charactersToRedraw.push(dalek);
		}
	}

	placeDaleksTest(): void {
		// This is some very specific placement so as to simulate scenarios that should lead to some specific events/counters/scorings
		let dalek1 = new Dalek();
		let dalek2 = new Dalek();
		let dalek3 = new Dalek();
		let dalek4 = new Dalek();
		let dalek5 = new Dalek();

		// 1 - 2 - next to each other above player
		dalek1.xpos = this.doctor.xpos + 0 * this.squareSize;
		dalek1.ypos = this.doctor.ypos - 3 * this.squareSize;
		this.charactersToRedraw.push(dalek1);

		dalek2.xpos = this.doctor.xpos + 1 * this.squareSize;
		dalek2.ypos = this.doctor.ypos - 3 * this.squareSize;
		this.charactersToRedraw.push(dalek2);

		// 3 - 5 - above the first two, one space apart
		dalek3.xpos = this.doctor.xpos - 2 * this.squareSize;
		dalek3.ypos = this.doctor.ypos - 4 * this.squareSize;
		this.charactersToRedraw.push(dalek3);

		dalek4.xpos = this.doctor.xpos + 0 * this.squareSize;
		dalek4.ypos = this.doctor.ypos - 4 * this.squareSize;
		this.charactersToRedraw.push(dalek4);

		dalek5.xpos = this.doctor.xpos + 2 * this.squareSize;
		dalek5.ypos = this.doctor.ypos - 4 * this.squareSize;
		this.charactersToRedraw.push(dalek5);
	}

	checkPositionNotTaken(dalek: DalekModel.Dalek): boolean {
		for (let item of this.charactersToRedraw) {
			if (dalek.xpos === item.xpos && dalek.ypos === item.ypos) {
				return false;
			}
		}

		return true;
	}

	redrawCanvas() {
		this.clearCanvas();
		this.drawCharacters();
		// draw other game elements
	}

	loadStartScreen() {
		setTimeout(() => {
			this.startScreen.drawImages(this.ctx);
		});
	}

	startGame() {
		this.gameState = GameState.GameInProgress;
		const rect = this.getRect();
		this.ctx.clearRect(0, 0, rect.width, rect.height);
		//this.startNextRound();	// Commented out for testing. TODO: Un-comment!
		this.startTestRound();		// My test arena. Bots will be pre-placed so as to test various scenarios.

		this.drawCharacters();
	}

	ngOnInit() {
		this.ctx = this.canvas.nativeElement.getContext('2d');
		this.cursor = new Cursor();
		this.score = new Score();
		this.startScreen = new StartScreen();
		this.gameState = GameState.StartScreen;

		this.loadStartScreen();
	};

	ngAfterViewInit() {

	}
}
