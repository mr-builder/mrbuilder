import {Configuration} from 'webpack';
import {OptionsManagerType} from '@mrbuilder/optionsmanager';
import {PluginConfigType} from './types';

export default function(options:PluginConfigType, webpack:Configuration, optionsManager:OptionsManagerType):Configuration {
    return webpack;
}
