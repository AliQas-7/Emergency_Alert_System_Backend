const { Expo } = require('expo-server-sdk');
const expo = new Expo();

async function sendPushNotification(expoPushToken, message, batteryStatus, location, emergencyType, acknowledge = false) {
  const formattedMessage = `${message}\nBattery: ${batteryStatus}%\nLocation: ${location}\nEmergency Type: ${emergencyType}`;
  
  const messages = [{
    to: expoPushToken,
    sound: 'default',
    body: formattedMessage,
    data: { 
      message: message,
      batteryStatus: batteryStatus,
      location: location,
      emergencyType: emergencyType,
      acknowledge: acknowledge
    },
  }];

  const chunks = expo.chunkPushNotifications(messages);
  for (const chunk of chunks) {
    try {
      const tickets = await expo.sendPushNotificationsAsync(chunk);
      for (const ticket of tickets) {
        if (ticket.status === 'error') {
          console.error(`Error sending notification: ${ticket.message}`);
          if (ticket.details && ticket.details.error) {
            console.error(`Error code: ${ticket.details.error}`);
          }
        }
      }
    } catch (error) {
      console.error('Error sending notification chunk:', error);
    }
  }
}

async function sendAcknowledgePushNotification(expoPushToken, message) {
  const messages = [{
    to: expoPushToken,
    sound: 'default',
    body: message,
    data: { 
      message: message,
      acknowledge: true
    },
  }];

  const chunks = expo.chunkPushNotifications(messages);
  for (const chunk of chunks) {
    try {
      const tickets = await expo.sendPushNotificationsAsync(chunk);
      for (const ticket of tickets) {
        if (ticket.status === 'error') {
          console.error(`Error sending acknowledgment notification: ${ticket.message}`);
          if (ticket.details && ticket.details.error) {
            console.error(`Error code: ${ticket.details.error}`);
          }
        }
      }
    } catch (error) {
      console.error('Error sending acknowledgment notification chunk:', error);
    }
  }
}


module.exports = {
  sendPushNotification,
  sendAcknowledgePushNotification,
};
