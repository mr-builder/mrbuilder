import React, { Component } from 'react';

const context = (er) => er.keys().map(
    key => [key.replace(/.*\/(.*)\.md$/), er(key).default])

const errors = context(require.context('./errors', true, /\.md$/));
const recipes = context(require.context('./recipes', true, /\.md$/));

export default class App extends React.Component {
    render() {
        return <div>
            <h2>Common Errors</h2>
            {errors.map(
                ([key, Error]) => <Error className='help-for-error'
                                         key={key}/>)}

            <h2>Recipes</h2>
            {recipes.map(
                ([key, Recipe]) => <Recipe className='help-for-recipe'
                                         key={key}/>)}
        </div>
    }
}
