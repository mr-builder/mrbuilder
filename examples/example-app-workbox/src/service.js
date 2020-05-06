
function wrapPromise(promise, abortController) {
    let status = 'pending';
    let response;

    const suspender = promise.then(
        (res) => {
            status = 'success';
            response = res;
        },
        (err) => {
            status = 'error';
            response = err;
        }
    );

    const read = () => {
        // if we're still fetching and got an abort signal, suspend rendering
        if (status === 'pending' && abortController.signal.aborted) {
            throw suspender;
        }

        switch (status) {
            case 'pending':
                throw suspender;
            case 'error':
                throw response;
            default:
                return response;
        }
    };

    return {
        read,
        abort() {
            abortController.abort();
        },
    };
}

export function fetchCurrency() {
    // create abort controller so we can abort a fetch
    const abortController = new AbortController();
    return wrapPromise(fetch("https://api.exchangeratesapi.io/latest", {
        signal: abortController.signal,
    })
        .then((res) => res.json())
        .then(({rates}) => Object.entries(rates)), abortController);
}
