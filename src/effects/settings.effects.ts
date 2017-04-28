import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';

import * as settingsActions from '../actions/settings.actions';
import { StorageService } from '../services';

@Injectable()
export class SettingsEffects {
	constructor(
		private actions: Actions,
		private storage: StorageService
	) {}

	@Effect()
	loadTasks: Observable<Action> = this.actions
		.ofType(settingsActions.actions.LOAD_SETTINGS)
		.startWith(new settingsActions.LoadSettings())
		.switchMap(() => {
			return Observable.fromPromise(this.storage.getSettings())
				.map((settings) => {
					return new settingsActions.LoadSettingsSuccess(settings);
				})
				.catch((error) => {
					console.error(error);
					return of(new settingsActions.LoadSettingsFail());
				});
		});

	@Effect()
	toggleDarkMode: Observable<Action> = this.actions
		.ofType(settingsActions.actions.TOGGLE_DARK_MODE)
		.map((action: Action) => {
			return action.payload;
		})
		.mergeMap((toggle) => {
			return Observable.fromPromise(this.storage.toggleDarkMode(toggle))
				.map((settings) => {
					return new settingsActions.ToggleDarkModeSuccess(toggle);
				})
				.catch((err) => {
					console.error(err);
					return of(new settingsActions.ToggleDarkModeFail());
				});
		});
}