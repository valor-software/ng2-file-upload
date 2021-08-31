import '../scripts/polyfills.ts';

import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

import './matchers';

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare let __karma__: any;
declare let require: any;

// Prevent Karma from running prematurely.
__karma__.loaded = Function.prototype;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
const context = require.context('../demo/src', true, /\.spec\.ts/);
// And load the modules.
context.keys().map(context);

const context2 = require.context('../src/spec', true, /\.spec\.ts/);
context2.keys().map(context2);
// Finally, start Karma to run the tests.
__karma__.start();
