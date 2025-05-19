import React from 'react';

const ChatMessage = ({ message }) => {
  const { text, sender } = message;
  
  return (
    <div className={`message ${sender}-message`}>
      <div className="message-content">
        {text.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i !== text.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ChatMessage;
