import * as React from "react";
import {useState} from "react";

export interface HelloProps {
    name?: string;
}


export const Hello: React.FC<HelloProps> = (props) => {
    const [value, setValue] = useState(0);
    return (
        <div className="hello">
            <div className="greeting">
                Hello {props.name + getExclamationMarks(value)} from TypeScript
            </div>
            <div>
                <button onClick={() => setValue(Math.max(value - 1, 0))}>-</button>
                <button onClick={() => setValue(value + 1)}>+</button>
            </div>
        </div>
    );
}

// helpers
function getExclamationMarks(numChars: number) {
    return Array(numChars + 1).join("!");
}
