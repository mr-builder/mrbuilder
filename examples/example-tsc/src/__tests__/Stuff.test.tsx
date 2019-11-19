import * as React from 'react';
import Stuff from '../index';
import {create} from 'react-test-renderer';

test('Should render lib', () => {
    const app = create(<Stuff name={'stuff'}/>);
    expect(app.toJSON()).toMatchSnapshot();

});
