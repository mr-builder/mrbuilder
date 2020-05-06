import React, {Component} from 'react';
import styled from '@emotion/styled'

const Button = styled.button`
  padding: 32px;
  background-color: hotpink;
  font-size: 24px;
  border-radius: 4px;
  color: black;
  font-weight: bold;
  &:hover {
    color: white;
  }
`
const Link = props => (<a
    css={{
        color: 'hotpink',
        '&:hover': {
            color: 'darkorchid'
        }
    }}
    {...props}
/>);

export default class App extends Component {

    render() {
        return (<div>
            <Button>This my "emotion" Button component.</Button>
            <Link>This uses the css prop</Link>
        </div>)
    }
}
