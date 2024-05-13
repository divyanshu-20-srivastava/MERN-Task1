import React, { useEffect, useState } from "react";
import axios from "axios"; 
import SampleSplitter from "./SampleSplitter";
import { useResizable } from "react-resizable-layout";
import { cn } from "../utils/cn";
import { BASE_URL } from "../services/helper";
import CountDisplay from "./countDisplay"; 

const IdeClone = (): JSX.Element => {
  const [content1, setContent1] = useState("Component1");
  const [content2, setContent2] = useState("Component2");
  const [content3, setContent3] = useState("Component3");
  const [inputValue1, setInputValue1] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  const [inputValue3, setInputValue3] = useState("");
  const [addCount, setAddCount] = useState(0);
  const [clearCount, setClearCount] = useState(0);

  useEffect(() => {
    fetch(`${BASE_URL}/analytics`)
      .then((response) => response.json())
      .then((data) => {
        // Assuming data is in the format { addCount: x, clearCount: y }
        setAddCount(data.addCount);
        setClearCount(data.clearCount);
      })
      .catch((error) => {
        console.error("Error fetching analytics data:", error);
      });
  }, [addCount, clearCount]);

  const handleInputChange = (
    setValue: React.Dispatch<React.SetStateAction<string>>
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleAdd = (
    setValue: React.Dispatch<React.SetStateAction<string>>,
    setContent: React.Dispatch<React.SetStateAction<string>>,
    inputValue: string
  ) => {
    if (inputValue.trim() !== "") {
      setContent(inputValue);
      setValue("");
      axios.post(`${BASE_URL}/analytics/add`)
        .then(() => setAddCount(prevCount => prevCount + 1)); // Increment add count
    }
  };

  const handleClear = (
    setValue: React.Dispatch<React.SetStateAction<string>>,
    setContent: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setValue("");
    setContent("Component" + (setValue === setInputValue1 ? "1" : setValue === setInputValue2 ? "2" : "3"));
    axios.post(`${BASE_URL}/analytics/clear`)
      .then(() => setClearCount(prevCount => prevCount + 1)); // Increment clear count
  };

  const {
    isDragging: isTerminalDragging,
    position: terminalH,
    splitterProps: terminalDragBarProps
  } = useResizable({
    axis: "y",
    initial: 150,
    min: 50,
    reverse: true
  });

  const {
    isDragging: isFileDragging,
    position: fileW,
    splitterProps: fileDragBarProps
  } = useResizable({
    axis: "x",
    initial: 250,
    min: 50
  });

  const buttonStyles = {
    margin: "0 5px",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    outline: "none",
  };

  const inputStyles = {
    padding: "5px",
    borderRadius: "5px",
    border: "1px solid #ced4da",
    outline: "none",
  };

  return (
    <div
      className={
        "flex flex-column h-screen bg-dark font-mono color-white overflow-hidden"
      }
    >
      <CountDisplay addCount={addCount} clearCount={clearCount} /> {/* Pass addCount and clearCount as props */}
      <div className={"flex grow"}>
        <div
          className={cn("shrink-0 contents", isFileDragging && "dragging")}
          style={{ width: fileW }}
        >
          {content1}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <input 
              type="text" 
              value={inputValue1} 
              onChange={handleInputChange(setInputValue1)} 
              placeholder="Component" 
              style={inputStyles} 
            />
            <button 
              onClick={() => handleAdd(setInputValue1, setContent1, inputValue1)} 
              style={buttonStyles}
            >
              Add
            </button>
            <button 
              onClick={() => handleClear(setInputValue1, setContent1)} 
              style={buttonStyles}
            >
              Clear
            </button>
          </div>
        </div>
        <SampleSplitter isDragging={isFileDragging} {...fileDragBarProps} />
        <div className={"flex grow"}>
          <div className={"grow bg-darker contents"}>{content2}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <input 
                type="text" 
                value={inputValue2} 
                onChange={handleInputChange(setInputValue2)} 
                placeholder="Component" 
                style={inputStyles} 
              />
              <button 
                onClick={() => handleAdd(setInputValue2, setContent2, inputValue2)} 
                style={buttonStyles}
              >
                Add
              </button>
              <button 
                onClick={() => handleClear(setInputValue2, setContent2)} 
                style={buttonStyles}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
      <SampleSplitter
        dir={"horizontal"}
        isDragging={isTerminalDragging}
        {...terminalDragBarProps}
      />
      <div
        className={cn(
          "shrink-0 bg-darker contents",
          isTerminalDragging && "dragging"
        )}
        style={{ height: terminalH }}
      >
        {content3}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <input 
            type="text" 
            value={inputValue3} 
            onChange={handleInputChange(setInputValue3)} 
            placeholder="Component" 
            style={inputStyles} 
          />
          <button 
            onClick={() => handleAdd(setInputValue3, setContent3, inputValue3)} 
            style={buttonStyles}
          >
            Add
          </button>
          <button 
            onClick={() => handleClear(setInputValue3, setContent3)} 
            style={buttonStyles}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeClone;
