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

@Component({
	selector: 'daleks',
	templateUrl: './dalek.component.html'
})

export class DalekComponent implements OnInit, AfterViewInit {
	cursor: Cursor;
	ctx: CanvasRenderingContext2D;
	doctor: Doctor;
	daleks: Dalek[] = [];
	charactersToRedraw: ICharacter[] = [];
	round = 0;
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
			for (let dalek of this.daleks) {
				dalek.respondToMove(this.doctor);
			}

			// Check for collisions:
			for (let charA of this.charactersToRedraw) {
				for (let charB of this.charactersToRedraw) {
					if (charA !== charB
						&& (!charA.isDead || !charB.isDead)
						&& charA.xpos === charB.xpos
						&& charA.ypos === charB.ypos
					) {
						charA.isDead = true;
						charB.isDead = true;

						if (charA instanceof Doctor || charB instanceof Doctor) {
							// game over, you died!
						}
					}
				}
			}
		}

		if (this.roundIsComplete()) {
			this.startNextRound();
		}

		this.redrawCanvas();
		this.drawArrow(true);
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
		this.daleks.length = 0;	// Probably makes the most sense to not leave the junk heaps on the play area at the beginning of the round
		this.doctor = new Doctor();
		this.doctor.teleport();
		this.placeDaleks();
		this.charactersToRedraw.push(this.doctor);

		for (let dalek of this.daleks) {
			this.charactersToRedraw.push(dalek);
		}
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

			//char.image.onload = () => {
			//	this.ctx.drawImage(char.image, char.xpos, char.ypos, char.width, char.height);
			//}
		});
	}

	placeDaleks() {
		for (let i = 0; i < this.round * 5; i++) {
			let dalek = new Dalek();

			do {
				dalek.place();
			} while (!this.checkPositionNotTaken(dalek))

			this.daleks.push(dalek);
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
		this.startNextRound();

		setTimeout(() => {
			this.drawCharacters();
		}, 200);
	};

	ngAfterViewInit() {

	}
}
