import { Toaster } from "react-hot-toast";

const ModernToaster = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerStyle={{
        top: 20,
        right: 20,
      }}
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: "12px",
          fontWeight: "500",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          fontSize: "14px",
          maxWidth: "400px",
        },
        success: {
          style: {
            background: "#F0FDF4",
            color: "#16A34A",
            border: "1px solid #BBF7D0",
          },
          iconTheme: {
            primary: "#16A34A",
            secondary: "#F0FDF4",
          },
        },
        error: {
          style: {
            background: "#FEF2F2",
            color: "#DC2626",
            border: "1px solid #FECACA",
          },
          iconTheme: {
            primary: "#DC2626",
            secondary: "#FEF2F2",
          },
        },
        loading: {
          style: {
            background: "#EBF8FF",
            color: "#1E40AF",
            border: "1px solid #BFDBFE",
          },
          iconTheme: {
            primary: "#1E40AF",
            secondary: "#EBF8FF",
          },
        },
      }}
    />
  );
};

export default ModernToaster;
