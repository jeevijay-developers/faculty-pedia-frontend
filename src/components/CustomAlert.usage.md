# Custom Alert System Usage Guide

## 🚀 Setup

### 1. Add AlertContainer to your main layout/app

```jsx
// In your main layout.js or _app.js
import { AlertContainer } from './components/CustomAlert';

export default function Layout({ children }) {
  return (
    <html>
      <body>
        {children}
        <AlertContainer />
      </body>
    </html>
  );
}
```

## 📝 Usage Examples

### Basic Confirmation Dialog
```jsx
import { confirmAlert } from '../components/CustomAlert';

const handleDelete = async () => {
  const result = await confirmAlert({
    title: 'Are you sure?',
    message: 'You want to delete this file? This action cannot be undone.',
    type: 'error',
    confirmText: 'Yes, Delete it!',
    cancelText: 'No, Keep it'
  });
  
  if (result) {
    // User confirmed
    deleteFile();
  }
};
```

### Custom UI Example (Like your requirement)
```jsx
import { confirmAlert } from '../components/CustomAlert';

const handleCustomDelete = () => {
  confirmAlert({
    customUI: ({ onClose, onConfirm }) => {
      return (
        <div className='bg-white p-6 rounded-2xl shadow-2xl max-w-md'>
          <h1 className="text-xl font-bold text-gray-900 mb-4">Are you sure?</h1>
          <p className="text-gray-600 mb-6">You want to delete this file?</p>
          <div className="flex space-x-3 justify-end">
            <button 
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              No
            </button>
            <button
              onClick={() => {
                handleClickDelete();
                onConfirm();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Yes, Delete it!
            </button>
          </div>
        </div>
      );
    }
  });
};
```

### Quick Alert Types
```jsx
import { showSuccess, showError, showWarning, showInfo } from '../components/CustomAlert';

// Success alert
showSuccess('File deleted successfully!');

// Error alert
showError('Something went wrong. Please try again.');

// Warning alert
showWarning('You have unsaved changes.');

// Info alert
showInfo('New update available.');
```

### Advanced Options
```jsx
confirmAlert({
  title: 'Delete Account',
  message: 'This will permanently delete your account and all associated data.',
  type: 'error',
  confirmText: 'Delete Account',
  cancelText: 'Cancel',
  closeOnBackdrop: false,        // Prevent closing by clicking outside
  showCloseButton: false,        // Hide X button
  showCancel: true,             // Show cancel button
  onConfirm: () => {
    console.log('Confirmed!');
  },
  onClose: () => {
    console.log('Cancelled!');
  }
});
```

## 🎨 Alert Types & Colors

- **success** - Green theme for successful actions
- **error** - Red theme for destructive actions
- **warning** - Yellow theme for caution
- **info** - Blue theme for information (default)

## 🔧 API Reference

### `confirmAlert(options)`
Main function to show confirmation dialogs.

**Options:**
- `title` - Alert title
- `message` - Alert message
- `type` - 'success' | 'error' | 'warning' | 'info'
- `confirmText` - Confirm button text
- `cancelText` - Cancel button text
- `showCancel` - Show cancel button (default: true)
- `showCloseButton` - Show X close button (default: true)
- `closeOnBackdrop` - Close when clicking outside (default: true)
- `customUI` - Custom React component function
- `onConfirm` - Callback when confirmed
- `onClose` - Callback when closed/cancelled

### Quick Functions
- `showAlert(message, type, options)` - Basic alert
- `showSuccess(message, options)` - Success alert
- `showError(message, options)` - Error alert  
- `showWarning(message, options)` - Warning alert
- `showInfo(message, options)` - Info alert

## 🎯 Professional Features

✅ **Professional Design** - Matches your educational platform theme
✅ **TypeScript Ready** - Full type support
✅ **Portal Rendering** - Renders outside component tree
✅ **Promise Based** - Async/await support
✅ **Multiple Alerts** - Support for stacked alerts
✅ **Custom UI** - Complete customization support
✅ **Responsive** - Mobile-friendly design
✅ **Accessibility** - ARIA compliant
✅ **Animations** - Smooth transitions
✅ **Themed** - Color-coded alert types