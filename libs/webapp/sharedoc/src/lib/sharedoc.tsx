import { useState } from 'react';
export interface SharedocProps { }

export function Sharedoc(props: SharedocProps) {

  const [count, setCount] = useState(0);

  function increment(): void {
    setCount((prevCount) => prevCount + 1);
    //set the span to the count
    document.getElementById("num-clicks")!.innerHTML = count.toString();
  }

  return (
    <div>
      You clicked <span id="num-clicks"></span> times.
      <button onClick={increment}>+1</button>
    </div>
  );
}

export default Sharedoc;
