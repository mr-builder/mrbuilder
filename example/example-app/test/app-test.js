import React from 'react';
import { mount } from 'enzyme';
import App from 'example-app';
import {expect} from 'chai';

describe('example-app', function () {
    it('should render App', function () {
        expect(mount(<App/>).find('#hello-from-app').text()).to.eql('Hello from App');
    })
});
