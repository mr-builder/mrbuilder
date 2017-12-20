import React from 'react';
import { render } from 'react-dom';
import shared from './shared';

render(<div>
    <h1>Hello from page 1</h1>
    <a href="other.html">Other Page</a>
    <h2>{shared()}</h2>
</div>, document.getElementById('content'));
