(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lodash.kebabcase'), require('vue'), require('lodash.get'), require('lodash.map')) :
    typeof define === 'function' && define.amd ? define(['exports', 'lodash.kebabcase', 'vue', 'lodash.get', 'lodash.map'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.TCheckboxGroup = {}, global.kebabCase, global.Vue, global.get, global.map));
})(this, (function (exports, kebabCase, Vue, get, map) { 'use strict';

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

    const guessOptionValue = (option, valueAttribute) => {
        if (valueAttribute) {
            return get(option, valueAttribute);
        }
        return get(option, 'value', get(option, 'id', get(option, 'text')));
    };
    const guessOptionText = (option, textAttribute) => {
        if (textAttribute) {
            return get(option, textAttribute);
        }
        return get(option, 'text', get(option, 'label'));
    };
    const normalizeOption = (option, textAttribute, valueAttribute) => {
        if (typeof option === 'string'
            || typeof option === 'number'
            || typeof option === 'boolean') {
            return {
                value: option,
                text: option,
                raw: option,
            };
        }
        if (option.children) {
            const children = option.children.map((childOption) => normalizeOption(childOption));
            return {
                value: guessOptionValue(option, valueAttribute),
                text: guessOptionText(option, textAttribute),
                children,
            };
        }
        const normalizedOption = {
            value: guessOptionValue(option, valueAttribute),
            text: guessOptionText(option, textAttribute),
            raw: option,
        };
        if (option.disabled !== undefined) {
            normalizedOption.disabled = option.disabled;
        }
        return normalizedOption;
    };
    const normalizeOptions = (options, textAttribute, valueAttribute) => {
        if (!options) {
            return [];
        }
        if (Array.isArray(options)) {
            return options.map((option) => normalizeOption(option, textAttribute, valueAttribute));
        }
        return map(options, (option, key) => ({
            value: key,
            text: option,
        }));
    };

    const InputWithOptions = HtmlInput.extend({
        props: {
            value: {
                type: [String, Object, Number, Boolean],
                default: null,
            },
            valueAttribute: {
                type: String,
                default: undefined,
            },
            textAttribute: {
                type: String,
                default: undefined,
            },
            options: {
                type: [Array, Object],
                default: undefined,
            },
        },
        data() {
            return {
                localValue: this.value,
            };
        },
        computed: {
            normalizedOptions() {
                return this.normalizeOptions(this.options);
            },
            flattenedOptions() {
                return this.normalizedOptions.map((option) => {
                    if (option.children) {
                        return option.children;
                    }
                    return option;
                }).flat();
            },
        },
        methods: {
            normalizeOptions(options) {
                return normalizeOptions(options, this.textAttribute, this.valueAttribute);
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

    const TCheckbox = HtmlInput.extend({
        name: 'TCheckbox',
        props: {
            value: {
                type: [String, Object, Number, Boolean, Array],
                default: true,
            },
            uncheckedValue: {
                type: [String, Object, Number, Boolean, Array],
                default: false,
            },
            indeterminate: {
                type: [Boolean, String],
                default: undefined,
            },
            checked: {
                type: [Boolean, String],
                default: undefined,
            },
            model: {
                // v-model
                type: [String, Object, Number, Boolean, Array],
                default: undefined,
            },
            wrapped: {
                type: Boolean,
                default: false,
            },
            wrapperTag: {
                type: String,
                default: 'label',
            },
            inputWrapperTag: {
                type: String,
                default: 'span',
            },
            labelTag: {
                type: String,
                default: 'span',
            },
            label: {
                type: [String, Number],
                default: undefined,
            },
            classes: {
                type: [String, Array, Object],
                default: 'text-blue-500 transition duration-100 ease-in-out border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed',
            },
        },
        data() {
            return {
                localValue: this.model,
            };
        },
        model: {
            prop: 'model',
            event: 'input',
        },
        render(createElement) {
            const renderFun = this.render;
            // eslint-disable-next-line max-len
            const createWrappedFunc = this.renderWrapped;
            if (this.wrapped) {
                return createWrappedFunc(createElement);
            }
            return renderFun(createElement);
        },
        computed: {
            isChecked: {
                get() {
                    if (this.model === undefined) {
                        return this.checked;
                    }
                    if (Array.isArray(this.model)) {
                        return this.model.indexOf(this.value) >= 0;
                    }
                    return this.model === this.value;
                },
                set(checked) {
                    this.localValue = checked;
                },
            },
        },
        watch: {
            isChecked(isChecked) {
                const input = this.getInput();
                if (input.checked !== isChecked) {
                    input.checked = isChecked;
                }
            },
            indeterminate(indeterminate) {
                this.setIndeterminate(indeterminate);
            },
            checked(checked) {
                this.setChecked(checked);
            },
        },
        methods: {
            getInput() {
                return this.$refs.input;
            },
            renderWrapped(createElement) {
                const childElements = [];
                const input = this.render(createElement);
                const inputWrapperClass = this.getElementCssClass('inputWrapper');
                const checkedInputWrapperClass = this.getElementCssClass('inputWrapperChecked', this.getElementCssClass('inputWrapper'));
                childElements.push(createElement(this.inputWrapperTag, {
                    ref: 'inputWrapper',
                    class: this.isChecked ? checkedInputWrapperClass : inputWrapperClass,
                }, [
                    input,
                ]));
                const labelClass = this.getElementCssClass('label');
                const checkedLabelClass = this.getElementCssClass('labelChecked', this.getElementCssClass('label'));
                let label;
                if (this.$scopedSlots.default !== undefined) {
                    label = this.$scopedSlots.default({
                        isChecked: this.isChecked,
                        value: this.isChecked ? this.value : this.uncheckedValue,
                        label: this.label,
                    });
                }
                else {
                    label = typeof this.label === 'number' ? String(this.label) : this.label;
                }
                childElements.push(createElement(this.labelTag, {
                    ref: 'label',
                    class: this.isChecked ? checkedLabelClass : labelClass,
                }, label));
                const wrapperClass = this.getElementCssClass('wrapper');
                const checkedWrapperClass = this.getElementCssClass('wrapperChecked', this.getElementCssClass('wrapper'));
                return createElement(this.wrapperTag, {
                    ref: 'wrapper',
                    class: this.isChecked ? checkedWrapperClass : wrapperClass,
                    attrs: {
                        for: this.id,
                        tabindex: this.tabindex,
                        autofocus: this.autofocus,
                    },
                    on: {
                        keydown: (e) => {
                            if (e.keyCode === Key$1.SPACE) {
                                this.wrapperSpaceHandler(e);
                            }
                        },
                    },
                }, childElements);
            },
            render(createElement) {
                return createElement('input', {
                    class: this.wrapped ? this.getElementCssClass('input') : this.componentClass,
                    ref: 'input',
                    attrs: {
                        checked: this.isChecked,
                        value: this.value,
                        id: this.id,
                        type: 'checkbox',
                        name: this.name,
                        disabled: this.disabled,
                        readonly: this.readonly,
                        required: this.required,
                        autofocus: !this.wrapped ? this.autofocus : undefined,
                        tabindex: this.wrapped && this.tabindex !== undefined ? -1 : this.tabindex,
                    },
                    on: this.getListeners({
                        blur: this.blurHandler,
                        focus: this.focusHandler,
                        change: this.changeHandler,
                        input: () => {
                            // Empty, overrides the input handler from the checkbox group
                        },
                    }),
                });
            },
            wrapperSpaceHandler(e) {
                e.preventDefault();
                this.click();
            },
            setIndeterminate(indeterminate) {
                const input = this.getInput();
                input.indeterminate = indeterminate;
                // Emit update event to prop
                this.$emit('update:indeterminate', indeterminate);
            },
            setChecked(checked) {
                const input = this.getInput();
                // this.localValue = checked;
                input.checked = !checked;
                input.click();
                // Emit update event to prop
                this.$emit('update:checked', checked);
            },
            changeHandler() {
                const input = this.getInput();
                const isChecked = input.checked;
                let localValue;
                if (Array.isArray(this.model)) {
                    localValue = [...this.model];
                    const index = localValue.indexOf(this.value);
                    if (isChecked && index < 0) {
                        localValue.push(this.value);
                    }
                    else if (!isChecked && index >= 0) {
                        localValue.splice(index, 1);
                    }
                }
                else {
                    localValue = isChecked ? this.value : this.uncheckedValue;
                }
                this.$emit('input', localValue);
                this.$emit('change', localValue);
                this.$emit('update:indeterminate', false);
                this.$emit('update:checked', isChecked);
            },
            blurHandler(e) {
                this.$emit('blur', e);
            },
            focusHandler(e) {
                this.$emit('focus', e);
            },
            blur() {
                this.getInput().blur();
            },
            click() {
                this.getInput().click();
            },
            focus(options) {
                this.getInput().focus(options);
            },
        },
    });

    const TCheckboxGroup = InputWithOptions.extend({
        name: 'TCheckboxGroup',
        props: {
            groupWrapperTag: {
                type: String,
                default: 'div',
            },
            wrapperTag: {
                type: String,
                default: 'label',
            },
            inputWrapperTag: {
                type: String,
                default: 'span',
            },
            labelTag: {
                type: String,
                default: 'span',
            },
            value: {
                type: Array,
                default() {
                    return [];
                },
            },
            fixedClasses: {
                type: Object,
                default() {
                    return {};
                },
            },
            classes: {
                type: Object,
                default() {
                    return {
                        groupWrapper: 'flex flex-col',
                        label: '',
                        input: 'text-blue-500 transition duration-100 ease-in-out border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 focus:ring-offset-0  disabled:opacity-50 disabled:cursor-not-allowed',
                        inputWrapper: 'inline-flex',
                        wrapper: 'inline-flex items-center space-x-2',
                    };
                },
            },
        },
        data() {
            return {
                localValue: this.value,
            };
        },
        watch: {
            localValue(localValue) {
                this.$emit('input', localValue);
                this.$emit('change', localValue);
            },
            value(value) {
                this.localValue = value;
            },
        },
        render(createElement) {
            const createRadioGroupFunc = this.createRadioGroup;
            return createRadioGroupFunc(createElement);
        },
        methods: {
            createRadioGroup(createElement) {
                return createElement(this.groupWrapperTag, {
                    ref: 'wrapper',
                    class: this.getElementCssClass('groupWrapper'),
                }, this.createRadioOptions(createElement));
            },
            createRadioOptions(createElement) {
                const options = this.normalizedOptions;
                return options
                    .map((option, index) => this.createRadioOption(createElement, option, index));
            },
            createRadioOption(createElement, option, index) {
                return createElement(TCheckbox, {
                    props: {
                        id: this.buildId(option, index),
                        name: this.name,
                        tabindex: this.tabindex,
                        disabled: this.disabled,
                        autofocus: this.autofocus,
                        required: this.required,
                        model: this.localValue,
                        label: option.text,
                        wrapped: true,
                        value: option.value,
                        checked: this.value === option.value,
                        variant: this.variant,
                        classes: this.classes,
                        fixedClasses: this.fixedClasses,
                        variants: this.variants,
                        wrapperTag: this.wrapperTag,
                        inputWrapperTag: this.inputWrapperTag,
                        labelTag: this.labelTag,
                    },
                    scopedSlots: {
                        default: this.$scopedSlots.default,
                    },
                    on: {
                        blur: this.blurHandler,
                        focus: this.focusHandler,
                        input: this.inputHandler,
                    },
                });
            },
            buildId(option, index) {
                const parts = [];
                if (this.id) {
                    parts.push(this.id);
                }
                else if (this.name) {
                    parts.push(this.name);
                }
                if (['string', 'number'].includes(typeof option.value)) {
                    parts.push(kebabCase(String(option.value)));
                }
                else {
                    parts.push(index);
                }
                return parts.join('-');
            },
            inputHandler(value) {
                this.localValue = value;
            },
            blurHandler(e) {
                this.$emit('blur', e);
            },
            focusHandler(e) {
                this.$emit('focus', e);
            },
        },
    });

    exports.default = TCheckboxGroup;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=t-checkbox-group.js.map
