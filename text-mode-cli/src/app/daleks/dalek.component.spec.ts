import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserModule } from '@angular/platform-browser';
import { DalekComponent } from './dalek.component';
describe('DalekComponent', () => {
	// https://stackoverflow.com/a/43950991/13578 had the info I needed (I think...)
	let component: DalekComponent;
	let fixture: ComponentFixture<DalekComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule,
				BrowserModule
			],
			declarations: [
				DalekComponent
			]
		}).compileComponents();
	}));

	it('should be instantiated', async(() => {
		fixture = TestBed.createComponent(DalekComponent);
		component = fixture.debugElement.componentInstance;
		fixture.detectChanges();
		expect(component).toBeTruthy();
	}));
});
