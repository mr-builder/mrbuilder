{{#if typescript}}
import {Configuration} from 'webpack';
import {OptionsManagerType} from '@mrbuilder/optionsmanager';
import {PluginConfigType} from './types';

export default function(options:PluginConfigType, webpack:Configuration, optionsManager:OptionsManagerType):Configuration {

}
{{else}}
module.exports = function(options, webpack, optionsManager){
    return webpack;
}
{{/if}}