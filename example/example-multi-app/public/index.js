import React from 'react';
import { render } from 'react-dom';
import shared from './shared';
import Stylus from './app.stylm';
import Less from './example.lessm'


const init = () => render(<div >
    <h1>Hello from page 1</h1>
    <a className={Stylus.link} href="other.html">Other Page</a>
    <p className={Less.widget}>This uses rewrite to turn a frown upside down</p>
    <img src={"/frown.png"}/>
    <h2>{shared()}</h2>
</div>, document.getElementById('content'));

init();

if (module.hot) {

   module.hot.accept(init);

}
