import {OptionsManager} from "@mrbuilder/optionsmanager";
import {parseIfBool, stringify} from '@mrbuilder/utils';
import _logger from 'npmlog';
export const logger = _logger;


if (!global._MRBUILDER_OPTIONS_MANAGER) {
    logger.addLevel('debug', 1000, { inverse:true }, 'debug')
    logger.enableUnicode()
    logger.level = parseIfBool(process.env.MRBUILDER_DEBUG) ? 'debug' : process.env.MRBUILDER_LOG || 'info';
    const om = global._MRBUILDER_OPTIONS_MANAGER = new OptionsManager({
        prefix: 'mrbuilder',
        _require: require,
        log: logger.log
    });
    logger.log('debug', '@mrbuilder', stringify(Array.from(om.plugins)));


}
export const instance = global._MRBUILDER_OPTIONS_MANAGER;
export default instance;