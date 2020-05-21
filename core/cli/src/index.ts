import {instance} from './instance';

export * as Info from './info';
export {default as info} from './info';
export {logger} from './instance';
export * from './extensions';
export const optionsManager = instance;
export default instance;