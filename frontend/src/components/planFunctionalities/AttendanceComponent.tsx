import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import {
  FaCalendarAlt,
  FaCamera,
  FaTimes,
  FaQrcode,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectSelectedPlan } from "../../redux/nearbyMessSlice";
import { Html5Qrcode } from "html5-qrcode";
import { motion, AnimatePresence } from "framer-motion";

type AttendanceType = "breakfast" | "lunch" | "dinner";

interface AttendanceMessage {
  type: "success" | "error";
  text: string;
}

interface AttendanceHistoryEntry {
  messId: string;
  type: AttendanceType;
  time: string;
}

export const AttendanceComponent: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [attendanceType, setAttendanceType] = useState<AttendanceType>("lunch");
  const [message, setMessage] = useState<AttendanceMessage | null>(null);
  const [history, setHistory] = useState<AttendanceHistoryEntry[]>([]);
  const html5qrcodeRef = useRef<Html5Qrcode | null>(null);
  const selectedPlan = useSelector(selectSelectedPlan);

  // Load history from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("attendanceHistory") || "[]");
    setHistory(stored);
  }, []);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    const isSecure =
      window.isSecureContext ||
      window.location.protocol === "https:" ||
      window.location.hostname === "localhost";

    if (!isSecure) {
      setMessage({ type: "error", text: "Camera requires HTTPS or localhost." });
      return;
    }

    setShowScanner(true);
    setMessage(null);

    setTimeout(async () => {
      try {
        if (html5qrcodeRef.current) {
          await html5qrcodeRef.current.stop().catch(() => {});
          html5qrcodeRef.current.clear();
          html5qrcodeRef.current = null;
        }

        html5qrcodeRef.current = new Html5Qrcode("qr-reader");

        const devices = await Html5Qrcode.getCameras();
        if (!devices.length) throw new Error("No camera found.");

        const backCam = devices.find((d) => /back|rear|environment/i.test(d.label));
        const cameraId = backCam ? backCam.id : devices[0].id;

        setScanning(true);

        await html5qrcodeRef.current.start(
          cameraId,
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            onScanSuccess(decodedText, attendanceType);
          },
          (errorMessage) => {
            console.warn("QR scanning error:", errorMessage);
          }
        );
      } catch (err: any) {
        console.error("Camera error:", err);
        stopScanner();
        const msg = err?.message || JSON.stringify(err);
        setMessage({ type: "error", text: `Camera error: ${msg}` });
      }
    }, 500);
  };

  const stopScanner = async () => {
    if (html5qrcodeRef.current) {
      try {
        await html5qrcodeRef.current.stop();
        await html5qrcodeRef.current.clear();
      } catch (err) {
        console.warn("Error stopping scanner:", err);
      }
      html5qrcodeRef.current = null;
    }
    setScanning(false);
    setShowScanner(false);
  };

  const onScanSuccess = async (decodedText: string, type: AttendanceType) => {
    await stopScanner();
    setMessage({ type: "success", text: "QR scanned! Marking attendance..." });

    const newEntry: AttendanceHistoryEntry = {
      messId: decodedText,
      type,
      time: new Date().toLocaleString(),
    };
    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("attendanceHistory", JSON.stringify(updatedHistory));

    await markAttendance(decodedText, type);
  };

  const markAttendance = async (messIdFromScan: string, type: AttendanceType) => {
    if (!messIdFromScan) {
      setMessage({ type: "error", text: "Invalid QR code content." });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/user/attendance/markattendance`,
        { messId: messIdFromScan, type },
        { headers: { token } }
      );

      if (res.data.success) {
        setMessage({ type: "success", text: "Attendance marked successfully!" });
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error?.response?.data?.message || "Failed to mark attendance.",
      });
    }
  };

  const clearMessage = () => setMessage(null);
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("attendanceHistory");
  };

  return (
    <div className="space-y-6">
      {/* Header & QR Scan */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaCalendarAlt className="text-teal-500" /> Attendance Records
          </h3>
          {selectedPlan?.messId?.messName && (
            <p className="text-sm text-gray-600 mt-1">Mess: {selectedPlan.messId.messName}</p>
          )}
        </div>
        <button
          onClick={startScanner}
          disabled={showScanner}
          className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaQrcode /> Scan QR
        </button>
      </div>

      {/* Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-lg flex items-center justify-between ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === "success" ? (
                <FaCheckCircle className="text-green-500" />
              ) : (
                <FaTimesCircle className="text-red-500" />
              )}
              <span>{message.text}</span>
            </div>
            <button onClick={clearMessage} className="text-gray-400 hover:text-gray-600">
              <FaTimes />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanner */}
      {showScanner && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaCamera className="text-teal-500" /> Scan QR Code
            </h4>
            <button onClick={stopScanner} className="text-gray-400 hover:text-gray-600">
              <FaTimes size={20} />
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Meal Type</label>
            <select
              value={attendanceType}
              onChange={(e) => setAttendanceType(e.target.value as AttendanceType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>
          <div id="qr-reader" className="w-full max-w-md mx-auto rounded-lg overflow-hidden" />
          {scanning && (
            <div className="text-center mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto" />
              <p className="text-gray-600 mt-2">Scanning for QR code...</p>
            </div>
          )}
        </motion.div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-lg font-semibold text-gray-800">Scan History</h4>
            <button onClick={clearHistory} className="text-red-600 hover:text-red-800 text-sm">
              Clear History
            </button>
          </div>
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {history.map((entry, idx) => (
              <li
                key={idx}
                className="p-3 bg-gray-50 border rounded shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="text-sm">
                    <strong>Mess ID:</strong> {entry.messId}
                  </p>
                  <p className="text-sm">
                    <strong>Meal:</strong> {entry.type}
                  </p>
                  <p className="text-xs text-gray-500">{entry.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
