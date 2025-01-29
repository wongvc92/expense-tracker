export interface IUserSession {
  id: string; // Unique identifier for the session
  sessionKey: string; // The session key
  userAgent: string; // User's browser or device information
  ipAddress: string; // IP address of the user
  createdAt: string; // ISO string of the session creation date
  expiresAt: string; // ISO string of the session expiration date
  isRevoked: boolean; // Whether the session has been revoked
}
