(() => {

    class Comment {
        constructor(comment, color = 'black', size = '20px') {
            this.comment = comment;
            this.color = color;
            this.size = size;
            this.top = `${window.scrollY + Math.floor(Math.random() * Math.floor(window.innerHeight) * 0.9)}px`;
            this.duration = `${5 + Math.floor(Math.random() * (10 - 5))}s`
        }
    }

    class NiconicomentPresenter {
        constructor() {
            console.log('NiconicomentPresentor started.')
            this.socket = undefined;
            this.meetingId = undefined;
            this.arts = this.loadArts();
            this.initializeUI();
            this.registerEvents();
        }

        initializeUI() {
            // ツールボックス作成
            const toolboxEl = document.createElement('div');
            toolboxEl.className = 'niconicoment-toolbox';
            toolboxEl.innerHTML = `
            <div>
                <input type="button" id="niconicoment-open" value="open" />
                <input type="button" id="niconicoment-close" value="close" />
            </div>
            <div id="niconicoment-meeting-container">
                <input type="text" size="25" id="niconicoment-meeting-id"/><br/>
                <a id="niconicoment-participant-link" target="_blank">participant link</a>
            </div>
            `;
            document.body.appendChild(toolboxEl);

            // スタイルシート
            const styleEl = document.createElement('style');
            styleEl.innerText = `
            .niconicoment-toolbox {
                position: fixed;
                right: 10px;
                bottom: 10px;
                border-radius: 5px;
                background-color: white;
                padding: 5px;
                border: solid lightgray 1px;
                z-index: 99999;
                font-size: 12px;
                width: 170px;
                min-height: 65px;
            }
            .niconicoment-toolbox > div {
                padding: 3px;
            }
            .niconicoment-slide-comment {
                position: absolute;
                z-index: 99999;
                border: none;
                background-color: transparent;
                box-shadow: none;
            }
            @keyframes slide {
                0% { right: 0; }
                100% { right: 100%; display: none; }
            }
            `;
            document.body.appendChild(styleEl);

            this.openButtonEl = document.getElementById('niconicoment-open');
            this.closeButtonEl = document.getElementById('niconicoment-close');
            this.meetingContainerEl = document.getElementById('niconicoment-meeting-container');
            this.meetingIdEl = document.getElementById('niconicoment-meeting-id');
            this.participantLinkEl = document.getElementById('niconicoment-participant-link');

            // データ状態を元にツールボックスを再描画
            this.renderToolbox();
        }

        registerEvents() {
            // 開始ボタン
            this.openButtonEl.addEventListener('click', (e) => {
                this.socket = io('http://localhost:9000'); // NOTE: URLを指定しないとホストページのドメインで探しに行ってしまう
                this.socket.emit('open-meeting', (res) => {
                    console.log(res.message);
                    this.meetingId = res.content.meetingId;
                    this.renderToolbox();
                });
                this.socket.on('send-comment-to-presenter', (msg) => {
                    this.slideComment(new Comment(msg.comment, msg.color, msg.size));
                    this.renderToolbox();
                });
            });

            this.closeButtonEl.addEventListener('click', (e) => {
                this.socket.emit('close-meeting', (res) => {
                    console.log(res.message);
                    this.socket = undefined;
                    this.meetingId = undefined;
                    this.renderToolbox();
                });
            });
        }

        renderToolbox() {
            this.openButtonEl.disabled = (this.socket !== undefined);
            this.closeButtonEl.disabled = (this.socket === undefined);
            if (this.meetingId) {
                this.meetingIdEl.value = this.meetingId;
                this.participantLinkEl.href = `http://localhost:9000/participant.html?meetingId=${this.meetingId}`;
                this.meetingContainerEl.style.display = 'block';
            } else {
                this.meetingContainerEl.style.display = 'none';
            }
        }

        slideComment(comment) {
            const el = document.createElement('pre');
            el.className = 'niconicoment-slide-comment';
            el.style = `
                top: ${comment.top};
                animation: slide ${comment.duration} linear 0s 1 normal forwards;
                color: ${comment.color};
                -webkit-text-stroke: 1.5px ${comment.color};
                font-size: ${comment.size};
                font-family: MeiryoKe_Gothic, "Ricty Diminished", "Osaka－等幅", "Osaka-等幅", Osaka-mono, "ＭＳ ゴシック", "MS Gothic", "Courier New", Courier, Monaco, Menlo, Consolas, "Lucida Console", monospace;
            `;

            let transformedComment = comment.comment;
            for (let key of this.arts.keys()) {
                transformedComment = transformedComment.replaceAll(new RegExp(key, 'g'), this.arts.get(key));
            }

            el.textContent = transformedComment;
            document.body.appendChild(el);
        }

        loadArts() {
            const arts = new Map();
            arts.set(':quiin:', `
            キュイ━━━━ン
            　　　∧,,∧
            　　 (・ω・｀) /|　
            　／くＴ￣￣二=二] 三二─
            　￣￣￣＼二＼
            `);
            arts.set(':rabbit:', `
            　┏━┓┏━┓
            　┃　┃┃　┃
            　┃　┃┃　┃
            　┃　┃┃　┃
            　┃　┃┃　┃
            ┏┛　┗┛　┗┓
            ┃　＞ ┳ ＜　┃
            ┃ ◎┗┻┛◎ ┃
            ┃┏┓　┏┓　┃　
            ┗┫┣━┫┣━┛
            　┗┫♥┗┫
            　　┣┳┳〇゛
            `);

            return arts;
        }
    }
    new NiconicomentPresenter();
})();