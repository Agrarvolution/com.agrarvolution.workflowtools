/**
 * Code by Chesko Dev
 * @url https://medium.com/@chesko.dev/usestate-vs-uselocalstorage-a1dc756ddd95
 */
import { useState } from "react";

function useLocalStorage<T>(key: string, initialValue: T) {
    // Get stored value from local storage or use initial value
    const storedValue: T = JSON.parse(localStorage.getItem(key) || '') || initialValue;

    // State to hold the current value
    const [value, setValue] = useState<T>(storedValue);

    // Update local storage and state when the value changes
    const updateValue = (newValue: T) => {
        setValue(newValue);
        localStorage.setItem(key, JSON.stringify(newValue));
    };

    return [value, updateValue] as const;
}

export default useLocalStorage;

