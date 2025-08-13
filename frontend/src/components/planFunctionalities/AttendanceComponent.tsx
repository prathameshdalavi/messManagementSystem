import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../config';
import { FaCalendarAlt, FaCamera, FaTimes, FaQrcode, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { selectSelectedPlan } from '../../redux/nearbyMessSlice';
import { Html5Qrcode } from 'html5-qrcode';
import { motion, AnimatePresence } from 'framer-motion';

export const AttendanceComponent: React.FC = () => {
  const [attendance, setAttendance] = useState<any>(null);
  const [scanning, setScanning] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [attendanceType, setAttendanceType] = useState<'breakfast' | 'lunch' | 'dinner'>('lunch');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const html5qrcodeRef = useRef<Html5Qrcode | null>(null);

  const selectedPlan = useSelector(selectSelectedPlan);

  useEffect(() => {
    if (selectedPlan) {
      fetchAttendance();
    }
  }, [selectedPlan]);

  useEffect(() => {
    return () => {
      if (html5qrcodeRef.current) {
        html5qrcodeRef.current.stop().catch(() => {}).finally(() => {
          html5qrcodeRef.current?.clear();
          html5qrcodeRef.current = null;
        });
      }
    };
  }, []);

  const fetchAttendance = async () => {
    if (!selectedPlan?.messId?._id) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/attendance/getRecords`,
        { messId: selectedPlan.messId._id },
        { headers: { token } }
      );
      if (response.data.success) setAttendance(response.data.data);
    } catch (error: any) {
      setAttendance(null);
      setMessage({ type: 'error', text: error?.response?.data?.message || 'Failed to fetch attendance records' });
    }
  };

  const startScanner = async () => {
    const isSecure = window.isSecureContext ||
      window.location.protocol === 'https:' ||
      window.location.hostname === 'localhost';
    if (!isSecure) {
      setMessage({ type: 'error', text: 'Camera requires HTTPS or localhost. Open the site via HTTPS.' });
      return;
    }

    setShowScanner(true);
    setScanning(true);
    setMessage(null);

    try {
      if (html5qrcodeRef.current) {
        try { await html5qrcodeRef.current.stop(); } catch {}
        try { await html5qrcodeRef.current.clear(); } catch {}
        html5qrcodeRef.current = null;
      }

      html5qrcodeRef.current = new Html5Qrcode('qr-reader', { verbose: false });

      const devices = await Html5Qrcode.getCameras();
      if (!devices || devices.length === 0) {
        throw new Error("No camera found on this device.");
      }

      const backCam = devices.find(d => /back|rear|environment/i.test(d.label));
      const cameraId = backCam ? backCam.id : devices[0].id;

      const config: any = { fps: 10, qrbox: { width: 250, height: 250 } };
      await html5qrcodeRef.current.start(
        cameraId,
        config,
        onScanSuccess,
        () => {}
      );

    } catch (err: any) {
      console.error("Camera start failed:", err);
      setScanning(false);
      setShowScanner(false);

      const msg = err?.message || JSON.stringify(err);
      if (/Permission|denied|NotAllowedError/i.test(msg)) {
        setMessage({ type: 'error', text: 'Camera permission denied. Please allow camera access in browser settings.' });
      } else if (/NotFoundError|no camera|OverconstrainedError/i.test(msg)) {
        setMessage({ type: 'error', text: 'No suitable camera found. Try switching to a different device.' });
      } else if (/NotReadableError|track/i.test(msg)) {
        setMessage({ type: 'error', text: 'Camera is already in use by another application. Close it and try again.' });
      } else if (/secure context|https/i.test(msg)) {
        setMessage({ type: 'error', text: 'Camera requires HTTPS. Use an HTTPS tunnel like ngrok or localtunnel.' });
      } else {
        setMessage({ type: 'error', text: `Could not start camera: ${msg}` });
      }
    }
  };

  const stopScanner = () => {
    const stop = async () => {
      if (html5qrcodeRef.current) {
        try { await html5qrcodeRef.current.stop(); } catch {}
        try { await html5qrcodeRef.current.clear(); } catch {}
        html5qrcodeRef.current = null;
      }
      setShowScanner(false);
      setScanning(false);
    };
    void stop();
  };

  const onScanSuccess = (decodedText: string) => {
    stopScanner();
    setMessage({ type: 'success', text: 'QR scanned. Marking attendance...' });
    void markAttendance(decodedText);
  };

  const markAttendance = async (messIdFromScan: string) => {
    if (!messIdFromScan) {
      setMessage({ type: 'error', text: 'Invalid QR content' });
      return;
    }
    setMessage(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/attendance/markattendance`,
        { messId: messIdFromScan, type: attendanceType },
        { headers: { token } }
      );
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Attendance marked successfully!' });
        await fetchAttendance();
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error?.response?.data?.message || 'Failed to mark attendance' });
    }
  };

  const clearMessage = () => setMessage(null);

  const renderStatCard = (title: string, value: number, color: string, icon: React.ReactNode) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('text', 'bg').replace('-600', '-100')}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaCalendarAlt className="text-teal-500" />
            Attendance Records
          </h3>
          {selectedPlan?.messId?.messName && (
            <p className="text-sm text-gray-600 mt-1">Mess: {selectedPlan.messId.messName}</p>
          )}
        </div>
        <button
          onClick={startScanner}
          disabled={showScanner}
          className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaQrcode />
          Scan QR
        </button>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-lg flex items-center justify-between ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
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

      {showScanner && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaCamera className="text-teal-500" />
              Scan QR Code
            </h4>
            <button onClick={stopScanner} className="text-gray-400 hover:text-gray-600">
              <FaTimes size={20} />
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Meal Type</label>
            <select
              value={attendanceType}
              onChange={(e) => setAttendanceType(e.target.value as 'breakfast' | 'lunch' | 'dinner')}
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

      {!selectedPlan?.messId?._id ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="bg-gray-50 p-6 rounded-full inline-block mb-4">
            <FaCalendarAlt className="mx-auto text-4xl text-gray-300" />
          </div>
          <h4 className="text-lg font-medium text-gray-600 mb-2">No Plan Selected</h4>
          <p className="text-gray-400 max-w-md mx-auto">
            Please select a mess plan from the sidebar to view attendance records.
          </p>
        </motion.div>
      ) : attendance ? (
        <div className="space-y-6">
          {/* Present Stats */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Present Counts</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderStatCard(
                'Lunch Present',
                attendance.getLunchAttendanceCount || 0,
                'text-green-600',
                <FaCheckCircle className="text-green-500" />
              )}
              {renderStatCard(
                'Breakfast Present',
                attendance.getBreakfastAttendanceCount || 0,
                'text-blue-600',
                <FaCheckCircle className="text-blue-500" />
              )}
              {renderStatCard(
                'Dinner Present',
                attendance.getDinnerAttendanceCount || 0,
                'text-purple-600',
                <FaCheckCircle className="text-purple-500" />
              )}
              {renderStatCard(
                'Total Days',
                attendance.totalDays || 0,
                'text-teal-600',
                <FaCalendarAlt className="text-teal-500" />
              )}
            </div>
          </div>

          {/* Absent Stats */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Absent Counts</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {renderStatCard(
                'Lunch Absent',
                attendance.getLunchAbsentyCount || 0,
                'text-red-600',
                <FaTimesCircle className="text-red-500" />
              )}
              {renderStatCard(
                'Breakfast Absent',
                attendance.getBreakfastAbsentyCount || 0,
                'text-red-600',
                <FaTimesCircle className="text-red-500" />
              )}
              {renderStatCard(
                'Dinner Absent',
                attendance.getDinnerAbsentyCount || 0,
                'text-red-600',
                <FaTimesCircle className="text-red-500" />
              )}
            </div>
          </div>

          {/* Percentage Stats */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Attendance Percentages</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {renderStatCard(
                'Lunch Attendance',
                attendance.lunchAttendancePercentage || 0,
                'text-green-600',
                <span className="font-bold">%</span>
              )}
              {renderStatCard(
                'Breakfast Attendance',
                attendance.breakfastAttendancePercentage || 0,
                'text-blue-600',
                <span className="font-bold">%</span>
              )}
              {renderStatCard(
                'Dinner Attendance',
                attendance.dinnerAttendancePercentage || 0,
                'text-purple-600',
                <span className="font-bold">%</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="bg-gray-50 p-6 rounded-full inline-block mb-4">
            <FaCalendarAlt className="mx-auto text-4xl text-gray-300" />
          </div>
          <h4 className="text-lg font-medium text-gray-600 mb-2">No Records Found</h4>
          <p className="text-gray-400 max-w-md mx-auto">
            No attendance records available for this plan yet.
          </p>
          <button
            onClick={fetchAttendance}
            className="mt-4 text-sm text-teal-600 hover:text-teal-800 font-medium transition-colors"
          >
            Refresh Records
          </button>
        </motion.div>
      )}
    </div>
  );
};