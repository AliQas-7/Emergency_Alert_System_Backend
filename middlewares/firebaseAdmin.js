const admin = require('firebase-admin');

// Create a service account object using environment variables
const serviceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDsalIMmjdHqdkz\nNHKVVi9K1YZ3SQ4s0HnfWzD73mjc3sZJmW2v4m+oZoDSVC1e+KJH9uXZhogM/T4k\nTRqpVGBaNAnVY6NLjVHlwHqkfEJ5lqE5PnAeJdInPbhR1AguM82qlBBi6WlvtXSA\n+8YfgaNiMaQwr6RremlXxjBj4z97WAnbBhZWo6R2dNfJbN0cULHXe9KHOgxZlE/G\nkIR4sCHpHa3qxhcFROJkTEgGfRhe2eAPiv7CgyZ+IoDSfLSeToAcRxf8Vz4v359a\nRj2xcQ8cH8dbdr7ryC8DQfxxWj9oC/EqKzRC3HwgyyHQM61j7j7jnYprc0m++lV5\nD7I20DrpAgMBAAECggEAWpwNQmNA2KiSZHuvhuj3Szk3RjSryCVG8IIk7gO6MRz4\n5nB1h7nDjclrijFVCldE60wHoC1dq4zL6mHa3BdIronPUwfTKDvLrcDtwGkXmT5Q\nIH57vjJEr2GKaWJYmEymgMAq354SGQx00JKuxpiLJDFeeoJ3A/JwuYFuPnp0dDL3\nRzmCzq6EUKvrWglwhKBAuFhkzwttNJhKULdPtukw5FrCCG01E6TFn0nbg+P9B3pt\nGpJZ+ldCuObDfqdcbOaCUIaWkXuz97o9u2UFkjQukodSeWsipgkIJK+pWEXo2S5F\nexEhecaUEaO86nnPlX9q64wv9jE/j1B9YIfbDliheQKBgQD6tZimEi4hDkN8onM8\njFfRdnZ9oFibbRClrZei+FAtNbkSDS8UyvGTa/CqCXAz+QZXxD45Sm2c/W5qbUgv\ncCf1GJUfEDLh5F/JEgt5MU2Ujz8nRAfOcqsw2DLkq35JVHyBwR7tFFE768b1lRKz\nCOntbvXSs2VAKc6sPs6lWvKXewKBgQDxZ4DyDI2d/uh72SmAyIy6DSaLo1jD5/QX\nlsjkni/klPF09hQb7FF2Bl3pjcKLCmkaSwUjGurnXlI9wyprVLpAgErHSYR0jrPc\nqn37xNWgB2KVCTWelFlomEb8IhVE3ngw4S8MGbDXELb5RPJHMGeQBinp9gzL6n8g\nKBRfiI936wKBgHGip+r2KJRxC6PNWiAimJdnc3OjnyXrvHTsBuQmWujzBcypzyJE\njlS8wxu/JW1ZPUfAuldrZd2XfVmd6O8fjezo1IZ86CM9STExDaRD9Z8VgpGAo20u\nymtcQ00kchw4wCpr52GcKOnZB5g+lngx3R3yglebWpRHntaxrSaD35tLAoGAJGV/\nmn7sBys8sBeQ21rhZNfAvQL2yiq5sajJRzbWb7dJJGJJq+AYdBwHosP91erO5+jx\nsFZJnnKpIajAR4hxwHHXVG6wKsatNZL7Ba+qqcMTSPcnf25MgKmc4jzdShHkuzHo\nXwGsmPBrNfAAO11/78YOIbk4OrJzUkzYrYKwZtsCgYBrldhS9Tfv7mwDkMJK9T6N\ntAbxi2P7N0E6ZtVABIq7zQ/hZ5S78t8j4Z36dlHxN5YIgm4CKLzuJccAFRJwXQ34\nat2l0ASXzT+qstYhZJJ/fDakeLwHe6Vo0+wPB9RlSnE/4TjD4iYkqXZf7mJSxzGy\nKCXbQpW7edDVgaTkZkPzrw==\n-----END PRIVATE KEY-----\n",
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
 auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL.replace('@', '%40')}`,
  universe_domain: 'googleapis.com'
};


// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

console.log('Firebase Admin Initialized');

// Export Firebase Admin for use in other files
const db = admin.firestore();

module.exports = { admin, db };
