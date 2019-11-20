import React from 'react';
import Example from '@mrbuilder/example-lib-webpack';
import { mount } from 'enzyme';
import { expect } from 'chai';
import list from '../src/list';
const into = (node) => {
    const attachTo = document.createElement('div');
    document.body.appendChild(attachTo);
    return mount(node, { attachTo });
};

describe('example-lib-webpack', function () {

    it('should render', function () {
        const ret = into(<Example/>)
        expect(ret.text()).to.eql('Hello from webpack example.')
    });
    it('should include', ()=>{
        console.log('list', list);
    })
});
