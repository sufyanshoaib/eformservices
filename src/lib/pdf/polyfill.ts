/**
 * Polyfill for PDF.js in Node.js / RSC environments
 * This must be imported before any pdfjs-dist imports
 */

const root = globalThis as any;

// 1. Polyfill Promise.withResolvers (required for PDF.js 4+)
if (typeof root.Promise.withResolvers === 'undefined') {
    root.Promise.withResolvers = function <T>() {
        let resolve: (value: T | PromiseLike<T>) => void;
        let reject: (reason?: any) => void;
        const promise = new Promise<T>((res, rej) => {
            resolve = res;
            reject = rej;
        });
        return { promise, resolve, reject };
    };
}

// 2. Polyfill DOMMatrix
if (typeof root.DOMMatrix === 'undefined') {
    root.DOMMatrix = class DOMMatrix {
        a: number; b: number; c: number; d: number; e: number; f: number;
        constructor(init?: string | number[]) {
            this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
            if (Array.isArray(init)) {
                this.a = init[0]; this.b = init[1]; this.c = init[2]; this.d = init[3]; this.e = init[4]; this.f = init[5];
            }
        }
        multiply() { return this; }
        translate() { return this; }
        scale() { return this; }
        transformPoint() { return { x: 0, y: 0 }; }
        invertSelf() { return this; }
    };
}

// 3. Polyfill Path2D
if (typeof root.Path2D === 'undefined') {
    root.Path2D = class Path2D { };
}

// REMOVED: window, document, navigator, CanvasRenderingContext2D, Image
// These were confusing pdfjs-dist into thinking it was in a browser environment.
