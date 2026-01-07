"use client";

import React, { useState, useEffect, useRef } from 'react';

export default function SnoringPunch() {
  const [punches, setPunches] = useState(0);
  const [isSnoring, setIsSnoring] = useState(true);
  const [showImpact, setShowImpact] = useState(false);
  const [impactPos, setImpactPos] = useState({ x: 50, y: 50 });
  const [sleepMeter, setSleepMeter] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lastPunchTime, setLastPunchTime] = useState(0);
  const [shakeIntensity, setShakeIntensity] = useState(0);
  const [stars, setStars] = useState<Array<{id: number, x: number, y: number, rotation: number}>>([]);
  const [message, setMessage] = useState('');
  const audioContext = useRef<AudioContext | null>(null);

  const messages = [
    "TAKE THAT! 💥",
    "QUIET DOWN! 🤫",
    "LET ME SLEEP! 😤",
    "SHUT IT! 🔇",
    "NO MORE SNORING! 🛑",
    "POW! 👊",
    "WHAM! 💫",
    "BONK! 🌟"
  ];

  const playPunchSound = () => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    const ctx = audioContext.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(150, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  };

  const playSnoreSound = () => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    const ctx = audioContext.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = 'sawtooth';
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(80, ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.5);
    oscillator.frequency.linearRampToValueAtTime(90, ctx.currentTime + 1);
    
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.5);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 1.2);
  };

  useEffect(() => {
    if (isSnoring) {
      const interval = setInterval(() => {
        playSnoreSound();
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isSnoring]);

  const handlePunch = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    playPunchSound();
    
    const now = Date.now();
    if (now - lastPunchTime < 500) {
      setCombo(c => c + 1);
    } else {
      setCombo(1);
    }
    setLastPunchTime(now);
    
    setPunches(p => p + 1);
    setImpactPos({ x, y });
    setShowImpact(true);
    setShakeIntensity(Math.min(combo * 2, 20));
    setMessage(messages[Math.floor(Math.random() * messages.length)]);
    
    const newStars = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 30,
      y: y + (Math.random() - 0.5) * 30,
      rotation: Math.random() * 360
    }));
    setStars(prev => [...prev, ...newStars]);
    
    setSleepMeter(m => {
      const newMeter = Math.min(m + (combo > 3 ? 5 : 2), 100);
      if (newMeter >= 100) {
        setIsSnoring(false);
        setTimeout(() => {
          setIsSnoring(true);
          setSleepMeter(0);
        }, 5000);
      }
      return newMeter;
    });
    
    setTimeout(() => setShowImpact(false), 150);
    setTimeout(() => setShakeIntensity(0), 100);
    setTimeout(() => {
      setStars(prev => prev.filter(s => !newStars.find(n => n.id === s.id)));
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] overflow-hidden relative font-sans">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Permanent+Marker&display=swap');
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes snore {
          0% { opacity: 0; transform: translate(0, 0) scale(0.5); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translate(30px, -40px) scale(1.5); }
        }
        
        @keyframes impact {
          0% { transform: scale(0) rotate(0deg); opacity: 1; }
          50% { transform: scale(1.5) rotate(180deg); opacity: 1; }
          100% { transform: scale(2) rotate(360deg); opacity: 0; }
        }
        
        @keyframes starBurst {
          0% { transform: scale(0) rotate(0deg); opacity: 1; }
          100% { transform: scale(1) rotate(180deg); opacity: 0; }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px) rotate(-1deg); }
          75% { transform: translateX(5px) rotate(1deg); }
        }
        
        @keyframes messageFloat {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-50px) scale(1.2); opacity: 0; }
        }
        
        @keyframes peacefulSleep {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        
        @keyframes zzz {
          0% { opacity: 0; transform: translate(0, 0) scale(0.8); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translate(20px, -30px) scale(1.2); }
        }
        
        .punch-target {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ctext y='24' font-size='24'%3E👊%3C/text%3E%3C/svg%3E") 16 16, pointer;
        }
        
        .combo-text {
          text-shadow: 
            3px 3px 0 #ff6b6b,
            6px 6px 0 #feca57,
            9px 9px 0 #48dbfb;
        }
        
        .font-bangers {
          font-family: 'Bangers', cursive;
        }
        
        .font-marker {
          font-family: 'Permanent Marker', cursive;
        }
      `}</style>
      
      {/* Header */}
      <div className="text-center p-5 relative z-10">
        <h1 className="text-4xl md:text-6xl text-white font-bangers tracking-wider"
            style={{ textShadow: '4px 4px 0 #e74c3c, 8px 8px 0 #c0392b' }}>
          SNORING<span className="text-[#feca57]">PUNCH</span> 👊
        </h1>
        <p className="text-gray-400 font-marker text-lg mt-1">
          Because some roommates need a virtual reality check
        </p>
      </div>

      {/* Stats Bar */}
      <div className="flex justify-center gap-8 px-5 flex-wrap">
        <div className="bg-white/10 rounded-2xl px-6 py-2.5 backdrop-blur-md border-2 border-white/20">
          <span className="text-[#feca57] text-2xl font-bangers">
            PUNCHES: {punches}
          </span>
        </div>
        
        {combo > 1 && (
          <div className="bg-gradient-to-r from-[#ff6b6b] to-[#feca57] rounded-2xl px-6 py-2.5"
               style={{ animation: 'pulse 0.3s ease-in-out' }}>
            <span className="combo-text text-white text-2xl font-bangers font-bold">
              {combo}x COMBO! 🔥
            </span>
          </div>
        )}
      </div>

      {/* Sleep Meter */}
      <div className="max-w-md mx-auto mt-5 px-5">
        <div className="flex justify-between mb-1">
          <span className="text-white font-marker">😤 Frustration</span>
          <span className="text-white font-marker">😴 Peace</span>
        </div>
        <div className="h-6 bg-black/50 rounded-2xl overflow-hidden border-3 border-[#feca57]"
             style={{ borderWidth: '3px' }}>
          <div 
            className="h-full rounded-xl transition-all duration-300"
            style={{
              width: `${sleepMeter}%`,
              background: sleepMeter < 50 
                ? 'linear-gradient(90deg, #e74c3c, #f39c12)' 
                : sleepMeter < 80 
                  ? 'linear-gradient(90deg, #f39c12, #2ecc71)'
                  : 'linear-gradient(90deg, #2ecc71, #00d2d3)',
              boxShadow: '0 0 20px rgba(46, 204, 113, 0.5)'
            }} 
          />
        </div>
      </div>

      {/* Main Punch Area */}
      <div 
        className="punch-target max-w-lg mx-auto mt-8 px-5 relative"
        onClick={handlePunch}
        style={{ animation: shakeIntensity > 0 ? 'shake 0.1s ease-in-out' : 'none' }}
      >
        <div className="bg-gradient-to-br from-[#2d3436] to-[#1e272e] rounded-3xl p-10 relative overflow-hidden"
             style={{ 
               boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.1)',
               border: '4px solid #3d3d3d'
             }}>
          {/* Bed */}
          <div className="bg-gradient-to-b from-[#6c5ce7] to-[#5f27cd] rounded-2xl p-8 relative">
            {/* Pillow */}
            <div className="absolute top-5 left-8 w-28 h-14 bg-gradient-to-br from-white to-[#dfe6e9] rounded-t-2xl"
                 style={{ 
                   borderRadius: '15px 15px 50% 50%',
                   boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                 }} />
            
            {/* Roommate Face */}
            <div 
              className="w-24 h-24 mx-auto my-5 rounded-full relative"
              style={{
                background: isSnoring 
                  ? 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)'
                  : 'linear-gradient(135deg, #81ecec 0%, #00cec9 100%)',
                animation: isSnoring ? 'float 2s ease-in-out infinite' : 'peacefulSleep 3s ease-in-out infinite',
                boxShadow: isSnoring 
                  ? '0 10px 30px rgba(253, 203, 110, 0.5)'
                  : '0 10px 30px rgba(0, 206, 201, 0.5)'
              }}
            >
              {/* Eyes */}
              <div className="absolute bg-[#2d3436] transition-all duration-300"
                   style={{
                     top: '35%',
                     left: '20%',
                     width: '15px',
                     height: isSnoring ? '3px' : '15px',
                     borderRadius: isSnoring ? '3px' : '50%'
                   }} />
              <div className="absolute bg-[#2d3436] transition-all duration-300"
                   style={{
                     top: '35%',
                     right: '20%',
                     width: '15px',
                     height: isSnoring ? '3px' : '15px',
                     borderRadius: isSnoring ? '3px' : '50%'
                   }} />
              
              {/* Mouth */}
              <div className="absolute left-1/2 -translate-x-1/2 transition-all duration-300"
                   style={{
                     bottom: '25%',
                     width: isSnoring ? '30px' : '20px',
                     height: isSnoring ? '25px' : '10px',
                     background: isSnoring ? '#2d3436' : 'transparent',
                     borderRadius: isSnoring ? '50%' : '0 0 20px 20px',
                     borderTop: isSnoring ? 'none' : 'none',
                     borderRight: isSnoring ? 'none' : '3px solid #2d3436',
                     borderBottom: isSnoring ? 'none' : '3px solid #2d3436',
                     borderLeft: isSnoring ? 'none' : '3px solid #2d3436'
                   }} />
              
              {/* Snoring Z's or peaceful Z's */}
              {isSnoring ? (
                <>
                  <div className="absolute -top-5 -right-5 text-3xl"
                       style={{ animation: 'snore 2s ease-in-out infinite' }}>💤</div>
                  <div className="absolute -top-2.5 right-0 text-xl"
                       style={{ animation: 'snore 2s ease-in-out infinite 0.5s' }}>Z</div>
                </>
              ) : (
                <>
                  <div className="absolute -top-5 -right-5 text-xl text-[#00cec9]"
                       style={{ animation: 'zzz 3s ease-in-out infinite' }}>z</div>
                  <div className="absolute -top-8 -right-2.5 text-base text-[#00cec9]"
                       style={{ animation: 'zzz 3s ease-in-out infinite 1s' }}>z</div>
                </>
              )}
            </div>
            
            {/* Blanket */}
            <div className="bg-gradient-to-b from-[#a29bfe] to-[#6c5ce7] h-10 rounded-b-2xl mt-2.5" />
          </div>
          
          {/* Impact Effect */}
          {showImpact && (
            <div 
              className="absolute text-6xl pointer-events-none z-50"
              style={{
                left: `${impactPos.x}%`,
                top: `${impactPos.y}%`,
                transform: 'translate(-50%, -50%)',
                animation: 'impact 0.3s ease-out forwards'
              }}
            >
              💥
            </div>
          )}
          
          {/* Stars */}
          {stars.map(star => (
            <div 
              key={star.id} 
              className="absolute text-2xl pointer-events-none"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                animation: 'starBurst 0.5s ease-out forwards',
                transform: `rotate(${star.rotation}deg)`
              }}
            >
              ⭐
            </div>
          ))}
          
          {/* Floating Message */}
          {showImpact && message && (
            <div 
              className="absolute left-1/2 -translate-x-1/2 text-white text-2xl font-bangers pointer-events-none whitespace-nowrap"
              style={{
                top: '30%',
                textShadow: '2px 2px 0 #e74c3c',
                animation: 'messageFloat 0.8s ease-out forwards'
              }}
            >
              {message}
            </div>
          )}
        </div>
        
        {/* Tap instruction */}
        <p 
          className="text-center font-marker text-xl mt-5"
          style={{
            color: isSnoring ? '#e74c3c' : '#2ecc71',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}
        >
          {isSnoring ? '👆 TAP TO PUNCH! 👆' : '😌 Ahh... Sweet silence...'}
        </p>
      </div>

      {/* Footer Tips */}
      <div className="text-center p-5 text-gray-500">
        <p className="font-marker text-sm">
          Pro tip: Rapid taps = COMBO BONUS! 🎯
        </p>
        <p className="font-marker text-xs mt-2.5 text-gray-600">
          * No real roommates were harmed in the making of this app
        </p>
      </div>

      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="absolute text-2xl opacity-10"
            style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 23) % 100}%`,
              transform: `rotate(${i * 45}deg)`
            }}
          >
            {['💤', '😴', '🛏️', '👊', '💥'][i % 5]}
          </div>
        ))}
      </div>
    </div>
  );
}
