import { FormlyExtension, FormlyConfig, TemplateManipulators } from '../../services/formly.config';
import { FormlyFieldConfigCache, FormlyFieldConfig } from '../../components/formly.field.config';
import { FormGroup } from '@angular/forms';
import { getFieldId, assignModelValue, isUndefined, getFieldValue, reverseDeepMerge, getKeyPath } from '../../utils';

/** @experimental */
export class CoreExtension implements FormlyExtension {
  private formId = 0;
  constructor(private formlyConfig: FormlyConfig) { }

  prePopulate(field: FormlyFieldConfigCache) {
    this.getFieldComponentInstance(field).prePopulate();
    if (field.parent) {
      return;
    }

    const fieldTransforms = (field.options && field.options.fieldTransform) || this.formlyConfig.extras.fieldTransform;
    (Array.isArray(fieldTransforms) ? fieldTransforms : [fieldTransforms]).forEach(fieldTransform => {
      if (fieldTransform) {
        console.warn(`NgxFormly: fieldTransform is deprecated since v5.0, use custom extension instead.`);
        const fieldGroup = fieldTransform(field.fieldGroup, field.model, <FormGroup>field.formControl, field.options);
        if (!fieldGroup) {
          throw new Error('fieldTransform must return an array of fields');
        }
      }
    });
  }

  onPopulate(field: FormlyFieldConfigCache) {
    this.initFieldOptions(field);
    this.getFieldComponentInstance(field).onPopulate();
    if (field.fieldGroup) {
      field.fieldGroup.forEach((f, index) => {
        Object.defineProperty(f, 'parent', { get: () => field, configurable: true });
        Object.defineProperty(f, 'index', { get: () => index, configurable: true });
        this.formId++;
      });
    }
  }

  postPopulate(field: FormlyFieldConfigCache) {
    this.getFieldComponentInstance(field).postPopulate();
  }

  private initFieldOptions(field: FormlyFieldConfigCache) {
    const root = <FormlyFieldConfigCache> field.parent;
    if (!root) {
      return;
    }

    Object.defineProperty(field, 'form', { get: () => root.formControl, configurable: true });
    Object.defineProperty(field, 'options', { get: () => root.options, configurable: true });
    Object.defineProperty(field, 'model', {
      get: () => field.key && field.fieldGroup ? getFieldValue(field) : root.model,
      configurable: true,
    });

    reverseDeepMerge(field, {
      id: getFieldId(`formly_${this.formId}`, field, field['index']),
      hooks: {},
      modelOptions: {},
      templateOptions: !field.type || !field.key ? {} : {
        label: '',
        placeholder: '',
        focus: false,
        disabled: false,
      },
    });

    if (field.lifecycle) {
      console.warn(`NgxFormly: 'lifecycle' is deprecated since v5.0, use 'hooks' instead.`);
    }

    if (field.template && field.type !== 'formly-template') {
      if (field.type) {
        console.warn(`NgxFormly: passing 'type' property is not allowed when 'template' is set.`);
      }
      field.type = 'formly-template';
    }

    if (!field.type && field.fieldGroup) {
      field.type = 'formly-group';
    }

    if (field.type) {
      this.formlyConfig.getMergedField(field);
    }

    if (!isUndefined(field.defaultValue) && isUndefined(getFieldValue(field))) {
      assignModelValue(root.model, getKeyPath(field), field.defaultValue);
    }

    this.initFieldWrappers(field);
  }

  private initFieldWrappers(field: FormlyFieldConfig) {
    field.wrappers = field.wrappers || [];
    const fieldTemplateManipulators: TemplateManipulators = {
      preWrapper: [],
      postWrapper: [],
      ...(field.templateOptions.templateManipulators || {}),
    };

    field.wrappers = [
      ...this.formlyConfig.templateManipulators.preWrapper.map(m => m(field)),
      ...fieldTemplateManipulators.preWrapper.map(m => m(field)),
      ...field.wrappers,
      ...this.formlyConfig.templateManipulators.postWrapper.map(m => m(field)),
      ...fieldTemplateManipulators.postWrapper.map(m => m(field)),
    ].filter((el, i, a) => el && a.indexOf(el)!==-1);
  }

  private getFieldComponentInstance(field: FormlyFieldConfigCache) {
    const componentRef = this.formlyConfig.createComponent(field);
    const instance: FormlyExtension = componentRef ? componentRef.instance as any : {};

    return {
      prePopulate: () => instance.prePopulate && instance.prePopulate(field),
      onPopulate: () => instance.onPopulate && instance.onPopulate(field),
      postPopulate: () => instance.postPopulate && instance.postPopulate(field),
    };
  }
}
