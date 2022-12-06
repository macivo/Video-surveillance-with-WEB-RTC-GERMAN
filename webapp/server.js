/*
 * Project 1 (BTI3301) 21, Berner Fachhochschule
 * Developers Gruppe 15 : Mohammed Ali, Mac Müller
 * Advisor: Stefan Cotting, Triviso AG
 *
 * Modified codes :: original source from: https://github.com/borjanebbal/webrtc-node-app
 *
 * NODE.js with socket.io and express, need https for smartphone
 * User will not be allowed to access the camera of smartphone without https protocol
 */
const express = require('express')
const https = require('https')
const app = express()
const fs = require('fs')
const options = {
    // Self signed certificate
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('key-cert.pem')
}
const server = https.createServer(options, app);
const io = require('socket.io')(server, { cookie: false });
app.use('/', express.static('public'))
const config = require("./config.json")

io.on('connection', (socket) => {
    socket.on('join', (roomId) => {
        const roomClients = io.sockets.adapter.rooms[roomId] || { length: 0 }
        const numberOfClients = roomClients.length

        if (numberOfClients === 0) {
            socket.join(roomId)
            socket.emit('room_created', roomId)
        } else if (numberOfClients ===1) {
            socket.join(roomId)
            socket.emit('room_joined', roomId)
        } else {
             socket.emit('full_room', roomId)
        }
    })

    // Check if a room with device's name is created
    socket.on('checkStatus', ()=> {
        for(const name in io.sockets.adapter.rooms){
            if(io.sockets.adapter.rooms.hasOwnProperty(name)){
                if (name !== Object.keys(io.sockets.adapter.rooms[name].sockets)[0]){
                    socket.emit('nowLive', name);
                }
            }
        }
    });

    socket.on('setTwoWaysCommunication', (setting) => {
        console.log(setting.room);
        socket.broadcast.to(setting.room).
        emit('changeTwoWaysCommunication', setting.setting);
    });

    socket.on('checkLogin', (password) => {
        if (password === config.password) {
            socket.emit('login', 'accepted')
        } else {
            socket.emit('login', 'rejected')
        }
    })
    // These events are emitted to all the sockets connected to the same room except the sender.
    socket.on('start_call', (roomId) => {
        socket.broadcast.to(roomId).emit('start_call')
    })
    socket.on('webrtc_offer', (event) => {
        socket.broadcast.to(event.roomId).emit('webrtc_offer', event.sdp)
    })
    socket.on('webrtc_answer', (event) => {
        socket.broadcast.to(event.roomId).emit('webrtc_answer', event.sdp)
    })
    socket.on('webrtc_ice_candidate', (event) => {
        socket.broadcast.to(event.roomId).emit('webrtc_ice_candidate', event)
    })
})

// START THE SERVER =================================================================
const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log(`Express server listening on port ${port}`)
});
