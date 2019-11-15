import React from 'react';
import Example from '@mrbuilder/example-lib-webpack';
import { mount } from 'enzyme';
import { expect } from 'chai';

const into = (node) => {
    const attachTo = document.createElement('div');
    document.body.appendChild(attachTo);
    return mount(node, { attachTo });
};

describe('example-lib-webpack', function () {

    it('should render', function () {
        const ret = into(<Example/>)
        expect(ret.text()).to.eql('Hello from webpack example.')
    })
});
