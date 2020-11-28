# React Vanilla State

This is a proof of concept that sharing state between a react app and a vanilla js app can work using the concept of atoms.
For this, the atoms need to be globally available, so that both react and the vanilla js app reference the same instance.

In this POC, I just put them on the window object in the file `src/atoms.ts`. This file will be loaded before the Vanilla JS code and the React code.

Both vanilla and react can then consume the atoms that are on the window object. In this case, it's the atom `counter`.
In the vanilla JS, it can just be subscribed to any value change, like this:

```js
// src/vanilla.ts
document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('#button')
    const counter = document.querySelector('#counter')

    if (button && counter) {
        button.addEventListener('click', () => {
            const current = parseInt(counter.innerHTML)
            window.atoms.counter.set(current + 1)
        })

        window.atoms.counter.subscribe((value) => {
            counter.innerHTML = `${value}`
        })
    }
})
```

In React, there is the hook `useAtom` that works pretty much the same way as a `useState` would work. Just pass in the atom that is on the window object and you are good to go.

```js
// src/react.ts
import * as React from 'react'
import ReactDOM from 'react-dom'
import { useAtom } from './lib'

function App() {
    const [counter, setCounter] = useAtom(window.atoms.counter)
    return (
        <div className="space-y-5">
            <h2 className="text-xl font-bold">React App</h2>

            <div>{counter}</div>
            <button
                className="bg-green-600 px-2 py-1 rounded hover:bg-green-500 text-white"
                onClick={() => setCounter((c) => c + 1)}
            >
                Count up from React
            </button>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('react-app'))
```

To run this example, run `yarn install && yarn start`. This should spin up a server on `localhost:1234`.
