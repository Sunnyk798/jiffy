import "./Notification.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Bar({ item }) {
  return (
    <Link className="noti-bars" to={item.url}>
      <span className="actor">{item.actor}</span>
      <span className="action"> {item.action}</span>
      <span className="time"> {item.createdAt}</span>
    </Link>
  );
}

function Notification({ user, noti }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch("/api/users/notifications", {
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + user.token,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setNotifications(result);
      });
  }, [user.token]);
  console.log(notifications);
  return (
    <div className={noti ? "notification" : "notification hide-noti"}>
      <h3>Notifications</h3>
      <div>
        {notifications.map((item) => {
          return <Bar item={item} />;
        })}
      </div>
    </div>
  );
}

export default Notification;
