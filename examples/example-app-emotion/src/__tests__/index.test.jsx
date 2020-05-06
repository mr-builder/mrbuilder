import React from 'react';
import {create} from 'react-test-renderer';
import App from '../index';
test('should render index', function(){
    expect(create(<App/>)).toMatchSnapshot();
})