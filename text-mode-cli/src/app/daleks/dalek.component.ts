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

	redrawCanvas() {
		// clear canvas, then draw the elements!
		var rect = this.canvas.nativeElement.getBoundingClientRect();
		this.ctx.clearRect(0, 0, rect.width, rect.height);
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


		// draw the doctor on the canvas - Image assets loaded on the dom for use by the canvas. See http://www.typescriptgames.com/ImageToCanvas.html for reference.
		this.doctor.image = <HTMLImageElement>document.getElementById('doctor');
		this.doctor.image.onload = () => {
			this.ctx.drawImage(this.doctor.image, this.doctor.xpos, this.doctor.ypos, this.doctor.width, this.doctor.height);
		};
	};

	ngAfterViewInit() {

	}
}
