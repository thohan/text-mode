import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DalekComponent } from './dalek.component';
describe('DalekComponent', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule
			],
			declarations: [
				DalekComponent
			],
		}).compileComponents();
	}));
	it('should create the app', async(() => {
		const fixture = TestBed.createComponent(DalekComponent);
		const dalek = fixture.debugElement.componentInstance;
		expect(dalek).toBeTruthy();
	}));
	describe('on click', () => {
		it('should call updateGameBoard', (() => {
			const fixture = TestBed.createComponent(DalekComponent);
			const dalek = fixture.debugElement.componentInstance;
			spyOn(dalek, 'onClick');
			dalek.onClick();
			expect(dalek.onClick).toHaveBeenCalled();
		}));
	});
});
