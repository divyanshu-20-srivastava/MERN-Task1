
const CountDisplay = ({ addCount, clearCount }: any) => {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      padding: "10px",
      backgroundColor: "#333",
      color: "#fff",
      zIndex: 9999,
    }}>
      <p>Add Count: {addCount}</p>
      <p>Clear Count: {clearCount}</p>
    </div>
  );
};

export default CountDisplay;
