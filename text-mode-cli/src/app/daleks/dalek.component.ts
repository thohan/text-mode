import { Component, ViewChild, OnInit, AfterViewInit, ElementRef } from '@angular/core';
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
	charactersToRedraw: DalekModel.ICharacter[] = [];
	@ViewChild('canvas') canvas: ElementRef;

	updateCursorPosition(evt) {
		let rect = this.canvas.nativeElement.getBoundingClientRect();
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

				this.ctx.drawImage(hoverArrowImage,
					this.doctor.xpos + arrow.xpos,
					this.doctor.ypos + arrow.ypos,
					arrow.width,
					arrow.height);
			}
		}
	}

	clearCanvas() {
		const rect = this.canvas.nativeElement.getBoundingClientRect();
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

	redrawCanvas() {
		this.clearCanvas();
		this.drawCharacters();
		// draw other game elements
	}

	onClick(event) {
		// stuff happens. Cool stuff!
		this.doctor.move();
		this.drawArrow(true);
	}

	ngOnInit() {
		this.ctx = this.canvas.nativeElement.getContext('2d');

		this.cursor = new DalekModel.Cursor();
		this.cursor.xpos = 0;
		this.cursor.ypos = 0;

		// Now I can draw stuff! (I just need to remember how...)
		this.doctor = new DalekModel.Doctor();
		this.doctor.xpos = 280;
		this.doctor.ypos = 200;
		this.charactersToRedraw.push(this.doctor);
		// TODO: Load up enemies, other game elements here, add them to the stuff to draw then draw them.
		this.drawCharacters();
	};

	ngAfterViewInit() {

	}
}
