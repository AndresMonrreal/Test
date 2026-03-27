import type { FormControl, Obj, FieldValue, Touched } from '../types';
/**
 * @ignore
 */
export declare function getFormControls(el: Element): FormControl[];
/**
 * @ignore
 */
export declare function addAttrsFromFieldset(fieldSet: HTMLFieldSetElement): void;
/** @ignore */
export declare function getInputTextOrNumber(el: FormControl): string | number | null;
/**
 * @ignore
 */
export declare function getFormDefaultValues<Data extends Obj>(node: HTMLFormElement): {
    defaultData: Data;
    defaultTouched: Touched<Data>;
};
export declare function setControlValue(el: FormControl, value: FieldValue | FieldValue[] | FileList): void;
/** Sets the form inputs value to match the data object provided. */
export declare function setForm<Data extends Obj>(node: HTMLFormElement, data: Data): void;
//# sourceMappingURL=domUtils.d.ts.map