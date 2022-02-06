export const setRoomUrl = (url) => ({
  type: 'SET_ROOM_URL',
  payload: {url},
});

export const setRoomState = (state) => ({
  type: 'SET_ROOM_STATE',
  payload: {state},
});

export const setRoomActiveSpeaker = (peerId) => ({
  type: 'SET_ROOM_ACTIVE_SPEAKER',
  payload: {peerId},
});

export const setRoomStatsPeerId = (peerId) => ({
  type: 'SET_ROOM_STATS_PEER_ID',
  payload: {peerId},
});

export const setMe = ({peerId, displayName, displayNameSet, device}) => ({
  type: 'SET_ME',
  payload: {peerId, displayName, displayNameSet, device},
});

export const setMediaCapabilities = ({canSendMic, canSendWebcam}) => ({
  type: 'SET_MEDIA_CAPABILITIES',
  payload: {canSendMic, canSendWebcam},
});

export const setCanChangeWebcam = (flag) => ({
  type: 'SET_CAN_CHANGE_WEBCAM',
  payload: flag,
});

export const addProducer = (producer) => ({
  type: 'ADD_PRODUCER',
  payload: {producer},
});

export const removeProducer = (producerId) => ({
  type: 'REMOVE_PRODUCER',
  payload: {producerId},
});

export const setProducerPaused = (producerId) => ({
  type: 'SET_PRODUCER_PAUSED',
  payload: {producerId},
});

export const setProducerResumed = (producerId) => ({
  type: 'SET_PRODUCER_RESUMED',
  payload: {producerId},
});

export const setProducerTrack = (producerId, track) => ({
  type: 'SET_PRODUCER_TRACK',
  payload: {producerId, track},
});

export const setProducerScore = (producerId, score) => ({
  type: 'SET_PRODUCER_SCORE',
  payload: {producerId, score},
});

export const setWebcamInProgress = (flag) => ({
  type: 'SET_WEBCAM_IN_PROGRESS',
  payload: {flag},
});

export const addPeer = (peer) => ({
  type: 'ADD_PEER',
  payload: {peer},
});

export const removePeer = (peerId) => ({
  type: 'REMOVE_PEER',
  payload: {peerId},
});

export const setPeerDisplayName = (displayName, peerId) => ({
  type: 'SET_PEER_DISPLAY_NAME',
  payload: {displayName, peerId},
});

export const addConsumer = (consumer, peerId) => ({
  type: 'ADD_CONSUMER',
  payload: {consumer, peerId},
});

export const removeConsumer = (consumerId, peerId) => ({
  type: 'REMOVE_CONSUMER',
  payload: {consumerId, peerId},
});

export const setConsumerPaused = (consumerId, originator) => ({
  type: 'SET_CONSUMER_PAUSED',
  payload: {consumerId, originator},
});

export const setConsumerResumed = (consumerId, originator) => ({
  type: 'SET_CONSUMER_RESUMED',
  payload: {consumerId, originator},
});

export const setConsumerCurrentLayers = (consumerId, spatialLayer, temporalLayer) => ({
  type: 'SET_CONSUMER_CURRENT_LAYERS',
  payload: {consumerId, spatialLayer, temporalLayer},
});

export const setConsumerScore = (consumerId, score) => ({
  type: 'SET_CONSUMER_SCORE',
  payload: {consumerId, score},
});

export const addNotification = (notification) => ({
  type: 'ADD_NOTIFICATION',
  payload: {notification},
});

export const removeNotification = (notificationId) => ({
  type: 'REMOVE_NOTIFICATION',
  payload: {notificationId},
});

export const removeAllNotifications = () => ({
  type: 'REMOVE_ALL_NOTIFICATIONS',
});
