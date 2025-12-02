/**
 * Example Usage: Payment Integration Components
 *
 * This file contains example React components showing how to use the payment API methods.
 * Copy and adapt these examples to your actual components.
 */

"use client";
import React, { useState, useEffect } from "react";
import {
  createPaymentOrder,
  verifyPayment,
  getStudentPayments,
  getEducatorPayments,
  initiatePayment,
  settlePayment,
} from "./payment.route";

// ===================================================================
// EXAMPLE 1: Course Purchase Button with Payment
// ===================================================================

export const CoursePurchaseButton = ({ course, currentStudent }) => {
  const [loading, setLoading] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    // Check if student is already enrolled
    const enrolled = currentStudent?.courses?.includes(course._id);
    setIsEnrolled(enrolled);
  }, [course._id, currentStudent]);

  const handlePurchase = async () => {
    try {
      setLoading(true);

      // Use the helper function that handles the entire flow
      await initiatePayment(
        {
          studentId: currentStudent._id,
          resourceType: "course",
          resourceId: course._id,
          studentInfo: {
            name: `${currentStudent.firstName} ${currentStudent.lastName}`,
            email: currentStudent.email,
            mobile: currentStudent.mobileNumber,
          },
        },
        // Success callback
        (result) => {
          setLoading(false);
          alert("Payment successful! You are now enrolled in the course.");
          // Refresh page or update state
          window.location.reload();
        },
        // Failure callback
        (error) => {
          setLoading(false);
          alert(`Payment failed: ${error.message}`);
        }
      );
    } catch (error) {
      setLoading(false);
      console.error("Payment error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  if (isEnrolled) {
    return (
      <button className="bg-green-600 text-white px-6 py-3 rounded-lg" disabled>
        ✓ Already Enrolled
      </button>
    );
  }

  return (
    <button
      onClick={handlePurchase}
      disabled={loading}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Processing..." : `Buy Now - ₹${course.fees}`}
    </button>
  );
};

// ===================================================================
// EXAMPLE 2: Test Series Purchase Button
// ===================================================================

export const TestSeriesPurchaseButton = ({ testSeries, currentStudent }) => {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);

    await initiatePayment(
      {
        studentId: currentStudent._id,
        resourceType: "testSeries",
        resourceId: testSeries._id,
        studentInfo: {
          name: `${currentStudent.firstName} ${currentStudent.lastName}`,
          email: currentStudent.email,
          mobile: currentStudent.mobileNumber,
        },
      },
      (result) => {
        setLoading(false);
        alert("Enrolled in test series successfully!");
        window.location.href = `/test-series/${testSeries._id}`;
      },
      (error) => {
        setLoading(false);
        alert(`Failed: ${error.message}`);
      }
    );
  };

  return (
    <button
      onClick={handlePurchase}
      disabled={loading}
      className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
    >
      {loading ? "Processing..." : `Enroll - ₹${testSeries.price}`}
    </button>
  );
};

// ===================================================================
// EXAMPLE 3: Webinar Registration with Payment
// ===================================================================

export const WebinarRegistrationButton = ({ webinar, currentStudent }) => {
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);

    await initiatePayment(
      {
        studentId: currentStudent._id,
        resourceType: "webinar",
        resourceId: webinar._id,
        studentInfo: {
          name: `${currentStudent.firstName} ${currentStudent.lastName}`,
          email: currentStudent.email,
          mobile: currentStudent.mobileNumber,
        },
      },
      (result) => {
        setLoading(false);
        alert("Registered for webinar successfully!");
        window.location.href = `/webinars/${webinar._id}`;
      },
      (error) => {
        setLoading(false);
        alert(`Registration failed: ${error.message}`);
      }
    );
  };

  return (
    <button
      onClick={handleRegister}
      disabled={loading}
      className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
    >
      {loading
        ? "Processing..."
        : webinar.fees > 0
        ? `Register - ₹${webinar.fees}`
        : "Register Free"}
    </button>
  );
};

// ===================================================================
// EXAMPLE 4: Student Payment History Page
// ===================================================================

