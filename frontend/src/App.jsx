import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/api/test")
      .then(res => setMsg(res.data))
      .catch(err => console.error(err));
  }, []);

  return <div className="p-4 text-xl">{msg}</div>;
}

export default App;