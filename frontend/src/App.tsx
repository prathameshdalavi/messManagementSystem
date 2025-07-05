import { useEffect, useState } from "react";
// Import your socket
import { socket } from "./socket";

interface Notice {
  _id: string;
  title: string;
  message: string;
  mess_id: string;
  createdAt: string;
}

export default function NoticeBoard() {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    // 1. Fetch notices initially via REST API
    async function fetchNotices() {
      const res = await fetch("http://localhost:3000/api/v1/user/notice/getNotices?userId=685ccabe3b914c2788684fb1", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer YOUR_TOKEN", // if required
        },
      });
      const data = await res.json();
      setNotices(data.data || []);
    }

    fetchNotices();

    // 2. Listen for real-time notice
    socket.on("new-notice", (notice: Notice) => {
      console.log("New notice received:", notice);
      setNotices((prev) => [notice, ...prev]); // prepend to the list
    });

    // 3. Clean up on unmount
    return () => {
      socket.off("new-notice");
    };
  }, []);

  return (
    <div>
      <h2>Notices</h2>
      <ul>
        {notices.map((notice) => (
          <li key={notice._id}>
            <strong>{notice.title}</strong> - {notice.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
