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
		var rect = this.canvas.nativeElement.getBoundingClientRect();
		this.cursor.xpos = evt.clientX - rect.left;
		this.cursor.ypos = evt.clientY - rect.top;
	}

	onCursorMove(event) {
		this.updateCursorPosition(event);
		let arrow: DalekModel.Arrow = this.doctor.updateArrow(this.cursor);

		if (arrow.hasChanged) {
			this.redrawCanvas();

			if (arrow.name) {
				let hoverArrowImage = <HTMLImageElement>document.getElementById(arrow.name);
				// So, how do I un-draw it? I'm going to have to do the getFrame stuff and essentially redraw every time.
				this.ctx.drawImage(hoverArrowImage, this.doctor.xpos + arrow.xpos, this.doctor.ypos + arrow.ypos);
			}
		}
	}

	clearCanvas() {
		var rect = this.canvas.nativeElement.getBoundingClientRect();
		this.ctx.clearRect(0, 0, rect.width, rect.height);
	}

	drawCharacters() {
		// draw on the canvas - Image assets loaded on the dom for use by the canvas.
		// See http://www.typescriptgames.com/ImageToCanvas.html for reference.
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

	redrawCanvas() {
		// clear canvas, then draw the elements!
		this.clearCanvas();
		this.drawCharacters();
	}

	onClick(event) {
		// stuff happens. Cool stuff!
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
