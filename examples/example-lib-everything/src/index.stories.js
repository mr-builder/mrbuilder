import React from 'react';
import {Hello} from "./hello";
import WebpackExample from './index';
import Readme from '../Readme.md';

const Button = function Button(props) {
    return <button {...props}/>
};


export const withText = () => <Button>Hello Button</Button>;

export const withEmoji = () => (
    <Button><span role="img" aria-label="so cool">😀 😎 👍 💯</span></Button>
);

export const withHello = () => (<Hello name='bob'/>);

export const withEverything = ()=>(<WebpackExample/>);

export const withReadme = ()=>(<Readme/>);

export default {title: 'Example Lib Storybook'};
