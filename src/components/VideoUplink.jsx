import { useEffect, useRef, useState } from 'react';
import { Peer } from 'peerjs';
import './VideoUplink.css';

const Icons = {
  MicOn: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
  MicOff: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
  CamOn: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
  CamOff: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  Hand: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>,
  Hangup: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{transform: 'rotate(135deg)'}}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Copy: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Send: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Back: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
};

const VideoUplink = ({ onClose, serviceName = "Unknown Service" }) => {
  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const [connectionStatus, setConnectionStatus] = useState("Initializing...");
  const [timeElapsed, setTimeElapsed] = useState("00:00");
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);

  const [messages, setMessages] = useState([
    { sender: 'System', text: 'Secure Channel Initialized.', type: 'system' }
  ]);
  const [chatInput, setChatInput] = useState("");

  const currentUserVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const localStreamRef = useRef(null);
  const dataConnectionRef = useRef(null);

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

  useEffect(() => {
    const peer = new Peer();

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream;
        if (currentUserVideoRef.current) {
            currentUserVideoRef.current.srcObject = stream;
            currentUserVideoRef.current.play();
        }

        peer.on('call', (call) => {
          setConnectionStatus("INCOMING CONNECTION...");
          call.answer(stream);
          call.on('stream', (remoteStream) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
                remoteVideoRef.current.play();
                setIsConnected(true);
                setConnectionStatus("CONNECTED");
            }
          });
          call.on('close', () => {
             setIsConnected(false);
             setConnectionStatus("PARTNER DISCONNECTED");
          });
        });
      })
      .catch(err => console.error("Stream Error:", err));

    peer.on('connection', (conn) => {
        dataConnectionRef.current = conn;
        setupDataConnection(conn);
    });

    peer.on('open', (id) => {
      setPeerId(id);
      setConnectionStatus("Ready to Connect");
    });

    peerInstance.current = peer;

    return () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
        }
        if (peer) peer.destroy();
    };
  }, []);

  const setupDataConnection = (conn) => {
      conn.on('open', () => console.log("Data Channel Open"));
      conn.on('data', (data) => {
          setMessages(prev => [...prev, { sender: 'Partner', text: data.message, type: 'received' }]);
      });
      conn.on('close', () => {
          setIsConnected(false);
          setConnectionStatus("PARTNER LEFT");
          dataConnectionRef.current = null;
      });
  };

  const callPeer = () => {
    if(!remotePeerIdValue) { alert("Please enter a Partner ID"); return; }
    setConnectionStatus("DIALING...");
    
    const stream = localStreamRef.current;
    const call = peerInstance.current.call(remotePeerIdValue, stream);

    call.on('stream', (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
        setIsConnected(true);
        setConnectionStatus("CONNECTED");
    });

    call.on('close', () => {
        setIsConnected(false);
        setConnectionStatus("CALL ENDED");
    });

    const conn = peerInstance.current.connect(remotePeerIdValue);
    dataConnectionRef.current = conn;
    setupDataConnection(conn);
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
        const audioTrack = localStreamRef.current.getAudioTracks()[0];
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
    }
  };

  const toggleCam = () => {
    if (localStreamRef.current) {
        const videoTrack = localStreamRef.current.getVideoTracks()[0];
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
    }
  };

  const toggleHand = () => {
    const newState = !isHandRaised;
    setIsHandRaised(newState);
    setMessages(prev => [...prev, { sender: 'System', text: newState ? 'You raised your hand.' : 'You lowered your hand.', type: 'system' }]);
    if (dataConnectionRef.current?.open) {
        dataConnectionRef.current.send({ message: newState ? '[System: Partner Raised Hand]' : '[System: Partner Lowered Hand]' });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(peerId);
    setConnectionStatus("ID COPIED!");
    setTimeout(() => setConnectionStatus("Ready to Connect"), 2000);
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, { sender: 'You', text: chatInput, type: 'sent' }]);
    if (dataConnectionRef.current?.open) {
        dataConnectionRef.current.send({ message: chatInput });
    }
    setChatInput("");
  };

  return (
    <div className="modern-overlay">
      <div className="modern-interface">
        
        <div className="interface-header">
            <div className="header-left">
                <button className="back-circle-btn" onClick={onClose}><Icons.Back /></button>
                <div>
                    <h2 className="header-title">Nixun Secure Channel</h2>
                    <p className="header-sub">{connectionStatus}</p>
                </div>
            </div>
            <div className="header-right">
                <span>{timeElapsed}</span>
            </div>
        </div>

        <div className="interface-body">
            <div className="video-stage">
                <video ref={remoteVideoRef} className="main-feed" />
                {!isConnected && (
                    <div className="video-placeholder">
                        <div className="avatar-circle">Op</div>
                        <p>Waiting for partner...</p>
                        <div className="connect-box">
                            <div className="id-display">
                                <span>MY ID:</span>
                                <div className="id-code">{peerId}</div>
                                <button className="copy-icon-btn" onClick={copyToClipboard} title="Copy ID"><Icons.Copy /></button>
                            </div>
                            <div className="join-row">
                                <input type="text" placeholder="Paste Remote ID" value={remotePeerIdValue} onChange={(e) => setRemotePeerIdValue(e.target.value)} />
                                <button className="connect-btn" onClick={callPeer}>JOIN</button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="pip-wrapper"><video ref={currentUserVideoRef} muted className="pip-feed" /></div>
                <div className="control-bar">
                    <button className={`ctrl-btn ${isMuted ? 'off' : ''}`} onClick={toggleMic}>{isMuted ? <Icons.MicOff /> : <Icons.MicOn />}</button>
                    <button className={`ctrl-btn ${isVideoOff ? 'off' : ''}`} onClick={toggleCam}>{isVideoOff ? <Icons.CamOff /> : <Icons.CamOn />}</button>
                    <button className={`ctrl-btn ${isHandRaised ? 'active-hand' : ''}`} onClick={toggleHand}><Icons.Hand /></button>
                    <button className="ctrl-btn hangup" onClick={onClose}><Icons.Hangup /></button>
                </div>
            </div>

            <div className="sidebar-panel">
                <div className="info-card"><h3>{serviceName}</h3><p>Service Inquiry Meeting</p></div>
                <div className="chat-tabs">
                    <button className={`tab ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>Room chat</button>
                    <button className={`tab ${activeTab === 'participants' ? 'active' : ''}`} onClick={() => setActiveTab('participants')}>Participants</button>
                </div>
                <div className="sidebar-content-area">
                    {activeTab === 'chat' ? (
                        <>
                            <div className="chat-stream">
                                {messages.map((msg, index) => (
                                    <div key={index} className={`msg ${msg.type}`}>
                                        <span className="sender">{msg.sender}</span>
                                        <div className={`bubble ${msg.type === 'sent' ? 'purple' : ''}`}>{msg.text}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="chat-input-area">
                                <input type="text" placeholder="Type a message..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} />
                                <button className="send-btn" onClick={sendMessage}><Icons.Send /></button>
                            </div>
                        </>
                    ) : (
                        <div className="participants-list">
                            <div className="p-row">
                                <div className="p-avatar">You</div>
                                <div className="p-info"><span className="p-name">Me (Host)</span><span className="p-status">{isHandRaised ? '✋ Hand Raised' : 'Active'}</span></div>
                                <div className="p-icons">{isMuted ? <Icons.MicOff /> : <Icons.MicOn />}</div>
                            </div>
                            {isConnected && (
                                <div className="p-row">
                                    <div className="p-avatar remote">Op</div>
                                    <div className="p-info"><span className="p-name">Remote Operative</span><span className="p-status">Connected</span></div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default VideoUplink;