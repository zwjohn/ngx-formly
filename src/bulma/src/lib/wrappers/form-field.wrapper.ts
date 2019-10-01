import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-form-field',
  template: `
    <div class="field" [class.has-error]="showError">
      <label class="label" *ngIf="to.label && to.hideLabel !== true" [attr.for]="id">
        {{ to.label }}
        <span *ngIf="to.required && to.hideRequiredMarker !== true">*</span>
      </label>

      <div class="control">
        <ng-template #fieldComponent></ng-template>
      </div>

      <p *ngIf="showError" class="help is-danger">
        <formly-validation-message [field]="field"></formly-validation-message>
      </p>

      <p *ngIf="to.description" class="help">{{ to.description }}</p>
    </div>
  `,
})
export class FormlyWrapperFormField extends FieldWrapper {
}
