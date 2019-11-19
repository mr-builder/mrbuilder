import React from 'react';
import App, {Smile} from '../index';
import renderer from 'react-test-renderer';

test('Should render lib', () => {
    const app = renderer.create(<App/>);
    expect(app.toJSON()).toMatchSnapshot();

});
test('Should render smile', () => {
    const smile = renderer.create(<Smile/>);
    expect(smile).toMatchSnapshot();
})