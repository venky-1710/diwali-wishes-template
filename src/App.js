import React, { useEffect, useState, useCallback } from 'react';
import { Star, Moon, Heart, Share2, Settings, X } from 'lucide-react';
import './App.css';
import emailjs from 'emailjs-com'; // Import EmailJS

const THEME_COLORS = {
  traditional: {
    primary: '#FFA500',
    secondary: '#FF4500',
    accent: '#FFD700',
  },
  modern: {
    primary: '#FF3366',
    secondary: '#9C27B0',
    accent: '#FFD700',
  },
  elegant: {
    primary: '#B76E79',
    secondary: '#7B506F',
    accent: '#C1A173',
  }
};

const DiwaliWebsite = () => {
  const [showContent, setShowContent] = useState(false);
  const [diyas, setDiyas] = useState([]);
  const [clickedDiyas, setClickedDiyas] = useState(new Set());
  const [wishMessage, setWishMessage] = useState('');
  const [showWishForm, setShowWishForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState('traditional');
  const [userName, setUserName] = useState('');
  const [senderName, setSenderName] = useState(''); // State for sender's name

  // Initialize diyas
  useEffect(() => {
    const generateDiyas = () => {
      return Array.from({ length: 25 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 90 + 5}%`,
        bottom: `${Math.random() * 40}%`,
        animationDelay: `${Math.random() * 2}s`,
        scale: Math.random() * 0.5 + 0.8,
        rotationSpeed: Math.random() * 2 + 1
      }));
    };

    setDiyas(generateDiyas());
    setShowContent(true);

    // Add fireworks randomly
    const fireworksInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        addFirework();
      }
    }, 2000);

    return () => clearInterval(fireworksInterval);
  }, []);

  // Handle diya interaction
  const handleDiyaClick = (id) => {
    if (!clickedDiyas.has(id)) {
      setClickedDiyas(new Set([...clickedDiyas, id]));
      addFirework();
    }
  };

  // Fireworks effect
  const addFirework = () => {
    const firework = document.createElement('div');
    firework.className = 'firework';
    firework.style.left = `${Math.random() * 100}%`;
    firework.style.top = `${Math.random() * 50}%`;
    document.querySelector('.fireworks-container').appendChild(firework);
    
    setTimeout(() => firework.remove(), 1000);
  };

  // Handle wish submission
  const handleWishSubmit = (e) => {
    e.preventDefault();
    if (!wishMessage.trim() || !senderName.trim()) return;

    // Animation for wish submission
    const wishElement = document.createElement('div');
    wishElement.className = 'floating-wish';
    wishElement.textContent = `${senderName}: ${wishMessage}`;
    document.body.appendChild(wishElement);
    
    setTimeout(() => wishElement.remove(), 3000);
    // Send email using EmailJS
    const templateParams = {
      message: `${senderName}: ${wishMessage}`, // Include sender's name in the message
      user_name: userName,
      reply_to: "venkysss47@gmail.com" // Replace with the recipient's email
    };
    emailjs.send('venky_1710', 'template_18c538p', templateParams, 'P4kkNNno4elF8pSQ9')
    .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
    }, (err) => {
        console.log('FAILED...', err);
    });
    setWishMessage('');
    setSenderName('');
    setShowWishForm(false);
  };



  // Share functionality
  const handleShare = async () => {
    const shareData = {
      title: 'Diwali Wishes',
      text: `${userName ? `${userName} sends you ` : ''}Happy Diwali! May the festival of lights brighten your life! 🪔✨`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback copy to clipboard
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        alert('Copied to clipboard!');
      }
    } catch (err) {
      console.log('Share failed:', err);
    }
  };

  return (
    <div className="diwali-container" data-theme={theme}>
      {/* Settings button */}
      <button 
        className="settings-button"
        onClick={() => setShowSettings(!showSettings)}
      >
        <Settings size={24} />
      </button>

      {/* Settings panel */}
      {showSettings && (
        <div className="settings-panel glass-card">
          <button 
            className="close-button"
            onClick={() => setShowSettings(false)}
          >
            <X size={24} />
          </button>
          <h3 style={{color:'white'}}>Customize</h3>
          <div className="settings-content">
            <input
              type="text"
              placeholder="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="name-input"
            />
            <div className="theme-selector">
              {Object.keys(THEME_COLORS).map(themeName => (
                <button
                  key={themeName}
                  className={`theme-button ${theme === themeName ? 'active' : ''}`}
                  onClick={() => setTheme(themeName)}
                >
                  {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Decorative elements */}
      <div className="decorative-elements">
        <div className="rangoli top-left" />
        <div className="rangoli bottom-right" />
        <div className="stars-container">
          {Array.from({ length: 50 }).map((_, i) => (
            <Star
              key={i}
              className="star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
              size={Math.random() * 10 + 5}
            />
          ))}
        </div>
      </div>

      {/* Diyas */}
      <div className="diyas-container">
        {diyas.map(diya => (
          <div
            key={diya.id}
            className={`diya ${clickedDiyas.has(diya.id) ? 'lit' : ''}`}
            style={{
              left: diya.left,
              bottom: diya.bottom,
              animationDelay: diya.animationDelay,
              transform: `scale(${diya.scale})`,
              '--rotation-speed': `${diya.rotationSpeed}s`
            }}
            onClick={() => handleDiyaClick(diya.id)}
          >
            <div className="diya-flame" />
            <div className="diya-glow" />
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className={`main-content ${showContent ? 'visible' : ''}`}>
        <Moon className="moon-icon" size={48} />
        
        <h1 className="title">
          Happy Diwali
          {userName && <div className="user-name">From {userName}</div>}
        </h1>
        
        <div className="message-card glass-card">
          <p className="message">
          May the divine light of Diwali spread into your life with peace ✌️, prosperity 💰, happiness 😊, and good health 🏥. Let's joyfully celebrate this beautiful festival of lights 🪔 with joy 🎉 and love ❤️!.
          </p>
          <h4 style={{color:'#D3D3D3'}}>KIET | K-Hub</h4>
          
          <div className="buttons-container">
            <button 
              className="festive-button primary"
              onClick={() => setShowWishForm(true)}
            >
              <Heart className="icon" size={16} />
              Send Wishes
            </button>
            
            <button 
              className="festive-button secondary"
              onClick={handleShare}
            >
              <Share2 className="icon" size={16} />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Wish form modal */}
      {showWishForm && (
        <div className="modal-overlay" onClick={() => setShowWishForm(false)}>
          <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
            <button 
              className="close-button"
              onClick={() => setShowWishForm(false)}
            >
              <X size={24} />
            </button>
            <h3 className="email-prompt" style={{ textAlign:'center', justifyContent: 'center', alignItems: 'center', color: 'lightgrey', marginBottom: '20px' }}>
              Send wishes directly at &nbsp;<a href='mailto:venkysss47@gmail.com' style={{color:'lightgrey'}}>venkysss47@gmail.com</a>
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', color: 'lightgrey' }}>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid white', margin: '0 10px' }} />
              <p style={{ margin: '0' }}>or</p>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid white', margin: '0 10px' }} />
            </div>
            <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'lightgrey', marginBottom: '20px' }}>
              Through this form.
            </p>
            <form onSubmit={handleWishSubmit}>
              {/* Text box for sender's name */}
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Your Name"
                required // Make this field required
              />
              <textarea
                value={wishMessage}
                onChange={(e) => setWishMessage(e.target.value)}
                placeholder="Write your Diwali wishes here..."
              />
              <div className="modal-buttons">
                <button type="submit" className="festive-button primary">
                  Send
                </button>
                <button 
                  type="button" 
                  className="festive-button secondary"
                  onClick={() => setShowWishForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fireworks container */}
      <div className="fireworks-container" />
    </div>
  );
};

export default DiwaliWebsite;