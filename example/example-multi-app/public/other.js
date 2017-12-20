import React from 'react';
import { render } from 'react-dom';
import shared from './shared';


render(<div>
    <h1>Hello from other page</h1>
    <a href="index.html">back to index</a>
    <h2>{shared()}</h2>
</div>, document.getElementById('content'));
