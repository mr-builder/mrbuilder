import React from 'react';
import { mount } from 'enzyme';
import App from 'example-app';
import {expect} from 'chai';

describe('example-app', function () {
    it('should render App', function () {
        expect(mount(<App/>).find('h1').text()).to.eql('Hello from App');
    })
});
