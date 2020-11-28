import { Atom } from './lib'

declare global {
    interface Window {
        atoms: {
            counter: Atom<number>
        }
    }
}
