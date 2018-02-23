import { Component, ViewChild, OnInit, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import * as DalekModel from './dalek.model';

@Component({
	selector: 'daleks',
	templateUrl: './dalek.component.html'
})

export class DalekComponent implements OnInit, AfterViewInit {
	cursor: DalekModel.Cursor;
	ctx: CanvasRenderingContext2D;
	doctor: DalekModel.Doctor;
	daleks: DalekModel.Dalek[] = [];
	charactersToRedraw: DalekModel.ICharacter[] = [];
	round: number = 1;
	@ViewChild('canvas') canvas: ElementRef;

	getRect() {
		return this.canvas.nativeElement.getBoundingClientRect();
	}

	@HostListener('window:keydown') keyStroke() {
		this.updateGameBoard(DalekModel.Input.Keyboard);
	}

	onClick(event) {
		this.updateGameBoard(DalekModel.Input.Mouse);
	}

	updateGameBoard(inputType: DalekModel.Input) {
		// This will only apply in a designated play area. Will need to define behaviors on the outer bezel/HUD
		const rect = this.getRect();
		this.doctor.move(inputType, rect.width, rect.height);
		// The game elements respond:
		for (let dalek of this.daleks) {
			dalek.respondToMove(this.doctor);
		}



		this.redrawCanvas();
		this.drawArrow(true);
	}

	goToNextRound() {

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
		// draw on the canvas - Image assets loaded on the dom for use by the canvas.
		// See http://www.typescriptgames.com/ImageToCanvas.html for reference.
		// This might be kind of sluggish. Is getElementById slow?
		this.charactersToRedraw.forEach((char: DalekModel.ICharacter) => {
			char.image = <HTMLImageElement>document.getElementById(char.name);

			if (char.image) {
				this.ctx.drawImage(char.image, char.xpos, char.ypos, char.width, char.height);
			}

			char.image.onload = () => {
				this.ctx.drawImage(char.image, char.xpos, char.ypos, char.width, char.height);
			}
		});
	}

	drawGrid() {
		//this.ctx.
	}

	placeDaleks() {
		for (let i = 0; i < this.round * 5; i++) {
			let dalek: DalekModel.Dalek = new DalekModel.Dalek();

			do {
				dalek.teleport();
			} while(!this.checkPosition(dalek))

			this.daleks.push(dalek);
		}
	}

	checkPosition(dalek: DalekModel.Dalek): boolean {
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

		this.cursor = new DalekModel.Cursor();
		this.cursor.xpos = 0;
		this.cursor.ypos = 0;

		// Now I can draw stuff! (I just need to remember how...)
		this.doctor = new DalekModel.Doctor();
		this.doctor.teleport();
		this.placeDaleks();
		this.charactersToRedraw.push(this.doctor);
		// TODO: Load up enemies, other game elements here, add them to the stuff to draw then draw them.
		for (let dalek of this.daleks) {
			this.charactersToRedraw.push(dalek);
		}

		this.drawCharacters();
	};

	ngAfterViewInit() {

	}
}
