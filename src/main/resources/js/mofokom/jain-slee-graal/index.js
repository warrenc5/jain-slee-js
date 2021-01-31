export const debug = js_debug || false
export const trace = js_trace || false

if (debug) {
    console.log("JAIN SLEE JMX Javascript Routines");
}
import '/resource:js/mofokom/jain-slee-graal/10-imports.js'
export * from '/resource:js/mofokom/jain-slee-graal/30-mbeans.js'
export * from '/resource:js/mofokom/jain-slee-graal/40-slee-util.js'
export * from '/resource:js/util/profile.js'