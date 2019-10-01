import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExamplesRouterViewerComponent } from '../../shared';
import { CommonModule, CommonExampleConfigs, CommonExampleComponents, debugFields } from '../common';

import { AppComponent } from '../ui-kendo/app.component';
import { FormlyBulmaModule } from '@ngx-formly/bulma';

@NgModule({
  imports: [
    CommonModule,
    FormlyBulmaModule,
    RouterModule.forChild([
      {
        path: '',
        component: AppComponent,
        children: [
          {
            path: '',
            component: ExamplesRouterViewerComponent,
            data: {
              debugFields,
              examples: [
                ...CommonExampleConfigs,
              ],
            },
          },
        ],
      },
    ]),
  ],
  declarations: [AppComponent],
  entryComponents: [
    ...CommonExampleComponents,
  ],
})
export class ConfigModule { }
