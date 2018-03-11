import { NgModule, ModuleWithProviders } from '@angular/core';
import { DalekComponent } from './dalek.component';
import { CommonModule, DecimalPipe } from '@angular/common';
import { LocalStorageService } from '../shared/services/local-storage.service';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		DalekComponent
	],
	providers: [
		LocalStorageService
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
