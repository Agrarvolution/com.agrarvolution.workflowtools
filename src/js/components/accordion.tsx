import { useEffect, useRef, useState, createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "../hooks/useStorage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faUnlock, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import useArray from "../hooks/useArray";

//import useLocalStorage from "../lib/utils/localStorage";

const AccordionContext = createContext({
    accordionItemIsOpen: (accordionItemKey: string): boolean => { return false; },
    updateActiveKey: (accordionItemKey: string, clickType: string) => { },
    accordionItemIsFixed: (accordionItemKey: string): boolean => { return false; }
});

const ClickType = {
    single: "click",
    double: "double"
}

type AccordionStateKey = string | string[] | null | undefined;
const ASPrefix = 'ui-accordion-';
const ASActiveKey = '-active';
const ASAlwaysActiveKey = '-always-active';

const Accordion = ({ children, defaultActiveKey, storageKey }:
    React.PropsWithChildren<{
        defaultActiveKey?: AccordionStateKey,
        storageKey?: string
    }>) => {

    if (defaultActiveKey == null) {
        defaultActiveKey = [];
    }
    if (!(defaultActiveKey instanceof Array)) {
        defaultActiveKey = [defaultActiveKey];
    }

    // by omiting the storage key, no peristance in local storage is used
    const [activeKey, setActiveKey] = storageKey ? useLocalStorage<string>(ASPrefix + storageKey + ASActiveKey, "") : useState<string>('');
    const alwaysActiveKey = useArray<string>(defaultActiveKey, 
        storageKey ? ASPrefix + storageKey + ASAlwaysActiveKey : undefined);



    const accordionContextValue = useMemo(() => {
        return { accordionItemIsOpen, updateActiveKey, accordionItemIsFixed }
    }, [activeKey, alwaysActiveKey.array]);

    function accordionItemIsOpen(accordionItemKey: string) {
        return accordionItemKey === activeKey || alwaysActiveKey.array.includes(accordionItemKey);
    }
    function updateActiveKey(accordionItemKey: string, clickType: string) {
        if (accordionItemKey === activeKey) { //unset if was prev active
            setActiveKey('');
        }

        if (alwaysActiveKey.array.includes(accordionItemKey)) { // unset if was prev active
            alwaysActiveKey.filter(value => accordionItemKey !== value);
            //setActiveKey('');
            return;
        } else if (ClickType.double === clickType) {
            alwaysActiveKey.push(accordionItemKey);
        }

        if (accordionItemKey !== activeKey && ClickType.single === clickType) {
            setActiveKey(accordionItemKey);
            return;
        }
    }
    function accordionItemIsFixed(accordionItemKey: string): boolean {
        return alwaysActiveKey.array.includes(accordionItemKey);
    }


    return (<article className='accordion'>
        <AccordionContext.Provider value={accordionContextValue}>
            {children}
        </AccordionContext.Provider>
    </article>);
};


const AccordionItem = ({ children, header, eventKey }:
    React.PropsWithChildren<{ defaultOpen?: boolean, header: React.ReactNode, eventKey: string }>) => {
    const accordionCallback = useContext(AccordionContext);

    const onClick = () => {
        accordionCallback.updateActiveKey(eventKey, ClickType.single);
    }
    const onDoubleClick = () => {
        accordionCallback.updateActiveKey(eventKey, ClickType.double);
    }

    const itemIsLocked = accordionCallback.accordionItemIsFixed(eventKey);

    const itemClassName = 'accordion-item' +
        (accordionCallback.accordionItemIsOpen(eventKey) ? ' accordion--isOpen' : '') +
        (itemIsLocked ? ' accordion--fixed' : '');

    return (<section className={itemClassName}>
        <AccordionHeader onClick={onClick} onDoubleClick={onDoubleClick} locked={itemIsLocked}>{header}</AccordionHeader>
        <AccordionBody>{children}</AccordionBody>
    </section>);
};

const AccordionHeader = ({ children, onClick, onDoubleClick, locked }: React.PropsWithChildren<{
    onClick: React.MouseEventHandler<HTMLElement>,
    onDoubleClick: React.MouseEventHandler<HTMLElement>,
    locked: boolean
}>) => {
    const accordionCallback = useContext(AccordionContext);
    return (<h2 className='accordion-header'>
        <button className='accordion-header-open' onClick={onClick} onDoubleClick={onDoubleClick}>{children}</button>
        <button onClick={onDoubleClick} className='accordion-header-lock'>
            <FontAwesomeIcon icon={locked ? faLock : faUnlock}></FontAwesomeIcon>
            <FontAwesomeIcon className="accordion-openIndicator" icon={faChevronRight}></FontAwesomeIcon>
        </button>
    </h2>);
};


const AccordionBody = ({ children }: React.PropsWithChildren) => {
    const [height, setHeight] = useState(0);
    const accordionBody = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setHeight(accordionBody.current?.scrollHeight || 0);
    }, [children]);

    return (<div className='accordion-body' ref={accordionBody} style={{ height: height }}>{children}</div>);
};



export default Object.assign(Accordion, {
    Header: AccordionHeader,
    Body: AccordionBody,
    Item: AccordionItem
});