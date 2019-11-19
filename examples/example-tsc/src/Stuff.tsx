import * as React from 'react';

type Props = { name: string };

export function Stuff({name}: Props): JSX.Element {
    return <span>{name}</span>;
}
