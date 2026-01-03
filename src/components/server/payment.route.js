import API_CLIENT from "./config";

/**
 * Create a payment order for a course, test series, webinar, or live class
 * @param {string} studentId - Student ID
 * @param {string} resourceType - Type of resource: 'course', 'testSeries', 'webinar', 'liveClass'
 * @param {string} resourceId - ID of the resource being purchased
 * @returns {Promise<Object>} Payment order details including Razorpay order ID
 */
export const createPaymentOrder = async (
  studentId,
  resourceType,
  resourceId
) => {
  try {
    const response = await API_CLIENT.post("/api/payment/create-order", {
      studentId,
      resourceType,
      resourceId,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating payment order:", error);
    throw error;
  }
};

/**
 * Verify payment after Razorpay checkout is completed
 * @param {string} razorpayOrderId - Razorpay order ID
 * @param {string} razorpayPaymentId - Razorpay payment ID
 * @param {string} razorpaySignature - Razorpay signature for verification
 * @returns {Promise<Object>} Verification result
 */
export const verifyPayment = async (
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature
) => {
  try {
    const response = await API_CLIENT.post("/api/payment/verify", {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });
    return response.data;
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw error;
  }
};

/**
 * Get payment history for a student
 * @param {string} studentId - Student ID
 * @param {number} page - Page number for pagination (default: 1)
 * @param {number} limit - Number of items per page (default: 10)
 * @param {string} status - Filter by payment status: 'created', 'pending', 'success', 'failed', 'refunded'
 * @returns {Promise<Object>} Payment history with pagination
 */
export const getStudentPayments = async (
  studentId,
  page = 1,
  limit = 10,
  status = null
) => {
  try {
    let url = `/api/payment/student/${studentId}?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }
    const response = await API_CLIENT.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching student payments:", error);
    throw error;
  }
};

/**
 * Get payment history for an educator
 * @param {string} educatorId - Educator ID
 * @param {number} page - Page number for pagination (default: 1)
 * @param {number} limit - Number of items per page (default: 10)
 * @param {boolean} isSettled - Filter by settlement status (null for all)
 * @returns {Promise<Object>} Payment history with revenue summary
 */
export const getEducatorPayments = async (
  educatorId,
  page = 1,
  limit = 10,
  isSettled = null
) => {
  try {
    let url = `/api/payment/educator/${educatorId}?page=${page}&limit=${limit}`;
    if (isSettled !== null) {
      url += `&isSettled=${isSettled}`;
    }
    const response = await API_CLIENT.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching educator payments:", error);
    throw error;
  }
};

/**
 * Settle a payment (move from pending to settled)
 * Admin/automated function - requires appropriate permissions
 * @param {string} paymentId - Payment ID to settle
 * @returns {Promise<Object>} Settlement result
 */
export const settlePayment = async (paymentId) => {
  try {
    const response = await API_CLIENT.post(`/api/payment/settle/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error("Error settling payment:", error);
    throw error;
  }
};

/**
 * Complete payment flow helper function
 * Creates order, opens Razorpay checkout, and verifies payment
 * @param {Object} paymentData - Payment data object
 * @param {string} paymentData.studentId - Student ID
 * @param {string} paymentData.resourceType - Resource type
 * @param {string} paymentData.resourceId - Resource ID
 * @param {Object} paymentData.studentInfo - Student info for prefill
 * @param {Function} onSuccess - Success callback
 * @param {Function} onFailure - Failure callback
 */
export const initiatePayment = async (paymentData, onSuccess, onFailure) => {
  try {
    // Check if Razorpay is loaded
    if (typeof window.Razorpay === "undefined") {
      throw new Error(
        "Razorpay SDK not loaded. Please add the script: <script src='https://checkout.razorpay.com/v1/checkout.js'></script>"
      );
    }

    // Step 1: Create payment order
    const orderResponse = await createPaymentOrder(
      paymentData.studentId,
      paymentData.resourceType,
      paymentData.resourceId
    );

    if (!orderResponse.success) {
      throw new Error(
        orderResponse.message || "Failed to create payment order"
      );
    }

    const orderData = orderResponse.data;

    // Step 2: Configure Razorpay options
    const options = {
      key: orderData.keyId,
      amount: orderData.amount * 100, // Convert to paise
      currency: orderData.currency,
      order_id: orderData.orderId,
      name: "Facultypedia",
      description: `${paymentData.resourceType} Purchase`,
      image: "/logo.png", // Add your logo path
      prefill: {
        name: orderData.studentName || paymentData.studentInfo?.name || "",
        email: orderData.studentEmail || paymentData.studentInfo?.email || "",
        contact:
          orderData.studentMobile || paymentData.studentInfo?.mobile || "",
      },
      theme: {
        color: "#3399cc",
      },
      handler: async function (response) {
        try {
          // Step 3: Verify payment
          const verificationResult = await verifyPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature
          );

          if (verificationResult.success) {
            onSuccess && onSuccess(verificationResult);
          } else {
            onFailure &&
              onFailure(
                new Error(
                  verificationResult.message || "Payment verification failed"
                )
              );
          }
        } catch (error) {
          onFailure && onFailure(error);
        }
      },
      modal: {
        ondismiss: function () {
          onFailure && onFailure(new Error("Payment cancelled by user"));
        },
      },
    };

    // Step 4: Open Razorpay checkout
    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Error initiating payment:", error);
    onFailure && onFailure(error);
  }
};

/**
 * Get payment status by order ID (helper function)
 * @param {string} orderId - Razorpay order ID
 * @returns {Promise<Object>} Payment status
 */
export const getPaymentStatus = async (orderId) => {
  try {
    // This would need a backend endpoint that checks payment status
    // For now, you can use getStudentPayments and filter
    throw new Error("Not implemented - use getStudentPayments instead");
  } catch (error) {
    console.error("Error getting payment status:", error);
    throw error;
  }
};

// Export all payment-related functions
const paymentService = {
  createPaymentOrder,
  verifyPayment,
  getStudentPayments,
  getEducatorPayments,
  settlePayment,
  initiatePayment,
  getPaymentStatus,
};

export default paymentService;
