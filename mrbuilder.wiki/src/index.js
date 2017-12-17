import React, { Component } from 'react';

const context = (er) => er.keys().map(key => [key, er(key).default]);

const errors   = context(require.context('./errors', true, /\.md$/));
const recipes  = context(require.context('./recipes', true, /\.md$/));
const plugins  = context(require.context('../../plugins', true, /Readme\.md$/));
const examples = context(require.context('../../example', true, /Readme\.md$/));

export default class App extends Component {
    render() {
        return <div>
            <h2>Examples</h2>
            {examples.map(
                ([key, Example]) => <Example key={key} className='example'/>)}

            <h2>Recipes</h2>
            {recipes.map(
                ([key, Recipe]) => <Recipe className='help-for-recipe'
                                           key={key}/>)}

            <h2>Plugins</h2>
            {plugins.map(([key, Plugin]) => <Plugin className='plugin' id={key}
                                                    key={key}/>)}

            <h2>Common Errors</h2>
            {errors.map(
                ([key, Error]) => <Error className='help-for-error'
                                         key={key}/>)}
        </div>
    }
}
