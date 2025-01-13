const { Expo } = require('expo-server-sdk');
const expo = new Expo();

async function sendPushNotification(expoPushToken, message, batteryStatus, location, emergencyType, acknowledge = false) {
  try {
    if (!Expo.isExpoPushToken(expoPushToken)) {
      console.error(`Invalid Expo Push Token: ${expoPushToken}`);
      return;
    }

    const formattedMessage = `${message}\nBattery: ${batteryStatus}%\nLocation: ${location}\nEmergency Type: ${emergencyType}`;
    const messages = [{
      to: expoPushToken,
      sound: 'default',
      body: formattedMessage,
      data: { 
        message,
        batteryStatus,
        location,
        emergencyType,
        acknowledge,
        screen: "home",
      },
    }];

    const chunks = expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
      try {
        const tickets = await expo.sendPushNotificationsAsync(chunk);
        console.log('Notification tickets:', tickets);

        // Log any errors in the tickets
        tickets.forEach((ticket) => {
          if (ticket.status === 'error') {
            console.error(`Error sending notification: ${ticket.message}`);
            if (ticket.details && ticket.details.error) {
              console.error(`Error code: ${ticket.details.error}`);
            }
          }
        });
      } catch (error) {
        console.error('Error sending notification chunk:', error);
      }
    }
  } catch (error) {
    console.error('Error in sendPushNotification:', error);
  }
}

async function sendAcknowledgePushNotification(expoPushToken, message) {
  try {
    if (!Expo.isExpoPushToken(expoPushToken)) {
      console.error(`Invalid Expo Push Token: ${expoPushToken}`);
      return;
    }

    const messages = [{
      to: expoPushToken,
      sound: 'default',
      body: message,
      data: { 
        message,
        acknowledge: true,
        screen: "home",
      },
    }];

    const chunks = expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
      try {
        const tickets = await expo.sendPushNotificationsAsync(chunk);
        console.log('Acknowledgment notification tickets:', tickets);

        tickets.forEach((ticket) => {
          if (ticket.status === 'error') {
            console.error(`Error sending acknowledgment notification: ${ticket.message}`);
            if (ticket.details && ticket.details.error) {
              console.error(`Error code: ${ticket.details.error}`);
            }
          }
        });
      } catch (error) {
        console.error('Error sending acknowledgment notification chunk:', error);
      }
    }
  } catch (error) {
    console.error('Error in sendAcknowledgePushNotification:', error);
  }
}

module.exports = {
  sendPushNotification,
  sendAcknowledgePushNotification,
};
