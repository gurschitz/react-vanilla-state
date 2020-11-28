import { createAtom } from './lib'

const counter = createAtom<number>(0)

window.atoms = { counter }
