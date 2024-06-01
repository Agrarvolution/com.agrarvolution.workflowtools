/**
 * Original code is used under the MIT license.
 * @author Sergey Leschev
 * @url https://github.com/sergeyleschev/react-custom-hooks/blob/main/src/hooks/useArray/useArray.js
 * 
 * Modified for Typescript use.
 */
import { useState } from "react"

export default function useArray<T>(defaultValue: T[]) {
    const [array, setArray] = useState(defaultValue);

    function push(element: T) {
        setArray(a => [...a, element]);
    }

    function merge(newArray: T[]) {
        setArray(a => [...a, ...newArray]);
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
        setArray(a => a.filter(callback));
    }

    function update(index: number, newElement: T) {
        setArray(a => [
            ...a.slice(0, index),
            newElement,
            ...a.slice(index + 1, a.length),
        ]);
    }

    function remove(index: number) {
        setArray(a => [...a.slice(0, index), ...a.slice(index + 1, a.length)]);
    }

    function removeDuplicates() {
        setArray(Array.from(new Set(array)));
    }

    function clear() {
        setArray([]);
    }

    function loadFromStorage(key:string): boolean {
        const storageJSON = localStorage.getItem(key);
        try {
            if (storageJSON == null) {
                return false;
            }
            const parsed = JSON.parse(storageJSON);
            if (parsed.length === undefined) {
                return false;
            }

            setArray(JSON.parse(storageJSON)); //type not garantueed??
            return true;
        } catch (e) {
            console.error(e);
        }
        return false;
    }

    return { array, set: setArray, push, merge, combine, filter, update, removeDuplicates, remove, clear, loadFromStorage };
}
