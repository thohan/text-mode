import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DalekModel } from './dalek.model';

@Component({
    selector: 'daleks',
    templateUrl: './dalek.component.html'
})

export class DalekComponent implements OnInit {
    canvasTopCornerX: number;
    canvasTopCornerY: number;
    mousePositionX: number;
    mousePositionY: number;
    @ViewChild('canvas') canvas: ElementRef;
    
    showMousePosition(evt) {
        var rect = this.canvas.nativeElement.getBoundingClientRect();
        this.mousePositionX = evt.clientX - rect.left;
        this.mousePositionY = evt.clientY - rect.top;
    }
   
    
// something like this, include a mousemove event and render the coordinates
    // ctx.addEventListener('mousemove', function(evt) {
    //     var mousePos = getMousePos(canvas, evt);
    //     var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;

    //   }, false);



    ngOnInit() {
        // do some canvas stuff:
        let ctx: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');
        // Now I can draw stuff! (I just need to remember how...)
    };
}