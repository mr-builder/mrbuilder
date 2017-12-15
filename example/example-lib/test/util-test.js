import util from '../src/util';
import { expect } from 'chai';

describe('util', function () {
    it('should say hi', function () {
        expect(util()).to.eql('hello from util');
    })
});
