/**
 * Generates a premium notification sound using the Web Audio API.
 * This ensures 100% reliability without dependency on external files or base64 strings.
 */
export const playNotificationSound = (volume = 0.4) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const context = new AudioContext();
    
    const playNote = (freq, vol, duration) => {
      const osc = context.createOscillator();
      const gain = context.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, context.currentTime);
      
      gain.gain.setValueAtTime(vol * volume, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(context.destination);
      
      osc.start();
      osc.stop(context.currentTime + duration);
    };

    // Layered "Chime" effect
    playNote(880, 1.0, 0.6); // Fundamental (A5)
    playNote(1108.73, 0.5, 0.4); // Major Third (C#6)
    playNote(1320, 0.4, 0.3); // Perfect Fifth (E6)
    playNote(1760, 0.2, 0.2); // Octave High (A6)
    
    // Auto-close context
    setTimeout(() => context.close(), 1000);
  } catch (error) {
    console.warn("Notification audio failed:", error);
  }
};
