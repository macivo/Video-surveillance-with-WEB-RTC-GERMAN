/*
 * Project 1 (BTI3301) 21, Berner Fachhochschule
 * Developers Gruppe 15 : Mohammed Ali, Mac Müller
 * Advisor: Stefan Cotting, Triviso AG
 *
 * Component: Generating html elements for live-page
 * Live-page: User can see the live-video from other smartphone
 */
import service from "../service.js"
import data from "../data.js";
import router from "../router.js";

let mediaRecorder;
let recordedBlobs;

/**
 * Generating html elements for live-page
 * @param $comp template from index.html
 */
function liveRender($comp) {
    const password = data.getPassword();
    const deviceName = data.getDeviceName();
    // Join the connection with camera without microphone.
    const callback = function (login){
        if(login === 'accepted'){
            console.log(login);
            $comp[0].append(service.getRemoteVideo());
            $comp[0].append(createRecordButton());
            $comp[0].append(createSpeakingButton());

        } else {
            setTimeout(function () {
                $('.errorLabel').text('Falsches Password!');
            }, 500);
            setTimeout(function () {
                location.reload();
            }, 2000);
        }
    };
    service.init(deviceName, true, password, callback);
}

/**
 * Generation a button with recording function
 * @returns {HTMLDivElement} button of recording function
 */
function createRecordButton(){
    const div = document.createElement('div');
    const recordBtn = document.createElement('button');
    recordBtn.textContent = "Video Aufnehmen";
    recordBtn.addEventListener('click', () =>{
        if(recordBtn.textContent === "Video Aufnehmen") {
            startRecording();
            recordBtn.textContent = "Aufnahme beenden";
        } else {
            stopRecording();
            recordBtn.textContent = "Video Aufnehmen";
        }
    });
    div.append(recordBtn);
    return div;
}

/**
 * Function if a recording-button is clicked
 */
function startRecording(){
    recordedBlobs = [];
    const video = service.getRemoteVideo();
    try {
        mediaRecorder = new MediaRecorder(video.srcObject, {mimeType: 'video/webm;codecs=vp8,opus'});
    }  catch (e) {
        console.error('Exception while creating MediaRecorder:', e);
    }
    mediaRecorder.ondataavailable = (event) => {
        console.log(' Recorded chunk of size ' + event.data.size + "B");
        if (event.data && event.data.size > 0) {
            recordedBlobs.push(event.data);
        }
    };
    mediaRecorder.onstop = (event) => {
        download(recordedBlobs);
    };
   mediaRecorder.start();
}

/**
 * Function for downloading the video-record
 * @param $recordedBlobs Data of video
 */
function download($recordedBlobs){
    const date = new Date();
    let dateStamp = date.toLocaleDateString()+'_'+date.toLocaleTimeString();
    dateStamp = dateStamp.split(/\.|:/).join('_');
    console.log(dateStamp);
    let blob = new Blob($recordedBlobs, {
        type: 'video/webm'
    });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.style = 'display: none';
    a.href = url;
    a.download = 'CTV_'+dateStamp+'.webm';
    a.click();
    window.URL.revokeObjectURL(url);
}

/**
 * Stop the recording
 */
function stopRecording(){
   mediaRecorder.stop();
}

/**
 * Generation a button with 2-ways-communication
 * @returns {HTMLDivElement} a button with function
 */
function createSpeakingButton(){
    const div = document.createElement('div');
    const speakBtn = document.createElement('button');
    speakBtn.textContent = "Sprechen";
    speakBtn.addEventListener('click', () =>{
        if(speakBtn.textContent === "Sprechen") {
            service.setTwoWaysCommunication(true, data.getDeviceName());
            speakBtn.textContent = "Stumm schalten";
        } else {
            service.setTwoWaysCommunication(false, data.getDeviceName());
            speakBtn.textContent = "Sprechen";
        }
    });
    div.append(speakBtn);
    return div;
}

/**
 *  Public interface
 **/
export default {
    getTitle: function () {
        return "Live";
    },
    render: function () {
        const $comp = $($('#tpl-live').html());
        liveRender($comp);
        return $comp;
    }
}
