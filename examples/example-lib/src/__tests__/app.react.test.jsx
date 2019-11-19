import React from 'react';
import App from '../index';
import renderer from 'react-test-renderer';

test('Should render lib', () => {
    const app = renderer.create(<App/>);
    expect(app.toJSON()).toMatchSnapshot();

});
