import {OptionsManager} from "@mrbuilder/optionsmanager";

declare global {
    namespace NodeJS {
        interface Global {
            _MRBUILDER_OPTIONS_MANAGER: OptionsManager
            _MRBUILDER_WEBPACK?: any,
        }
    }
}