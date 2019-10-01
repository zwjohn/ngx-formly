import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { BULMA_FORMLY_CONFIG, FIELD_TYPE_COMPONENTS } from './bulma.config';
import { FormlyBulmaAddonsModule } from '@ngx-formly/bulma/addons';

@NgModule({
  declarations: [
    FIELD_TYPE_COMPONENTS,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlySelectModule,
    FormlyModule.forChild(BULMA_FORMLY_CONFIG),
    FormlyBulmaAddonsModule,
  ],
})
export class FormlyBulmaModule {}
