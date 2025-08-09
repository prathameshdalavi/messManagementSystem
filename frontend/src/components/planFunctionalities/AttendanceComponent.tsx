import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../config';
import { FaCalendarAlt, FaCamera, FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { selectSelectedPlan } from '../../redux/nearbyMessSlice';
import { Html5Qrcode } from 'html5-qrcode';

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
    // 1. Check HTTPS or localhost
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
      // 2. Stop any previous scanner
      if (html5qrcodeRef.current) {
        try { await html5qrcodeRef.current.stop(); } catch {}
        try { await html5qrcodeRef.current.clear(); } catch {}
        html5qrcodeRef.current = null;
      }

      // 3. Create scanner instance
      html5qrcodeRef.current = new Html5Qrcode('qr-reader', { verbose: false });

      // 4. Get list of cameras
      const devices = await Html5Qrcode.getCameras();
      if (!devices || devices.length === 0) {
        throw new Error("No camera found on this device.");
      }

      // 5. Prefer back camera if available
      const backCam = devices.find(d => /back|rear|environment/i.test(d.label));
      const cameraId = backCam ? backCam.id : devices[0].id;

      // 6. Start scanning
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
    } finally {
    }
  };

  const clearMessage = () => setMessage(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Attendance Records</h3>
          {selectedPlan?.messId?.messName && (
            <p className="text-sm text-gray-600 mt-1">Mess: {selectedPlan.messId.messName}</p>
          )}
        </div>
        <button
          onClick={startScanner}
          disabled={showScanner}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaCamera />
          Scan QR
        </button>
      </div>

      {showScanner && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-800">Scan QR Code</h4>
            <button onClick={stopScanner} className="text-red-600 hover:text-red-700">
              <FaTimes size={20} />
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Attendance Type</label>
            <select
              value={attendanceType}
              onChange={(e) => setAttendanceType(e.target.value as 'breakfast' | 'lunch' | 'dinner')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>
          <div id="qr-reader" className="w-full max-w-md mx-auto" />
          {scanning && (
            <div className="text-center mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
              <p className="text-gray-600 mt-2">Scanning for QR code...</p>
            </div>
          )}
        </div>
      )}

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success'
          ? 'bg-green-100 border border-green-400 text-green-700'
          : 'bg-red-100 border border-red-400 text-red-700'}`}>
          <div className="flex justify-between items-center">
            <span>{message.text}</span>
            <button onClick={clearMessage} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {!selectedPlan?.messId?._id ? (
        <div className="text-center py-8 text-gray-500">
          <FaCalendarAlt className="mx-auto text-4xl text-gray-300 mb-4" />
          <p>Please select a plan to view attendance records</p>
        </div>
      ) : attendance ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          {/* Present counts */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 mb-3">Present Counts</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Lunch Present</span>
                <span className="text-2xl font-bold text-green-600">{attendance.getLunchAttendanceCount || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Breakfast Present</span>
                <span className="text-2xl font-bold text-blue-600">{attendance.getBreakfastAttendanceCount || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Dinner Present</span>
                <span className="text-2xl font-bold text-purple-600">{attendance.getDinnerAttendanceCount || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Total Days</span>
                <span className="text-2xl font-bold text-orange-600">{attendance.totalDays || 0}</span>
              </div>
            </div>
          </div>

          {/* Absence summary */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Absence Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Lunch Absent</span>
                <span className="text-2xl font-bold text-red-600">{attendance.getLunchAbsentyCount || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Breakfast Absent</span>
                <span className="text-2xl font-bold text-red-600">{attendance.getBreakfastAbsentyCount || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Dinner Absent</span>
                <span className="text-2xl font-bold text-red-600">{attendance.getDinnerAbsentyCount || 0}</span>
              </div>
            </div>
          </div>

          {/* Percentages */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Attendance Percentages</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Lunch Attendance</span>
                <span className="text-2xl font-bold text-green-600">{attendance.lunchAttendancePercentage || 0}%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Breakfast Attendance</span>
                <span className="text-2xl font-bold text-blue-600">{attendance.breakfastAttendancePercentage || 0}%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Dinner Attendance</span>
                <span className="text-2xl font-bold text-purple-600">{attendance.dinnerAttendancePercentage || 0}%</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <FaCalendarAlt className="mx-auto text-4xl text-gray-300 mb-4" />
          <p>No attendance records available for this plan</p>
        </div>
      )}
    </div>
  );
};
