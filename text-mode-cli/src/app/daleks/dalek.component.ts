import { Component, ViewChild, OnInit, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import * as DalekModel from './dalek.model';
import DoctorModel = require('./doctor.model');
import Doctor = DoctorModel.Doctor;
import Dalek = DalekModel.Dalek;
import CharacterModel = require('./character.model');
import ICharacter = CharacterModel.ICharacter;
import InputModel = require('./input.model');
import Cursor = InputModel.Cursor;
import Input = InputModel.Input;
import ScoreModel = require('./score.model');
import Score = ScoreModel.Score;
import ConfigModel = require('./config.model');

@Component({
	selector: 'app-daleks',
	templateUrl: './dalek.component.html'
})

export class DalekComponent implements OnInit, AfterViewInit {
	cursor: Cursor;
	ctx: CanvasRenderingContext2D;
	doctor: Doctor;
	charactersToRedraw: ICharacter[] = [];
	round = 0;
	score: Score;
	@ViewChild('canvas') canvas: ElementRef;

	getRect(): ClientRect {
		return this.canvas.nativeElement.getBoundingClientRect();
	}

	@HostListener('window:keydown') keyStroke() {
		this.updateGameBoard(Input.Keyboard);
	}

	onClick(event): void {
		this.updateGameBoard(Input.Mouse);
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

			// Check for collisions:
			for (let charA of this.charactersToRedraw) {
				let wayCount = 1;
				let isJunkPile = false;
				let setDead = false;

				for (let charB of this.charactersToRedraw) {
					if (charA !== charB
						&& !charB.isDead
						&& charA.xpos === charB.xpos
						&& charA.ypos === charB.ypos
					) {
						if (charA.isDead) {
							isJunkPile = true;
						} else {
							wayCount++;
						}

						charB.isDead = true;
						setDead = true;
					}
				}

				if (!charA.isDead) {
					charA.isDead = setDead;
				}

				if (charA.isDead) {
					if (wayCount === 3) {
						// score a three-way collision
						if (isJunkPile) {
							// score a three-way junkpile collision
							this.score.countThreeWayJunkPileCurrent++;
							this.score.countThreeWayJunkPileAllTime++;
						} else {
							// score a three-way collision
							this.score.countThreeWayCollisionCurrent++;
							this.score.countThreeWayCollisionAllTime++;
						}
					} else if (wayCount === 2) {
						// score a two-way collision
						if (isJunkPile) {
							this.score.countTwoWayJunkPileCurrent++;
							this.score.countTwoWayJunkPileAllTime++;
						} else {
							this.score.countTwoWayCollisionCurrent++;
							this.score.countTwoWayCollisionAllTime++;
						}
					} else if (wayCount === 1 && setDead) {
						// it must be a one-way into junk, score that
						this.score.countJunkPileCurrent++;
						this.score.countJunkPileAllTime++;
					} else if (wayCount === 1) {
						// It's just always one at the outset. Not a problem
					} else {
						console.log(`error: the wayCount was ${wayCount}`);
					}
				}
			}

			//for (let char of this.charactersToRedraw) {
			//	if (char instanceof Dalek) {
			//		if (char.points > 0) {
			//			char.isDead = true;
			//		}
			//	}
			//}

			this.score.update(this.charactersToRedraw);

			if (this.doctor.isDead) {
				this.gameOver();
			} else if (this.roundIsComplete()) {
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

	startNextRound() {
		this.round++;
		this.charactersToRedraw.length = 0;
		this.doctor = new Doctor();
		this.doctor.teleport();
		this.charactersToRedraw.push(this.doctor);
		this.placeDaleks();
	}

	gameOver(): void {

	}

	updateCursorPosition(evt) {
		let rect = this.getRect();
		this.cursor.xpos = evt.clientX - rect.left;
		this.cursor.ypos = evt.clientY - rect.top;
	}

	onCursorMove(event) {
		this.updateCursorPosition(event);
		this.drawArrow();
	}

	drawArrow(force: boolean = false) {
		let arrow = this.doctor.updateArrow(this.cursor);

		if (arrow.hasChanged || force) {
			this.redrawCanvas();

			if (arrow.name || force) {
				let hoverArrowImage = <HTMLImageElement>document.getElementById(arrow.name);

				if (hoverArrowImage) {
					this.ctx.drawImage(hoverArrowImage,
						this.doctor.xpos + arrow.xpos,
						this.doctor.ypos + arrow.ypos,
						arrow.width,
						arrow.height);
				}
			}
		}
	}

	clearCanvas() {
		const rect = this.getRect();
		this.ctx.clearRect(0, 0, rect.width, rect.height);
	}

	drawCharacters() {
		this.charactersToRedraw.forEach((char: ICharacter) => {
			if (char.isDead) {
				char.image = <HTMLImageElement>document.getElementById('junkheap');
			} else {
				char.image = <HTMLImageElement>document.getElementById(char.name);
			}

			if (char.image) {
				this.ctx.drawImage(char.image, char.xpos, char.ypos, char.width, char.height);
			}
		});
	}

	placeDaleks() {
		for (let i = 0; i < this.round * ConfigModel.daleksPerRound; i++) {
			let dalek = new Dalek();

			do {
				dalek.place();
			} while (!this.checkPositionNotTaken(dalek))

			this.charactersToRedraw.push(dalek);
		}
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

	ngOnInit() {
		this.ctx = this.canvas.nativeElement.getContext('2d');
		this.cursor = new Cursor();
		this.score = new Score();
		this.startNextRound();

		setTimeout(() => {
			this.drawCharacters();
		}, 200);
	};

	ngAfterViewInit() {

	}
}
