import { Component } from '@angular/core';
import { AlertController, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { Observable } from 'rxjs';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { DeviceService, LoadingService } from '../../../core/services';
import { ResolutionPage } from '../../../resolution/pages';
import { Settings } from '../../../settings/models';
import * as reducers from '../../../reducers';
import * as resolutionActions from '../../../actions/resolution.actions';
import * as settingsActions from '../../../actions/settings.actions';
import { reducer } from '../../../reducers/settings.reducer';

@Component({
	templateUrl: 'app.component.html',
})
export class AppComponent {
	rootPage = ResolutionPage;
	settings: Observable<Settings>;

	constructor(
		private actions: Actions,
		private alertController: AlertController,
		private deviceService: DeviceService,
		private loadingService: LoadingService,
		platform: Platform,
		private store: Store<reducers.State>,
		private statusBar: StatusBar,
		private splashScreen: SplashScreen
	) {
		this.loadingService.present('Loading');

		platform.ready().then(() => {
			if (this.deviceService.isApp()) {
				this.statusBar.hide();
				this.splashScreen.hide();
			}
		});

		this.settings = this.store.select(reducers.getSettingsState);

		this.actions
			.ofType(resolutionActions.actions.GET_ALL_FAIL, resolutionActions.actions.GET_ALL_SUCCESS)
			.take(1)
			.subscribe(action => {
				this.loadingService.dismiss();

				if (action.type === resolutionActions.actions.GET_ALL_FAIL) {
					this.alertController
						.create({
							title: 'Aww dang :(',
							message: 'Big time error.',
						})
						.present();
				} else {
					this.alertController
						.create({
							title: 'Happy New Year!',
							message: "It's time to resolve to do things better!",
						})
						.present();
				}
			});
	}

	onClearData() {
		this.store.dispatch(new resolutionActions.DeleteAll());
	}

	onToggleDarkMode(toggle) {
		this.store.dispatch(new settingsActions.ToggleDarkMode(toggle));
	}
}
