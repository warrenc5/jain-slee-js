import {mbean} from '/resource:js/mofokom/jain-slee-graal/15-jmx-base.js'

export const debug = js_debug || false
export const trace = js_trace || false

export function toString(a) {
    if(!a instanceof Array)
        return a;

    var k = "[";
    for (var s = 0; s < a.length; s++) {
        k += a[s]
        if (s < a.length - 1) {
            k += ', '
        }
    }

    return k += "]"
}

// Java Collection (Iterable) to script array
export function toArray(collection) {
    if (collection instanceof Array) {
        return collection;
    }
    var array = new Array();
    try {
        var itr = collection.iterator();
        while (itr.hasNext()) {
            array.push(itr.next());
        }
    }catch(e) { 
        for (var i = 0; i < collection.length; i++) {
            array.push(collection[i]);
        }
    }

    return array;
}

// wraps a script array as java.lang.Object[]
//FIXME:
export function objectArray(array) {
    if (array === undefined) {
        array = [];
    }
    try {
        if (trace)
            console.log("1!", arrayToString(array))
        var to = Java.to(array, "java.lang.Object[]");
        if (trace)
            console.log("!!", arrayToString(to))
        return to;
    } catch (e) {
        console.log("e1**" + e);
        return Java.to([], "java.lang.Object[]");
    }
}

// wraps a script (string) array as java.lang.String[]
//FIXME:
export function stringArray(array) {
    if (array === undefined) {
        array = [];
    }
    try {
        return Java.to(array, "java.lang.String[]");
    } catch (e) {
        console.log("e2**" + e);
        return Java.to([], "java.lang.String[]");
    }
}

export function arrayToStringShort(o) {
    var result = "[";

    for (var s = 0; s < o.length; s++) {
        result += o[s]
    }
    result += "]"
    return result
}
export function arrayToString(o, pad) {
    if (pad === undefined)
        pad = '';

    if (o === undefined)
        return "[]";
    pad += '\t' + "[" + o.length + "]";

    for (var s = 0; s < o.length; s++) {
        var type = typeof (o[s]);

        var v = o[s];

        try {
            type = o[s].getClass();


            if (type.isArray())
                v = o[s].length;

        } catch (e) {
        }

        console.log(pad + " " + s + " " + type + " " + v);

        if (o[s] == null)
            continue;

        try {
            if (type.isArray()) {
                arrayToString(o[s], pad);
            }
        } catch (e) {
        }
    }
    pad = pad.slice(0, pad.length - 1);
}