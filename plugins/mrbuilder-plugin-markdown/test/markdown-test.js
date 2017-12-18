import React from 'react';
import Readme from '../README.md';
import { mount } from 'enzyme';
import { expect } from 'chai';

const into = (node) => {
    const attachTo = document.createElement('div');
    document.body.appendChild(attachTo);
    return mount(node, { attachTo });
};

describe('mrbuilder-plugin-markdown', function () {
    it('should render README', function () {

        const root = into(<Readme className='readme'/>);
        expect(root.find('h1').at(0).text()).to
                                            .eql('mrbuilder-plugin-markdown');
    });

});
