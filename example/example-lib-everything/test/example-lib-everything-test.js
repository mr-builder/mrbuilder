import React from 'react';
import Everything from '@mrbuilder/example-lib-everything';
import { mount } from 'enzyme';
import { expect } from 'chai';

const into = (node) => {
    const attachTo = document.createElement('div');
    document.body.appendChild(attachTo);
    return mount(node, { attachTo });
};

describe('example-lib-everything', function () {

    it('should render', function () {
        const ret = into(<Everything/>);
        expect(ret.find('#header').text()).to.eql('Hello');
        expect(ret.find('#yaml').text()).to.eql('Yaml - A Yaml Value');

    })
});
