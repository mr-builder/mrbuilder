import React from 'react';
import Lib from '../src';
import { expect } from 'chai';
import {mount} from 'enzyme';

describe('lib', function () {
    it('should render', function () {
        const t = mount(<Lib/>);

        expect(t.text()).to.eql('Hello from lib');
    })
});
