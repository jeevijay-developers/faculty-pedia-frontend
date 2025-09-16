"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiAlertTriangle, FiInfo, FiCheckCircle, FiX, FiAlertCircle } from 'react-icons/fi';

// Alert store to manage multiple alerts
class AlertStore {
  constructor() {
    this.alerts = [];
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.alerts));
  }

  addAlert(alert) {
    const id = Date.now() + Math.random();
    const newAlert = { ...alert, id };
    this.alerts.push(newAlert);
    this.notify();
    return id;
  }

  removeAlert(id) {
    this.alerts = this.alerts.filter(alert => alert.id !== id);
    this.notify();
  }

  clearAll() {
    this.alerts = [];
    this.notify();
  }
}

const alertStore = new AlertStore();

// Main Custom Alert Component
const CustomAlert = ({ alert, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      if (alert.onClose) alert.onClose();
    }, 200);
  };

  const handleConfirm = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      if (alert.onConfirm) alert.onConfirm();
    }, 200);
  };

  const getIcon = () => {
    switch (alert.type) {
      case 'success':
        return <FiCheckCircle className="w-6 h-6 text-green-600" />;
      case 'warning':
        return <FiAlertTriangle className="w-6 h-6 text-yellow-600" />;
      case 'error':
        return <FiAlertCircle className="w-6 h-6 text-red-600" />;
      case 'info':
      default:
        return <FiInfo className="w-6 h-6 text-blue-600" />;
    }
  };

  const getColors = () => {
    switch (alert.type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          button: 'bg-green-600 hover:bg-green-700',
          cancelButton: 'border-green-300 text-green-700 hover:bg-green-50'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          button: 'bg-yellow-600 hover:bg-yellow-700',
          cancelButton: 'border-yellow-300 text-yellow-700 hover:bg-yellow-50'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          button: 'bg-red-600 hover:bg-red-700',
          cancelButton: 'border-red-300 text-red-700 hover:bg-red-50'
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          button: 'bg-blue-600 hover:bg-blue-700',
          cancelButton: 'border-blue-300 text-blue-700 hover:bg-blue-50'
        };
    }
  };

  // Custom UI rendering
  if (alert.customUI) {
    return createPortal(
      <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-200"
          onClick={handleClose}
        />
        
        {/* Custom Content */}
        <div className={`relative bg-white rounded-2xl shadow-2xl transform transition-all duration-200 ${
          isVisible ? 'scale-100' : 'scale-95'
        }`}>
          {alert.customUI({ onClose: handleClose, onConfirm: handleConfirm })}
        </div>
      </div>,
      document.body
    );
  }

  const colors = getColors();

  return createPortal(
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-200 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 bg-opacity-50 transition-opacity duration-200"
        onClick={alert.closeOnBackdrop !== false ? handleClose : undefined}
      />
      
      {/* Alert Modal */}
      <div className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-200 ${
        isVisible ? 'scale-100' : 'scale-95'
      }`}>
        {/* Close button */}
        {alert.showCloseButton !== false && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <FiX className="w-5 h-5" />
          </button>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Icon and Title */}
          <div className="flex items-start space-x-4 mb-4">
            <div className={`flex-shrink-0 p-2 rounded-full ${colors.bg} ${colors.border} border`}>
              {getIcon()}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {alert.title || 'Confirmation'}
              </h3>
              {alert.message && (
                <p className="text-gray-600 text-sm leading-relaxed">
                  {alert.message}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
            {/* Cancel/No button */}
            {alert.showCancel !== false && (
              <button
                onClick={handleClose}
                className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200 ${colors.cancelButton}`}
              >
                {alert.cancelText || 'Cancel'}
              </button>
            )}
            
            {/* Confirm/Yes button */}
            <button
              onClick={handleConfirm}
              className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${colors.button}`}
            >
              {alert.confirmText || 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Alert Container to render all alerts
const AlertContainer = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const unsubscribe = alertStore.subscribe(setAlerts);
    return unsubscribe;
  }, []);

  if (alerts.length === 0) return null;

  return (
    <>
      {alerts.map((alert) => (
        <CustomAlert
          key={alert.id}
          alert={alert}
          onClose={() => alertStore.removeAlert(alert.id)}
        />
      ))}
    </>
  );
};

// Utility function to show alerts
export const confirmAlert = (options) => {
  const defaultOptions = {
    type: 'info',
    showCancel: true,
    showCloseButton: true,
    closeOnBackdrop: true,
    ...options
  };

  return new Promise((resolve) => {
    const alert = {
      ...defaultOptions,
      onConfirm: () => {
        resolve(true);
        if (options.onConfirm) options.onConfirm();
      },
      onClose: () => {
        resolve(false);
        if (options.onClose) options.onClose();
      }
    };

    alertStore.addAlert(alert);
  });
};

// Additional utility functions for different alert types
export const showAlert = (message, type = 'info', options = {}) => {
  return confirmAlert({
    message,
    type,
    showCancel: false,
    confirmText: 'OK',
    ...options
  });
};

export const showSuccess = (message, options = {}) => {
  return showAlert(message, 'success', { title: 'Success', ...options });
};

export const showError = (message, options = {}) => {
  return showAlert(message, 'error', { title: 'Error', ...options });
};

export const showWarning = (message, options = {}) => {
  return showAlert(message, 'warning', { title: 'Warning', ...options });
};

export const showInfo = (message, options = {}) => {
  return showAlert(message, 'info', { title: 'Information', ...options });
};

// Export the container component (add this to your main App or Layout)
export { AlertContainer };
export default CustomAlert;