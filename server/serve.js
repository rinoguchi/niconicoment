const express = require('express');
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http, { cors: { origin: '*' } }); // NOTE: Access to XMLHttpRequest at 'http://localhost:9000/socket.io/' from origin 'https://hostpage.domain' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.


// 静的ファイル
app.use(express.static('public'));

// ポートリッスン開始
const port = process.env.PORT || 9000;
http.listen(port, () => {
    console.log('listening on http://localhost:' + port);
});

class Response {
    constructor(succeeded, message, content = {}) {
        this.succeeded = succeeded;
        this.message = message;
        this.content = content;
        console.log(this.message)
    }
}

// socket.io
let participantsByMeeting = new Map() // key: meetingId, value: Set<socket.id>
io.on('connection', (socket) => {
    console.log(`connected. socket.id: ${socket.id}`)

    // ミーティングを開始
    socket.on('open-meeting', (callback) => {
        participantsByMeeting.set(socket.id, new Set());
        callback(new Response(true, `Meeting ${socket.id} opened.`, { meetingId: socket.id }));
    });

    // ミーティングを終了
    socket.on('close-meeting', (callback) => {
        participants = participantsByMeeting.get(socket.id);
        for (let participant of participants) {
            io.to(participant).emit('message', `Meeting ${socket.id} closed.`);
        }
        participantsByMeeting.delete(socket.id);
        callback(new Response(true, `Meeting ${socket.id} closed.`));
        socket.disconnect();
    });

    // コメント受付
    socket.on('send-comment-to-server', (msg, callback) => {
        console.log(`send-comment-to-server started. msg: ${JSON.stringify(msg)}`);

        // ミーティングがなければ終了
        if (!participantsByMeeting.has(msg.meetingId)) {
            callback(new Response(false, `Meeting ${msg.meetingId} is not started.`))
            return;
        }

        // ミーティング参加者に追加
        participantsByMeeting.get(msg.meetingId).add(socket.id);

        // プレゼンターに通知
        io.to(msg.meetingId).emit('send-comment-to-presenter', msg.comment);

        // 正常終了を通知
        callback(new Response(false, `Send comment succeeded.`))
    });
});


