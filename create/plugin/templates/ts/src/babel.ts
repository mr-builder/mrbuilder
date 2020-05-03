import {TransformOptions as Babel} from '@babel/core';
import {OptionsManagerType} from '@mrbuilder/optionsmanager';
import {PluginConfigType} from './types';

export default function (options: PluginConfigType, babel: Babel, optionsManager: OptionsManagerType): Babel {
    return babel;
}
