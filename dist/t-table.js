(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lodash.pick'), require('vue'), require('lodash.get')) :
    typeof define === 'function' && define.amd ? define(['exports', 'lodash.pick', 'vue', 'lodash.get'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.TTable = {}, global.pick, global.Vue, global.get));
})(this, (function (exports, pick, Vue, get) { 'use strict';

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

    const TTable = Component.extend({
        name: 'TTable',
        props: {
            data: {
                type: Array,
                default() {
                    return [];
                },
            },
            headers: {
                type: Array,
                default() {
                    return [];
                },
            },
            footerData: {
                type: Array,
                default() {
                    return [];
                },
            },
            hideHeader: {
                type: Boolean,
                default: false,
            },
            showFooter: {
                type: Boolean,
                default: false,
            },
            responsive: {
                type: Boolean,
                default: false,
            },
            responsiveBreakpoint: {
                type: Number,
                default: 768,
            },
            classes: {
                type: Object,
                default: () => ({
                    table: 'min-w-full divide-y divide-gray-100 shadow-sm border-gray-200 border',
                    thead: '',
                    theadTr: '',
                    theadTh: 'px-3 py-2 font-semibold text-left bg-gray-100 border-b',
                    tbody: 'bg-white divide-y divide-gray-100',
                    tr: '',
                    td: 'px-3 py-2 whitespace-no-wrap',
                    tfoot: '',
                    tfootTr: '',
                    tfootTd: '',
                }),
            },
        },
        data() {
            return {
                ready: !this.responsive,
                windowWidth: null,
            };
        },
        computed: {
            renderResponsive() {
                const { windowWidth } = this;
                return this.responsive && windowWidth && windowWidth < this.responsiveBreakpoint;
            },
            normalizedHeaders() {
                return this.headers.map((header) => {
                    if (typeof header === 'string') {
                        return {
                            text: header,
                        };
                    }
                    return header;
                });
            },
            normalizedFooterData() {
                return this.footerData.map((footer) => {
                    if (typeof footer === 'string') {
                        return {
                            text: footer,
                        };
                    }
                    return footer;
                });
            },
            headersValues() {
                return this.headers
                    .filter((h) => h.value)
                    .map((h) => h.value);
            },
            showHeader() {
                return !this.hideHeader;
            },
        },
        mounted() {
            // If responsive we will need to calculate the windowWidth
            if (this.responsive) {
                this.windowWidth = window.innerWidth;
                // If responsive we want to show the table until we know the window size
                this.ready = true;
                window.addEventListener('resize', this.resizeListener);
            }
        },
        beforeDestroy() {
            if (this.responsive) {
                window.removeEventListener('resize', this.resizeListener);
            }
        },
        render(createElement) {
            const renderFun = this.renderTable;
            return renderFun(createElement);
        },
        methods: {
            resizeListener() {
                this.windowWidth = window.innerWidth;
            },
            renderTable(createElement) {
                if (!this.ready) {
                    return createElement();
                }
                const childElements = [];
                // The responsive version doesnt have header
                if (!this.renderResponsive) {
                    childElements.push(this.renderThead(createElement));
                }
                childElements.push(this.renderTbody(createElement));
                if (this.showFooter || this.$scopedSlots.tfoot) {
                    childElements.push(this.renderTfoot(createElement));
                }
                return createElement('table', {
                    ref: 'table',
                    class: this.getElementCssClass('table'),
                }, childElements);
            },
            renderThead(createElement) {
                const trClass = this.getElementCssClass('theadTr');
                const thClass = this.getElementCssClass('theadTh');
                const theadClass = this.getElementCssClass('thead');
                if (this.$scopedSlots.thead) {
                    const thead = this.$scopedSlots.thead({
                        theadClass,
                        trClass,
                        thClass,
                        data: this.normalizedHeaders,
                    });
                    if (thead) {
                        return thead;
                    }
                }
                if (!this.showHeader) {
                    return createElement();
                }
                const ths = this.normalizedHeaders.map((header) => createElement('th', {
                    attrs: {
                        id: header.id,
                    },
                    class: header.className ? [thClass, header.className] : thClass,
                }, header.text));
                return createElement('thead', {
                    class: theadClass,
                }, [
                    createElement('tr', {
                        class: trClass,
                    }, ths),
                ]);
            },
            renderTfoot(createElement) {
                const trClass = this.getElementCssClass('tfootTr');
                const tdClass = this.getElementCssClass('tfootTd');
                const tfootClass = this.getElementCssClass('tfoot');
                if (this.$scopedSlots.tfoot) {
                    const tfoot = this.$scopedSlots.tfoot({
                        tfootClass,
                        trClass,
                        tdClass,
                        data: this.normalizedFooterData,
                        headers: this.normalizedHeaders,
                        renderResponsive: this.renderResponsive,
                    });
                    if (tfoot) {
                        return tfoot;
                    }
                }
                const tds = this.normalizedFooterData.map((footer) => createElement('td', {
                    attrs: {
                        id: footer.id,
                    },
                    class: footer.className ? [tdClass, footer.className] : tdClass,
                }, footer.text));
                return createElement('tfoot', {
                    class: tfootClass,
                }, [
                    createElement('tr', {
                        class: trClass,
                    }, tds),
                ]);
            },
            renderTbody(createElement) {
                if (this.$scopedSlots.tbody) {
                    const tbody = this.$scopedSlots.tbody({
                        tbodyClass: this.getElementCssClass('tbody'),
                        trClass: this.getElementCssClass('tr'),
                        tdClass: this.getElementCssClass('td'),
                        data: this.data,
                        headers: this.normalizedHeaders,
                        renderResponsive: this.renderResponsive,
                    });
                    if (tbody) {
                        return tbody;
                    }
                }
                return createElement('tbody', {
                    class: this.getElementCssClass('tbody'),
                }, this.renderRows(createElement));
            },
            renderRows(createElement) {
                return this.data.map((row, rowIndex) => {
                    if (this.$scopedSlots.row) {
                        const tableRow = this.$scopedSlots.row({
                            rowIndex,
                            row,
                            trClass: this.getElementCssClass('tr'),
                            tdClass: this.getElementCssClass('td'),
                        });
                        if (tableRow) {
                            return tableRow;
                        }
                    }
                    return createElement('tr', {
                        class: this.getElementCssClass('tr'),
                    }, this.renderCols(createElement, row, rowIndex));
                });
            },
            renderCols(createElement, row, rowIndex) {
                const columns = this.getRowColumns(row);
                if (typeof columns === 'object') {
                    return Object.keys(columns).map((columnIndex) => {
                        const text = columns[columnIndex];
                        return this.renderCol(createElement, text, rowIndex, columnIndex);
                    });
                }
                return columns
                    .map((text, columnIndex) => this.renderCol(createElement, text, rowIndex, columnIndex));
            },
            renderCol(createElement, text, rowIndex, columnIndex) {
                if (this.$scopedSlots.column) {
                    const tableColumn = this.$scopedSlots.column({
                        rowIndex,
                        columnIndex,
                        text,
                        tdClass: this.getElementCssClass('td'),
                    });
                    if (tableColumn) {
                        return tableColumn;
                    }
                }
                return createElement('td', {
                    class: this.getElementCssClass('td'),
                }, text);
            },
            getRowColumns(row) {
                if (!this.headersValues.length) {
                    return row;
                }
                if (typeof row === 'object') {
                    return pick(row, this.headersValues);
                }
                return {};
            },
        },
    });

    exports.default = TTable;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=t-table.js.map
