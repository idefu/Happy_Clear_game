/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Procedural audio utility using standard Web Audio API
class SoundManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    // Lazy initialized on first user interaction to comply with browser safety rules
  }

  private initContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  // Swap swoop sound
  playSwap() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {
      console.warn('Audio failed to play', e);
    }
  }

  // Refusal swap bounce back
  playBounce() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(180, this.ctx.currentTime + 0.08);
      osc.frequency.linearRampToValueAtTime(120, this.ctx.currentTime + 0.16);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.17);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.17);
    } catch { /* ignore */ }
  }

  // Match elimination chimes
  playMatch(combo: number = 0) {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const pitchOffset = Math.min(6, combo) * 50; // Pitch ascends for higher combos!
      const pitches = [261.63, 329.63, 392.00, 523.25]; // C major chord entries

      pitches.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.type = 'sine';
        const startFreq = freq + pitchOffset;
        osc.frequency.setValueAtTime(startFreq, this.ctx!.currentTime + idx * 0.04);
        osc.frequency.exponentialRampToValueAtTime(startFreq * 1.5, this.ctx!.currentTime + 0.25 + idx * 0.04);

        gain.gain.setValueAtTime(0, this.ctx!.currentTime);
        gain.gain.linearRampToValueAtTime(0.1, this.ctx!.currentTime + idx * 0.04 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx!.currentTime + 0.3 + idx * 0.04);

        osc.start(this.ctx!.currentTime + idx * 0.04);
        osc.stop(this.ctx!.currentTime + 0.3 + idx * 0.04);
      });
    } catch { /* ignore */ }
  }

  // Ice block crack & shatter
  playIceShatter() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      // High glass chime + short noise crackle
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(3000, this.ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.18);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.18);

      // Low rumble crack
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(180, this.ctx.currentTime);
      subOsc.frequency.linearRampToValueAtTime(60, this.ctx.currentTime + 0.15);
      
      subGain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      subGain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.15);
      subOsc.start();
      subOsc.stop(this.ctx.currentTime + 0.16);
    } catch { /* ignore */ }
  }

  // Row or Col blast laser explosion sweep
  playLaserBlast() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.4);

      // filter to smooth sawtooth
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.4);

      osc.disconnect(gain);
      osc.connect(filter);
      filter.connect(gain);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.45);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.45);
    } catch { /* ignore */ }
  }

  // Hyper color-bomb explosion shockwave
  playHyperExplode() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      // Heavy explosion noise rumble
      const duration = 0.6;
      const rate = this.ctx.sampleRate;
      const amount = rate * duration;
      const buffer = this.ctx.createBuffer(1, amount, rate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < amount; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(400, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + duration);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      // Also add a high sci-Fi sweeping sine
      const sweep = this.ctx.createOscillator();
      const sweepGain = this.ctx.createGain();
      sweep.connect(sweepGain);
      sweepGain.connect(this.ctx.destination);
      sweep.type = 'sine';
      sweep.frequency.setValueAtTime(120, this.ctx.currentTime);
      sweep.frequency.exponentialRampToValueAtTime(2200, this.ctx.currentTime + 0.5);
      sweepGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      sweepGain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.5);

      noise.start();
      sweep.start();
      sweep.stop(this.ctx.currentTime + 0.5);
    } catch { /* ignore */ }
  }

  // Shuffle system swirl sweep
  playShuffle() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [220, 277.18, 329.63, 440, 554.37, 659.25, 880];
      
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        osc.frequency.linearRampToValueAtTime(freq * 0.8, now + idx * 0.05 + 0.15);

        gain.gain.setValueAtTime(0, now + idx * 0.05);
        gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.05 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.002, now + idx * 0.05 + 0.15);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.15);
      });
    } catch { /* ignore */ }
  }

  // Win melodic fanfare
  playLevelWin() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Arpeggiated positive major chord melodies
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.08 + 0.4);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    } catch { /* ignore */ }
  }

  // Lose sad downsweep
  playLevelLose() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [293.66, 277.18, 261.63, 196.00, 146.83];
      
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);
        osc.frequency.linearRampToValueAtTime(freq - 20, now + idx * 0.15 + 0.25);

        gain.gain.setValueAtTime(0, now + idx * 0.15);
        gain.gain.linearRampToValueAtTime(0.1, now + idx * 0.15 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.15 + 0.3);

        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 0.3);
      });
    } catch { /* ignore */ }
  }
}

export const sound = new SoundManager();
export default sound;
