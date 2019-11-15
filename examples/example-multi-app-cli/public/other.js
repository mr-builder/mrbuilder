import React from 'react';
import { render } from 'react-dom';


render(<div>
    <h1>Hello from other page</h1>
    <a href="index.html">back to index</a>
</div>, document.getElementById('content'));
