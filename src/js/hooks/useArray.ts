/**
 * Original code is used under the MIT license.
 * @author Sergey Leschev
 * @url https://github.com/sergeyleschev/react-custom-hooks/blob/main/src/hooks/useArray/useArray.js
 * 
 * Modified for Typescript use.
 */
import { useState } from "react";
import { useLocalStorage  } from "usehooks-ts";

export default function useArray<T>(defaultValue: T[], storageKey?: string) {
    const [array, setArray] = storageKey ? useLocalStorage(storageKey,defaultValue, {
        deserializer: (value: string) : T[] => {
            if (value == null || value === undefined) {
                return [];
            }

            try {
                const raw = JSON.parse(value);
                if (raw instanceof Array) {
                    return raw;
                }
            } catch (e) {
                console.error(e);
            }         
            return [];
        }
    }) : useState(defaultValue); //@ToDo switch to useLocalStorage from usehooks-ts

    function push(element: T) {
        setArray((a : T []) => [...a, element]);
    }

    function merge(newArray: T[]) {
        setArray((a : T []) => [...a, ...newArray]);
    }

    function combine(element: T | T[] | undefined | null) {
        if (element == null || element === undefined) {
            return;
        }

        if (element instanceof Array) {
            merge(element);
            return;
        }
        push(element);
    }

    function filter(callback: (value: T, index?: number, array?: T[]) => boolean) {
        setArray((a : T []) => a.filter(callback));
    }

    function update(index: number, newElement: T) {
        setArray((a : T []) => [
            ...a.slice(0, index),
            newElement,
            ...a.slice(index + 1, a.length),
        ]);
    }

    function remove(index: number) {
        setArray((a : T []) => [...a.slice(0, index), ...a.slice(index + 1, a.length)]);
    }

    function removeDuplicates() {
        setArray(Array.from(new Set(array)));
    }

    function clear() {
        setArray([]);
    }

    return { array, set: setArray, push, merge, combine, filter, update, removeDuplicates, remove, clear};
}
