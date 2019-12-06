import moment from 'moment';

export const nameof = <T>(name: keyof T) => name;

export function isNullOrWhitespace(str: string) {
    return str === null || str.match(/^ *$/) !== null;
}

export const clone = <T>(object: any): T => {
    //if (typeof object === 'object')
    //    return Object.assign({}, object) as T;
    //return object as T;

    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == object || "object" != typeof object) return object;

    // Handle Date
    if (object instanceof Date) {
        copy = new Date();
        copy.setTime(object.getTime());
        return copy as unknown as T;
    }

    // Handle Array
    if (object instanceof Array) {
        copy = [];
        for (var i = 0, len = object.length; i < len; i++) {
            copy[i] = clone(object[i]);
        }
        return copy as unknown as T;
    }

    // Handle Object
    if (object instanceof Object) {
        copy = {} as any;
        for (var attr in object) {
            if (object.hasOwnProperty(attr)) copy[attr] = clone(object[attr]);
        }
        return copy as unknown as T;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

export const formatDate = (date: Date, t?: (text: string) => string, format?: string) => {
    if (!t)
        t = o => o;
    if (!format)
        format = "DD-MM-YYYY";
    if (!date)
        return `(${t("Not set")})`;
    return moment(date).format(format);
}

export const formatDecimal = (number: number) => {
    return number ? number.toLocaleString() : 0;
}

export const formatCurrency = (number: number, symbol: string) => {
    return `${formatDecimal(number)} ${symbol}`;
}

export const formatPercent = (number: number) => {
    return `${formatDecimal(number)}%`;
}

export const formatBoolean = (value: boolean, t: (text: string) => string) => {
    return value ? t("Yes") : t("No");
}

export const getProperties = (o: any): { key: string, value: any }[] => {
    const result = [];
    for (const key in o) {
        if (o.hasOwnProperty(key)) {
            result.push({ key, value: o[key] });
        }
    }

    return result;
};

export function delay(ms: number) {
    return new Promise<void>(function (resolve) {
        setTimeout(resolve, ms);
    });
}