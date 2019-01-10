import React from 'react';
import Meta from './fixture/meta.md';
import { mount } from 'enzyme';
import { expect } from 'chai';

const into = (node) => {
    const attachTo = document.createElement('div');
    document.body.appendChild(attachTo);
    return mount(node, { attachTo });
};

describe('@mrbuilder/plugin-markdown', function () {
    /*it('should render Inline', function () {

         into(<Inline className='readme'/>);

    });*/
    it('should render Meta', function () {

        into(<Meta className='readme'/>);

    });
});
