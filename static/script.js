document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('chat-form');
  const input = document.getElementById('user-input');
  const chatBox = document.getElementById('chat-box');
  const sendButton = form.querySelector('button[type="submit"]');

  /**
   * Appends a message to the chat box and returns the new element.
   * @param {string} sender - The sender of the message ('user' or 'bot').
   * @param {string} text - The message content.
   * @returns {HTMLElement} The created message element.
   */
  function appendMessage(sender, text) {
    const msg = document.createElement('div');
    // Add CSS classes for styling, e.g., 'user-message' or 'bot-message'
    msg.classList.add('message', sender);
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msg; // Return the element to allow modification
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const userMessage = input.value.trim();
    if (!userMessage) {
      return; // Don't send empty messages
    }

    // Disable form controls while processing
    input.disabled = true;
    sendButton.disabled = true;

    // 1. Add the user's message to the chat box
    appendMessage('user', userMessage);
    input.value = ''; // Clear the input field

    // 2. Show a temporary "Thinking..." bot message
    const thinkingMessageElement = appendMessage('bot', 'Thinking...');

    try {
      // 3. Send the user's message to the backend API
      const response = await fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Match the backend's expected JSON structure
        body: JSON.stringify({
          conversation: [{ role: 'user', message: userMessage }],
        }),
      });

      if (!response.ok) {
        // This will catch HTTP errors like 404 or 500
        throw new Error('Failed to get response from server.');
      }

      const data = await response.json();

      // 4. Replace the "Thinking..." message with the AI's reply
      if (data && data.result) {
        thinkingMessageElement.textContent = data.result;
      } else {
        // Handle cases where response is OK but no result is present
        thinkingMessageElement.textContent = 'Sorry, no response received.';
      }
    } catch (error) {
      // This will catch network errors or the error thrown above
      console.error('Chat Error:', error);
      thinkingMessageElement.textContent = 'Failed to get response from server.';
    } finally {
      // Re-enable form controls after the request is complete
      input.disabled = false;
      sendButton.disabled = false;
      input.focus(); // Set focus back to the input for the next message
    }
  });
});
