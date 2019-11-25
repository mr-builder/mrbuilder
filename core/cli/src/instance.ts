import {OptionsManager} from "@mrbuilder/optionsmanager";
if (!global._MRBUILDER_OPTIONS_MANAGER) {
    global._MRBUILDER_OPTIONS_MANAGER = new OptionsManager({
        prefix: 'mrbuilder', _require: require
    });
}

export default global._MRBUILDER_OPTIONS_MANAGER;