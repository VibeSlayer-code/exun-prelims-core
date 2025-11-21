import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import './VideoUplink.css';

const VideoUplink = ({ onClose, serviceName = "Unknown Service" }) => {
  // --- PEERJS STATE ---
  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const [connectionStatus, setConnectionStatus] = useState("Waiting for connection...");
  const [timeElapsed, setTimeElapsed] = useState("00:00");
  
  const currentUserVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerInstance = useRef(null);

  // --- TIMER LOGIC ---
  useEffect(() => {
    let seconds = 0;
    const interval = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        setTimeElapsed(`${mins}:${secs}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- PEERJS LOGIC ---
  useEffect(() => {
    const peer = new Peer();

    peer.on('open', (id) => {
      setPeerId(id);
    });

    peer.on('call', (call) => {
      setConnectionStatus("Connecting...");
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((mediaStream) => {
          currentUserVideoRef.current.srcObject = mediaStream;
          currentUserVideoRef.current.play();
          
          call.answer(mediaStream);
          
          call.on('stream', (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play();
            setConnectionStatus("Connected");
          });
        });
    });

    peerInstance.current = peer;
  }, []);

  const callPeer = () => {
    if(!remotePeerIdValue) return;
    setConnectionStatus("Dialing...");
    
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();

        const call = peerInstance.current.call(remotePeerIdValue, mediaStream);

        call.on('stream', (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
          setConnectionStatus("Connected");
        });
      });
  };

  return (
    <div className="modern-overlay">
      
      {/* --- MAIN CONTAINER --- */}
      <div className="modern-interface">
        
        {/* 1. HEADER */}
        <div className="interface-header">
            <div className="header-left">
                <button className="back-circle-btn" onClick={onClose}>←</button>
                <div>
                    <h2 className="header-title">Nixun Secure Channel</h2>
                    <p className="header-sub">Encrypted Uplink // {connectionStatus}</p>
                </div>
            </div>
            <div className="header-right">
                <span>Time Elapsed: {timeElapsed}</span>
            </div>
        </div>

        <div className="interface-body">
            
            {/* 2. VIDEO STAGE (LEFT) */}
            <div className="video-stage">
                {/* REMOTE VIDEO (Main) */}
                <video ref={remoteVideoRef} className="main-feed" />
                
                {/* PLACEHOLDER IF NO VIDEO */}
                <div className="video-placeholder">
                    <div className="avatar-circle">Op</div>
                    <p>Waiting for video feed...</p>
                    <div className="connect-box">
                        <p>Your ID: <span className="highlight-id">{peerId}</span></p>
                        <div className="join-row">
                            <input 
                                type="text" 
                                placeholder="Enter Partner ID"
                                value={remotePeerIdValue}
                                onChange={(e) => setRemotePeerIdValue(e.target.value)}
                            />
                            <button onClick={callPeer}>CONNECT</button>
                        </div>
                    </div>
                </div>

                {/* SELF VIEW (PiP) */}
                <div className="pip-wrapper">
                    <video ref={currentUserVideoRef} muted className="pip-feed" />
                </div>

                {/* FLOATING CONTROLS */}
                <div className="control-bar">
                    <button className="ctrl-btn">🎤</button>
                    <button className="ctrl-btn">📷</button>
                    <button className="ctrl-btn">✋</button>
                    <button className="ctrl-btn hangup" onClick={onClose}>📞</button>
                </div>
            </div>

            {/* 3. SIDEBAR (RIGHT) */}
            <div className="sidebar-panel">
                
                {/* INFO CARD */}
                <div className="info-card">
                    <h3>{serviceName}</h3>
                    <p>Service Inquiry Meeting</p>
                </div>

                {/* TABS */}
                <div className="chat-tabs">
                    <button className="tab active">Room chat</button>
                    <button className="tab">Participants</button>
                </div>

                {/* CHAT AREA */}
                <div className="chat-stream">
                    <div className="msg received">
                        <span className="sender">System</span>
                        <div className="bubble">Connection established via Nixun Relay.</div>
                        <span className="time">Now</span>
                    </div>
                    <div className="msg sent">
                        <div className="bubble purple">I need confirmation on the 5g payload.</div>
                        <span className="time">Now</span>
                    </div>
                </div>

                {/* INPUT AREA */}
                <div className="chat-input-area">
                    <input type="text" placeholder="Your message..." />
                    <button className="send-btn">➤</button>
                </div>

            </div>
        </div>

      </div>
    </div>
  );
};

export default VideoUplink;