import React, { Component } from "react";
import "./JoinBlock.css";
import axios from "axios";
import socket from "../socket";

export default function JoinBlock({ onLogin }) {
  const [roomId, setRoomId] = React.useState("");
  const [userName, setUserName] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);

  const onEnter = async () => {
    // console.log(roomId, userName);
    if (!roomId || !userName) {
      return alert("Данные введены неправильно!");
    }

    const obj = {
      roomId,
      userName
    };

    setLoading(true);
    await axios.post("http://localhost:9999/rooms", obj);
    onLogin(obj);
  };

  return (
    <div>
      <div className="form-wrapper">
        <input
          className="form-input"
          type="text"
          placeholder="Введите номер"
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        />
        <input
          className="form-input"
          type="text"
          placeholder="Введите имя"
          value={userName}
          onChange={e => setUserName(e.target.value)}
        />
        <button disabled={isLoading} className="form-link" onClick={onEnter}>
          {isLoading ? "Войти" : "Войти"}
        </button>
      </div>
    </div>
  );
}
