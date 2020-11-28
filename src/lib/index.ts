import { useEffect, useState } from 'react'

export type Subscriber<Value> = (value: Value) => unknown
export type Atom<Value> = {
    read(): Value
    set(value: Value): void
    subscribe(subscriber: Subscriber<Value>): void
}

export function createAtom<Value>(initial: Value): Atom<Value> {
    let current: Value = initial
    let subscribers: Subscriber<Value>[] = []
    return {
        read() {
            return current
        },
        set(value: Value) {
            current = value
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

type UpdateFn<Value> = (old: Value) => Value
type UpdateOrFn<Value> = Value | UpdateFn<Value>
type UpdateAction<Value> = (updateOrFn: UpdateOrFn<Value>) => void

function isFunction<Value>(
    valueOrFn: UpdateOrFn<Value>
): valueOrFn is UpdateFn<Value> {
    if (typeof valueOrFn === 'function') {
        return true
    }
    return false
}

export function useAtom<Value>(
    atom: Atom<Value>
): [Value, UpdateAction<Value>] {
    const [atomState, setAtomState] = useState<Value>(atom.read())

    useEffect(() => {
        return atom.subscribe((value) => {
            setAtomState(value)
        })
    }, [atom])

    function update(valueOrFn: UpdateOrFn<Value>) {
        if (isFunction(valueOrFn)) {
            atom.set(valueOrFn(atom.read()))
        } else {
            atom.set(valueOrFn)
        }
    }

    return [atomState, update]
}
