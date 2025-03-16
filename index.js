document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const messageForm = document.getElementById('messageForm');
  const messageInput = document.getElementById('messageInput');
  const messagesContainer = document.getElementById('messagesContainer');
  const mobileNavTabs = document.querySelectorAll('.nav-tab');
  const historySidebar = document.getElementById('historySidebar');
  const chatContainer = document.getElementById('chatContainer');
  const analysisSidebar = document.getElementById('analysisSidebar');
  
  // Analysis metrics elements
  const depressionBar = document.getElementById('depressionBar');
  const anxietyBar = document.getElementById('anxietyBar');
  const happinessBar = document.getElementById('happinessBar');
  const suicidalBar = document.getElementById('suicidalBar');
  const stressBar = document.getElementById('stressBar');
  
  const depressionValue = document.getElementById('depressionValue');
  const anxietyValue = document.getElementById('anxietyValue');
  const happinessValue = document.getElementById('happinessValue');
  const suicidalValue = document.getElementById('suicidalValue');
  const stressValue = document.getElementById('stressValue');
  
  const recommendationsContainer = document.getElementById('recommendationsContainer');
  
  // Initial chat messages
  let messages = [
    {
      id: 1,
      text: "Hello! I'm your therapy assistant. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ];
  
  // Initial analysis values
  let analysis = {
    depression: 25,
    anxiety: 30,
    happiness: 65,
    suicidal: 5,
    stress: 40
  };
  
  // Set active tab for mobile
  let activeTab = 'chat';
  
  // Initialize the chat with the first message
  renderMessages();
  
  // Set chat as active on mobile by default
  if (window.innerWidth < 768) {
    setActiveTab('chat');
  }
  
  // Event Listeners
  messageForm.addEventListener('submit', handleSendMessage);
  
  mobileNavTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-tab');
      setActiveTab(tabName);
    });
  });
  
  // Functions
  function handleSendMessage(e) {
    e.preventDefault();
    
    const text = messageInput.value.trim();
    if (!text) return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: text,
      sender: 'user',
      timestamp: new Date()
    };
    
    messages.push(userMessage);
    messageInput.value = '';
    
    // Re-render messages
    renderMessages();
    
    // Update analysis based on user input
    updateAnalysis(text);
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponses = [
        "I understand how you're feeling. Can you tell me more about that?",
        "That sounds challenging. How long have you been feeling this way?",
        "Thank you for sharing that with me. What do you think triggered these feelings?",
        "I'm here to listen. How has this been affecting your daily life?",
        "It takes courage to express these feelings. Have you tried any coping strategies?"
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage = {
        id: messages.length + 1,
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      messages.push(botMessage);
      renderMessages();
    }, 1000);
  }
  
  function renderMessages() {
    messagesContainer.innerHTML = '';
    
    messages.forEach(message => {
      const messageElement = document.createElement('div');
      messageElement.className = `message ${message.sender}`;
      
      const formattedTime = formatDate(message.timestamp);
      
      messageElement.innerHTML = `
        <div class="message-bubble">
          <p>${message.text}</p>
          <p class="message-time">${formattedTime}</p>
        </div>
      `;
      
      messagesContainer.appendChild(messageElement);
    });
    
    // Scroll to the bottom each time new messages render
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  function updateAnalysis(input) {
    // Simple keyword matching (demo only)
    const lowerInput = input.toLowerCase();
    
    let newAnalysis = {...analysis};
    
    if (lowerInput.includes('sad') || lowerInput.includes('depressed') || lowerInput.includes('unhappy')) {
      newAnalysis.depression = Math.min(100, newAnalysis.depression + 5);
      newAnalysis.happiness = Math.max(0, newAnalysis.happiness - 5);
    }
    
    if (lowerInput.includes('worry') || lowerInput.includes('anxious') || lowerInput.includes('nervous')) {
      newAnalysis.anxiety = Math.min(100, newAnalysis.anxiety + 5);
    }
    
    if (lowerInput.includes('happy') || lowerInput.includes('joy') || lowerInput.includes('good')) {
      newAnalysis.happiness = Math.min(100, newAnalysis.happiness + 5);
      newAnalysis.depression = Math.max(0, newAnalysis.depression - 5);
    }
    
    if (lowerInput.includes('die') || lowerInput.includes('death') || lowerInput.includes('end it')) {
      newAnalysis.suicidal = Math.min(100, newAnalysis.suicidal + 10);
    }
    
    if (lowerInput.includes('stress') || lowerInput.includes('overwhelm') || lowerInput.includes('pressure')) {
      newAnalysis.stress = Math.min(100, newAnalysis.stress + 5);
    }
    
    // Update the analysis object
    analysis = newAnalysis;
    
    // Update the UI
    updateAnalysisUI();
  }
  
  function updateAnalysisUI() {
    // Update progress bars
    depressionBar.style.width = `${analysis.depression}%`;
    anxietyBar.style.width = `${analysis.anxiety}%`;
    happinessBar.style.width = `${analysis.happiness}%`;
    suicidalBar.style.width = `${analysis.suicidal}%`;
    stressBar.style.width = `${analysis.stress}%`;
    
    // Update numeric values
    depressionValue.textContent = `${analysis.depression}%`;
    anxietyValue.textContent = `${analysis.anxiety}%`;
    happinessValue.textContent = `${analysis.happiness}%`;
    suicidalValue.textContent = `${analysis.suicidal}%`;
    stressValue.textContent = `${analysis.stress}%`;
    
    // Update recommendations
    updateRecommendations();
  }
  
  function updateRecommendations() {
    let recommendationsHTML = '';
    
    // Check for suicidal risk
    if (analysis.suicidal > 30) {
      recommendationsHTML = `
        <div class="alert">
          <div class="alert-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                 viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16
                       a2 2 0 0 0 1.73-3Z"></path>
              <path d="M12 9v4"></path>
              <path d="M12 17h.01"></path>
            </svg>
            <p>Immediate attention recommended</p>
          </div>
          <p>
            Please contact a mental health professional or call a crisis helpline immediately.
            National Suicide Prevention Lifeline: 988 or 1-800-273-8255
          </p>
        </div>
      `;
    }
    
    let recommendations = [];
    
    if (analysis.depression > 50) {
      recommendations.push("Consider speaking with a mental health professional about your feelings of depression.");
    }
    
    if (analysis.anxiety > 50) {
      recommendations.push("Try practicing mindfulness and deep breathing exercises to help manage anxiety.");
    }
    
    if (analysis.stress > 50) {
      recommendations.push("Regular physical activity and adequate sleep can help reduce stress levels.");
    }
    
    if (recommendations.length === 0) {
      recommendations.push("Continue practicing self-care and maintaining your mental well-being.");
    }
    
    recommendationsHTML += `
      <h4>Recommendations:</h4>
      <ul>
        ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
      </ul>
    `;
    
    recommendationsContainer.innerHTML = recommendationsHTML;
  }
  
  function setActiveTab(tabName) {
    activeTab = tabName;
    
    // Update which tab is active
    mobileNavTabs.forEach(tab => {
      if (tab.getAttribute('data-tab') === tabName) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    
    // Show/hide content based on active tab (mobile only)
    if (tabName === 'history') {
      historySidebar.classList.add('active');
      chatContainer.classList.remove('active');
      analysisSidebar.classList.remove('active');
    } else if (tabName === 'chat') {
      historySidebar.classList.remove('active');
      chatContainer.classList.add('active');
      analysisSidebar.classList.remove('active');
    } else if (tabName === 'analysis') {
      historySidebar.classList.remove('active');
      chatContainer.classList.remove('active');
      analysisSidebar.classList.add('active');
    }
  }
  
  function formatDate(date) {
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // Handle window resizing
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      // On desktop, ensure chat is visible
      chatContainer.classList.add('active');
    } else {
      // On mobile, only show the active tab
      setActiveTab(activeTab);
    }
  });
});
