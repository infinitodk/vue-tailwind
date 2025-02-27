import { DateFormatter, DateParser } from '../utils/dates';
import { CalendarView } from './TDatepicker/TDatepickerNavigator';
interface Dropdown extends Vue {
    doToggle(): void;
    doHide(): void;
    doShow(): void;
    escapeHandler(e: KeyboardEvent): void;
    hideIfFocusOutside(e: FocusEvent): void;
}
declare const TDatepicker: import("vue/types/vue").ExtendedVue<{
    getListeners(listeners: {
        [key: string]: Function | Function[];
    } | undefined): {
        [key: string]: Function | Function[];
    } | undefined;
} & {
    id: string;
    name: string;
    disabled: boolean;
    readonly: boolean;
    autofocus: boolean;
    required: boolean;
    tabindex: string | number;
} & {
    getElementCssClass(elementName?: string | undefined, defaultClasses?: import("../types/CssClass").default): import("../types/CssClass").default;
} & {
    componentClass: import("../types/CssClass").default;
    activeVariant: string | undefined;
} & {
    classes: any;
    fixedClasses: any;
    variants: any;
    variant: any;
} & import("vue").default, {
    localValue: Date | Date[] | null;
    formatedDate: string | string[];
    userFormatedDate: string | string[];
    activeDate: Date;
    shown: boolean;
    showActiveDate: boolean;
    currentView: CalendarView;
    parse: DateParser;
    format: DateFormatter;
    formatNative: DateFormatter;
    currentLocale: import("../types/locale").Locale;
    hasFocus: boolean;
    dateWithoutTime: Date | null;
    timeWithoutDate: Date | null;
}, {
    refreshFormattedDate(): void;
    refreshCurrentLocale(): void;
    refreshParser(): void;
    refreshFormatter(): void;
    focus(options?: FocusOptions | undefined): void | never;
    doHide(): void;
    doShow(): void;
    toggle(): void;
    arrowKeyHandler(e: KeyboardEvent): void;
    focusTimePicker(): void;
    inputDateHandler(date: Date): void;
    inputTimeHandler(date: Date): void;
    dateTimeInputHandler(): void;
    inputHandler(newDate: Date): void;
    inputActiveDateHandler(newDate: Date): void;
    setView(newView: CalendarView): void;
    resetView(): void;
    enterHandler(e: KeyboardEvent): void;
    escapeHandler(e: KeyboardEvent): void;
    spaceHandler(e: KeyboardEvent): void;
    getDropdown(): Dropdown | undefined;
    resetInitialState(): void;
    resetActiveDate(localValue: Date | null | Date[]): void;
    clearHandler(): void;
    focusHandler(e: FocusEvent): void;
    blurHandler(e: FocusEvent): void;
    hideIfFocusOutside(e: FocusEvent): void;
}, {
    visibleRange: [Date, Date];
    latestDate: Date | null;
    currentValueIsInTheView: boolean;
}, {
    value: string | number | unknown[];
    placeholder: string;
    inputName: string;
    weekStart: number;
    monthsPerView: number;
    lang: string;
    locale: any;
    locales: any;
    dateFormat: string;
    userFormat: string;
    dateFormatter: Function;
    dateParser: Function;
    closeOnSelect: boolean;
    showDaysForOtherMonth: boolean;
    show: boolean;
    inline: boolean;
    initialView: string;
    yearsPerView: number;
    disabledDates: string | Function | unknown[];
    highlightDates: string | Function | unknown[];
    maxDate: string;
    minDate: string;
    initialDate: string;
    initialTime: string;
    conjunction: string;
    multiple: boolean;
    range: boolean;
    clearable: boolean;
    datepicker: boolean;
    timepicker: boolean;
    amPm: boolean;
    showSeconds: boolean;
    classes: any;
    fixedClasses: any;
}>;
export default TDatepicker;
