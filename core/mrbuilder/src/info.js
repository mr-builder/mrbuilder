const om   = global._MRBUILDER_OPTIONS_MANAGER;
const {
          env: {
              MRBUILDER_DEBUG,
              NODE_ENV
          }
      }    = process;
const mode = om.config(
    'mrbuilder-plugin-webpack.mode');

const isKarma      = om.enabled('mrbuilder-plugin-karma'),
      isDevServer  = om.enabled('mrbuilder-plugin-webpack-dev-server'),
      isApp        = !!om.config('mrbuilder-plugin-webpack.app'),
      isDemo       = !!om.config('mrbuilder-plugin-webpack.demo'),
      isHtml       = om.enabled('mrbuilder-plugin-html'),
      isHot        = om.enabled('mrbuilder-plugin-hot'),
      isDebug      = MRBUILDER_DEBUG != null,
      isProduction = mode == null ? NODE_ENV === 'production' : mode
                                                                    === 'prodution',

      /**
       * isLibrary can not be true if its running in a dev server, or as an app
       * or as a demo.  But otherwise its true, because library build is the
       * default.
       *
       * @type {boolean}
       */

      isLibrary    = !(isKarma || isDevServer || isApp || isDemo);
module.exports     = {
    isKarma,
    isDebug,
    isProduction,
    isDevServer,
    isApp,
    isDemo,
    isHtml,
    isHot,
    isLibrary
};

