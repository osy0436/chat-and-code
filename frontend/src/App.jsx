import "./App.css";
import React from "react";
import { Routes, Route, useParams, Navigate,Redirect } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Auth from "./Pages/Auth";
import ChatPage from "./Pages/ChatPage";
// import Coding from "./Pages/Coding";
import App2 from "./Components/peer/App2";

function App() {
  const { v4: uuidV4 } = require("uuid");
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="auth" element={<Auth />}></Route>
        <Route path="chats" element={<ChatPage />}></Route>
        
          {/* When the path is exactly "/peer", redirect to "/peer/{UUID}" */}
          <Route path="/peer" element={<Navigate to={`/peer/${uuidV4()}`} />} />
        
        {/* When the path is "/peer/{UUID}", render the Room component */}
        <Route path="/peer/:id" element={<Room />} />
      </Routes>
    </div>
  );
}
function Room() {
  let { roomId } = useParams();
  return <App2 roomId={roomId} />;
};
export default App;
