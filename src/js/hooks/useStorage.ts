/**
 * Original code is used under the MIT license.
 * @author Sergey Leschev
 * @url https://github.com/sergeyleschev/react-custom-hooks/blob/main/src/hooks/useStorage/useStorage.js
 * 
 * Modified for Typescript use.
 */

import { useCallback, useState, useEffect } from "react"

export function useLocalStorage<T>(key: string, defaultValue: T) {
    return useStorage(key, defaultValue, window.localStorage);
}

export function useSessionStorage<T>(key: string, defaultValue: T) {
    return useStorage(key, defaultValue, window.sessionStorage);
}

function useStorage<T>(key: string, defaultValue: T, storageObject: Storage) {
    const [value, setValue] = useState(() => {
        const jsonValue = storageObject.getItem(key);
        if (jsonValue != null) {
            return JSON.parse(jsonValue);
        }

        if (typeof defaultValue === "function") {
            return defaultValue();
        } else {
            return defaultValue;
        }
    });

    useEffect(() => {
        if (value === undefined) {
            return storageObject.removeItem(key);
        }
        storageObject.setItem(key, JSON.stringify(value));

    }, [key, value, storageObject]);

    const remove = useCallback(() => {
        setValue(undefined);
    }, []);

    return [value, setValue, remove];
}
