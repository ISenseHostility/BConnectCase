import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './views/app/app.config';
import {AppComponent} from './views/app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
