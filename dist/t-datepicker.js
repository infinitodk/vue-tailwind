(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lodash.isequal'), require('lodash.clonedeep'), require('vue'), require('lodash.get'), require('lodash.merge')) :
    typeof define === 'function' && define.amd ? define(['exports', 'lodash.isequal', 'lodash.clonedeep', 'vue', 'lodash.get', 'lodash.merge'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.TDatepicker = {}, global.isEqual, global.cloneDeep, global.Vue, global.get, global.merge));
})(this, (function (exports, isEqual, cloneDeep, Vue, get, merge) { 'use strict';

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

    const TDropdown = Component.extend({
        name: 'TDropdown',
        props: {
            text: {
                type: String,
                default: '',
            },
            disabled: {
                type: Boolean,
                default: undefined,
            },
            tagName: {
                type: String,
                default: 'div',
            },
            dropdownWrapperTagName: {
                type: String,
                default: 'div',
            },
            dropdownTagName: {
                type: String,
                default: 'div',
            },
            toggleOnFocus: {
                type: Boolean,
                default: false,
            },
            toggleOnClick: {
                type: Boolean,
                default: true,
            },
            toggleOnHover: {
                type: Boolean,
                default: false,
            },
            hideOnLeaveTimeout: {
                type: Number,
                default: 250,
            },
            show: {
                type: Boolean,
                default: false,
            },
            classes: {
                type: Object,
                default() {
                    return {
                        button: 'block px-4 py-2 text-white transition duration-100 ease-in-out bg-blue-500 border border-transparent rounded shadow-sm hover:bg-blue-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed',
                        wrapper: 'inline-flex flex-col',
                        dropdownWrapper: 'relative z-10',
                        dropdown: 'origin-top-left absolute left-0 w-56 rounded shadow bg-white mt-1',
                        enterClass: 'opacity-0 scale-95',
                        enterActiveClass: 'transition transform ease-out duration-100',
                        enterToClass: 'opacity-100 scale-100',
                        leaveClass: 'opacity-100 scale-100',
                        leaveActiveClass: 'transition transform ease-in duration-75',
                        leaveToClass: 'opacity-0 scale-95',
                    };
                },
            },
        },
        data() {
            return {
                localShow: this.show,
                hasFocus: false,
                hideOnLeaveTimeoutHolder: null,
            };
        },
        render(createElement) {
            const renderFun = this.render;
            return renderFun(createElement);
        },
        watch: {
            show(show) {
                this.localShow = show;
            },
            localShow(localShow) {
                this.$emit('update:show', localShow);
                if (localShow) {
                    this.$emit('shown');
                }
                else {
                    this.$emit('hidden');
                }
            },
        },
        methods: {
            render(createElement) {
                const defaultSlot = this.$scopedSlots.default
                    ? this.$scopedSlots.default({
                        hide: this.doHide,
                        show: this.doShow,
                        toggle: this.doToggle,
                        blurHandler: this.blurHandler,
                    }) : null;
                const triggerSlot = this.$scopedSlots.trigger
                    ? this.$scopedSlots.trigger({
                        isShown: this.localShow,
                        hide: this.doHide,
                        hideIfFocusOutside: this.hideIfFocusOutside,
                        show: this.doShow,
                        toggle: this.doToggle,
                        mousedownHandler: this.mousedownHandler,
                        focusHandler: this.focusHandler,
                        blurHandler: this.blurHandler,
                        keydownHandler: this.keydownHandler,
                        disabled: this.disabled,
                    }) : createElement('button', {
                    ref: 'button',
                    attrs: {
                        type: 'button',
                        disabled: this.disabled,
                    },
                    class: this.getElementCssClass('button'),
                    on: {
                        keydown: this.keydownHandler,
                        mousedown: this.mousedownHandler,
                        focus: this.focusHandler,
                        blur: this.blurHandler,
                    },
                }, this.$slots.button || this.text);
                const subElements = [
                    triggerSlot,
                    createElement('transition', {
                        props: {
                            enterClass: this.getElementCssClass('enterClass'),
                            enterActiveClass: this.getElementCssClass('enterActiveClass'),
                            enterToClass: this.getElementCssClass('enterToClass'),
                            leaveClass: this.getElementCssClass('leaveClass'),
                            leaveActiveClass: this.getElementCssClass('leaveActiveClass'),
                            leaveToClass: this.getElementCssClass('leaveToClass'),
                        },
                    }, this.localShow ? [
                        createElement(this.dropdownWrapperTagName, {
                            ref: 'dropdownWrapper',
                            class: this.getElementCssClass('dropdownWrapper'),
                            attrs: {
                                tabindex: -1,
                            },
                            on: {
                                focus: this.focusHandler,
                                blur: this.blurHandler,
                            },
                        }, [
                            createElement(this.dropdownTagName, {
                                ref: 'dropdown',
                                class: this.getElementCssClass('dropdown'),
                            }, defaultSlot),
                        ]),
                    ] : undefined),
                ];
                return createElement(this.tagName, {
                    ref: 'wrapper',
                    class: this.getElementCssClass('wrapper'),
                    on: {
                        mouseover: this.mouseoverHandler,
                        mouseleave: this.mouseleaveHandler,
                    },
                }, subElements);
            },
            blurEventTargetIsChild(e) {
                const blurredElement = e.relatedTarget;
                if (blurredElement) {
                    const wrapper = this.$refs.wrapper;
                    return wrapper.contains(blurredElement);
                }
                return false;
            },
            focusEventTargetIsChild(e) {
                const focusedElement = e.target;
                if (focusedElement) {
                    const wrapper = this.$refs.wrapper;
                    return wrapper.contains(focusedElement);
                }
                return false;
            },
            escapeHandler() {
                this.doHide();
            },
            mousedownHandler() {
                if (this.toggleOnClick) {
                    this.doToggle();
                }
            },
            focusHandler(e) {
                if (!this.hasFocus && this.focusEventTargetIsChild(e)) {
                    this.hasFocus = true;
                    this.$emit('focus', e);
                }
                if (this.toggleOnFocus) {
                    this.doShow();
                }
            },
            blurHandler(e) {
                if (this.hasFocus && !this.blurEventTargetIsChild(e)) {
                    this.hasFocus = false;
                    this.$emit('blur', e);
                }
                if (this.toggleOnFocus || this.toggleOnClick) {
                    this.hideIfFocusOutside(e);
                }
            },
            keydownHandler(e) {
                if ([Key$1.ENTER, Key$1.SPACE].includes(e.keyCode)) {
                    this.mousedownHandler();
                }
                else if (e.keyCode === Key$1.ESC) {
                    this.escapeHandler();
                }
                this.$emit('keydown', e);
            },
            mouseleaveHandler() {
                if (!this.toggleOnHover) {
                    return;
                }
                if (!this.hideOnLeaveTimeout) {
                    this.doHide();
                    return;
                }
                this.hideOnLeaveTimeoutHolder = setTimeout(() => {
                    this.doHide();
                    this.hideOnLeaveTimeoutHolder = null;
                }, this.hideOnLeaveTimeout);
            },
            mouseoverHandler() {
                if (!this.toggleOnHover) {
                    return;
                }
                if (this.hideOnLeaveTimeout && this.hideOnLeaveTimeoutHolder) {
                    clearTimeout(this.hideOnLeaveTimeoutHolder);
                    this.hideOnLeaveTimeoutHolder = null;
                }
                this.doShow();
            },
            doHide() {
                this.localShow = false;
            },
            hideIfFocusOutside(e) {
                if (!(e instanceof Event)) {
                    throw new Error('the method hideIfFocusOutside expects an instance of `Event` as parameter');
                }
                if (!this.blurEventTargetIsChild(e)) {
                    this.doHide();
                }
            },
            doShow() {
                this.localShow = true;
            },
            doToggle() {
                if (this.localShow) {
                    this.doHide();
                }
                else {
                    this.doShow();
                }
            },
            blur() {
                const el = this.$refs.button;
                el.blur();
            },
            focus(options) {
                const el = this.$refs.button;
                el.focus(options);
            },
        },
    });

    const English = {
        weekdays: {
            shorthand: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            longhand: [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
            ],
        },
        months: {
            shorthand: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
            ],
            longhand: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
            ],
        },
        daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        firstDayOfWeek: 0,
        ordinal: (nth) => {
            const s = nth % 100;
            if (s > 3 && s < 21)
                return 'th';
            switch (s % 10) {
                case 1:
                    return 'st';
                case 2:
                    return 'nd';
                case 3:
                    return 'rd';
                default:
                    return 'th';
            }
        },
        rangeSeparator: ' to ',
        weekAbbreviation: 'Wk',
        amPM: ['AM', 'PM'],
        yearAriaLabel: 'Year',
        monthAriaLabel: 'Month',
        hourAriaLabel: 'Hour',
        minuteAriaLabel: 'Minute',
        time24hr: false,
        timeLabel: 'Time',
        okLabel: 'Ok',
    };

    const pad = (number, length = 2) => `000${number}`.slice(length * -1);
    const int = (bool) => (bool === true ? 1 : 0);

    // Credits to https://github.com/flatpickr/flatpickr/blob/master/src/utils/formatting.ts
    const doNothing = () => undefined;
    const monthToStr = (monthNumber, shorthand, locale) => locale.months[shorthand ? 'shorthand' : 'longhand'][monthNumber];
    const revFormat = {
        D: doNothing,
        F(dateObj, monthName, locale) {
            dateObj.setMonth(locale.months.longhand.indexOf(monthName));
        },
        G: (dateObj, hour) => {
            dateObj.setHours(parseFloat(hour));
        },
        H: (dateObj, hour) => {
            dateObj.setHours(parseFloat(hour));
        },
        J: (dateObj, day) => {
            dateObj.setDate(parseFloat(day));
        },
        K: (dateObj, amPM, locale) => {
            dateObj.setHours((dateObj.getHours() % 12)
                + 12 * int(new RegExp(locale.amPM[1], 'i').test(amPM)));
        },
        M(dateObj, shortMonth, locale) {
            dateObj.setMonth(locale.months.shorthand.indexOf(shortMonth));
        },
        S: (dateObj, seconds) => {
            dateObj.setSeconds(parseFloat(seconds));
        },
        U: (_, unixSeconds) => new Date(parseFloat(unixSeconds) * 1000),
        W(dateObj, weekNum, locale) {
            const weekNumber = parseInt(weekNum, 10);
            const date = new Date(dateObj.getFullYear(), 0, 2 + (weekNumber - 1) * 7, 0, 0, 0, 0);
            date.setDate(date.getDate() - date.getDay() + locale.firstDayOfWeek);
            return date;
        },
        Y: (dateObj, year) => {
            dateObj.setFullYear(parseFloat(year));
        },
        Z: (_, ISODate) => new Date(ISODate),
        d: (dateObj, day) => {
            dateObj.setDate(parseFloat(day));
        },
        h: (dateObj, hour) => {
            dateObj.setHours(parseFloat(hour));
        },
        i: (dateObj, minutes) => {
            dateObj.setMinutes(parseFloat(minutes));
        },
        j: (dateObj, day) => {
            dateObj.setDate(parseFloat(day));
        },
        l: doNothing,
        m: (dateObj, month) => {
            dateObj.setMonth(parseFloat(month) - 1);
        },
        n: (dateObj, month) => {
            dateObj.setMonth(parseFloat(month) - 1);
        },
        s: (dateObj, seconds) => {
            dateObj.setSeconds(parseFloat(seconds));
        },
        u: (_, unixMillSeconds) => new Date(parseFloat(unixMillSeconds)),
        w: doNothing,
        y: (dateObj, year) => {
            dateObj.setFullYear(2000 + parseFloat(year));
        },
    };
    const tokenRegex = {
        D: '(\\w+)',
        F: '(\\w+)',
        G: '(\\d\\d|\\d)',
        H: '(\\d\\d|\\d)',
        J: '(\\d\\d|\\d)\\w+',
        K: '',
        M: '(\\w+)',
        S: '(\\d\\d|\\d)',
        U: '(.+)',
        W: '(\\d\\d|\\d)',
        Y: '(\\d{4})',
        Z: '(.+)',
        d: '(\\d\\d|\\d)',
        h: '(\\d\\d|\\d)',
        i: '(\\d\\d|\\d)',
        j: '(\\d\\d|\\d)',
        l: '(\\w+)',
        m: '(\\d\\d|\\d)',
        n: '(\\d\\d|\\d)',
        s: '(\\d\\d|\\d)',
        u: '(.+)',
        w: '(\\d\\d|\\d)',
        y: '(\\d{2})',
    };
    const formats = {
        // get the date in UTC
        Z: (date) => date.toISOString(),
        // weekday name, short, e.g. Thu
        D(date, locale) {
            return locale.weekdays.shorthand[formats.w(date, locale)];
        },
        // full month name e.g. January
        F(date, locale) {
            return monthToStr(formats.n(date, locale) - 1, false, locale);
        },
        // padded hour 1-12
        G(date, locale) {
            return pad(formats.h(date, locale));
        },
        // hours with leading zero e.g. 03
        H: (date) => pad(date.getHours()),
        // day (1-30) with ordinal suffix e.g. 1st, 2nd
        J(date, locale) {
            return locale.ordinal !== undefined
                ? date.getDate() + locale.ordinal(date.getDate())
                : date.getDate();
        },
        // AM/PM
        K: (date, locale) => locale.amPM[int(date.getHours() > 11)],
        // shorthand month e.g. Jan, Sep, Oct, etc
        M(date, locale) {
            return monthToStr(date.getMonth(), true, locale);
        },
        // seconds 00-59
        S: (date) => pad(date.getSeconds()),
        // unix timestamp
        U: (date) => date.getTime() / 1000,
        W(givenDate) {
            // return options.getWeek(date);
            const date = new Date(givenDate.getTime());
            date.setHours(0, 0, 0, 0);
            // Thursday in current week decides the year.
            date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
            // January 4 is always in week 1.
            const week1 = new Date(date.getFullYear(), 0, 4);
            // Adjust to Thursday in week 1 and count number of weeks from date to week1.
            return (1
                + Math.round(((date.getTime() - week1.getTime()) / 86400000
                    - 3
                    + ((week1.getDay() + 6) % 7))
                    / 7));
        },
        // full year e.g. 2016, padded (0001-9999)
        Y: (date) => pad(date.getFullYear(), 4),
        // day in month, padded (01-30)
        d: (date) => pad(date.getDate()),
        // hour from 1-12 (am/pm)
        h: (date) => (date.getHours() % 12 ? date.getHours() % 12 : 12),
        // minutes, padded with leading zero e.g. 09
        i: (date) => pad(date.getMinutes()),
        // day in month (1-30)
        j: (date) => date.getDate(),
        // weekday name, full, e.g. Thursday
        l(date, locale) {
            return locale.weekdays.longhand[date.getDay()];
        },
        // padded month number (01-12)
        m: (date) => pad(date.getMonth() + 1),
        // the month number (1-12)
        n: (date) => date.getMonth() + 1,
        // seconds 0-59
        s: (date) => date.getSeconds(),
        // Unix Milliseconds
        u: (date) => date.getTime(),
        // number of the day of the week
        w: (date) => date.getDay(),
        // last two digits of year e.g. 16 for 2016
        y: (date) => String(date.getFullYear()).substring(2),
    };

    const formatDate = (dateObj, format, customLocale) => {
        if (!dateObj) {
            return '';
        }
        const locale = customLocale || English;
        return format
            .split('')
            .map((char, i, arr) => {
            if (formats[char] && arr[i - 1] !== '\\') {
                return formats[char](dateObj, locale);
            }
            if (char !== '\\') {
                return char;
            }
            return '';
        })
            .join('');
    };
    const parseDate = (date, format = 'Y-m-d H:i:S', timeless, customLocale) => {
        if (date !== 0 && !date) {
            return undefined;
        }
        const locale = customLocale || English;
        const localeTokenRegex = Object.assign({}, tokenRegex);
        localeTokenRegex.K = `(${locale.amPM[0]}|${locale.amPM[1]}|${locale.amPM[0].toLowerCase()}|${locale.amPM[1].toLowerCase()})`;
        let parsedDate;
        const dateOrig = date;
        if (date instanceof Date) {
            parsedDate = new Date(date.getTime());
        }
        else if (typeof date !== 'string'
            && date.toFixed !== undefined // timestamp
        ) {
            // create a copy
            parsedDate = new Date(date);
        }
        else if (typeof date === 'string') {
            // if (!userConfig.dateFormat && (userConfig.enableTime || timeMode)) {
            //   const defaultDateFormat =
            //     flatpickr.defaultConfig.dateFormat || defaultOptions.dateFormat;
            //   formats.dateFormat =
            //     userConfig.noCalendar || timeMode
            //       ? "H:i" + (userConfig.enableSeconds ? ":S" : "")
            //       : defaultDateFormat + " H:i" + (userConfig.enableSeconds ? ":S" : "");
            // }
            const datestr = String(date).trim();
            if (datestr === 'today') {
                parsedDate = new Date();
                // eslint-disable-next-line no-param-reassign
                timeless = true;
            }
            else if (/Z$/.test(datestr)
                || /GMT$/.test(datestr) // datestrings w/ timezone
            ) {
                parsedDate = new Date(date);
            }
            else {
                parsedDate = new Date(new Date().getFullYear(), 0, 1, 0, 0, 0, 0);
                // parsedDate = !config || !config.noCalendar
                //   ? new Date(new Date().getFullYear(), 0, 1, 0, 0, 0, 0)
                //   : (new Date(new Date().setHours(0, 0, 0, 0)) as Date);
                let matched;
                const ops = [];
                for (let i = 0, matchIndex = 0, regexStr = ''; i < format.length; i += 1) {
                    const token2 = format[i];
                    const isBackSlash = token2 === '\\';
                    const escaped = format[i - 1] === '\\' || isBackSlash;
                    if (localeTokenRegex[token2] && !escaped) {
                        regexStr += localeTokenRegex[token2];
                        const match = new RegExp(regexStr).exec(date);
                        if (match) {
                            matched = true;
                            ops[token2 !== 'Y' ? 'push' : 'unshift']({
                                fn: revFormat[token2],
                                val: match[matchIndex += 1],
                            });
                        }
                    }
                    else if (!isBackSlash) {
                        regexStr += '.'; // don't really care
                    }
                    // eslint-disable-next-line no-loop-func
                    ops.forEach((op) => {
                        const { fn } = op;
                        const { val } = op;
                        parsedDate = fn(parsedDate, String(val), locale) || parsedDate;
                    });
                }
                parsedDate = matched ? parsedDate : undefined;
            }
        }
        /* istanbul ignore next */
        // eslint-disable-next-line no-restricted-globals
        if (!(parsedDate instanceof Date && !isNaN(parsedDate.getTime()))) {
            throw new Error(`Invalid date provided: ${dateOrig}`);
        }
        if (timeless === true) {
            parsedDate.setHours(0, 0, 0, 0);
        }
        return parsedDate;
    };
    /**
     * Compute the difference in dates, measured in ms
     */
    function compareDates(date1, date2, timeless = true) {
        if (timeless !== false) {
            return (new Date(date1.getTime()).setHours(0, 0, 0, 0)
                - new Date(date2.getTime()).setHours(0, 0, 0, 0));
        }
        return date1.getTime() - date2.getTime();
    }
    const extractLocaleFromProps = (localeName, locales, defaultLocale) => {
        const availableLocales = Object.keys(locales);
        const find = availableLocales.find((l) => l === localeName);
        const locale = find && locales[find] ? locales[find] : defaultLocale;
        return merge(cloneDeep(English), locale);
    };
    const buildDateParser = (locale, customDateParser) => (date, format = 'Y-m-d H:i:S', timeless) => {
        if (customDateParser) {
            return customDateParser(date, format, timeless, locale);
        }
        return parseDate(date, format, timeless, locale);
    };
    const buildDateFormatter = (locale, customDateFormatter) => (date, format = 'Y-m-d H:i:S') => {
        if (customDateFormatter) {
            return customDateFormatter(date, format, locale);
        }
        return formatDate(date, format, locale);
    };
    /**
     * it two dates are in the same month
     */
    function isSameMonth(date1, date2) {
        return (!!date1)
            && (!!date2)
            && date1.getFullYear() === date2.getFullYear()
            && date1.getMonth() === date2.getMonth();
    }
    /**
     * it two dates are in the same day
     */
    function isSameDay(date1, date2) {
        return isSameMonth(date1, date2) && (date1 === null || date1 === void 0 ? void 0 : date1.getDate()) === (date2 === null || date2 === void 0 ? void 0 : date2.getDate());
    }
    function dayIsPartOfTheConditions(day, condition, dateParser, dateFormat) {
        if (!day) {
            return false;
        }
        if (typeof condition === 'function') {
            return condition(day);
        }
        if (typeof condition === 'string' || condition instanceof String) {
            const disabledDate = dateParser(condition, dateFormat);
            return isSameDay(disabledDate, day);
        }
        if (condition instanceof Date) {
            return isSameDay(condition, day);
        }
        if (Array.isArray(condition)) {
            return condition.some((c) => dayIsPartOfTheConditions(day, c, dateParser, dateFormat));
        }
        return false;
    }
    function dateIsOutOfRange(date, min, max, dateParser = null, dateFormat = null) {
        let minDate;
        if (typeof min === 'string' || min instanceof String) {
            if (!dateParser) {
                throw new Error('strings needs a date parser');
            }
            if (!dateFormat) {
                throw new Error('strings needs a date format');
            }
            minDate = dateParser(min, dateFormat);
        }
        else {
            minDate = min;
        }
        let maxDate;
        if (typeof max === 'string' || max instanceof String) {
            if (!dateParser) {
                throw new Error('strings needs a date parser');
            }
            if (!dateFormat) {
                throw new Error('strings needs a date format');
            }
            maxDate = dateParser(max, dateFormat);
        }
        else {
            maxDate = max;
        }
        const time = date.getTime();
        if (minDate && maxDate) {
            return time < minDate.getTime() || time > maxDate.getTime();
        }
        if (minDate) {
            return time < minDate.getTime();
        }
        if (maxDate) {
            return time > maxDate.getTime();
        }
        return false;
    }
    function addDays(date, amount = 1) {
        const result = new Date(date);
        result.setDate(result.getDate() + amount);
        return result;
    }
    function addMonths(date, amount = 1) {
        let newDate = new Date(date.valueOf());
        newDate.setMonth(date.getMonth() + amount);
        // Means the current day has less days so the extra month is
        // in the following month
        if (newDate.getDate() !== date.getDate()) {
            // Assign the last day of previous month
            newDate = new Date(newDate.getFullYear(), newDate.getMonth(), 0);
        }
        return newDate;
    }
    function addYears(date, amount = 1) {
        let newDate = new Date(date.valueOf());
        newDate.setFullYear(date.getFullYear() + amount);
        // Means the current day has less days so the extra month is
        // in the following month
        if (newDate.getDate() !== date.getDate()) {
            // Assign the last day of previous month
            newDate = new Date(newDate.getFullYear(), newDate.getMonth(), 0);
        }
        return newDate;
    }
    function lastDayOfMonth(date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }

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

    const getYearsRange = (date, yearsPerView) => {
        const currentYear = date.getFullYear();
        const from = currentYear - Math.floor(currentYear % yearsPerView);
        const to = from + yearsPerView - 1;
        return [from, to];
    };
    var CalendarView;
    (function (CalendarView) {
        CalendarView["Day"] = "day";
        CalendarView["Month"] = "month";
        CalendarView["Year"] = "year";
    })(CalendarView || (CalendarView = {}));
    const TDatepickerNavigator = Vue.extend({
        name: 'TDatepickerNavigator',
        props: {
            getElementCssClass: {
                type: Function,
                required: true,
            },
            value: {
                type: Date,
                default: null,
            },
            showSelector: {
                type: Boolean,
                default: true,
            },
            currentView: {
                type: String,
                default: CalendarView.Day,
                validator(value) {
                    return [CalendarView.Day, CalendarView.Month, CalendarView.Year].includes(value);
                },
            },
            parse: {
                type: Function,
                required: true,
            },
            formatNative: {
                type: Function,
                required: true,
            },
            dateFormat: {
                type: String,
                required: true,
            },
            yearsPerView: {
                type: Number,
                required: true,
            },
            maxDate: {
                type: [Date, String],
                default: undefined,
            },
            minDate: {
                type: [Date, String],
                default: undefined,
            },
            locale: {
                type: Object,
                required: true,
            },
        },
        data() {
            return {
                localValue: new Date(this.value.valueOf()),
            };
        },
        computed: {
            isDayView() {
                return this.currentView === CalendarView.Day;
            },
            isYearView() {
                return this.currentView === CalendarView.Year;
            },
            isMonthView() {
                return this.currentView === CalendarView.Month;
            },
            nextDate() {
                return this.getNextDate();
            },
            prevDate() {
                return this.getPrevDate();
            },
            prevButtonIsDisabled() {
                return !this.prevDate;
            },
            nextButtonIsDisabled() {
                return !this.nextDate;
            },
            nextButtonAriaLabel() {
                if (this.isDayView) {
                    return `Next ${this.locale.MonthAriaLabel}`;
                }
                return `Next ${this.locale.yearAriaLabel}`;
            },
            prevButtonAriaLabel() {
                if (this.isDayView) {
                    return `Prev ${this.locale.MonthAriaLabel}`;
                }
                return `Prev ${this.locale.yearAriaLabel}`;
            },
        },
        watch: {
            value(value) {
                this.localValue = new Date(value.valueOf());
            },
        },
        methods: {
            getNextDate() {
                let nextDate;
                if (this.currentView === CalendarView.Day) {
                    nextDate = this.getNextMonth();
                }
                else if (this.currentView === CalendarView.Month) {
                    nextDate = this.getNextYear();
                }
                else if (this.currentView === CalendarView.Year) {
                    nextDate = this.getNextYearGroup();
                }
                return nextDate;
            },
            getPrevDate() {
                let prevDate;
                if (this.currentView === CalendarView.Day) {
                    prevDate = this.getPrevMonth();
                }
                else if (this.currentView === CalendarView.Month) {
                    prevDate = this.getPrevYear();
                }
                else if (this.currentView === CalendarView.Year) {
                    prevDate = this.getPrevYearGroup();
                }
                return prevDate;
            },
            inputHandler(newDate) {
                this.$emit('input', newDate);
            },
            clickHandler() {
                if (this.currentView === CalendarView.Day) {
                    this.$emit('update-view', CalendarView.Month);
                }
                else if (this.currentView === CalendarView.Month) {
                    this.$emit('update-view', CalendarView.Year);
                }
                else if (this.currentView === CalendarView.Year) {
                    this.$emit('update-view', CalendarView.Day);
                }
            },
            next() {
                if (this.nextDate) {
                    this.inputHandler(this.nextDate);
                }
            },
            prev() {
                if (this.prevDate) {
                    this.inputHandler(this.prevDate);
                }
            },
            getPrevMonth() {
                const prevMonth = addMonths(this.localValue, -1);
                const dateParser = this.parse;
                if (!dateIsOutOfRange(prevMonth, this.minDate, this.maxDate, dateParser, this.dateFormat)) {
                    return prevMonth;
                }
                let day = prevMonth.getDate();
                let dateToTry = prevMonth;
                let validDate;
                day = prevMonth.getDate();
                const lastDay = lastDayOfMonth(prevMonth).getDate();
                do {
                    dateToTry = addDays(dateToTry, 1);
                    day += 1;
                    if (!dateIsOutOfRange(dateToTry, this.minDate, this.maxDate, dateParser, this.dateFormat)) {
                        validDate = dateToTry;
                    }
                } while (day <= lastDay && !validDate);
                if (!validDate) {
                    day = prevMonth.getDate();
                    do {
                        dateToTry = addDays(dateToTry, -1);
                        day -= 1;
                        if (!dateIsOutOfRange(dateToTry, this.minDate, this.maxDate, dateParser, this.dateFormat)) {
                            validDate = dateToTry;
                        }
                    } while (day >= 1 && !validDate);
                }
                return validDate;
            },
            getNextMonth() {
                const nextMonth = addMonths(this.localValue, 1);
                const dateParser = this.parse;
                if (!dateIsOutOfRange(nextMonth, this.minDate, this.maxDate, dateParser, this.dateFormat)) {
                    return nextMonth;
                }
                let day = nextMonth.getDate();
                let dateToTry = nextMonth;
                let validDate;
                do {
                    dateToTry = addDays(dateToTry, -1);
                    day -= 1;
                    if (!dateIsOutOfRange(dateToTry, this.minDate, this.maxDate, dateParser, this.dateFormat)) {
                        validDate = dateToTry;
                    }
                } while (day >= 1 && !validDate);
                if (!validDate) {
                    day = nextMonth.getDate();
                    const lastDay = lastDayOfMonth(nextMonth).getDate();
                    do {
                        dateToTry = addDays(dateToTry, 1);
                        day += 1;
                        if (!dateIsOutOfRange(dateToTry, this.minDate, this.maxDate, dateParser, this.dateFormat)) {
                            validDate = dateToTry;
                        }
                    } while (day <= lastDay && !validDate);
                }
                return validDate;
            },
            getPrevYear() {
                const prevYear = addYears(this.localValue, -1);
                const dateParser = this.parse;
                if (!dateIsOutOfRange(prevYear, this.minDate, this.maxDate, dateParser, this.dateFormat)) {
                    return prevYear;
                }
                let validDate;
                let dateToTry = prevYear;
                const year = prevYear.getFullYear();
                do {
                    dateToTry = addDays(dateToTry, 1);
                    if (!dateIsOutOfRange(dateToTry, this.minDate, this.maxDate, dateParser, this.dateFormat)) {
                        validDate = dateToTry;
                    }
                } while (dateToTry.getFullYear() === year && !validDate);
                if (!validDate) {
                    do {
                        dateToTry = addDays(dateToTry, -1);
                        if (!dateIsOutOfRange(dateToTry, this.minDate, this.maxDate, dateParser, this.dateFormat)) {
                            validDate = dateToTry;
                        }
                    } while (dateToTry.getFullYear() === year && !validDate);
                }
                return validDate;
            },
            getNextYear() {
                const nextYear = addYears(this.localValue, 1);
                const dateParser = this.parse;
                if (!dateIsOutOfRange(nextYear, this.minDate, this.maxDate, dateParser, this.dateFormat)) {
                    return nextYear;
                }
                let validDate;
                let dateToTry = nextYear;
                const year = nextYear.getFullYear();
                do {
                    dateToTry = addDays(dateToTry, -1);
                    if (!dateIsOutOfRange(dateToTry, this.minDate, this.maxDate, dateParser, this.dateFormat)) {
                        validDate = dateToTry;
                    }
                } while (dateToTry.getFullYear() === year && !validDate);
                if (!validDate) {
                    do {
                        dateToTry = addDays(dateToTry, 1);
                        if (!dateIsOutOfRange(dateToTry, this.minDate, this.maxDate, dateParser, this.dateFormat)) {
                            validDate = dateToTry;
                        }
                    } while (dateToTry.getFullYear() === year && !validDate);
                }
                return validDate;
            },
            getPrevYearGroup() {
                const prevYear = addYears(this.localValue, -this.yearsPerView);
                const dateParser = this.parse;
                if (!dateIsOutOfRange(prevYear, this.minDate, this.maxDate, dateParser, this.dateFormat)) {
                    return prevYear;
                }
                let validDate;
                let dateToTry = prevYear;
                const year = prevYear.getFullYear();
                do {
                    dateToTry = addDays(dateToTry, this.yearsPerView);
                    if (!dateIsOutOfRange(dateToTry, this.minDate, this.maxDate, dateParser, this.dateFormat)) {
                        validDate = dateToTry;
                    }
                } while (dateToTry.getFullYear() === year && !validDate);
                if (!validDate) {
                    do {
                        dateToTry = addDays(dateToTry, -this.yearsPerView);
                        if (!dateIsOutOfRange(dateToTry, this.minDate, this.maxDate, dateParser, this.dateFormat)) {
                            validDate = dateToTry;
                        }
                    } while (dateToTry.getFullYear() === year && !validDate);
                }
                return validDate;
            },
            getNextYearGroup() {
                const nextYear = addYears(this.localValue, this.yearsPerView);
                const dateParser = this.parse;
                if (!dateIsOutOfRange(nextYear, this.minDate, this.maxDate, dateParser, this.dateFormat)) {
                    return nextYear;
                }
                let validDate;
                let dateToTry = nextYear;
                const year = nextYear.getFullYear();
                do {
                    dateToTry = addDays(dateToTry, -this.yearsPerView);
                    if (!dateIsOutOfRange(dateToTry, this.minDate, this.maxDate, dateParser, this.dateFormat)) {
                        validDate = dateToTry;
                    }
                } while (dateToTry.getFullYear() === year && !validDate);
                if (!validDate) {
                    do {
                        dateToTry = addDays(dateToTry, this.yearsPerView);
                        if (!dateIsOutOfRange(dateToTry, this.minDate, this.maxDate, dateParser, this.dateFormat)) {
                            validDate = dateToTry;
                        }
                    } while (dateToTry.getFullYear() === year && !validDate);
                }
                return validDate;
            },
        },
        render(createElement) {
            const subElements = [];
            if (this.showSelector) {
                const buttonElements = [];
                if (this.currentView === CalendarView.Day) {
                    buttonElements.push(createElement('span', {
                        class: this.getElementCssClass('navigatorViewButtonMonthName'),
                    }, this.formatNative(this.localValue, 'F')));
                }
                if (this.currentView === CalendarView.Month || this.currentView === CalendarView.Day) {
                    buttonElements.push(createElement('span', {
                        class: this.getElementCssClass('navigatorViewButtonYear'),
                    }, this.formatNative(this.localValue, 'Y')));
                }
                if (this.currentView !== CalendarView.Year) {
                    buttonElements.push(createElement('svg', {
                        attrs: {
                            fill: 'currentColor',
                            xmlns: 'http://www.w3.org/2000/svg',
                            viewBox: '0 0 20 20',
                        },
                        class: this.getElementCssClass('navigatorViewButtonIcon'),
                    }, [
                        createElement('polygon', {
                            attrs: {
                                points: '12.9497475 10.7071068 13.6568542 10 8 4.34314575 6.58578644 5.75735931 10.8284271 10 6.58578644 14.2426407 8 15.6568542 12.9497475 10.7071068',
                            },
                        }),
                    ]));
                }
                else {
                    buttonElements.push(createElement('svg', {
                        attrs: {
                            fill: 'currentColor',
                            xmlns: 'http://www.w3.org/2000/svg',
                            viewBox: '0 0 20 20',
                        },
                        class: this.getElementCssClass('navigatorViewButtonBackIcon'),
                    }, [
                        createElement('polygon', {
                            attrs: {
                                points: '7.05025253 9.29289322 6.34314575 10 12 15.6568542 13.4142136 14.2426407 9.17157288 10 13.4142136 5.75735931 12 4.34314575',
                            },
                        }),
                    ]));
                    buttonElements.push(createElement('span', {
                        class: this.getElementCssClass('navigatorViewButtonYearRange'),
                    }, getYearsRange(this.localValue, this.yearsPerView).join(' - ')));
                }
                subElements.push(createElement('button', {
                    attrs: {
                        type: 'button',
                        class: this.getElementCssClass('navigatorViewButton'),
                        tabindex: -1,
                    },
                    on: {
                        click: this.clickHandler,
                    },
                }, buttonElements));
            }
            else {
                subElements.push(createElement('span', {
                    attrs: {
                        class: this.getElementCssClass('navigatorLabel'),
                    },
                }, [
                    createElement('span', {
                        class: this.getElementCssClass('navigatorLabelMonth'),
                    }, this.formatNative(this.localValue, 'F')),
                    createElement('span', {
                        class: this.getElementCssClass('navigatorLabelYear'),
                    }, this.formatNative(this.localValue, 'Y')),
                ]));
            }
            if (this.showSelector) {
                subElements.push(createElement('button', {
                    ref: 'prev',
                    attrs: {
                        'aria-label': this.prevButtonAriaLabel,
                        type: 'button',
                        class: this.getElementCssClass('navigatorPrevButton'),
                        tabindex: -1,
                        disabled: this.prevButtonIsDisabled ? true : undefined,
                    },
                    on: {
                        click: this.prev,
                    },
                }, [
                    createElement('svg', {
                        attrs: {
                            fill: 'none',
                            viewBox: '0 0 24 24',
                            stroke: 'currentColor',
                        },
                        class: this.getElementCssClass('navigatorPrevButtonIcon'),
                    }, [
                        createElement('path', {
                            attrs: {
                                'stroke-linecap': 'round',
                                'stroke-linejoin': 'round',
                                'stroke-width': 2,
                                d: 'M15 19l-7-7 7-7',
                            },
                        }),
                    ]),
                ]));
                subElements.push(createElement('button', {
                    ref: 'next',
                    attrs: {
                        'aria-label': this.nextButtonAriaLabel,
                        type: 'button',
                        class: this.getElementCssClass('navigatorNextButton'),
                        tabindex: -1,
                        disabled: this.nextButtonIsDisabled ? true : undefined,
                    },
                    on: {
                        click: this.next,
                    },
                }, [
                    createElement('svg', {
                        attrs: {
                            fill: 'none',
                            viewBox: '0 0 24 24',
                            stroke: 'currentColor',
                        },
                        class: this.getElementCssClass('navigatorNextButtonIcon'),
                    }, [
                        createElement('path', {
                            attrs: {
                                'stroke-linecap': 'round',
                                'stroke-linejoin': 'round',
                                'stroke-width': 2,
                                d: 'M9 5l7 7-7 7',
                            },
                        }),
                    ]),
                ]));
            }
            return createElement('div', {
                class: this.getElementCssClass('navigator'),
            }, subElements);
        },
    });

    const TDatepickerTrigger = Vue.extend({
        name: 'TDatepickerTrigger',
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
            inputName: {
                type: String,
                default: undefined,
            },
            placeholder: {
                type: String,
                default: undefined,
            },
            show: {
                type: Function,
                default: undefined,
            },
            hideIfFocusOutside: {
                type: Function,
                default: undefined,
            },
            conjunction: {
                type: String,
                required: true,
            },
            multiple: {
                type: Boolean,
                required: true,
            },
            range: {
                type: Boolean,
                required: true,
            },
            clearable: {
                type: Boolean,
                required: true,
            },
            locale: {
                type: Object,
                required: true,
            },
            userFormatedDate: {
                type: [String, Array],
                required: true,
            },
            formatedDate: {
                type: [String, Array],
                required: true,
            },
            value: {
                type: [Date, Array],
                default: null,
            },
            activeDate: {
                type: Date,
                required: true,
            },
            getElementCssClass: {
                type: Function,
                required: true,
            },
            hasFocus: {
                type: Boolean,
                required: true,
            },
        },
        computed: {
            hasValue() {
                if (Array.isArray(this.value)) {
                    return this.value.length > 0;
                }
                return !!this.value;
            },
        },
        methods: {
            clearButtonClickHandler(e) {
                this.$emit('clear', e);
            },
        },
        render(createElement) {
            const formattedDate = this.formatedDate;
            let formText = '';
            if (Array.isArray(this.userFormatedDate)) {
                const conjunction = this.range ? this.locale.rangeSeparator : this.conjunction;
                formText = this.userFormatedDate.join(conjunction);
            }
            else {
                formText = this.userFormatedDate;
            }
            const subElements = [
                createElement('input', {
                    ref: 'input',
                    class: this.getElementCssClass('input'),
                    attrs: {
                        // Prevents
                        readonly: !this.hasFocus ? this.readonly : true,
                        inputmode: 'none',
                        id: this.id,
                        name: this.name,
                        disabled: this.disabled,
                        autocomplete: 'off',
                        autofocus: this.autofocus,
                        type: 'text',
                        required: this.required,
                        placeholder: this.placeholder,
                        tabindex: this.tabindex,
                        value: formText,
                    },
                    on: {
                        click: (e) => {
                            if (this.show) {
                                this.show();
                            }
                            this.$emit('click', e);
                        },
                        input: (e) => {
                            this.$emit('input', e);
                        },
                        keydown: (e) => {
                            this.$emit('keydown', e);
                        },
                        blur: (e) => {
                            if (this.hideIfFocusOutside) {
                                this.hideIfFocusOutside(e);
                            }
                            this.$emit('blur', e);
                        },
                        focus: (e) => {
                            if (this.show) {
                                this.show();
                            }
                            this.$emit('focus', e);
                        },
                    },
                }),
            ];
            if (this.clearable && this.hasValue) {
                const clearButtonSlot = this.$scopedSlots.clearButton
                    ? this.$scopedSlots.clearButton({
                        className: this.getElementCssClass('clearButtonIcon'),
                        formatedDate: this.formatedDate,
                        userFormatedDate: this.userFormatedDate,
                        value: this.value,
                        activeDate: this.activeDate,
                    }) : [
                    createElement('svg', {
                        attrs: {
                            fill: 'currentColor',
                            xmlns: 'http://www.w3.org/2000/svg',
                            viewBox: '0 0 20 20',
                        },
                        class: this.getElementCssClass('clearButtonIcon'),
                    }, [
                        createElement('polygon', {
                            attrs: {
                                points: '10 8.58578644 2.92893219 1.51471863 1.51471863 2.92893219 8.58578644 10 1.51471863 17.0710678 2.92893219 18.4852814 10 11.4142136 17.0710678 18.4852814 18.4852814 17.0710678 11.4142136 10 18.4852814 2.92893219 17.0710678 1.51471863 10 8.58578644',
                            },
                        }),
                    ]),
                ];
                subElements.push(createElement('button', {
                    ref: 'clearButton',
                    class: this.getElementCssClass('clearButton'),
                    attrs: {
                        type: 'button',
                        tabindex: -1,
                    },
                    on: {
                        click: this.clearButtonClickHandler,
                    },
                }, clearButtonSlot));
            }
            if (this.multiple) {
                const dates = Array.isArray(formattedDate) ? formattedDate : [formattedDate];
                const hiddenInputs = dates.map((date) => createElement('input', {
                    attrs: {
                        type: 'hidden',
                        value: date,
                        name: this.name,
                        disabled: this.disabled,
                        readonly: this.readonly,
                        required: this.required,
                    },
                }));
                subElements.push(...hiddenInputs);
            }
            else {
                subElements.push(createElement('input', {
                    attrs: {
                        type: 'hidden',
                        value: Array.isArray(formattedDate) ? formattedDate.join(this.conjunction) : formattedDate,
                        name: this.name,
                        disabled: this.disabled,
                        readonly: this.readonly,
                        required: this.required,
                    },
                }));
            }
            return createElement('div', {
                class: this.getElementCssClass('inputWrapper'),
            }, subElements);
        },
    });

    const TDatepickerViewsViewCalendarDaysDay = Vue.extend({
        name: 'TDatepickerViewsViewCalendarDaysDay',
        props: {
            day: {
                type: Date,
                required: true,
            },
            value: {
                type: [Date, Array],
                default: null,
            },
            activeDate: {
                type: Date,
                required: true,
            },
            activeMonth: {
                type: Date,
                required: true,
            },
            getElementCssClass: {
                type: Function,
                required: true,
            },
            parse: {
                type: Function,
                required: true,
            },
            format: {
                type: Function,
                required: true,
            },
            formatNative: {
                type: Function,
                required: true,
            },
            dateFormat: {
                type: String,
                required: true,
            },
            userFormat: {
                type: String,
                required: true,
            },
            showDaysForOtherMonth: {
                type: Boolean,
                required: true,
            },
            showActiveDate: {
                type: Boolean,
                required: true,
            },
            disabledDates: {
                type: [Date, Array, Function, String],
                default: undefined,
            },
            highlightDates: {
                type: [Date, Array, Function, String],
                default: undefined,
            },
            maxDate: {
                type: [Date, String],
                default: undefined,
            },
            minDate: {
                type: [Date, String],
                default: undefined,
            },
            range: {
                type: Boolean,
                required: true,
            },
            dateWithoutTime: {
                type: Date,
                default: null,
            },
        },
        data() {
            return {
                localActiveDate: new Date(this.activeDate.valueOf()),
                localActiveMonth: new Date(this.activeMonth.valueOf()),
            };
        },
        computed: {
            isSelected() {
                const d1 = this.getDay();
                const d2 = this.getSelectedDay();
                if (d2 instanceof Date) {
                    return isSameDay(d1, d2);
                }
                if (Array.isArray(d2)) {
                    return d2.some((d) => isSameDay(d, d1));
                }
                return false;
            },
            isActive() {
                const d1 = this.getDay();
                const d2 = this.localActiveDate;
                return isSameDay(d1, d2);
            },
            isToday() {
                const d1 = this.getDay();
                const d2 = new Date();
                return isSameDay(d1, d2);
            },
            isDisabled() {
                const day = this.getDay();
                const disabledDates = this.disabledDates;
                const dateParser = this.parse;
                return dateIsOutOfRange(day, this.minDate, this.maxDate, dateParser, this.dateFormat)
                    || dayIsPartOfTheConditions(day, disabledDates, dateParser, this.dateFormat);
            },
            isHighlighted() {
                const day = this.getDay();
                const highlightDates = this.highlightDates;
                const dateParser = this.parse;
                return dayIsPartOfTheConditions(day, highlightDates, dateParser, this.dateFormat);
            },
            isForAnotherMonth() {
                const d1 = this.localActiveMonth;
                const d2 = this.getDay();
                return d1.getFullYear() !== d2.getFullYear()
                    || d1.getMonth() !== d2.getMonth();
            },
            isInRange() {
                if (!this.range || !Array.isArray(this.value)) {
                    return false;
                }
                const [from, to] = this.value;
                if (from && to) {
                    return !dateIsOutOfRange(this.getDay(), addDays(from, 1), addDays(to, -1));
                }
                return false;
            },
            isFirstDayOfRange() {
                if (!this.range || !Array.isArray(this.value)) {
                    return false;
                }
                const [from] = this.value;
                return from && isSameDay(from, this.getDay());
            },
            isLastDayOfRange() {
                if (!this.range || !Array.isArray(this.value)) {
                    return false;
                }
                const [, to] = this.value;
                return to && isSameDay(to, this.getDay());
            },
            dayFormatted() {
                return this.formatNative(this.getDay(), 'j');
            },
            ariaLabel() {
                return this.format(this.getDay(), this.userFormat);
            },
            dateFormatted() {
                return this.format(this.getDay(), 'Y-m-d');
            },
        },
        watch: {
            activeDate(activeDate) {
                this.localActiveDate = new Date(activeDate.valueOf());
            },
            activeMonth(activeMonth) {
                this.localActiveMonth = new Date(activeMonth.valueOf());
            },
        },
        methods: {
            getClass() {
                if (this.isForAnotherMonth) {
                    return this.getElementCssClass('otherMonthDay');
                }
                if (this.isFirstDayOfRange) {
                    return this.getElementCssClass('inRangeFirstDay');
                }
                if (this.isLastDayOfRange) {
                    return this.getElementCssClass('inRangeLastDay');
                }
                if (this.isInRange) {
                    return this.getElementCssClass('inRangeDay');
                }
                if (this.isSelected) {
                    return this.getElementCssClass('selectedDay');
                }
                if (this.isActive && this.showActiveDate) {
                    return this.getElementCssClass('activeDay');
                }
                if (this.isHighlighted) {
                    return this.getElementCssClass('highlightedDay');
                }
                if (this.isToday) {
                    return this.getElementCssClass('today');
                }
                return this.getElementCssClass('day');
            },
            getDay() {
                return this.day;
            },
            getSelectedDay() {
                if (this.dateWithoutTime !== null) {
                    return this.dateWithoutTime;
                }
                return this.value;
            },
        },
        render(createElement) {
            if (this.isForAnotherMonth && !this.showDaysForOtherMonth) {
                return createElement('span', {
                    class: this.getElementCssClass('emptyDay'),
                }, '');
            }
            const daySlot = this.$scopedSlots.day
                ? this.$scopedSlots.day({
                    dayFormatted: this.dayFormatted,
                    isForAnotherMonth: this.isForAnotherMonth,
                    isFirstDayOfRange: this.isFirstDayOfRange,
                    isLastDayOfRange: this.isLastDayOfRange,
                    isInRange: this.isInRange,
                    isSelected: this.isSelected,
                    isActive: this.isActive,
                    isHighlighted: this.isHighlighted,
                    isToday: this.isToday,
                    day: this.getDay(),
                    activeDate: this.activeDate,
                    value: this.value,
                }) : this.dayFormatted;
            return createElement('button', {
                class: this.getClass(),
                attrs: {
                    'aria-label': this.ariaLabel,
                    'aria-current': this.isToday ? 'date' : undefined,
                    'data-date': this.dateFormatted,
                    type: 'button',
                    tabindex: -1,
                    disabled: this.isDisabled ? true : undefined,
                },
                on: {
                    click: (e) => this.$emit('click', e),
                },
            }, daySlot);
        },
    });

    const TDatepickerViewsViewCalendarDays = Vue.extend({
        name: 'TDatepickerViewsViewCalendarDays',
        props: {
            value: {
                type: [Date, Array],
                default: null,
            },
            activeDate: {
                type: Date,
                required: true,
            },
            activeMonth: {
                type: Date,
                required: true,
            },
            weekStart: {
                type: Number,
                required: true,
            },
            getElementCssClass: {
                type: Function,
                required: true,
            },
            parse: {
                type: Function,
                required: true,
            },
            format: {
                type: Function,
                required: true,
            },
            formatNative: {
                type: Function,
                required: true,
            },
            userFormat: {
                type: String,
                required: true,
            },
            dateFormat: {
                type: String,
                required: true,
            },
            showDaysForOtherMonth: {
                type: Boolean,
                required: true,
            },
            showActiveDate: {
                type: Boolean,
                required: true,
            },
            disabledDates: {
                type: [Date, Array, Function, String],
                default: undefined,
            },
            highlightDates: {
                type: [Date, Array, Function, String],
                default: undefined,
            },
            maxDate: {
                type: [Date, String],
                default: undefined,
            },
            minDate: {
                type: [Date, String],
                default: undefined,
            },
            range: {
                type: Boolean,
                required: true,
            },
            timepicker: {
                type: Boolean,
                required: true,
            },
            dateWithoutTime: {
                type: Date,
                default: null,
            },
        },
        data() {
            return {
                localActiveDate: new Date(this.activeDate.valueOf()),
                localActiveMonth: new Date(this.activeMonth.valueOf()),
            };
        },
        computed: {
            firstDayOfMonth() {
                const localActiveDate = new Date(this.localActiveMonth.valueOf());
                localActiveDate.setDate(1);
                return localActiveDate;
            },
            lastDayOfMonth() {
                return lastDayOfMonth(this.localActiveMonth);
            },
            firstDayOfPrevMonth() {
                return new Date(this.localActiveMonth.getFullYear(), this.localActiveMonth.getMonth() - 1, 1);
            },
            lastDayOfPrevMonth() {
                const localActiveDate = new Date(this.localActiveMonth.valueOf());
                localActiveDate.setDate(0);
                return localActiveDate;
            },
            firstDayOfNextMonth() {
                const localActiveDate = new Date(this.localActiveMonth.valueOf());
                localActiveDate.setDate(1);
                localActiveDate.setMonth(this.localActiveMonth.getMonth() + 1);
                return localActiveDate;
            },
            monthDays() {
                return Array
                    .from({ length: this.lastDayOfMonth.getDate() }, (_x, i) => i + 1)
                    .map((day) => this.getDay(this.localActiveMonth, day));
            },
            prevMonthDays() {
                let prevMonthTotalDays = this.firstDayOfMonth.getDay() - this.weekStart;
                if (prevMonthTotalDays < 0) {
                    prevMonthTotalDays = 7 + prevMonthTotalDays;
                }
                return Array.from({ length: prevMonthTotalDays }, (_x, i) => this.lastDayOfPrevMonth.getDate() - i)
                    .reverse()
                    .map((day) => this.getDay(this.firstDayOfPrevMonth, day));
            },
            nextMonthDays() {
                const nextMonthTotalDays = 7 - (this.monthDays.concat(this.prevMonthDays).length % 7);
                if (nextMonthTotalDays === 7) {
                    return [];
                }
                return Array.from({ length: nextMonthTotalDays }, (_x, i) => i + 1)
                    .map((day) => this.getDay(this.firstDayOfNextMonth, day));
            },
            days() {
                const { prevMonthDays } = this;
                const { monthDays } = this;
                const { nextMonthDays } = this;
                return prevMonthDays.concat(monthDays, nextMonthDays);
            },
        },
        watch: {
            activeDate(activeDate) {
                this.localActiveDate = new Date(activeDate.valueOf());
            },
            activeMonth(activeMonth) {
                this.localActiveMonth = new Date(activeMonth.valueOf());
            },
        },
        methods: {
            getDay(date, dayNumber) {
                const day = new Date(date.valueOf());
                day.setDate(dayNumber);
                return day;
            },
        },
        render(createElement) {
            return createElement('div', {
                class: this.getElementCssClass('calendarDaysWrapper'),
            }, this.days.map((day) => createElement('span', {
                class: this.getElementCssClass('calendarDaysDayWrapper'),
            }, [
                createElement(TDatepickerViewsViewCalendarDaysDay, {
                    props: {
                        day,
                        value: this.value,
                        activeDate: this.localActiveDate,
                        activeMonth: this.localActiveMonth,
                        getElementCssClass: this.getElementCssClass,
                        parse: this.parse,
                        format: this.format,
                        formatNative: this.formatNative,
                        dateFormat: this.dateFormat,
                        userFormat: this.userFormat,
                        showDaysForOtherMonth: this.showDaysForOtherMonth,
                        showActiveDate: this.showActiveDate,
                        disabledDates: this.disabledDates,
                        highlightDates: this.highlightDates,
                        minDate: this.minDate,
                        maxDate: this.maxDate,
                        range: this.range,
                        dateWithoutTime: this.dateWithoutTime,
                    },
                    scopedSlots: this.$scopedSlots,
                    on: {
                        click: () => {
                            if (this.timepicker) {
                                this.$emit('input-date', day);
                            }
                            else {
                                this.$emit('input', day);
                            }
                        },
                    },
                })
            ])));
        },
    });

    const TDatepickerViewsViewCalendarHeaders = Vue.extend({
        name: 'TDatepickerViewsViewCalendarHeaders',
        props: {
            weekStart: {
                type: Number,
                required: true,
            },
            getElementCssClass: {
                type: Function,
                required: true,
            },
            formatNative: {
                type: Function,
                required: true,
            },
        },
        computed: {
            weekDays() {
                return Array.from({ length: 7 }, (_x, i) => {
                    const weekDay = this.weekStart + i;
                    if (weekDay >= 7) {
                        return weekDay - 7;
                    }
                    return weekDay;
                }).map(this.getWeekDayName);
            },
        },
        methods: {
            getWeekDayName(weekDay) {
                const date = new Date();
                date.setDate((date.getDate() + (7 + weekDay - date.getDay())) % 7);
                return this.formatNative(date, 'D');
            },
        },
        render(createElement) {
            return createElement('div', {
                class: this.getElementCssClass('calendarHeaderWrapper'),
            }, this.weekDays.map((weekDayName) => createElement('span', {
                class: this.getElementCssClass('calendarHeaderWeekDay'),
            }, weekDayName)));
        },
    });

    const TDatepickerViewsViewCalendar = Vue.extend({
        name: 'TDatepickerViewsViewCalendar',
        props: {
            value: {
                type: [Date, Array],
                default: null,
            },
            activeDate: {
                type: Date,
                required: true,
            },
            activeMonth: {
                type: Date,
                required: true,
            },
            weekStart: {
                type: Number,
                required: true,
            },
            getElementCssClass: {
                type: Function,
                required: true,
            },
            parse: {
                type: Function,
                required: true,
            },
            format: {
                type: Function,
                required: true,
            },
            formatNative: {
                type: Function,
                required: true,
            },
            dateFormat: {
                type: String,
                required: true,
            },
            userFormat: {
                type: String,
                required: true,
            },
            monthsPerView: {
                type: Number,
                required: true,
            },
            showActiveDate: {
                type: Boolean,
                required: true,
            },
            disabledDates: {
                type: [Date, Array, Function, String],
                default: undefined,
            },
            highlightDates: {
                type: [Date, Array, Function, String],
                default: undefined,
            },
            maxDate: {
                type: [Date, String],
                default: undefined,
            },
            minDate: {
                type: [Date, String],
                default: undefined,
            },
            range: {
                type: Boolean,
                required: true,
            },
            showDaysForOtherMonth: {
                type: Boolean,
                required: true,
            },
            timepicker: {
                type: Boolean,
                required: true,
            },
            dateWithoutTime: {
                type: Date,
                default: null,
            },
        },
        data() {
            return {
                localActiveDate: new Date(this.activeDate.valueOf()),
                localActiveMonth: new Date(this.activeMonth.valueOf()),
            };
        },
        watch: {
            activeDate(activeDate) {
                this.localActiveDate = new Date(activeDate.valueOf());
            },
            activeMonth(activeMonth) {
                this.localActiveMonth = new Date(activeMonth.valueOf());
            },
        },
        render(createElement) {
            return createElement('div', {
                class: this.getElementCssClass('calendarWrapper'),
            }, [
                createElement(TDatepickerViewsViewCalendarHeaders, {
                    props: {
                        weekStart: this.weekStart,
                        getElementCssClass: this.getElementCssClass,
                        formatNative: this.formatNative,
                    },
                }),
                createElement(TDatepickerViewsViewCalendarDays, {
                    ref: 'days',
                    props: {
                        value: this.value,
                        activeDate: this.localActiveDate,
                        activeMonth: this.localActiveMonth,
                        weekStart: this.weekStart,
                        getElementCssClass: this.getElementCssClass,
                        parse: this.parse,
                        format: this.format,
                        formatNative: this.formatNative,
                        userFormat: this.userFormat,
                        dateFormat: this.dateFormat,
                        showDaysForOtherMonth: this.monthsPerView > 1 ? false : this.showDaysForOtherMonth,
                        showActiveDate: this.showActiveDate,
                        disabledDates: this.disabledDates,
                        highlightDates: this.highlightDates,
                        minDate: this.minDate,
                        maxDate: this.maxDate,
                        range: this.range,
                        timepicker: this.timepicker,
                        dateWithoutTime: this.dateWithoutTime,
                    },
                    scopedSlots: this.$scopedSlots,
                    on: {
                        input: (date) => this.$emit('input', date),
                        'input-date': (date) => this.$emit('input-date', date),
                    },
                }),
            ]);
        },
    });

    const TDatepickerViewsViewMonthsMonth = Vue.extend({
        name: 'TDatepickerViewsViewMonthsMonth',
        props: {
            month: {
                type: Date,
                required: true,
            },
            value: {
                type: [Date, Array],
                default: null,
            },
            activeDate: {
                type: Date,
                required: true,
            },
            getElementCssClass: {
                type: Function,
                required: true,
            },
            formatNative: {
                type: Function,
                required: true,
            },
            showActiveDate: {
                type: Boolean,
                required: true,
            },
        },
        computed: {
            isSelected() {
                const d1 = this.getMonth();
                const d2 = this.value;
                if (d2 instanceof Date) {
                    return isSameMonth(d1, d2);
                }
                if (Array.isArray(d2)) {
                    return d2.some((d) => isSameMonth(d, d1));
                }
                return false;
            },
            isActive() {
                const d1 = this.getMonth();
                const d2 = this.activeDate;
                return isSameMonth(d1, d2);
            },
            monthFormatted() {
                return this.formatNative(this.getMonth(), 'M');
            },
        },
        methods: {
            getClass() {
                if (this.isSelected) {
                    return this.getElementCssClass('selectedMonth');
                }
                if (this.isActive && this.showActiveDate) {
                    return this.getElementCssClass('activeMonth');
                }
                return this.getElementCssClass('month');
            },
            getMonth() {
                return this.month;
            },
        },
        render(createElement) {
            const monthSlot = this.$scopedSlots.month
                ? this.$scopedSlots.month({
                    monthFormatted: this.monthFormatted,
                    isSelected: this.isSelected,
                    isActive: this.isActive,
                    month: this.getMonth(),
                    activeDate: this.activeDate,
                    value: this.value,
                }) : this.monthFormatted;
            return createElement('button', {
                class: this.getClass(),
                attrs: {
                    'aria-label': this.formatNative(this.getMonth(), 'F, Y'),
                    'data-date': this.formatNative(this.getMonth(), 'Y-m'),
                    type: 'button',
                    tabindex: -1,
                },
                on: {
                    click: (e) => this.$emit('click', e),
                },
            }, monthSlot);
        },
    });

    const TDatepickerViewsViewMonths = Vue.extend({
        name: 'TDatepickerViewsViewMonths',
        props: {
            value: {
                type: [Date, Array],
                default: null,
            },
            activeDate: {
                type: Date,
                required: true,
            },
            getElementCssClass: {
                type: Function,
                required: true,
            },
            showActiveDate: {
                type: Boolean,
                required: true,
            },
            formatNative: {
                type: Function,
                required: true,
            },
        },
        data() {
            return {
                localActiveDate: new Date(this.activeDate.valueOf()),
            };
        },
        computed: {
            months() {
                return Array
                    .from({ length: 12 }, (_x, i) => i)
                    .map((monthNumber) => this.getMonth(monthNumber));
            },
        },
        watch: {
            activeDate(activeDate) {
                this.localActiveDate = new Date(activeDate.valueOf());
            },
        },
        methods: {
            getMonth(monthNumber) {
                let newDate = new Date(this.localActiveDate.valueOf());
                newDate.setMonth(monthNumber);
                // Means the current day has less days so the extra month is
                // in the following month
                if (newDate.getDate() !== this.localActiveDate.getDate()) {
                    // Assign the last day of previous month
                    newDate = new Date(newDate.getFullYear(), newDate.getMonth(), 0);
                }
                return newDate;
            },
        },
        render(createElement) {
            return createElement('div', {
                class: this.getElementCssClass('monthWrapper'),
            }, this.months.map((month) => createElement(TDatepickerViewsViewMonthsMonth, {
                props: {
                    month,
                    value: this.value,
                    activeDate: this.localActiveDate,
                    getElementCssClass: this.getElementCssClass,
                    showActiveDate: this.showActiveDate,
                    formatNative: this.formatNative,
                },
                scopedSlots: this.$scopedSlots,
                on: {
                    click: () => this.$emit('input', month),
                },
            })));
        },
    });

    const TDatepickerViewsViewYearsYear = Vue.extend({
        name: 'TDatepickerViewsViewYearsYear',
        props: {
            year: {
                type: Date,
                required: true,
            },
            activeDate: {
                type: Date,
                required: true,
            },
            value: {
                type: [Date, Array],
                default: null,
            },
            getElementCssClass: {
                type: Function,
                required: true,
            },
            showActiveDate: {
                type: Boolean,
                required: true,
            },
            formatNative: {
                type: Function,
                required: true,
            },
        },
        data() {
            return {
                localActiveDate: new Date(this.activeDate.valueOf()),
            };
        },
        computed: {
            isSelected() {
                const d1 = this.getYear();
                const d2 = this.value;
                if (d2 instanceof Date) {
                    return d1.getFullYear() === d2.getFullYear();
                }
                if (Array.isArray(d2)) {
                    return d2.some((d) => d.getFullYear() === d1.getFullYear());
                }
                return false;
            },
            isActive() {
                const d1 = this.getYear();
                const d2 = this.activeDate;
                return d2 && d1.getFullYear() === d2.getFullYear();
            },
            yearFormatted() {
                return this.formatNative(this.getYear(), 'Y');
            },
        },
        watch: {
            activeDate(activeDate) {
                this.localActiveDate = new Date(activeDate.valueOf());
            },
        },
        methods: {
            getClass() {
                if (this.isSelected) {
                    return this.getElementCssClass('selectedYear');
                }
                if (this.isActive && this.showActiveDate) {
                    return this.getElementCssClass('activeYear');
                }
                return this.getElementCssClass('year');
            },
            getYear() {
                return this.year;
            },
        },
        render(createElement) {
            const yearSlot = this.$scopedSlots.year
                ? this.$scopedSlots.year({
                    yearFormatted: this.yearFormatted,
                    isSelected: this.isSelected,
                    isActive: this.isActive,
                    year: this.getYear(),
                    activeDate: this.activeDate,
                    value: this.value,
                }) : this.yearFormatted;
            return createElement('button', {
                class: this.getClass(),
                attrs: {
                    'aria-label': this.yearFormatted,
                    'data-date': this.yearFormatted,
                    type: 'button',
                    tabindex: -1,
                },
                on: {
                    click: (e) => this.$emit('click', e),
                },
            }, yearSlot);
        },
    });

    const TDatepickerViewsViewYears = Vue.extend({
        name: 'TDatepickerViewsViewYears',
        props: {
            value: {
                type: [Date, Array],
                default: null,
            },
            activeDate: {
                type: Date,
                required: true,
            },
            getElementCssClass: {
                type: Function,
                required: true,
            },
            yearsPerView: {
                type: Number,
                required: true,
            },
            showActiveDate: {
                type: Boolean,
                required: true,
            },
            formatNative: {
                type: Function,
                required: true,
            },
        },
        data() {
            return {
                localActiveDate: new Date(this.activeDate.valueOf()),
            };
        },
        computed: {
            years() {
                const [initialYear] = getYearsRange(this.localActiveDate, this.yearsPerView);
                return Array
                    .from({ length: this.yearsPerView }, (_x, i) => i)
                    .map((year) => this.getYear(initialYear + year));
            },
        },
        watch: {
            activeDate(activeDate) {
                this.localActiveDate = new Date(activeDate.valueOf());
            },
        },
        methods: {
            getYear(year) {
                let newDate = new Date(this.localActiveDate.valueOf());
                newDate.setFullYear(year);
                // Means the current day has less days so the extra month is
                // in the following month
                if (newDate.getDate() !== this.localActiveDate.getDate()) {
                    // Assign the last day of previous month
                    newDate = new Date(newDate.getFullYear(), newDate.getMonth(), 0);
                }
                return newDate;
            },
        },
        render(createElement) {
            return createElement('div', {
                class: this.getElementCssClass('yearWrapper'),
            }, this.years.map((year) => createElement(TDatepickerViewsViewYearsYear, {
                props: {
                    year,
                    activeDate: this.localActiveDate,
                    value: this.value,
                    getElementCssClass: this.getElementCssClass,
                    showActiveDate: this.showActiveDate,
                    formatNative: this.formatNative,
                },
                scopedSlots: this.$scopedSlots,
                on: {
                    click: () => this.$emit('input', year),
                },
            })));
        },
    });

    const TDatepickerViewsView = Vue.extend({
        name: 'TDatepickerViewsView',
        props: {
            value: {
                type: [Date, Array],
                default: null,
            },
            activeMonth: {
                type: Date,
                required: true,
            },
            activeDate: {
                type: Date,
                required: true,
            },
            weekStart: {
                type: Number,
                required: true,
            },
            lang: {
                type: String,
                required: true,
            },
            getElementCssClass: {
                type: Function,
                required: true,
            },
            formatNative: {
                type: Function,
                required: true,
            },
            parse: {
                type: Function,
                required: true,
            },
            format: {
                type: Function,
                required: true,
            },
            userFormat: {
                type: String,
                required: true,
            },
            dateFormat: {
                type: String,
                required: true,
            },
            monthsPerView: {
                type: Number,
                required: true,
            },
            monthIndex: {
                type: Number,
                required: true,
            },
            currentView: {
                type: String,
                required: true,
            },
            yearsPerView: {
                type: Number,
                required: true,
            },
            showActiveDate: {
                type: Boolean,
                required: true,
            },
            showDaysForOtherMonth: {
                type: Boolean,
                required: true,
            },
            disabledDates: {
                type: [Date, Array, Function, String],
                default: undefined,
            },
            highlightDates: {
                type: [Date, Array, Function, String],
                default: undefined,
            },
            maxDate: {
                type: [Date, String],
                default: undefined,
            },
            minDate: {
                type: [Date, String],
                default: undefined,
            },
            range: {
                type: Boolean,
                required: true,
            },
            locale: {
                type: Object,
                required: true,
            },
            timepicker: {
                type: Boolean,
                required: true,
            },
            dateWithoutTime: {
                type: Date,
                default: null,
            },
        },
        data() {
            return {
                localActiveDate: new Date(this.activeDate.valueOf()),
                localActiveMonth: new Date(this.activeMonth.valueOf()),
            };
        },
        computed: {
            isFirstMonth() {
                return this.monthIndex === 0;
            },
            isLastMonth() {
                return this.monthIndex === this.monthsPerView - 1;
            },
            showMonthName() {
                return this.monthsPerView > 1;
            },
        },
        watch: {
            activeDate(activeDate) {
                this.localActiveDate = new Date(activeDate.valueOf());
            },
            activeMonth(activeMonth) {
                this.localActiveMonth = new Date(activeMonth.valueOf());
            },
        },
        methods: {
            inputHandler(date) {
                this.resetView();
                this.$emit('input', date);
            },
            inputDateHandler(date) {
                this.$emit('input-date', date);
            },
            viewInputActiveDateHandler(date) {
                this.resetView();
                this.inputActiveDateHandler(date);
            },
            inputActiveDateHandler(date) {
                this.$emit('input-active-date', date);
                this.resetFocus();
            },
            resetFocus() {
                this.$emit('reset-focus');
            },
            resetView() {
                this.$emit('reset-view');
            },
        },
        render(createElement) {
            const subElements = [];
            subElements.push(createElement(TDatepickerNavigator, {
                ref: 'navigator',
                props: {
                    value: this.localActiveMonth,
                    getElementCssClass: this.getElementCssClass,
                    showSelector: this.isFirstMonth,
                    currentView: this.currentView,
                    parse: this.parse,
                    formatNative: this.formatNative,
                    dateFormat: this.dateFormat,
                    yearsPerView: this.yearsPerView,
                    minDate: this.minDate,
                    maxDate: this.maxDate,
                    locale: this.locale,
                },
                on: {
                    input: this.inputActiveDateHandler,
                    'update-view': (newView) => {
                        this.$emit('update-view', newView);
                    },
                },
            }));
            if (this.currentView === CalendarView.Day) {
                subElements.push(createElement(TDatepickerViewsViewCalendar, {
                    ref: 'calendar',
                    props: {
                        value: this.value,
                        activeMonth: this.localActiveMonth,
                        activeDate: this.localActiveDate,
                        weekStart: this.weekStart,
                        getElementCssClass: this.getElementCssClass,
                        showDaysForOtherMonth: this.showDaysForOtherMonth,
                        parse: this.parse,
                        format: this.format,
                        formatNative: this.formatNative,
                        dateFormat: this.dateFormat,
                        userFormat: this.userFormat,
                        monthsPerView: this.monthsPerView,
                        showActiveDate: this.showActiveDate,
                        disabledDates: this.disabledDates,
                        highlightDates: this.highlightDates,
                        minDate: this.minDate,
                        maxDate: this.maxDate,
                        range: this.range,
                        timepicker: this.timepicker,
                        dateWithoutTime: this.dateWithoutTime,
                    },
                    scopedSlots: this.$scopedSlots,
                    on: {
                        input: this.inputHandler,
                        'input-date': this.inputDateHandler,
                    },
                }));
            }
            else if (this.currentView === CalendarView.Month) {
                subElements.push(createElement(TDatepickerViewsViewMonths, {
                    ref: 'months',
                    props: {
                        value: this.value,
                        activeDate: this.localActiveDate,
                        getElementCssClass: this.getElementCssClass,
                        showActiveDate: this.showActiveDate,
                        formatNative: this.formatNative,
                    },
                    scopedSlots: this.$scopedSlots,
                    on: {
                        input: this.viewInputActiveDateHandler,
                    },
                }));
            }
            else if (this.currentView === CalendarView.Year) {
                subElements.push(createElement(TDatepickerViewsViewYears, {
                    ref: 'years',
                    props: {
                        value: this.value,
                        activeDate: this.localActiveDate,
                        getElementCssClass: this.getElementCssClass,
                        yearsPerView: this.yearsPerView,
                        showActiveDate: this.showActiveDate,
                        formatNative: this.formatNative,
                    },
                    scopedSlots: this.$scopedSlots,
                    on: {
                        input: this.viewInputActiveDateHandler,
                    },
                }));
            }
            return createElement('div', {
                class: this.getElementCssClass('view'),
            }, subElements);
        },
    });

    const TDatepickerViews = Vue.extend({
        name: 'TDatepickerViews',
        props: {
            value: {
                type: [Date, Array],
                default: null,
            },
            activeDate: {
                type: Date,
                required: true,
            },
            weekStart: {
                type: Number,
                required: true,
            },
            monthsPerView: {
                type: Number,
                required: true,
            },
            lang: {
                type: String,
                required: true,
            },
            getElementCssClass: {
                type: Function,
                required: true,
            },
            parse: {
                type: Function,
                required: true,
            },
            format: {
                type: Function,
                required: true,
            },
            formatNative: {
                type: Function,
                required: true,
            },
            dateFormat: {
                type: String,
                required: true,
            },
            userFormat: {
                type: String,
                required: true,
            },
            initialView: {
                type: String,
                required: true,
            },
            currentView: {
                type: String,
                required: true,
            },
            yearsPerView: {
                type: Number,
                required: true,
            },
            showActiveDate: {
                type: Boolean,
                required: true,
            },
            showDaysForOtherMonth: {
                type: Boolean,
                required: true,
            },
            disabledDates: {
                type: [Date, Array, Function, String],
                default: undefined,
            },
            highlightDates: {
                type: [Date, Array, Function, String],
                default: undefined,
            },
            maxDate: {
                type: [Date, String],
                default: undefined,
            },
            minDate: {
                type: [Date, String],
                default: undefined,
            },
            range: {
                type: Boolean,
                required: true,
            },
            locale: {
                type: Object,
                required: true,
            },
            timepicker: {
                type: Boolean,
                required: true,
            },
            dateWithoutTime: {
                type: Date,
                default: null,
            },
        },
        data() {
            return {
                localActiveDate: new Date(this.activeDate.valueOf()),
            };
        },
        computed: {
            activeMonths() {
                return Array
                    .from({ length: this.monthsPerView }, (_x, i) => i)
                    .map((i) => addMonths(this.localActiveDate, i));
            },
        },
        watch: {
            activeDate(activeDate) {
                this.localActiveDate = new Date(activeDate.valueOf());
            },
        },
        render(createElement) {
            const subElements = this.activeMonths.map((activeMonth, index) => createElement(TDatepickerViewsView, {
                ref: 'view',
                props: {
                    value: this.value,
                    activeMonth,
                    activeDate: this.localActiveDate,
                    weekStart: this.weekStart,
                    lang: this.lang,
                    getElementCssClass: this.getElementCssClass,
                    parse: this.parse,
                    format: this.format,
                    dateFormat: this.dateFormat,
                    userFormat: this.userFormat,
                    formatNative: this.formatNative,
                    monthsPerView: this.monthsPerView,
                    monthIndex: index,
                    currentView: index === 0 ? this.currentView : this.initialView,
                    yearsPerView: this.yearsPerView,
                    showActiveDate: this.showActiveDate,
                    disabledDates: this.disabledDates,
                    highlightDates: this.highlightDates,
                    minDate: this.minDate,
                    maxDate: this.maxDate,
                    range: this.range,
                    showDaysForOtherMonth: this.showDaysForOtherMonth,
                    locale: this.locale,
                    timepicker: this.timepicker,
                    dateWithoutTime: this.dateWithoutTime,
                },
                scopedSlots: this.$scopedSlots,
                on: {
                    input: (date) => {
                        this.$emit('input', date);
                    },
                    'input-date': (date) => {
                        this.$emit('input-date', date);
                    },
                    'input-time': (date) => {
                        this.$emit('input-time', date);
                    },
                    'input-active-date': (date) => {
                        this.$emit('input-active-date', date);
                    },
                    'update-view': (newView) => {
                        this.$emit('update-view', newView);
                    },
                    'reset-view': () => {
                        this.$emit('reset-view');
                    },
                    'reset-focus': () => {
                        this.$emit('reset-focus');
                    },
                },
            }));
            return createElement('div', {
                class: this.getElementCssClass('viewGroup'),
            }, subElements);
        },
    });

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

    const isNumeric = (char) => /^\d+$/.test(String(char));

    const TDatepickerTimeSelector = Vue.extend({
        name: 'TDatepickerTimeSelector',
        props: {
            parse: {
                type: Function,
                required: true,
            },
            format: {
                type: Function,
                required: true,
            },
            amPm: {
                type: Boolean,
                required: true,
            },
            showSeconds: {
                type: Boolean,
                required: true,
            },
            activeDate: {
                type: Date,
                required: true,
            },
            locale: {
                type: Object,
                required: true,
            },
            getElementCssClass: {
                type: Function,
                required: true,
            },
        },
        data() {
            return {
                localActiveDate: new Date(this.activeDate.valueOf()),
                alreadyTriedAnInvalidValue: false,
                lastValidValue: '',
                timeInputKeys: [],
            };
        },
        computed: {
            amPmFormatted() {
                if (!this.amPm) {
                    return null;
                }
                return this.format(this.localActiveDate, 'K');
            },
            minutesFormatted() {
                return this.format(this.localActiveDate, 'i');
            },
            hoursFormatted() {
                if (this.amPm) {
                    return this.format(this.localActiveDate, 'G');
                }
                return this.format(this.localActiveDate, 'H');
            },
            secondsFormatted() {
                return this.format(this.localActiveDate, 'S');
            },
        },
        watch: {
            timeInputKeys(timeInputKeys) {
                const numbers = timeInputKeys.join('').substr(this.showSeconds ? -6 : -4);
                const minutesInput = this.$refs.minutes;
                const hoursInput = this.$refs.hours;
                const fullTime = numbers.padStart(this.showSeconds ? 6 : 4, ' ').substr(this.showSeconds ? -6 : -4);
                if (this.showSeconds) {
                    const secondsInput = this.$refs.seconds;
                    secondsInput.value = fullTime.substr(4, 2).trim();
                    minutesInput.value = fullTime.substr(2, 2).trim();
                    hoursInput.value = fullTime.substr(0, 2).trim();
                }
                else {
                    minutesInput.value = fullTime.substr(2, 2).trim();
                    hoursInput.value = fullTime.substr(0, 2).trim();
                }
            },
            activeDate(activeDate) {
                this.localActiveDate = new Date(activeDate.valueOf());
                this.lastValidValue = '';
                this.alreadyTriedAnInvalidValue = false;
                this.timeInputKeys = [];
            },
        },
        methods: {
            handleFullTimeBlur(e) {
                this.$emit('blur', e);
                if (!this.timeInputKeys.length) {
                    return;
                }
                const numbers = this.timeInputKeys.filter((key) => isNumeric(key)).join('').substr(this.showSeconds ? -6 : -4);
                const fullTime = numbers.padStart(this.showSeconds ? 6 : 4, '0').substr(this.showSeconds ? -6 : -4);
                let time;
                if (this.showSeconds) {
                    if (this.amPm && Number(fullTime.substr(0, 2)) <= 12) {
                        const formattedIntendedTime = `${fullTime.substr(0, 2)}:${fullTime.substr(2, 2)}:${fullTime.substr(4, 2)} ${this.amPmFormatted}`;
                        time = this.parse(formattedIntendedTime, 'H:i:S K');
                    }
                    else {
                        const formattedIntendedTime = `${fullTime.substr(0, 2)}:${fullTime.substr(2, 2)}:${fullTime.substr(4, 2)}`;
                        time = this.parse(formattedIntendedTime, 'G:i:S');
                    }
                }
                else if (this.amPm && Number(fullTime.substr(0, 2)) <= 12) {
                    const formattedIntendedTime = `${fullTime.substr(0, 2)}:${fullTime.substr(2, 2)} ${this.amPmFormatted}`;
                    time = this.parse(formattedIntendedTime, 'H:i K');
                }
                else {
                    const formattedIntendedTime = `${fullTime.substr(0, 2)}:${fullTime.substr(2, 2)}`;
                    time = this.parse(formattedIntendedTime, 'G:i');
                }
                if (time instanceof Date && !Number.isNaN(time)) {
                    this.setHours(time.getHours());
                    this.setMinutes(time.getMinutes());
                    this.setSeconds(time.getSeconds());
                    this.$emit('input', this.localActiveDate);
                    this.$nextTick(() => {
                        this.updateSecondsInput();
                        this.updateMinutesInput();
                        this.updateHoursInput();
                    });
                }
                this.focusNextElementFullTimeSelector();
            },
            focusNextElementFullTimeSelector() {
                if (this.amPm) {
                    this.$refs.amPm.focus();
                }
                else {
                    this.focusOkButton();
                }
            },
            focusOkButton() {
                this.$refs.okButton.focus();
            },
            handleTimeInputFocus(e) {
                const input = e.target;
                input.focus();
                setTimeout(() => {
                    input.setSelectionRange(0, 2);
                }, 1);
            },
            handleTimeInput(e, maxValue, minValue, valueHandler) {
                const input = e.target;
                const { value } = input;
                if (value === '') {
                    return;
                }
                const numericValue = Number(value);
                const keyPressed = Number(e.data);
                if (!isNumeric(numericValue)) {
                    input.value = this.lastValidValue;
                    return;
                }
                if (numericValue > maxValue || numericValue < minValue) {
                    if (isNumeric(keyPressed)) {
                        if (this.alreadyTriedAnInvalidValue) {
                            input.value = String(keyPressed);
                            input.dispatchEvent(new Event('input'));
                            this.alreadyTriedAnInvalidValue = false;
                            return;
                        }
                        this.alreadyTriedAnInvalidValue = true;
                    }
                    input.value = this.lastValidValue;
                    return;
                }
                valueHandler(numericValue);
                this.alreadyTriedAnInvalidValue = false;
                this.lastValidValue = value;
            },
            setHours(hours) {
                const newDate = new Date(this.localActiveDate.valueOf());
                newDate.setHours(hours);
                this.localActiveDate = newDate;
            },
            setMinutes(minutes) {
                const newDate = new Date(this.localActiveDate.valueOf());
                newDate.setMinutes(minutes);
                this.localActiveDate = newDate;
            },
            setSeconds(seconds) {
                const newDate = new Date(this.localActiveDate.valueOf());
                newDate.setSeconds(seconds);
                this.localActiveDate = newDate;
            },
            updateSecondsInput() {
                if (!this.showSeconds) {
                    return;
                }
                const seconds = this.$refs.seconds;
                if (seconds) {
                    seconds.value = this.secondsFormatted;
                }
            },
            updateMinutesInput() {
                const minutes = this.$refs.minutes;
                if (minutes) {
                    minutes.value = this.minutesFormatted;
                }
            },
            updateHoursInput() {
                const hours = this.$refs.hours;
                if (hours) {
                    hours.value = this.hoursFormatted;
                }
            },
            focus() {
                const timeInput = this.$refs.timeInput;
                if (timeInput) {
                    timeInput.focus();
                }
            },
        },
        render(createElement) {
            const subElements = [];
            const label = createElement('label', {
                class: this.getElementCssClass('timepickerTimeLabel'),
            }, this.locale.timeLabel);
            const timePickerInputs = [
                createElement('input', {
                    ref: 'hours',
                    class: this.getElementCssClass('timepickerInput'),
                    domProps: {
                        value: this.hoursFormatted,
                    },
                    attrs: {
                        inputmode: 'numeric',
                        type: 'text',
                        contenteditable: false,
                    },
                    on: {
                        input: (e) => {
                            const maxHours = this.amPm ? 12 : 23;
                            const minHours = this.amPm ? 1 : 0;
                            this.handleTimeInput(e, maxHours, minHours, (hours) => {
                                if (this.amPm) {
                                    if (hours === 12) {
                                        this.setHours(this.amPmFormatted === this.locale.amPM[1] ? hours : 0);
                                    }
                                    else {
                                        this.setHours(this.amPmFormatted === this.locale.amPM[1] ? hours + 12 : hours);
                                    }
                                }
                                else {
                                    this.setHours(hours);
                                }
                            });
                        },
                        blur: (e) => {
                            this.$emit('blur', e);
                            this.$emit('input', this.localActiveDate);
                            this.$nextTick(() => {
                                this.updateHoursInput();
                            });
                        },
                        focus: (e) => {
                            this.handleTimeInputFocus(e);
                        },
                    },
                }),
                createElement('span', {
                    class: this.getElementCssClass('timepickerTimeSeparator'),
                    attrs: {
                        contenteditable: false,
                    },
                }, ':'),
                createElement('input', {
                    ref: 'minutes',
                    class: this.getElementCssClass('timepickerInput'),
                    domProps: {
                        value: this.minutesFormatted,
                    },
                    attrs: {
                        inputmode: 'numeric',
                        type: 'text',
                        contenteditable: false,
                    },
                    on: {
                        input: (e) => {
                            const maxMinutes = 59;
                            const minMinutes = 0;
                            this.handleTimeInput(e, maxMinutes, minMinutes, this.setMinutes);
                        },
                        blur: (e) => {
                            this.$emit('blur', e);
                            this.$emit('input', this.localActiveDate);
                            this.$nextTick(() => {
                                this.updateMinutesInput();
                            });
                        },
                        focus: (e) => {
                            this.handleTimeInputFocus(e);
                        },
                    },
                }),
            ];
            if (this.showSeconds) {
                timePickerInputs.push(createElement('span', {
                    class: this.getElementCssClass('timepickerTimeSeparator'),
                    attrs: {
                        contenteditable: false,
                    },
                }, ':'));
                timePickerInputs.push(createElement('input', {
                    ref: 'seconds',
                    class: this.getElementCssClass('timepickerInput'),
                    domProps: {
                        value: this.secondsFormatted,
                    },
                    attrs: {
                        inputmode: 'numeric',
                        type: 'text',
                        contenteditable: false,
                    },
                    on: {
                        input: (e) => {
                            const maxSeconds = 59;
                            const minSeconds = 0;
                            this.handleTimeInput(e, maxSeconds, minSeconds, this.setSeconds);
                        },
                        blur: (e) => {
                            this.$emit('blur', e);
                            this.$emit('input', this.localActiveDate);
                            this.$nextTick(() => {
                                this.updateSecondsInput();
                            });
                        },
                        focus: (e) => {
                            this.handleTimeInputFocus(e);
                        },
                    },
                }));
            }
            const timePickerElements = [
                createElement('div', {
                    ref: 'timeInput',
                    class: this.getElementCssClass('timepickerTimeFieldsWrapper'),
                    style: {
                        caretColor: 'transparent',
                    },
                    attrs: {
                        tabindex: 0,
                        inputmode: 'numeric',
                        contenteditable: true,
                    },
                    on: {
                        keydown: (e) => {
                            if (e.target !== this.$refs.timeInput) {
                                return;
                            }
                            e.preventDefault();
                            const { key } = e;
                            if (key === 'Enter') {
                                this.focusNextElementFullTimeSelector();
                            }
                            else if (key === 'Backspace') {
                                this.timeInputKeys.pop();
                            }
                            if (isNumeric(key)) {
                                this.timeInputKeys.push(key);
                            }
                        },
                        blur: this.handleFullTimeBlur,
                    },
                }, timePickerInputs),
            ];
            if (this.amPm) {
                timePickerElements.push(createElement(TToggle, {
                    ref: 'amPm',
                    props: {
                        model: this.amPmFormatted,
                        value: this.locale.amPM[1],
                        uncheckedValue: this.locale.amPM[0],
                        checkedPlaceholder: this.locale.amPM[0],
                        uncheckedPlaceholder: this.locale.amPM[1],
                        checkedLabel: this.locale.amPM[1],
                        uncheckedLabel: this.locale.amPM[0],
                        fixedClasses: {
                            wrapper: '',
                            wrapperChecked: '',
                            wrapperDisabled: '',
                            wrapperCheckedDisabled: '',
                            button: '',
                            buttonChecked: '',
                            checkedPlaceholder: '',
                            uncheckedPlaceholder: '',
                        },
                        classes: {
                            wrapper: this.getElementCssClass('timepickerAmPmWrapper'),
                            wrapperChecked: this.getElementCssClass('timepickerAmPmWrapperChecked'),
                            wrapperDisabled: this.getElementCssClass('timepickerAmPmWrapperDisabled'),
                            wrapperCheckedDisabled: this.getElementCssClass('timepickerAmPmWrapperCheckedDisabled'),
                            button: this.getElementCssClass('timepickerAmPmButton'),
                            buttonChecked: this.getElementCssClass('timepickerAmPmButtonChecked'),
                            checkedPlaceholder: this.getElementCssClass('timepickerAmPmCheckedPlaceholder'),
                            uncheckedPlaceholder: this.getElementCssClass('timepickerAmPmUncheckedPlaceholder'),
                        },
                    },
                    on: {
                        blur: (e) => this.$emit('blur', e),
                        input: (amOrPM) => {
                            const formattedDate = this.format(new Date(this.localActiveDate.valueOf()), 'Y-m-d G:i:S');
                            const newActiveDate = this.parse(`${formattedDate} ${amOrPM}`, 'Y-m-d G:i:S K');
                            this.$emit('input', newActiveDate);
                        },
                        keydown: (e) => {
                            const { key } = e;
                            if (key === 'Enter') {
                                this.focusOkButton();
                            }
                        },
                    },
                }));
            }
            timePickerElements.push(createElement('a', {
                ref: 'okButton',
                attrs: {
                    href: '#',
                },
                class: this.getElementCssClass('timepickerOkButton'),
                on: {
                    blur: (e) => this.$emit('blur', e),
                    click: (e) => {
                        e.preventDefault();
                        this.$emit('submit', this.localActiveDate);
                    },
                },
            }, this.locale.okLabel));
            const timePickerWrapper = createElement('div', {
                class: this.getElementCssClass('timepickerTimeWrapper'),
            }, timePickerElements);
            subElements.push(label);
            subElements.push(timePickerWrapper);
            return createElement('div', {
                class: this.getElementCssClass('timepickerWrapper'),
            }, subElements);
        },
    });

    const getInitialActiveDate = (localValue, initialDate, dateFormat, parse, amPm, initialTime) => {
        if (Array.isArray(localValue) && localValue.length) {
            return localValue[localValue.length - 1];
        }
        if (localValue instanceof Date) {
            return localValue;
        }
        const activeDate = parse(initialDate, dateFormat) || new Date();
        if (initialTime) {
            const parsedDateWithTime = parse(initialTime, amPm ? 'G:i:S K' : 'H:i:S');
            if (parsedDateWithTime) {
                activeDate.setHours(parsedDateWithTime.getHours());
                activeDate.setMinutes(parsedDateWithTime.getMinutes());
                activeDate.setSeconds(parsedDateWithTime.getSeconds());
            }
        }
        return activeDate;
    };
    const TDatepicker = HtmlInput.extend({
        name: 'TDatepicker',
        props: {
            value: {
                type: [Date, String, Number, Array],
                default: null,
            },
            placeholder: {
                type: String,
                default: undefined,
            },
            inputName: {
                type: String,
                default: undefined,
            },
            weekStart: {
                type: Number,
                default: 0,
            },
            monthsPerView: {
                type: Number,
                default: 1,
                validator(value) {
                    return value >= 1;
                },
            },
            lang: {
                type: String,
                default: 'en',
            },
            locale: {
                type: Object,
                default: () => English,
            },
            locales: {
                type: Object,
                default: () => ({}),
            },
            dateFormat: {
                type: String,
                default: 'Y-m-d',
            },
            userFormat: {
                type: String,
                default: 'F j, Y',
            },
            dateFormatter: {
                type: Function,
                default: undefined,
            },
            dateParser: {
                type: Function,
                default: undefined,
            },
            closeOnSelect: {
                type: Boolean,
                default: true,
            },
            showDaysForOtherMonth: {
                type: Boolean,
                default: true,
            },
            show: {
                type: Boolean,
                default: false,
            },
            inline: {
                type: Boolean,
                default: false,
            },
            initialView: {
                type: String,
                default: CalendarView.Day,
                validator(value) {
                    return [CalendarView.Day, CalendarView.Month, CalendarView.Year].includes(value);
                },
            },
            yearsPerView: {
                type: Number,
                default: 12,
            },
            disabledDates: {
                type: [Date, Array, Function, String],
                default: undefined,
            },
            highlightDates: {
                type: [Date, Array, Function, String],
                default: undefined,
            },
            maxDate: {
                type: [Date, String],
                default: undefined,
            },
            minDate: {
                type: [Date, String],
                default: undefined,
            },
            initialDate: {
                type: [Date, String],
                default: undefined,
            },
            initialTime: {
                type: String,
                default: undefined,
            },
            conjunction: {
                type: String,
                default: ',',
            },
            multiple: {
                type: Boolean,
                default: false,
            },
            range: {
                type: Boolean,
                default: false,
            },
            clearable: {
                type: Boolean,
                default: true,
            },
            datepicker: {
                type: Boolean,
                default: true,
            },
            timepicker: {
                type: Boolean,
                default: false,
            },
            amPm: {
                type: Boolean,
                default: false,
            },
            showSeconds: {
                type: Boolean,
                default: false,
            },
            classes: {
                type: Object,
                default: () => ({
                    wrapper: 'flex flex-col',
                    dropdownWrapper: 'relative z-10',
                    // Dropdown related classes
                    dropdown: 'origin-top-left absolute rounded shadow bg-white overflow-hidden mt-1',
                    enterClass: 'opacity-0 scale-95',
                    enterActiveClass: 'transition transform ease-out duration-100',
                    enterToClass: 'opacity-100 scale-100',
                    leaveClass: 'opacity-100 scale-100',
                    leaveActiveClass: 'transition transform ease-in duration-75',
                    leaveToClass: 'opacity-0 scale-95',
                    // Wrapper for inline calendar
                    inlineWrapper: '',
                    inlineViews: 'rounded bg-white border mt-1 inline-flex flex-col',
                    // Text input related classes
                    inputWrapper: '',
                    input: 'block w-full px-3 py-2 text-black placeholder-gray-400 transition duration-100 ease-in-out bg-white border border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed',
                    clearButton: 'hover:bg-gray-100 rounded transition duration-100 ease-in-out text-gray-600',
                    clearButtonIcon: '',
                    // Picker views
                    viewGroup: '',
                    view: '',
                    // Navigator
                    navigator: 'pt-2 px-3',
                    navigatorViewButton: 'transition ease-in-out duration-100 inline-flex cursor-pointer rounded-full px-2 py-1 -ml-1 hover:bg-gray-100',
                    navigatorViewButtonIcon: 'fill-current text-gray-400',
                    navigatorViewButtonBackIcon: 'fill-current text-gray-400',
                    navigatorViewButtonMonth: 'text-gray-700 font-semibold',
                    navigatorViewButtonYear: 'text-gray-500 ml-1',
                    navigatorViewButtonYearRange: 'text-gray-500 ml-1',
                    navigatorLabel: 'py-1',
                    navigatorLabelMonth: 'text-gray-700 font-semibold',
                    navigatorLabelYear: 'text-gray-500 ml-1',
                    navigatorPrevButton: 'transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-100 rounded-full p-1 ml-2 ml-auto disabled:opacity-50 disabled:cursor-not-allowed',
                    navigatorNextButton: 'transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-100 rounded-full p-1 -mr-1 disabled:opacity-50 disabled:cursor-not-allowed',
                    navigatorPrevButtonIcon: 'text-gray-400',
                    navigatorNextButtonIcon: 'text-gray-400',
                    // Calendar View
                    calendarWrapper: 'px-3 py-2',
                    calendarHeaderWrapper: '',
                    calendarHeaderWeekDay: 'uppercase text-xs text-gray-500 w-8 h-8 flex items-center justify-center',
                    calendarDaysWrapper: '',
                    calendarDaysDayWrapper: 'w-full h-8 flex flex-shrink-0 items-center',
                    // Day item
                    otherMonthDay: 'text-sm rounded-full w-8 h-8 mx-auto hover:bg-blue-100 text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed',
                    emptyDay: '',
                    inRangeFirstDay: 'text-sm bg-blue-500 text-white w-full h-8 rounded-l-full',
                    inRangeLastDay: 'text-sm bg-blue-500 text-white w-full h-8 rounded-r-full',
                    inRangeDay: 'text-sm bg-blue-200 w-full h-8 disabled:opacity-50 disabled:cursor-not-allowed',
                    selectedDay: 'text-sm rounded-full w-8 h-8 mx-auto bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed',
                    activeDay: 'text-sm rounded-full bg-blue-100 w-8 h-8 mx-auto disabled:opacity-50 disabled:cursor-not-allowed',
                    highlightedDay: 'text-sm rounded-full bg-blue-200 w-8 h-8 mx-auto disabled:opacity-50 disabled:cursor-not-allowed',
                    day: 'text-sm rounded-full w-8 h-8 mx-auto hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed',
                    today: 'text-sm rounded-full w-8 h-8 mx-auto hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500',
                    // Months View
                    monthWrapper: 'px-3 py-2',
                    selectedMonth: 'text-sm rounded w-full h-12 mx-auto bg-blue-500 text-white',
                    activeMonth: 'text-sm rounded w-full h-12 mx-auto bg-blue-100',
                    month: 'text-sm rounded w-full h-12 mx-auto hover:bg-blue-100',
                    // Years View
                    yearWrapper: 'px-3 py-2',
                    year: 'text-sm rounded w-full h-12 mx-auto hover:bg-blue-100',
                    selectedYear: 'text-sm rounded w-full h-12 mx-auto bg-blue-500 text-white',
                    activeYear: 'text-sm rounded w-full h-12 mx-auto bg-blue-100',
                    // Time selector
                    timepickerWrapper: 'flex items-center px-4 py-2 space-x-2',
                    timepickerTimeWrapper: 'flex items-center space-x-2',
                    timepickerTimeFieldsWrapper: 'bg-gray-100 rounded-md w-full text-right flex items-center border border-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
                    timepickerOkButton: 'text-blue-600 text-sm uppercase font-semibold transition duration-100 ease-in-out border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 rounded cursor-pointer',
                    timepickerInput: 'text-center w-8 border-transparent bg-transparent p-0 h-6 text-sm transition duration-100 ease-in-out border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 rounded',
                    timepickerTimeLabel: 'flex-grow text-sm text-gray-500',
                    timepickerAmPmWrapper: 'relative inline-flex flex-shrink-0 transition duration-200 ease-in-out bg-gray-100 border border-transparent rounded cursor-pointer focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
                    timepickerAmPmWrapperChecked: 'relative inline-flex flex-shrink-0 transition duration-200 ease-in-out bg-gray-100 border border-transparent rounded cursor-pointer focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
                    timepickerAmPmWrapperDisabled: 'relative inline-flex flex-shrink-0 transition duration-200 ease-in-out opacity-50 cursor-not-allowed',
                    timepickerAmPmWrapperCheckedDisabled: 'relative inline-flex flex-shrink-0 transition duration-200 ease-in-out opacity-50 cursor-not-allowed',
                    timepickerAmPmButton: 'absolute flex items-center justify-center w-6 h-6 text-xs text-gray-800 transition duration-200 ease-in-out transform translate-x-0 bg-white rounded shadow',
                    timepickerAmPmButtonChecked: 'absolute flex items-center justify-center w-6 h-6 text-xs text-gray-800 transition duration-200 ease-in-out transform translate-x-full bg-white rounded shadow',
                    timepickerAmPmCheckedPlaceholder: 'flex items-center justify-center w-6 h-6 text-xs text-gray-500 rounded-sm',
                    timepickerAmPmUncheckedPlaceholder: 'flex items-center justify-center w-6 h-6 text-xs text-gray-500 rounded-sm',
                }),
            },
            fixedClasses: {
                type: Object,
                default: () => ({
                    navigator: 'flex',
                    navigatorViewButton: 'flex items-center',
                    navigatorViewButtonIcon: 'flex-shrink-0 h-5 w-5',
                    navigatorViewButtonBackIcon: 'flex-shrink-0 h-5 w-5',
                    navigatorLabel: 'flex items-center py-1',
                    navigatorPrevButtonIcon: 'h-6 w-6 inline-flex',
                    navigatorNextButtonIcon: 'h-6 w-6 inline-flex',
                    inputWrapper: 'relative',
                    viewGroup: 'inline-flex flex-wrap',
                    view: 'w-64',
                    calendarDaysWrapper: 'grid grid-cols-7',
                    calendarHeaderWrapper: 'grid grid-cols-7',
                    monthWrapper: 'grid grid-cols-4',
                    yearWrapper: 'grid grid-cols-4',
                    clearButton: 'flex flex-shrink-0 items-center justify-center absolute right-0 top-0 m-2 h-6 w-6',
                    clearButtonIcon: 'fill-current h-3 w-3',
                }),
            },
        },
        data() {
            const currentLocale = extractLocaleFromProps(this.lang, this.locales, this.locale);
            const dateFormatter = this.dateFormatter;
            const parse = buildDateParser(currentLocale, this.dateParser);
            const format = buildDateFormatter(currentLocale, dateFormatter);
            // Keep a native formatter for the different views
            const formatNative = !dateFormatter ? format : buildDateFormatter(currentLocale);
            let localValue = this.multiple || this.range ? [] : null;
            if (Array.isArray(this.value)) {
                localValue = this.value
                    .map((value) => parse(value, this.dateFormat) || null)
                    .filter((value) => !!value);
            }
            else {
                localValue = parse(this.value, this.dateFormat) || localValue;
            }
            const formatedDate = Array.isArray(localValue)
                ? localValue.map((d) => format(d, this.dateFormat))
                : format(localValue, this.dateFormat);
            const userFormatedDate = Array.isArray(localValue)
                ? localValue.map((d) => format(d, this.userFormat))
                : format(localValue, this.userFormat);
            const activeDate = getInitialActiveDate(localValue, this.initialDate, this.dateFormat, parse, this.amPm, this.initialTime);
            // Used to show the selected month/year
            const currentView = this.initialView;
            let dateWithoutTime = null;
            if (this.timepicker) {
                dateWithoutTime = Array.isArray(localValue) ? localValue[0] : localValue;
            }
            return {
                localValue,
                formatedDate,
                userFormatedDate,
                activeDate,
                shown: this.show,
                showActiveDate: false,
                currentView,
                parse,
                format,
                formatNative,
                currentLocale,
                hasFocus: false,
                dateWithoutTime,
                timeWithoutDate: null,
            };
        },
        computed: {
            visibleRange() {
                const start = new Date(this.activeDate.valueOf());
                const end = new Date(this.activeDate.valueOf());
                start.setDate(1);
                end.setMonth(end.getMonth() + this.monthsPerView, 0);
                return [start, end];
            },
            latestDate() {
                if (Array.isArray(this.localValue)) {
                    if (this.localValue.length) {
                        return this.localValue[this.localValue.length - 1] || null;
                    }
                    return null;
                }
                return this.localValue;
            },
            currentValueIsInTheView() {
                // eslint-disable-next-line no-restricted-globals
                if (this.latestDate) {
                    const [start, end] = this.visibleRange;
                    return compareDates(end, this.latestDate) >= 0 && compareDates(this.latestDate, start) >= 0;
                }
                return true;
            },
        },
        watch: {
            shown(shown) {
                this.$emit('update:show', shown);
            },
            activeDate(activeDate) {
                this.$emit('active-change', activeDate);
            },
            formatedDate(formatedDate) {
                this.$emit('input', formatedDate);
                this.$emit('change', formatedDate);
            },
            userFormatedDate(userFormatedDate) {
                this.$emit('user-date-changed', userFormatedDate);
            },
            localValue(localValue) {
                if (this.monthsPerView === 1 || !this.currentValueIsInTheView) {
                    this.resetActiveDate(localValue);
                }
                this.refreshFormattedDate();
            },
            value(value) {
                if (Array.isArray(value)) {
                    const localValue = value
                        .map((v) => this.parse(v, this.dateFormat) || null)
                        .filter((v) => !!v);
                    if (!isEqual(localValue, this.localValue)) {
                        this.localValue = localValue;
                    }
                }
                else {
                    this.localValue = this.parse(value, this.dateFormat)
                        || (this.multiple || this.range ? [] : null);
                }
            },
            dateParser() {
                this.refreshParser();
            },
            dateFormatter() {
                this.refreshFormatter();
            },
            lang() {
                this.refreshCurrentLocale();
            },
            locale() {
                this.refreshCurrentLocale();
            },
            locales: {
                handler() {
                    this.refreshCurrentLocale();
                },
                deep: true,
            },
        },
        methods: {
            refreshFormattedDate() {
                const formatedDate = Array.isArray(this.localValue)
                    ? this.localValue.map((d) => this.format(d, this.dateFormat))
                    : this.format(this.localValue, this.dateFormat);
                const userFormatedDate = Array.isArray(this.localValue)
                    ? this.localValue.map((d) => this.format(d, this.userFormat))
                    : this.format(this.localValue, this.userFormat);
                this.formatedDate = formatedDate;
                this.userFormatedDate = userFormatedDate;
            },
            refreshCurrentLocale() {
                this.currentLocale = extractLocaleFromProps(this.lang, this.locales, this.locale);
                this.refreshParser();
                this.refreshFormatter();
                this.refreshFormattedDate();
            },
            refreshParser() {
                const parse = buildDateParser(this.currentLocale, this.dateParser);
                this.parse = parse;
            },
            refreshFormatter() {
                const dateFormatter = this.dateFormatter;
                const format = buildDateFormatter(this.currentLocale, dateFormatter);
                // Keep a native formatter for the different views
                const formatNative = !dateFormatter ? format : buildDateFormatter(this.currentLocale);
                this.format = format;
                this.formatNative = formatNative;
            },
            focus(options) {
                const wrapper = this.$el;
                const input = wrapper.querySelector('input[type=text]');
                if (!input) {
                    throw new Error('Input not found');
                }
                input.focus(options);
            },
            doHide() {
                const dropdown = this.getDropdown();
                if (dropdown) {
                    dropdown.doHide();
                }
            },
            doShow() {
                const dropdown = this.getDropdown();
                if (dropdown) {
                    dropdown.doShow();
                }
            },
            toggle() {
                const dropdown = this.getDropdown();
                if (dropdown) {
                    dropdown.doToggle();
                }
            },
            arrowKeyHandler(e) {
                e.preventDefault();
                this.showActiveDate = true;
                if (!this.inline && !this.shown) {
                    this.doShow();
                    return;
                }
                let newActiveDate;
                if (this.currentView === CalendarView.Day) {
                    if (e.keyCode === Key$1.DOWN) {
                        newActiveDate = addDays(this.activeDate, 7);
                    }
                    else if (e.keyCode === Key$1.LEFT) {
                        newActiveDate = addDays(this.activeDate, -1);
                    }
                    else if (e.keyCode === Key$1.UP) {
                        newActiveDate = addDays(this.activeDate, -7);
                    }
                    else if (e.keyCode === Key$1.RIGHT) {
                        newActiveDate = addDays(this.activeDate, 1);
                    }
                }
                else if (this.currentView === CalendarView.Month) {
                    if (e.keyCode === Key$1.DOWN) {
                        newActiveDate = addMonths(this.activeDate, 4);
                    }
                    else if (e.keyCode === Key$1.LEFT) {
                        newActiveDate = addMonths(this.activeDate, -1);
                    }
                    else if (e.keyCode === Key$1.UP) {
                        newActiveDate = addMonths(this.activeDate, -4);
                    }
                    else if (e.keyCode === Key$1.RIGHT) {
                        newActiveDate = addMonths(this.activeDate, 1);
                    }
                }
                else if (this.currentView === CalendarView.Year) {
                    if (e.keyCode === Key$1.DOWN) {
                        newActiveDate = addYears(this.activeDate, 4);
                    }
                    else if (e.keyCode === Key$1.LEFT) {
                        newActiveDate = addYears(this.activeDate, -1);
                    }
                    else if (e.keyCode === Key$1.UP) {
                        newActiveDate = addYears(this.activeDate, -4);
                    }
                    else if (e.keyCode === Key$1.RIGHT) {
                        newActiveDate = addYears(this.activeDate, 1);
                    }
                }
                if (newActiveDate && !dateIsOutOfRange(newActiveDate, this.minDate, this.maxDate, this.parse, this.dateFormat)) {
                    this.activeDate = newActiveDate;
                }
            },
            focusTimePicker() {
                this.$refs.timePicker.focus();
            },
            inputDateHandler(date) {
                this.dateWithoutTime = date;
                this.dateTimeInputHandler();
            },
            inputTimeHandler(date) {
                this.timeWithoutDate = date;
                if (this.datepicker) {
                    this.dateTimeInputHandler();
                }
                else {
                    this.inputHandler(date);
                }
            },
            dateTimeInputHandler() {
                if (this.dateWithoutTime === null || this.timeWithoutDate === null) {
                    if (this.timeWithoutDate === null) {
                        this.focusTimePicker();
                    }
                    else if (this.dateWithoutTime === null) {
                        this.focus();
                    }
                    return;
                }
                const { dateWithoutTime, timeWithoutDate } = this;
                const dateTime = new Date(dateWithoutTime.getFullYear(), dateWithoutTime.getMonth(), dateWithoutTime.getDate(), timeWithoutDate.getHours(), timeWithoutDate.getMinutes(), timeWithoutDate.getSeconds());
                this.inputHandler(dateTime);
            },
            inputHandler(newDate) {
                const date = new Date(newDate.valueOf());
                const disabledDates = this.disabledDates;
                if (dayIsPartOfTheConditions(date, disabledDates, this.parse, this.dateFormat)
                    || dateIsOutOfRange(date, this.minDate, this.maxDate, this.parse, this.dateFormat)) {
                    return;
                }
                if (this.range) {
                    let range = [];
                    // Reset the range when
                    // 1. Is not an array
                    // 2. The range already have both values
                    // 3. The range has the first value and the second value is before
                    if (!this.localValue
                        || !Array.isArray(this.localValue)
                        || (Array.isArray(this.localValue)
                            && (this.localValue.length === 0 || this.localValue.length === 2))
                        || (Array.isArray(this.localValue)
                            && this.localValue.length === 1
                            && this.localValue[0]
                            && this.localValue[0].getTime() > date.getTime())) {
                        range = [date];
                    }
                    else if (this.localValue.length === 1) {
                        range = [this.localValue[0], date];
                    }
                    this.localValue = range;
                    // Range is complete
                    if (!this.inline && this.localValue.length === 2 && this.closeOnSelect) {
                        this.doHide();
                    }
                }
                else if (Array.isArray(this.localValue)) {
                    const index = this.localValue.findIndex((d) => isSameDay(d, date));
                    if (index >= 0) {
                        this.localValue.splice(index, 1);
                    }
                    else {
                        this.localValue.push(date);
                    }
                }
                else {
                    this.focus();
                    this.localValue = date;
                }
                if (!this.inline && this.closeOnSelect && !Array.isArray(this.localValue)) {
                    this.doHide();
                }
            },
            inputActiveDateHandler(newDate) {
                this.activeDate = new Date(newDate.valueOf());
            },
            setView(newView) {
                this.currentView = newView;
                this.focus();
            },
            resetView() {
                if (this.currentView === CalendarView.Month) {
                    this.setView(CalendarView.Day);
                }
                else if (this.currentView === CalendarView.Year) {
                    this.setView(CalendarView.Month);
                }
                else {
                    this.setView(CalendarView.Day);
                }
            },
            enterHandler(e) {
                e.preventDefault();
                if (!this.inline && !this.shown) {
                    this.doShow();
                }
                else if (this.showActiveDate) {
                    if (this.currentView === CalendarView.Day) {
                        if (this.timepicker) {
                            this.inputDateHandler(new Date(this.activeDate.valueOf()));
                        }
                        else {
                            this.inputHandler(new Date(this.activeDate.valueOf()));
                        }
                    }
                    else {
                        this.resetView();
                    }
                }
            },
            escapeHandler(e) {
                e.preventDefault();
                const dropdown = this.getDropdown();
                if (dropdown) {
                    dropdown.escapeHandler(e);
                }
            },
            spaceHandler(e) {
                e.preventDefault();
                this.toggle();
            },
            getDropdown() {
                return this.$refs.dropdown;
            },
            resetInitialState() {
                this.shown = false;
                this.currentView = this.initialView;
                this.showActiveDate = false;
                if (this.timepicker) {
                    this.dateWithoutTime = Array.isArray(this.localValue) ? this.localValue[0] : this.localValue;
                }
                else {
                    this.dateWithoutTime = null;
                }
                this.timeWithoutDate = null;
                this.resetActiveDate(this.localValue);
            },
            resetActiveDate(localValue) {
                this.activeDate = getInitialActiveDate(localValue, this.initialDate, this.dateFormat, this.parse, this.amPm, this.initialTime);
            },
            clearHandler() {
                if (this.multiple || this.range) {
                    this.localValue = [];
                }
                else {
                    this.localValue = null;
                }
                this.resetActiveDate(this.localValue);
            },
            focusHandler(e) {
                this.hasFocus = true;
                this.$emit('focus', e);
            },
            blurHandler(e) {
                this.hasFocus = false;
                this.$emit('blur', e);
            },
            hideIfFocusOutside(e) {
                const dropdown = this.getDropdown();
                if (dropdown) {
                    dropdown.hideIfFocusOutside(e);
                }
            },
        },
        render(createElement) {
            const views = [];
            if (this.datepicker) {
                views.push(createElement(TDatepickerViews, {
                    ref: 'views',
                    props: {
                        value: this.localValue,
                        activeDate: this.activeDate,
                        weekStart: this.weekStart,
                        monthsPerView: this.monthsPerView,
                        lang: this.lang,
                        locale: this.currentLocale,
                        getElementCssClass: this.getElementCssClass,
                        parse: this.parse,
                        format: this.format,
                        formatNative: this.formatNative,
                        dateFormat: this.dateFormat,
                        userFormat: this.userFormat,
                        initialView: this.initialView,
                        currentView: this.currentView,
                        yearsPerView: this.yearsPerView,
                        showActiveDate: this.showActiveDate,
                        disabledDates: this.disabledDates,
                        highlightDates: this.highlightDates,
                        minDate: this.minDate,
                        maxDate: this.maxDate,
                        range: this.range,
                        showDaysForOtherMonth: this.showDaysForOtherMonth,
                        datepicker: this.datepicker,
                        timepicker: this.timepicker,
                        dateWithoutTime: this.dateWithoutTime,
                    },
                    scopedSlots: this.$scopedSlots,
                    on: {
                        input: this.inputHandler,
                        'input-date': this.inputDateHandler,
                        'input-time': this.inputTimeHandler,
                        'input-active-date': this.inputActiveDateHandler,
                        'update-view': this.setView,
                        'reset-view': this.resetView,
                        'reset-focus': this.focus,
                    },
                }));
            }
            if (this.timepicker && this.currentView === CalendarView.Day) {
                views.push(createElement(TDatepickerTimeSelector, {
                    ref: 'timePicker',
                    props: {
                        parse: this.parse,
                        format: this.format,
                        amPm: this.amPm,
                        showSeconds: this.showSeconds,
                        activeDate: this.activeDate,
                        locale: this.currentLocale,
                        getElementCssClass: this.getElementCssClass,
                    },
                    on: {
                        input: this.inputActiveDateHandler,
                        submit: this.inputTimeHandler,
                        blur: this.hideIfFocusOutside,
                    },
                }));
            }
            const triggerSettings = {
                ref: 'trigger',
                props: {
                    id: this.id,
                    name: this.name,
                    inputName: this.inputName,
                    disabled: this.disabled,
                    readonly: this.readonly,
                    autofocus: this.autofocus,
                    required: this.required,
                    placeholder: this.placeholder,
                    tabindex: this.tabindex,
                    userFormatedDate: this.userFormatedDate,
                    formatedDate: this.formatedDate,
                    conjunction: this.conjunction,
                    multiple: this.multiple,
                    range: this.range,
                    clearable: this.clearable,
                    locale: this.currentLocale,
                    value: this.localValue,
                    activeDate: this.activeDate,
                    hasFocus: this.hasFocus,
                    getElementCssClass: this.getElementCssClass,
                },
                scopedSlots: this.$scopedSlots,
                on: {
                    clear: this.clearHandler,
                    focus: this.focusHandler,
                    blur: this.blurHandler,
                    keydown: (e) => {
                        if ([Key$1.LEFT, Key$1.UP, Key$1.RIGHT, Key$1.DOWN].includes(e.keyCode) && this.datepicker) {
                            this.arrowKeyHandler(e);
                        }
                        else if (e.keyCode === Key$1.ENTER) {
                            this.enterHandler(e);
                        }
                        else if (e.keyCode === Key$1.ESC) {
                            this.escapeHandler(e);
                        }
                        else if (e.keyCode === Key$1.SPACE) {
                            this.spaceHandler(e);
                        }
                        if (isNumeric(e.key)) {
                            this.focusTimePicker();
                        }
                        this.$emit('keydown', e);
                    },
                },
            };
            if (this.inline) {
                return createElement('div', {
                    class: this.getElementCssClass('inlineWrapper'),
                }, [
                    createElement(TDatepickerTrigger, triggerSettings),
                    createElement('div', {
                        class: this.getElementCssClass('inlineViews'),
                    }, views),
                ]);
            }
            return createElement(TDropdown, {
                ref: 'dropdown',
                props: {
                    fixedClasses: undefined,
                    classes: {
                        wrapper: this.getElementCssClass('wrapper'),
                        dropdownWrapper: this.getElementCssClass('dropdownWrapper'),
                        dropdown: this.getElementCssClass('dropdown'),
                        enterClass: this.getElementCssClass('enterClass'),
                        enterActiveClass: this.getElementCssClass('enterActiveClass'),
                        enterToClass: this.getElementCssClass('enterToClass'),
                        leaveClass: this.getElementCssClass('leaveClass'),
                        leaveActiveClass: this.getElementCssClass('leaveActiveClass'),
                        leaveToClass: this.getElementCssClass('leaveToClass'),
                    },
                    show: this.show,
                },
                on: {
                    hidden: () => {
                        this.$emit('hidden');
                        this.resetInitialState();
                    },
                    shown: () => {
                        this.$emit('shown');
                        this.shown = true;
                        if (this.timepicker && !this.datepicker) {
                            this.$nextTick(() => {
                                this.focusTimePicker();
                            });
                        }
                    },
                },
                scopedSlots: {
                    trigger: (props) => {
                        const settings = cloneDeep(triggerSettings);
                        settings.props = Object.assign(Object.assign({}, settings.props), {
                            hideIfFocusOutside: props.hideIfFocusOutside,
                            show: props.show,
                        });
                        return [
                            createElement(TDatepickerTrigger, settings),
                        ];
                    },
                },
            }, views);
        },
    });

    exports.default = TDatepicker;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=t-datepicker.js.map
