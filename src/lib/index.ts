import { useEffect, useState } from 'react'

export type Subscriber<Value> = (value: Value) => unknown

type UpdateFn<Value> = (old: Value) => Value
type ValueOrFn<Value> = Value | UpdateFn<Value>

export type Atom<Value> = {
    read(): Value
    set(value: ValueOrFn<Value>): void
    subscribe(subscriber: Subscriber<Value>): void
}

function isFunction<Value>(
    valueOrFn: ValueOrFn<Value>
): valueOrFn is UpdateFn<Value> {
    if (typeof valueOrFn === 'function') {
        return true
    }
    return false
}

export function createAtom<Value>(initial: Value): Atom<Value> {
    let current: Value = initial
    let subscribers: Subscriber<Value>[] = []
    return {
        read() {
            return current
        },
        set(valueOrFn: ValueOrFn<Value>) {
            if (isFunction(valueOrFn)) {
                current = valueOrFn(current)
            } else {
                current = valueOrFn
            }
            subscribers.forEach((s) => s(current))
        },
        subscribe(subscriber: Subscriber<Value>) {
            subscribers.push(subscriber)
            return function unsubscribe() {
                subscribers = subscribers.filter((f) => f === subscriber)
            }
        },
    }
}

type UpdateAction<Value> = (valueOrFn: ValueOrFn<Value>) => void

export function useAtom<Value>(
    atom: Atom<Value>
): [Value, UpdateAction<Value>] {
    const [atomState, setAtomState] = useState<Value>(atom.read())

    useEffect(() => {
        return atom.subscribe((value) => {
            setAtomState(value)
        })
    }, [atom])

    return [atomState, atom.set]
}
