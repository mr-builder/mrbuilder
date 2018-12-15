import * as React from 'react';
export interface HelloProps {
    name: string;
}
export declare type HelloState = {
    value?: number;
};
export declare class Hello extends React.Component<HelloProps, HelloState> {
    state: {
        value: number;
    };
    handleIncrement: () => void;
    handleDecrement: () => void;
    render(): JSX.Element;
}
