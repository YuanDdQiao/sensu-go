import modernizr from "/modernizr.macro";

// Configure bluebird polyfill
Promise.config({
  warnings: {
    wForgottenReturn: false,
  },
});

const polyfillCollections = () =>
  new Promise(resolve =>
    modernizr.on("es6collections", result => {
      if (result) {
        return resolve();
      }

      return Promise.all([
        import(/* webpackChunkName: "collections" */ "core-js/es6/map"),
        import(/* webpackChunkName: "collections" */ "core-js/es6/weak-map"),
        import(/* webpackChunkName: "collections" */ "core-js/es6/set"),
        import(/* webpackChunkName: "collections" */ "core-js/es6/weak-set"),
      ]).then(([map, weakMap, set, weakSet]) => {
        window.Map = window.Map || map.default;
        window.WeakMap = window.WeakMap || weakMap.default;
        window.Set = window.Set || set.default;
        window.WeakSet = window.WeakSet || weakSet.default;
      });
    }),
  );

const polyfillFetch = () =>
  new Promise(resolve =>
    modernizr.on("fetch", result => {
      if (result) {
        return resolve();
      }

      return import(/* webpackChunkName: "fetch" */ "whatwg-fetch").then(
        resolve,
      );
    }),
  );

const polyfillURLSearchParams = () =>
  new Promise(resolve =>
    modernizr.on("urlsearchparams", result => {
      if (result) {
        return resolve();
      }

      return import(/* webpackChunkName: "url" */ "url-search-params-polyfill").then(
        resolve,
      );
    }),
  );

const polyfillIntl = () =>
  new Promise(resolve =>
    modernizr.on("intl", result => {
      if (result) {
        return resolve();
      }

      return Promise.all([
        import(/* webpackChunkName: "intl" */ "intl"),
        import(/* webpackChunkName: "intl" */ "intl/locale-data/jsonp/en.js"),
      ]).then(resolve);
    }),
  );

const polyfillIntlRelativeFormat = () =>
  import(/* webpackChunkName: "intl-relative-format" */ "intl-relativeformat").then(
    result => {
      window.IntlRelativeFormat = result.default;
      return import(/* webpackChunkName: "intl-relative-format" */ "intl-relativeformat/dist/locale-data/en.js");
    },
  );

export default () =>
  Promise.all([
    polyfillCollections(),
    polyfillFetch(),
    polyfillURLSearchParams(),
    polyfillIntl(),
    polyfillIntlRelativeFormat(),
  ]).then(() => {});