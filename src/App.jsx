import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

// Utility to calculate age
const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Utility to calculate days until next birthday
const daysUntilBirthday = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  
  const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  
  if (today > nextBirthday) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }
  
  const diffTime = Math.abs(nextBirthday - today);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays;
};

// Utility to get Zodiac Sign
const getZodiacSign = (dateStr) => {
  const d = new Date(dateStr);
  const month = d.getMonth() + 1;
  const day = d.getDate();

  if ((month == 1 && day <= 20) || (month == 12 && day >= 22)) return { name: "Capricorn", emoji: "♑" };
  if ((month == 1 && day >= 21) || (month == 2 && day <= 18)) return { name: "Aquarius", emoji: "♒" };
  if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return { name: "Pisces", emoji: "♓" };
  if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return { name: "Aries", emoji: "♈" };
  if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return { name: "Taurus", emoji: "♉" };
  if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return { name: "Gemini", emoji: "♊" };
  if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return { name: "Cancer", emoji: "♋" };
  if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return { name: "Leo", emoji: "♌" };
  if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return { name: "Virgo", emoji: "♍" };
  if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return { name: "Libra", emoji: "♎" };
  if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return { name: "Scorpio", emoji: "♏" };
  if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return { name: "Sagittarius", emoji: "♐" };
  return { name: "", emoji: "" };
};

function App() {
  const [birthdays, setBirthdays] = useState(() => {
    const saved = localStorage.getItem('birthdays');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [phone, setPhone] = useState('');
  const [gift, setGift] = useState('');
  
  const fileInputRef = useRef(null);

  // State for Onboarding Modal
  const [showWelcome, setShowWelcome] = useState(() => {
    return localStorage.getItem('hasSeenWelcome') !== 'true';
  });

  useEffect(() => {
    localStorage.setItem('birthdays', JSON.stringify(birthdays));
  }, [birthdays]);

  const closeWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('hasSeenWelcome', 'true');
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#f472b6', '#a78bfa', '#25D366']
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !date) return;
    
    const newBirthday = {
      id: crypto.randomUUID(),
      name,
      date,
      phone,
      gift
    };
    
    setBirthdays(prev => [...prev, newBirthday]);
    setName('');
    setDate('');
    setPhone('');
    setGift('');
    
    confetti({
      particleCount: 80,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#8b5cf6', '#f472b6', '#25D366']
    });
  };

  const removeBirthday = (id) => {
    setBirthdays(prev => prev.filter(b => b.id !== id));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(birthdays, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "birthday_backup.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (Array.isArray(imported)) {
            setBirthdays(imported);
            alert("✅ Backup data successfully restored!");
          } else {
            alert("❌ Invalid backup file format.");
          }
        } catch {
          alert("❌ Failed to parse the backup file.");
        }
      };
      reader.readAsText(file);
    }
    // reset input
    e.target.value = null;
  };

  const sortedBirthdays = [...birthdays].sort((a, b) => {
    return daysUntilBirthday(a.date) - daysUntilBirthday(b.date);
  });

  return (
    <>
      {/* ONBOARDING MODAL */}
      {showWelcome && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <div className="modal-icon">🎉</div>
            <h2>Welcome to Birthday Reminder!</h2>
            <p className="modal-subtitle">The most beautiful way to remember special days.</p>
            
            <div className="feature-list">
              <div className="feature-item">
                <span className="feature-emoji">📅</span>
                <div>
                  <h4>Track Upcoming Dates</h4>
                  <p>Automatically sorts birthdays so you always know who's next.</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-emoji">🔮</span>
                <div>
                  <h4>Smart Details</h4>
                  <p>Auto-detects Zodiac signs and calculates exact age & countdown.</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-emoji">💬</span>
                <div>
                  <h4>WhatsApp Integration</h4>
                  <p>Save their number and send a WhatsApp greeting in one click!</p>
                </div>
              </div>
            </div>

            <button onClick={closeWelcome} className="btn btn-large w-100 mt-4">
              Awesome, Let's Start!
            </button>
          </div>
        </div>
      )}

      {/* MAIN APP */}
      <div className={`app-container ${showWelcome ? 'blurred' : ''}`}>
        <div className="glass-card">
          <div className="header">
            <h1>Birthday Reminder</h1>
            <p>Never forget a special day again ✨</p>
            
            {/* Backup Controls */}
            <div className="backup-controls">
              <button onClick={() => fileInputRef.current.click()} className="small-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Import
              </button>
              <input 
                type="file" 
                accept=".json" 
                ref={fileInputRef} 
                onChange={handleImport} 
                style={{ display: 'none' }} 
              />
              <button onClick={exportData} className="small-btn" disabled={birthdays.length === 0}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                Export
              </button>
            </div>
          </div>

          <form className="add-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="name">Who's having a birthday?</label>
              <input 
                type="text" 
                id="name" 
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="input-row">
              <div className="input-group">
                <label htmlFor="date">Date of Birth</label>
                <input 
                  type="date" 
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="phone">WhatsApp (Optional)</label>
                <input 
                  type="tel" 
                  id="phone"
                  placeholder="e.g. 62812345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            
            <div className="input-group">
              <label htmlFor="gift">Gift Ideas (Optional)</label>
              <input 
                type="text" 
                id="gift"
                placeholder="e.g. Running shoes, Coffee mug..."
                value={gift}
                onChange={(e) => setGift(e.target.value)}
              />
            </div>

            <button type="submit" className="btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Birthday
            </button>
          </form>

          <div className="birthday-list">
            {sortedBirthdays.length === 0 ? (
              <div className="empty-state interactive-empty">
                <div className="empty-icon">🎈</div>
                <h3>It's a little quiet here...</h3>
                <p>Start tracking celebrations! Add your first birthday above to see the magic happen.</p>
              </div>
            ) : (
              sortedBirthdays.map((person) => {
                const age = calculateAge(person.date);
                const daysLeft = daysUntilBirthday(person.date);
                const zodiac = getZodiacSign(person.date);
                
                // Determine highlight style
                let highlightClass = "";
                if (daysLeft === 0) highlightClass = "highlight-today";
                else if (daysLeft <= 3) highlightClass = "highlight-soon";
                
                // Format phone number
                let cleanPhone = person.phone ? person.phone.replace(/\D/g, '') : '';
                if (cleanPhone.startsWith('0')) {
                  cleanPhone = '62' + cleanPhone.substring(1);
                }
                const waMessage = encodeURIComponent(`Happy Birthday ${person.name}! 🎉🎂 Wishing you a fantastic day!`);
                const waLink = `https://wa.me/${cleanPhone}?text=${waMessage}`;

                return (
                  <div key={person.id} className={`birthday-item ${highlightClass}`}>
                    <div className="person-info">
                      <div className="avatar">
                        {person.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="details">
                        <h3>{person.name} <span className="zodiac-badge" title={zodiac.name}>{zodiac.emoji}</span></h3>
                        <p>
                          {new Date(person.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                        </p>
                        <div className="tags-row">
                          <span className="age-badge">
                            Turning {age + 1} in {daysLeft === 0 ? 'today!' : `${daysLeft} days`}
                          </span>
                          {person.gift && (
                            <span className="gift-badge" title="Gift Idea">
                              🎁 {person.gift}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="actions-group">
                      {person.phone && (
                        <a 
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-btn wa-btn"
                          title="Send WhatsApp Greeting"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                          </svg>
                        </a>
                      )}
                      <button 
                        className="action-btn delete-btn" 
                        onClick={() => removeBirthday(person.id)}
                        aria-label="Remove birthday"
                        title="Delete"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
