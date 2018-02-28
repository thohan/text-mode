import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DalekComponent } from './daleks/dalek.component';

@NgModule({
	declarations: [
		AppComponent,
		DalekComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule
	],
	providers: [],
	bootstrap: [
		AppComponent
	],
	//schemas: [
	//	CUSTOM_ELEMENTS_SCHEMA
	//]
})

export class AppModule {

}
