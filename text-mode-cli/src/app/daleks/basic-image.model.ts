export class BasicImage {
	xpos: number;
	ypos: number;
	image: HTMLImageElement;
	width: number;
	height: number;

	constructor(
		image: HTMLImageElement,
		xpos = 0,
		ypos = 0,
		width = 0,
		height = 0
	) {
		this.image = image;
		this.xpos = xpos;
		this.ypos = ypos;

		if (width) {
			this.width = width;
		}

		if (height) {
			this.height = height;
		}
	}
}