export const StudentPaymentHistory = ({ studentId }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadPayments();
  }, [page]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const response = await getStudentPayments(studentId, page, 10);

      if (response.success) {
        setPayments(response.data.payments);
        setTotalPages(response.data.totalPages);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading payments:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading payment history...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Payment History</h2>

      {payments.length === 0 ? (
        <p className="text-gray-500">No payments yet</p>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment._id}
              className="border rounded-lg p-4 flex justify-between items-center hover:shadow-lg transition-shadow"
            >
              <div>
                <p className="font-semibold capitalize">
                  {payment.resourceType}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(payment.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Order ID: {payment.razorpayOrderId}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">₹{payment.amount}</p>
                <span
                  className={`text-sm px-3 py-1 rounded-full ${
                    payment.status === "success"
                      ? "bg-green-100 text-green-800"
                      : payment.status === "failed"
                      ? "bg-red-100 text-red-800"
                      : payment.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {payment.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// ===================================================================
// EXAMPLE 5: Educator Revenue Dashboard
// ===================================================================

export const EducatorRevenueDashboard = ({ educatorId }) => {
  const [payments, setPayments] = useState([]);
  const [revenueSummary, setRevenueSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, settled

  useEffect(() => {
    loadRevenueData();
  }, [filter]);

  const loadRevenueData = async () => {
    try {
      setLoading(true);
      const isSettled = filter === "all" ? null : filter === "settled";
      const response = await getEducatorPayments(educatorId, 1, 20, isSettled);

      if (response.success) {
        setPayments(response.data.payments);
        setRevenueSummary(response.data.revenueSummary);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading revenue data:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading revenue data...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Revenue Dashboard</h2>

      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-sm text-blue-600 font-medium">Total Revenue</p>
          <p className="text-3xl font-bold text-blue-900">
            ₹{revenueSummary?.totalRevenue?.toLocaleString("en-IN") || 0}
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-sm text-yellow-600 font-medium">Pending Amount</p>
          <p className="text-3xl font-bold text-yellow-900">
            ₹{revenueSummary?.pendingAmount?.toLocaleString("en-IN") || 0}
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <p className="text-sm text-green-600 font-medium">Settled Amount</p>
          <p className="text-3xl font-bold text-green-900">
            ₹{revenueSummary?.settledAmount?.toLocaleString("en-IN") || 0}
          </p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded ${
            filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded ${
            filter === "pending" ? "bg-yellow-600 text-white" : "bg-gray-200"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter("settled")}
          className={`px-4 py-2 rounded ${
            filter === "settled" ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
        >
          Settled
        </button>
      </div>

      {/* Payment List */}
      <div className="space-y-3">
        <h3 className="text-xl font-semibold mb-3">Payment Transactions</h3>
        {payments.length === 0 ? (
          <p className="text-gray-500">No payments found</p>
        ) : (
          payments.map((payment) => (
            <div
              key={payment._id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  {payment.studentId?.firstName} {payment.studentId?.lastName}
                </p>
                <p className="text-sm text-gray-600 capitalize">
                  {payment.resourceType} -{" "}
                  {new Date(payment.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">₹{payment.educatorRevenue}</p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    payment.isSettled
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {payment.isSettled ? "Settled" : "Pending"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ===================================================================
// EXAMPLE 6: Manual Payment Flow (Advanced)
// ===================================================================

export const ManualPaymentFlow = ({ course, studentId }) => {
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const handleCreateOrder = async () => {
    try {
      setLoading(true);
      const response = await createPaymentOrder(
        studentId,
        "course",
        course._id
      );

      if (response.success) {
        setOrderData(response.data);
        alert("Order created! Now opening Razorpay...");
        openRazorpayCheckout(response.data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert(`Error: ${error.message}`);
    }
  };

  const openRazorpayCheckout = (orderData) => {
    const options = {
      key: orderData.keyId,
      amount: orderData.amount * 100,
      currency: "INR",
      order_id: orderData.orderId,
      name: "Faculty Pedia",
      handler: async (response) => {
        await handleVerifyPayment(response);
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleVerifyPayment = async (razorpayResponse) => {
    try {
      const result = await verifyPayment(
        razorpayResponse.razorpay_order_id,
        razorpayResponse.razorpay_payment_id,
        razorpayResponse.razorpay_signature
      );

      if (result.success) {
        alert("Payment verified! Enrollment complete.");
      }
    } catch (error) {
      alert(`Verification failed: ${error.message}`);
    }
  };

  return (
    <button onClick={handleCreateOrder} disabled={loading}>
      {loading ? "Processing..." : "Start Payment"}
    </button>
  );
};

// Note: Don't forget to add Razorpay script to your layout or page:
// <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
