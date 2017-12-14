import { expect } from 'chai';
import plugin from '../src';
describe('mrbuilder-plugin-analyze', function () {
    it('should register', function () {
        const options = {}, webpack = {plugins:[]};
        plugin(options,webpack);
        expect(webpack.plugins).to.have.length(1);
    });
});
