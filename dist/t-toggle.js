(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue'), require('lodash.get')) :
    typeof define === 'function' && define.amd ? define(['exports', 'vue', 'lodash.get'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.TToggle = {}, global.Vue, global.get));
})(this, (function (exports, Vue, get) { 'use strict';

    const mergeClasses = (classesA, classesB) => {
        let a = classesA;
        let b = classesB;
        // Convert array of string classes to a single string
        if (Array.isArray(classesA) && classesA.every((className) => typeof className === 'string' || !!className)) {
            a = classesA.filter((className) => !!className).join(' ');
        }
        // Convert array of string classes to a single string
        if (Array.isArray(classesB) && classesB.every((className) => typeof className === 'string' || !!className)) {
            b = classesB.filter((className) => !!className).join(' ');
        }
        if (typeof a === 'string' && typeof b === 'string') {
            return `${a} ${b}`;
        }
        if (typeof a === 'string' && Array.isArray(b)) {
            return [a].concat(b);
        }
        if (typeof b === 'string' && Array.isArray(a)) {
            return a.concat([b]);
        }
        if (Array.isArray(a) && Array.isArray(b)) {
            return a.concat(b);
        }
        return [a, b];
    };
    const Component = Vue.extend({
        props: {
            classes: {
                type: [String, Array, Object],
                default: undefined,
            },
            fixedClasses: {
                type: [String, Array, Object],
                default: undefined,
            },
            variants: {
                type: Object,
                default: undefined,
            },
            variant: {
                type: [String, Object],
                default: undefined,
            },
        },
        computed: {
            componentClass() {
                return this.getElementCssClass();
            },
            activeVariant() {
                if (!this.variant) {
                    return undefined;
                }
                if (typeof this.variant === 'object') {
                    const truthyVariant = Object.keys(this.variant).find((variant) => !!this.variant[variant]);
                    return truthyVariant || undefined;
                }
                return this.variant;
            },
        },
        methods: {
            getElementCssClass(elementName, defaultClasses = '') {
                let classes;
                if (elementName) {
                    if (this.activeVariant) {
                        const elementVariant = get(this.variants, `${this.activeVariant}.${elementName}`);
                        // If the variant exists but not for the element fallback to the default
                        if (elementVariant === undefined
                            && get(this.variants, this.activeVariant) !== undefined) {
                            classes = get(this.classes, elementName, defaultClasses);
                        }
                        else {
                            classes = elementVariant === undefined ? defaultClasses : elementVariant;
                        }
                    }
                    else {
                        classes = get(this.classes, elementName, defaultClasses);
                    }
                    const fixedClasses = get(this.fixedClasses, elementName);
                    if (fixedClasses) {
                        return mergeClasses(fixedClasses, classes);
                    }
                    return classes;
                }
                if (this.activeVariant) {
                    classes = get(this.variants, this.activeVariant, defaultClasses);
                }
                else {
                    classes = this.classes === undefined ? defaultClasses : this.classes;
                }
                if (this.fixedClasses) {
                    return mergeClasses(this.fixedClasses, classes);
                }
                return classes;
            },
        },
    });

    const HtmlInput = Component.extend({
        props: {
            id: {
                type: String,
                default: undefined,
            },
            name: {
                type: String,
                default: undefined,
            },
            disabled: {
                type: Boolean,
                default: undefined,
            },
            readonly: {
                type: Boolean,
                default: undefined,
            },
            autofocus: {
                type: Boolean,
                default: undefined,
            },
            required: {
                type: Boolean,
                default: undefined,
            },
            tabindex: {
                type: [String, Number],
                default: undefined,
            },
        },
        methods: {
            getListeners(listeners) {
                return Object.assign(Object.assign({}, this.$listeners), listeners);
            },
        },
    });

    /* eslint-disable no-shadow */
    var Key;
    (function (Key) {
        Key[Key["LEFT"] = 37] = "LEFT";
        Key[Key["UP"] = 38] = "UP";
        Key[Key["RIGHT"] = 39] = "RIGHT";
        Key[Key["DOWN"] = 40] = "DOWN";
        Key[Key["ENTER"] = 13] = "ENTER";
        Key[Key["ESC"] = 27] = "ESC";
        Key[Key["SPACE"] = 32] = "SPACE";
        Key[Key["BACKSPACE"] = 8] = "BACKSPACE";
    })(Key || (Key = {}));
    var Key$1 = Key;

    const isChecked = (model, value) => {
        if (Array.isArray(model)) {
            return model.indexOf(value) >= 0;
        }
        return model === value;
    };
    const TToggle = HtmlInput.extend({
        name: 'TToggle',
        props: {
            value: {
                type: [String, Object, Number, Boolean, Array],
                default: true,
            },
            uncheckedValue: {
                type: [String, Object, Number, Boolean, Array],
                default: false,
            },
            model: {
                // v-model
                type: [String, Object, Number, Boolean, Array],
                default: undefined,
            },
            checked: {
                type: Boolean,
                default: undefined,
            },
            tabindex: {
                type: [String, Number],
                default: 0,
            },
            uncheckedPlaceholder: {
                type: String,
                default: undefined,
            },
            checkedPlaceholder: {
                type: String,
                default: undefined,
            },
            uncheckedLabel: {
                type: String,
                default: undefined,
            },
            checkedLabel: {
                type: String,
                default: undefined,
            },
            classes: {
                type: Object,
                default() {
                    return {
                        wrapper: 'bg-gray-100 rounded-full border-2 border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
                        wrapperChecked: 'bg-blue-500 rounded-full border-2 border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
                        wrapperDisabled: 'bg-gray-100 rounded-full border-2 border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
                        wrapperCheckedDisabled: 'bg-blue-500 rounded-full border-2 border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
                        button: 'h-5 w-5 rounded-full bg-white shadow flex items-center justify-center text-gray-400 text-xs',
                        buttonChecked: 'h-5 w-5 rounded-full bg-white shadow flex items-center justify-center text-blue-500 text-xs',
                        checkedPlaceholder: 'rounded-full w-5 h-5 flex items-center justify-center text-gray-400 text-xs',
                        uncheckedPlaceholder: 'rounded-full w-5 h-5 flex items-center justify-center text-gray-400 text-xs',
                    };
                },
            },
            fixedClasses: {
                type: [String, Array, Object],
                default() {
                    return {
                        wrapper: 'relative inline-flex flex-shrink-0 cursor-pointer transition-colors ease-in-out duration-200',
                        wrapperChecked: 'relative inline-flex flex-shrink-0 cursor-pointer transition-colors ease-in-out duration-200',
                        wrapperDisabled: 'relative inline-flex flex-shrink-0 cursor-pointer transition-colors ease-in-out duration-200 opacity-50 cursor-not-allowed',
                        wrapperCheckedDisabled: 'relative inline-flex flex-shrink-0 cursor-pointer transition-colors ease-in-out duration-200 opacity-50 cursor-not-allowed',
                        button: 'inline-block absolute transform translate-x-0 transition ease-in-out duration-200',
                        buttonChecked: 'inline-block absolute transform translate-x-full transition ease-in-out duration-200',
                        checkedPlaceholder: 'inline-block',
                        uncheckedPlaceholder: 'inline-block',
                    };
                },
            },
        },
        model: {
            prop: 'model',
            event: 'input',
        },
        data() {
            const checked = typeof this.checked === 'boolean' && typeof this.model === 'undefined'
                ? this.checked
                : isChecked(this.model, this.value);
            return {
                isChecked: checked,
            };
        },
        computed: {
            isDisabled() {
                return this.disabled || this.readonly;
            },
            currentValue() {
                return this.isChecked ? this.value : this.uncheckedValue;
            },
        },
        watch: {
            model(model) {
                this.isChecked = isChecked(model, this.value);
            },
            isChecked(checked) {
                let localValue;
                if (Array.isArray(this.model)) {
                    localValue = [...this.model];
                    const index = localValue.indexOf(this.value);
                    if (checked && index < 0) {
                        localValue.push(this.value);
                    }
                    else if (!checked && index >= 0) {
                        localValue.splice(index, 1);
                    }
                }
                else {
                    localValue = this.currentValue;
                }
                this.$emit('input', localValue);
                this.$emit('change', localValue);
                // Emit update event to prop
                this.$emit('update:checked', checked);
            },
        },
        methods: {
            blurHandler(e) {
                this.$emit('blur', e);
            },
            focusHandler(e) {
                this.$emit('focus', e);
            },
            getElement() {
                return this.$el;
            },
            blur() {
                this.getElement().blur();
            },
            click() {
                this.getElement().click();
            },
            spaceHandler(e) {
                e.preventDefault();
                this.toggleValue();
            },
            clickHandler() {
                this.toggleValue();
            },
            toggleValue() {
                if (this.isDisabled) {
                    return;
                }
                this.isChecked = !this.isChecked;
            },
            setChecked(checked) {
                this.isChecked = checked;
            },
            focus(options) {
                this.getElement().focus(options);
            },
        },
        render(createElement) {
            let wrapperClass;
            if (this.isDisabled) {
                if (this.isChecked) {
                    wrapperClass = this.getElementCssClass('wrapperCheckedDisabled');
                }
                else {
                    wrapperClass = this.getElementCssClass('wrapperDisabled');
                }
            }
            else if (this.isChecked) {
                wrapperClass = this.getElementCssClass('wrapperChecked');
            }
            else {
                wrapperClass = this.getElementCssClass('wrapper');
            }
            let defaultSlot = this.$scopedSlots.default ? this.$scopedSlots.default({
                value: this.currentValue,
                uncheckedValue: this.uncheckedValue,
                isChecked: this.isChecked,
            }) : null;
            if (!defaultSlot) {
                defaultSlot = this.isChecked ? this.checkedLabel : this.uncheckedLabel;
            }
            let checkedslot = this.$scopedSlots.checked ? this.$scopedSlots.checked({
                value: this.currentValue,
                uncheckedValue: this.uncheckedValue,
                isChecked: this.isChecked,
            }) : null;
            if (this.checkedPlaceholder && !checkedslot) {
                checkedslot = this.checkedPlaceholder;
            }
            let uncheckedSlot = this.$scopedSlots.unchecked ? this.$scopedSlots.unchecked({
                value: this.currentValue,
                uncheckedValue: this.uncheckedValue,
                isChecked: this.isChecked,
            }) : null;
            if (this.uncheckedPlaceholder && !uncheckedSlot) {
                uncheckedSlot = this.uncheckedPlaceholder;
            }
            return createElement('span', {
                class: wrapperClass,
                attrs: {
                    role: 'checkbox',
                    id: this.id,
                    tabindex: this.tabindex,
                    autofocus: this.autofocus,
                    'aria-checked': this.isChecked ? 'true' : 'false',
                },
                on: {
                    blur: this.blurHandler,
                    focus: this.focusHandler,
                    click: (e) => {
                        this.clickHandler();
                        this.$emit('click', e);
                    },
                    keydown: (e) => {
                        if (e.keyCode === Key$1.SPACE) {
                            this.spaceHandler(e);
                        }
                        this.$emit('keydown', e);
                    },
                },
            }, [
                createElement('input', {
                    ref: 'input',
                    attrs: {
                        value: this.currentValue,
                        type: 'hidden',
                        name: this.name,
                        disabled: this.disabled,
                        readonly: this.readonly,
                        required: this.required,
                    },
                }),
                createElement('span', {
                    class: this.getElementCssClass('checkedPlaceholder'),
                    attrs: {
                        'aria-hidden': 'true',
                    },
                }, checkedslot),
                createElement('span', {
                    class: this.getElementCssClass('uncheckedPlaceholder'),
                    attrs: {
                        'aria-hidden': 'true',
                    },
                }, uncheckedSlot),
                createElement('span', {
                    ref: 'button',
                    class: this.isChecked
                        ? this.getElementCssClass('buttonChecked')
                        : this.getElementCssClass('button'),
                    attrs: {
                        'aria-hidden': 'true',
                    },
                }, defaultSlot),
            ]);
        },
    });

    exports.default = TToggle;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=t-toggle.js.map
