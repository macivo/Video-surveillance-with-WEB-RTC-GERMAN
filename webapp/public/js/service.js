/*
 * Project 1 (BTI3301) 21, Berner Fachhochschule
 * Developers Gruppe 15 : Mohammed Ali, Mac Müller
 * Advisor: Stefan Cotting, Triviso AG
 *
 * Modified codes :: original source from: https://github.com/borjanebbal/webrtc-node-app
 *
 * Video conferencing service
 */
import data from "./data.js";

const localVideo = document.createElement("video");
const remoteVideo = document.createElement("video");
const socket = io();
let mediaConstraints = {
    audio: true,
    video: { facingMode: 'environment' },
}
let pageCallback;
let roomId;
let localStream
let remoteStream
let isRoomCreator;
let rtcPeerConnection
// It's possible to use STUN-Servers in the future.
const iceServers = { }

/**
 * the init function must be called before using the service
 * @param deviceName - will be used as chat-room-identification
 * @param audio - for setting if joining to the chat-room with/without microphone
 * @param password - password for using the application
 * @param callback - a call-back function after login succeeded
 */
function renderService(deviceName, audio, password, callback){
    mediaConstraints.audio = audio;
    localVideo.addEventListener('loadedmetadata', function() {
        console.log(`Local video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
    })
    roomId = deviceName;
    localVideo.autoplay = true;
    localVideo.playsInline = true;
    localVideo.muted = true;
    localVideo.controls = true;

    remoteVideo.autoplay = true;
    remoteVideo.playsInline = true;
    pageCallback = callback;
    socket.emit('checkLogin', password);
}

///////////////////////////////////////////////////////////////////////
// Socket Event-Handlers: A function will be called if a socket receive
//////////////////////////////////////////////////////////////////////
socket.on('login', async (login) =>{
        joinRoom(roomId)
        pageCallback(login);
});
socket.on('room_created', async () => {
    await setLocalStream(mediaConstraints);
    isRoomCreator = true;
    remoteVideo.muted = true; // two ways communication is off
    data.setCam(true); // define as cctv camera
})
socket.on('room_joined', async () => {
    await setLocalStream(mediaConstraints)
    socket.emit('start_call', roomId)
})
socket.on('full_room', async () => {
    alert('Beta Version: nur 2 zwei Verbindungen erlaubt.');
})
socket.on('nowLive', async (room) => {
    setTimeout(function () {
        const deviceName = $('#deviceName');
        deviceName.val(room);
        deviceName.prop('readonly', true);
        $('.errorLabel').html('Kamera: "'+ room +'" ist online. </br> Bitte geben Sie das Password ein');
        $('.start-img').attr("src","../image/test.svg");
        data.setLive(room);
    }, 500);
})
socket.on('start_call', async () => {
    if (isRoomCreator) {
        rtcPeerConnection = new RTCPeerConnection(iceServers)
        addLocalTracks(rtcPeerConnection)
        rtcPeerConnection.ontrack = setRemoteStream
        rtcPeerConnection.onicecandidate = sendIceCandidate
        await createOffer(rtcPeerConnection)
    }
})
socket.on('webrtc_offer', async (event) => {
    if (!isRoomCreator) {
        rtcPeerConnection = new RTCPeerConnection(iceServers)
        addLocalTracks(rtcPeerConnection)
        rtcPeerConnection.ontrack = setRemoteStream
        rtcPeerConnection.onicecandidate = sendIceCandidate
        rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event))
        await createAnswer(rtcPeerConnection)
    }
})
socket.on('webrtc_answer', (event) => {
    rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event))
})
socket.on('webrtc_ice_candidate', (event) => {
    // ICE candidate configuration.
    const candidate = new RTCIceCandidate({
        sdpMLineIndex: event.label,
        candidate: event.candidate,
    })
    rtcPeerConnection.addIceCandidate(candidate)
})
socket.on('changeTwoWaysCommunication', async(setting) => {
    if (data.isCam()){ //setting only on device as cctv
        if(setting === true){
            // two ways communication is true => unmute
            remoteVideo.muted = false;
            console.log("two ways communication is on");
        } else {
            remoteVideo.muted = true;
            console.log("two ways communication is off");
        }
    }
});

////////////////////////////////////////////////////////////
// Helper Functions
////////////////////////////////////////////////////////////
/**
 * Function: join conference
 * @param room - name of device
 */
function joinRoom(room) {
    if (room === '') {
        alert('Please type a room ID')
    } else {
        roomId = room
        socket.emit('join', room)
    }
}

/**
 * Function: check login
 * @param password - password of application
 */
function checkLogin(password) {
    socket.emit('identify', password)
}

/**
 * Function: request to access the camera and microphone of users smartphone
 * @param mediaConstraints - constraint of devices accessing
 * @returns {Promise<void>}
 */
async function setLocalStream(mediaConstraints) {
    let stream
    try {
        stream = await navigator.mediaDevices.getUserMedia(mediaConstraints)
    } catch (error) {
        console.error('Could not get user media', error)
    }
    localStream = stream
    localVideo.srcObject = stream
}

/**
 * Function: add users media to connection
 * @param rtcPeerConnection - connection to signaling server
 */
function addLocalTracks(rtcPeerConnection) {
    localStream.getTracks().forEach((track) => {
        rtcPeerConnection.addTrack(track, localStream)
    })
}

/**
 * Function: peering with session of the connection
 * @param rtcPeerConnection - connection to signaling server
 */
async function createOffer(rtcPeerConnection) {
    let sessionDescription
    try {
        sessionDescription = await rtcPeerConnection.createOffer()
        rtcPeerConnection.setLocalDescription(sessionDescription)
    } catch (error) {
        console.error(error)
    }
    socket.emit('webrtc_offer', {
        type: 'webrtc_offer',
        sdp: sessionDescription,
        roomId,
    })
}

/**
 * Function: peering with session of the connection
 * @param rtcPeerConnection - connection to signaling server
 */
async function createAnswer(rtcPeerConnection) {
    let sessionDescription
    try {
        sessionDescription = await rtcPeerConnection.createAnswer()
        rtcPeerConnection.setLocalDescription(sessionDescription)
    } catch (error) {
        console.error(error)
    }
    socket.emit('webrtc_answer', {
        type: 'webrtc_answer',
        sdp: sessionDescription,
        roomId,
    })
}

/**
 * Function: binding the live-video to html video element
 * @param event - stream source
 */
function setRemoteStream(event) {
    remoteVideo.srcObject = event.streams[0]
    remoteStream = event.stream
}

/**
 * Function: emitting to server a new joining connection
 * @param event
 */
function sendIceCandidate(event) {
    if (event.candidate) {
        socket.emit('webrtc_ice_candidate', {
            roomId,
            label: event.candidate.sdpMLineIndex,
            candidate: event.candidate.candidate,
        })
    }
}



/**
 *  Public interface
 **/
export default {
    // return video of user
    getLocalVideo: function () {
        return localVideo;
    },
    // return video of another device
    getRemoteVideo: function () {
        return remoteVideo;
    },
    // check if a device with live camera is already live
    checkStatus: function (){
        socket.emit('checkStatus');
    },
    // fist generating function to use a service
    init: function (deviceName, audio, password, callback) {
        renderService(deviceName, audio, password, callback);
    },
    // mute or unmute the 2-ways-com
    setTwoWaysCommunication: function (value ,room) {
        let setting = {};
        setting.setting = value;
        setting.room = room;
        socket.emit('setTwoWaysCommunication', setting);
    }
}
