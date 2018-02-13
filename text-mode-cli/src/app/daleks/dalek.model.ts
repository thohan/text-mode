// imports?

interface ICharacter{
    xpos: number;
    ypos: number;
    image: HTMLImageElement;
}

export class Doctor implements ICharacter{
    xpos: number;
    ypos: number;
    image: HTMLImageElement;
    // image file, behaviors, etc.
}

export class Dalek implements ICharacter{
    xpos: number;
    ypos: number;
    image: HTMLImageElement;
}

export class Cursor{
    xpos: number;
    ypos: number;
}