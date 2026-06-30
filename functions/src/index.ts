import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { logger } from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK
initializeApp();
const db = getFirestore();

/**
 * Cloud Function triggered when a new document is created in the 'reservations' collection.
 * Sends a real-time notification to the administrator via Telegram.
 * 
 * Supports automatic retry on failure.
 */
export const onReservationCreated = onDocumentCreated({
  document: "reservations/{reservationId}",
  retry: true // Requirement 7: Enable automatic retry on failure
}, async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    logger.warn("No data associated with this creation event.");
    return;
  }

  const reservationId = event.params.reservationId;
  const data = snapshot.data();
  logger.info(`Processing new reservation: ${reservationId}`, { data });

  // Extract reservation details with dual-mapping to handle both custom input and existing application model
  const name = data.name || data.userName || "미기재";
  const phone = data.phone || data.guestPhone || "미기재";
  const date = data.date || "미기재";
  const time = data.time || "미기재";
  const product = data.product || data.className || "미기재";
  const quantity = data.quantity !== undefined ? data.quantity : (data.headCount !== undefined ? data.headCount : 1);
  const message = data.message || data.requests || data.memo || "없음";

  // Retrieve Telegram Bot Token and Chat ID from environment variables / Secret Manager
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    logger.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in environment configuration.");
    throw new Error("Configuration Error: Telegram environment variables are missing.");
  }

  // Format message as requested
  const telegramMessage = `📢 달그락 상점 신규 예약

👤 이름: ${name}
📞 전화번호: ${phone}
📅 예약일: ${date}
🕒 예약시간: ${time}
🛍 상품: ${product}
🔢 수량: ${quantity}개
💬 요청사항: ${message}`;

  try {
    logger.info(`Sending Telegram notification for reservation ${reservationId}...`);
    
    // Send Telegram message using standard global fetch (native in Node.js 18+)
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramMessage
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error("Telegram API returned non-2xx response", {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Telegram API Error: ${response.status} - ${errorText}`);
    }

    logger.info(`Successfully sent Telegram notification for reservation: ${reservationId}`);
  } catch (err: any) {
    logger.error(`Failed to send Telegram notification for reservation: ${reservationId}`, {
      error: err.message || err,
      stack: err.stack
    });
    
    // Throwing error triggers Cloud Functions automatic retry if configured
    throw err;
  }
});
