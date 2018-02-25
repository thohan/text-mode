export interface ICharacter {
	xpos: number;
	ypos: number;
	name: string;
	image: HTMLImageElement;
	width: number;
	height: number;
	description: IDescription;
	isDead: boolean;
}

export interface IDescription {
	short: string;
	medium: string;
	long: string;
}

export enum Direction {
	None = 0,
	OnSelf = 1,
	East = 360,
	NorthEast = 45,
	North = 90,
	NorthWest = 135,
	West = 180,
	SouthWest = 225,
	South = 270,
	SouthEast = 315
};
