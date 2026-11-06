/** Fired on window once this browser has just been set up for push, so a listener that was not needed until now can start. */
export const PUSH_ENABLED_EVENT = "shoproom:push-enabled";

/**
 * The Firebase messaging SDK is about 130 KB. It is loaded through this one function, and only
 * when push is actually in play (permission already granted, or the person is turning it on),
 * so pages for people who never use push do not download it.
 */
export const loadMessagingSdk = () => import("firebase/messaging");
