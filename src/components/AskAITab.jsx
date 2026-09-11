import React, { useState } from 'react';
import { useKhata } from '../context/KhataContext';
import { ArrowUp, ArrowUpRight, MoreHorizontal, Bot, Mic } from 'lucide-react';

export const AskAITab = () => {
  const { chatMessages, sendChatMessage } = useKhata();
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    if (isRecording) setIsRecording(false);
    sendChatMessage(inputText);
    setInputText('');
  };

  const handlePresetClick = (prompt) => {
    sendChatMessage(prompt);
  };

  return (
    <div className="animate-fade-in" style={styles.container}>
      {/* Top Header */}
      <div style={styles.topHeader}>
        <div style={styles.headerLeft}>
          <div style={styles.botHeaderAvatar}>
            <Bot size={22} color="#FAF3EC" />
          </div>
          <div>
            <h1 style={styles.aiTitle}>Ask FinoraAI</h1>
            <div style={styles.statusIndicator}>
              <span style={styles.greenDot} />
              <span>reads your khata, not your bank</span>
            </div>
          </div>
        </div>
        <button style={styles.moreBtn} className="hover-btn">
          <MoreHorizontal size={20} color="#7C6E6E" />
        </button>
      </div>

      {/* Main Chat Container */}
      <div style={styles.chatArea}>
        {/* Notice Banner */}
        <div style={styles.disclaimerCard}>
          <span>I explain what your entries say. I do not move money or make decisions for you.</span>
        </div>

        {/* Preset Prompt Chips */}
        <div style={styles.presetsRow}>
          <button
            style={styles.presetChip}
            className="hover-btn"
            onClick={() => handlePresetClick('Why was August tight?')}
          >
            Why was August tight? <ArrowUpRight size={14} />
          </button>
          <button
            style={styles.presetChip}
            className="hover-btn"
            onClick={() => handlePresetClick('Can I afford more stock?')}
          >
            Can I afford more stock? <ArrowUpRight size={14} />
          </button>
          <button
            style={styles.presetChip}
            className="hover-btn"
            onClick={() => handlePresetClick('What should I pay first?')}
          >
            What should I pay first? <ArrowUpRight size={14} />
          </button>
        </div>

        {/* Message Thread */}
        <div style={styles.messagesThread}>
          {chatMessages.map((msg) => {
            if (msg.sender === 'bot') {
              return (
                <div key={msg.id} style={styles.botMessageWrapper} className="animate-fade-in">
                  <div style={styles.botCard} className="hover-card">
                    <div style={styles.botText}>{msg.text}</div>
                  </div>
                  <div style={styles.botSubline}>
                    <div style={styles.miniRobotBadge}>🤖</div>
                    <span>{msg.subtext || 'Based on 47 entries · Aug 2026'}</span>
                  </div>
                </div>
              );
            }
            return (
              <div key={msg.id} style={styles.userMessageWrapper} className="animate-fade-in">
                <div style={styles.userCard} className="hover-card">
                  <div style={styles.userText}>{msg.text}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <div style={styles.inputSection}>
          {isRecording && (
            <div style={styles.recordingBanner}>
              <span style={styles.recordingDot} />
              <span>Recording... Click mic button to stop</span>
            </div>
          )}
          <form onSubmit={handleSubmit} style={styles.inputForm}>
            <input
              type="text"
              placeholder={isRecording ? "Listening... Speak your question..." : "Ask in your own words..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={styles.chatInput}
            />
            <button
              type="button"
              onClick={toggleRecording}
              className={isRecording ? "va-recording-pulse" : "hover-btn"}
              style={{
                ...styles.micBtn,
                backgroundColor: isRecording ? '#e53e3e' : '#eee6d7',
                color: isRecording ? '#ffffff' : '#573a46'
              }}
              title={isRecording ? "Click to stop recording" : "Click to start recording"}
            >
              <Mic size={18} color={isRecording ? "#FFFFFF" : "#573a46"} />
            </button>
            <button type="submit" style={styles.submitBtn} className="hover-btn">
              <ArrowUp size={18} color="#FFFFFF" />
            </button>
          </form>
          <div style={styles.tryHint}>
            Try: <span onClick={() => handlePresetClick('How much did tea counter sales make?')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>"How much did tea counter sales make?"</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    maxWidth: '860px',
    width: '100%',
    margin: '0 auto'
  },
  topHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px'
  },
  botHeaderAvatar: {
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    backgroundColor: 'var(--plum-dark)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-sm)'
  },
  aiTitle: {
    fontSize: '22px',
    color: 'var(--plum-dark)',
    fontWeight: '800'
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#27563D',
    fontWeight: '600'
  },
  greenDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    backgroundColor: '#2E7D56'
  },
  moreBtn: {
    padding: '8px',
    borderRadius: '50%'
  },
  chatArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  disclaimerCard: {
    backgroundColor: 'var(--card-cream)',
    border: '1px solid var(--card-cream-border)',
    borderRadius: '16px',
    padding: '16px 20px',
    fontSize: '13px',
    color: '#7C6E6E',
    textAlign: 'left'
  },
  presetsRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  presetChip: {
    backgroundColor: '#EFE7DB',
    border: '1px solid #E3D9C9',
    borderRadius: '16px',
    padding: '10px 18px',
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--plum-dark)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: 'var(--shadow-sm)'
  },
  messagesThread: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    minHeight: '220px',
    margin: '10px 0'
  },
  botMessageWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    alignSelf: 'flex-start',
    maxWidth: '85%'
  },
  botCard: {
    backgroundColor: 'var(--card-cream)',
    border: '1px solid var(--card-cream-border)',
    borderRadius: '20px',
    padding: '20px 24px',
    boxShadow: 'var(--shadow-sm)'
  },
  botText: {
    fontSize: '15px',
    color: 'var(--plum-dark)',
    fontWeight: '600',
    lineHeight: '1.45',
    whiteSpace: 'pre-line'
  },
  botSubline: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    color: '#988A8A',
    fontWeight: '600',
    paddingLeft: '4px'
  },
  miniRobotBadge: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#C85C35',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px'
  },
  userMessageWrapper: {
    alignSelf: 'flex-end',
    maxWidth: '75%'
  },
  userCard: {
    backgroundColor: 'var(--plum-dark)',
    color: '#FAF3EC',
    borderRadius: '20px',
    padding: '14px 20px',
    boxShadow: 'var(--shadow-sm)'
  },
  userText: {
    fontSize: '14px',
    fontWeight: '600'
  },
  recordingBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(229, 62, 62, 0.1)',
    border: '1px solid rgba(229, 62, 62, 0.3)',
    borderRadius: '12px',
    padding: '6px 14px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#E53E3E',
    marginBottom: '4px'
  },
  recordingDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#E53E3E'
  },
  inputSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    marginTop: '12px'
  },
  inputForm: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    backgroundColor: '#FAF5EC',
    border: '1.5px solid #DCD1C0',
    borderRadius: '28px',
    padding: '8px 12px 8px 24px',
    boxShadow: 'var(--shadow-md)'
  },
  chatInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '15px',
    color: 'var(--plum-dark)',
    fontFamily: 'var(--font-main)'
  },
  micBtn: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    backgroundColor: '#eee6d7',
    border: '1px solid #DCD1C0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  submitBtn: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    backgroundColor: '#C85C35',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  tryHint: {
    fontSize: '11px',
    color: '#8C7A70',
    textAlign: 'center'
  }
};
