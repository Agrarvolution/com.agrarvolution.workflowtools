import { useEffect, useState } from "react";
import { subscribeBackgroundColor } from "../lib/utils/bolt";
import Accordion from '../components/accordion';
import SearchInput from "../components/searchInput";

const Main = () => {
  const [bgColor, setBgColor] = useState("#282c34");

  useEffect(() => {
    if (window.cep) {
      subscribeBackgroundColor(setBgColor);
    }
  }, []);

  return (
    <div className="app" style={{ "--background-color": bgColor } as React.CSSProperties}>
      <h1 style={{ color: "#ff5b3b" }}>Welcome to Bolt CEP!</h1>
      <Accordion defaultActiveKey="1" storageKey="1">
        <Accordion.Item eventKey="1" header="Batch Rename">
          <SearchInput></SearchInput>
        </Accordion.Item>
        <Accordion.Item eventKey="2" header="This is a second header.">
          Content
        </Accordion.Item>
        <Accordion.Item eventKey="3" header="This is a third header.">
          Content
        </Accordion.Item>
      </Accordion>
    </div>
  );
};
export default Main;

