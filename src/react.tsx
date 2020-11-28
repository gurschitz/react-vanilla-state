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
