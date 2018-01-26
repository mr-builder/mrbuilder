import React from 'react';
import shared from './shared';

export default () => (<div>
    <h1>Hello from other page</h1>
    <a href="index.html">back to index</a>
    <h2>{shared()}</h2>
</div>);
