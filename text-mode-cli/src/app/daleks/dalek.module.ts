import { NgModule, ModuleWithProviders } from '@angular/core';
import { DalekComponent } from './dalek.component';
import { CommonModule, DecimalPipe } from '@angular/common';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		DalekComponent
	],
	exports: [
		DalekComponent
	]
})

export class DalekModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: DalekModule,
			providers: []
		}
	}
}
