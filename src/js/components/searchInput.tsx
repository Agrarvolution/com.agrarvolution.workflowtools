const SearchInput = ({ value }:
    React.PropsWithChildren<{
        value?: string
    }>) => {


    return (<span>
        <input className="search-input" placeholder="Search" type="text" value={value}></input>
        <input type="checkbox" className="search-input-button search-input-button--ignore-case"></input>
        <input type="checkbox" className="search-input-button search-input-button--whole-word"></input>
        <input type="checkbox" className="search-input-button search-input-button--regex"></input>
    </span>);
}



export default SearchInput;