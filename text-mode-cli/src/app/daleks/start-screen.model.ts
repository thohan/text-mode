import BasicImageModel = require('./basic-image.model');
import BasicImage = BasicImageModel.BasicImage;
import * as Config from './config.model';

export class StartScreen {
	titleMarquee: BasicImage;
	startButton: BasicImage;

	constructor() {
		// TODO: Put x/y vals in config? Yes!!!
		this.titleMarquee = new BasicImage(<HTMLImageElement>document.getElementById('title-marquee'), Config.titleMarqueeXpos, Config.titleMarqueeYpos, 400, 51);
		this.startButton = new BasicImage(<HTMLImageElement>document.getElementById('start-button'), 150, 200, 200, 28);
	}

	drawImages(ctx: CanvasRenderingContext2D) {
		if (this.titleMarquee.image) {
			ctx.drawImage(this.titleMarquee.image, this.titleMarquee.xpos, this.titleMarquee.ypos);
		}

		if (this.startButton.image) {
			ctx.drawImage(this.startButton.image, this.startButton.xpos, this.startButton.ypos);
		}
	}
}
