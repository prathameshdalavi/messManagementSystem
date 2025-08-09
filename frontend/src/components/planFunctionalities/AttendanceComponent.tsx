import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../config';
import { FaCalendarAlt, FaCamera, FaCheck, FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { selectSelectedPlan } from '../../redux/nearbyMessSlice';
import { Html5QrcodeScanner } from 'html5-qrcode';

export const AttendanceComponent: React.FC = () => {
  const [attendance, setAttendance] = useState<any>(null);
  const [scanning, setScanning] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState<string>('');
  const [markingAttendance, setMarkingAttendance] = useState(false);
  const [attendanceType, setAttendanceType] = useState<'breakfast' | 'lunch' | 'dinner'>('lunch');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  // Get selectedPlan from Redux
  const selectedPlan = useSelector(selectSelectedPlan);

  useEffect(() => {
    if (selectedPlan) {
      fetchAttendance();
    }
  }, [selectedPlan]);

  useEffect(() => {
    // Cleanup scanner when component unmounts
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, []);

  const fetchAttendance = async () => {
    if (!selectedPlan?.messId?._id) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/attendance/getRecords`, {
        messId: selectedPlan.messId._id
      }, {
        headers: { token }
      });
      
      if (response.data.success) {
        setAttendance(response.data.data);
      }
    } catch (error: any) {
      setAttendance(null);
      setMessage({ type: 'error', text: error?.response?.data?.message || 'Failed to fetch attendance records' });
    }
  };

  const startScanner = () => {
    setShowScanner(true);
    setScanning(true);
    setScanResult('');
    setMessage(null);

    // Initialize the scanner
    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      false
    );

    scannerRef.current.render(onScanSuccess, onScanFailure);
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setShowScanner(false);
    setScanning(false);
  };

  const onScanSuccess = (decodedText: string) => {
    setScanResult(decodedText);
    setScanning(false);
    stopScanner();
  };

  const onScanFailure = (error: any) => {
    // Handle scan failure silently
  };

  const markAttendance = async () => {
    if (!scanResult) {
      setMessage({ type: 'error', text: 'Please scan a QR code first' });
      return;
    }

    if (!selectedPlan?.messId?._id) {
      setMessage({ type: 'error', text: 'No mess selected' });
      return;
    }

    setMarkingAttendance(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/attendance/markattendance`,
        {
          messId: selectedPlan.messId._id, // Use the mess ID from the selected plan
          type: attendanceType
        },
        {
          headers: { token }
        }
      );

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Attendance marked successfully!' });
        setScanResult('');
        // Refresh attendance data
        await fetchAttendance();
      }
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to mark attendance' 
      });
    } finally {
      setMarkingAttendance(false);
    }
  };

  const clearMessage = () => {
    setMessage(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Attendance Records</h3>
          {selectedPlan?.messId?.messName && (
            <p className="text-sm text-gray-600 mt-1">
              Mess: {selectedPlan.messId.messName}
            </p>
          )}
        </div>
        <button
          onClick={startScanner}
          disabled={showScanner || !selectedPlan?.messId?._id}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaCamera />
          Mark Attendance
        </button>
      </div>

      {/* Scanner Section */}
      {showScanner && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-800">Scan QR Code</h4>
            <button
              onClick={stopScanner}
              className="text-red-600 hover:text-red-700"
            >
              <FaTimes size={20} />
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attendance Type
            </label>
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

          <div id="qr-reader" className="w-full max-w-md mx-auto"></div>
          
          {scanning && (
            <div className="text-center mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Scanning for QR code...</p>
            </div>
          )}
        </div>
      )}

      {/* Scan Result Section */}
      {scanResult && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Scan Result</h4>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-600 mb-2">Scanned Mess ID:</p>
            <p className="font-mono text-lg break-all">{scanResult}</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={markAttendance}
              disabled={markingAttendance}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              {markingAttendance ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Marking...
                </>
              ) : (
                <>
                  <FaCheck />
                  Mark Attendance
                </>
              )}
            </button>
            <button
              onClick={() => {
                setScanResult('');
                setMessage(null);
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          <div className="flex justify-between items-center">
            <span>{message.text}</span>
            <button onClick={clearMessage} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {/* Attendance Records Display */}
      {!selectedPlan?.messId?._id ? (
        <div className="text-center py-8 text-gray-500">
          <FaCalendarAlt className="mx-auto text-4xl text-gray-300 mb-4" />
          <p>Please select a plan to view attendance records</p>
        </div>
      ) : attendance ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          {/* Present Counts - Vertical Layout */}
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
          
          {/* Absence Summary - Vertical Layout */}
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

          {/* Attendance Percentages - Vertical Layout */}
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

          {/* Plan Status Information */}
          {attendance.isPlanPaused && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Plan Status</h4>
                <p className="text-yellow-700 text-sm">
                  ⚠️ Your plan is currently paused. You cannot mark new attendance while the plan is paused.
                  {attendance.totalPausedDays > 0 && (
                    <span className="block mt-1">Total paused days: {attendance.totalPausedDays}</span>
                  )}
                </p>
              </div>
            </div>
          )}
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

