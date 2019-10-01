import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-checkbox',
  template: `
    <label class="checkbox" [for]="id">
      <input class="checkbox" type="checkbox"
        [class.is-danger]="showError"
        [indeterminate]="to.indeterminate && formControl.value === null"
        [formControl]="formControl"
        [formlyAttributes]="field">
        {{ to.label }}
        <span *ngIf="to.required && to.hideRequiredMarker !== true">*</span>
    </label>
  `,
})
export class FormlyFieldCheckbox extends FieldType {
  defaultOptions = {
    templateOptions: {
      indeterminate: true,
      hideLabel: true,
    },
  };
}
