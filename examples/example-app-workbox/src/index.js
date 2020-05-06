import React, {Suspense, useCallback, useEffect, useState} from 'react';
import {fetchCurrency} from "./service";
import './style.css';
import {Workbox} from "workbox-window";


function Currency({rate, currency}) {
    return (<article className="card card-currency">
        <div className="currency">{currency}</div>
        <div className="rate">{rate}</div>
    </article>)
}

const initialResource = fetchCurrency();
const Loading = (<div className="loading-container">
    <div className="loading-spinner"/>
</div>);
const SVG = (<svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="white"
>
    <path fill="none" d="M0 0h24v24H0V0z"/>
    <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/>
</svg>);
export default function App() {
    const [resource, setResource] = useState(initialResource);
    const [button, setButton] = useState(false);
    const [workbox, setWorkbox] = useState();
    const onClick = useCallback(() => {
        // Set up a listener that will reload the page as soon as the previously waiting service worker has taken control.
        workbox.addEventListener("controlling", event => {
            window.location.reload();
        });

        // Send a message telling the service worker to skip waiting.
        // This will trigger the `controlling` event handler above.
        workbox.messageSW({type: "SKIP_WAITING"});
    })
    useEffect(() => {

        if ("serviceWorker" in navigator) {
            window.addEventListener("load", () => {
                const wb = new Workbox('./sw.js');
                // Fires when the registered service worker has installed but is waiting to activate.
                wb.addEventListener("waiting", event => {
                    console.log('here');
                    setButton(true);
                });

                wb.register();

                setWorkbox(wb);
            });

        }

    }, [setWorkbox, setButton]);
    // fetch the next person when we increment the ID
    useEffect(() => setResource(fetchCurrency), []);

    return (<div>
        <nav id="navbar">
            Currencies (€)
            {button && <button id="app-update" className="app-update" onClick={onClick}>
                {SVG} update app
            </button>}
        </nav>

        <main id="main">
            <Suspense fallback={Loading}>
                <Currencies resource={resource}/>
            </Suspense>
        </main>
    </div>)

}

function Currencies({resource}) {
    return resource.read().map(([currency, rate]) => (<Currency key={currency} {...{rate, currency}}/>));
}