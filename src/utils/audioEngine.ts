/**
 * Web Audio Ambient Soundscape Generator
 * Produces nostalgic, warm lofi chords and vinyl warmth for the memory player
 * Completely self-contained, offline-first, no CORS or broken asset dependencies.
 */

class MemoryAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timer: number | null = null;
  private gainNode: GainNode | null = null;
  private noiseNode: AudioNode | null = null;
  private currentChordIndex: number = 0;

  // Nostalgic Fmaj7 - Cmaj7 - Dm7 - Am7 progression
  private chords: number[][] = [
    [174.61, 220.0, 261.63, 329.63], // Fmaj7
    [130.81, 196.0, 246.94, 261.63], // Cmaj7
    [146.83, 220.0, 261.63, 293.66], // Dm7
    [110.0, 164.81, 220.0, 261.63],  // Am7
  ];

  public init() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;
        this.ctx = new AudioCtx();
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.setValueAtTime(0.25, this.ctx.currentTime);
        this.gainNode.connect(this.ctx.destination);
      } catch (err) {
        console.warn('AudioContext not supported in this environment:', err);
        this.ctx = null;
        this.gainNode = null;
      }
    }
  }

  public play() {
    try {
      this.init();
      if (!this.ctx || !this.gainNode) {
        this.isPlaying = false;
        return;
      }

      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch((err) => {
          console.warn('Audio resume not supported or blocked:', err);
        });
      }

      this.isPlaying = true;
      this.startNoise();
      this.scheduleChord();
    } catch (err) {
      console.warn('Audio playback not supported:', err);
      this.isPlaying = false;
    }
  }

  public pause() {
    this.isPlaying = false;
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.ctx && this.gainNode) {
      try {
        this.gainNode.gain.setTargetAtTime(0.001, this.ctx.currentTime, 0.5);
      } catch {
        // audio node parameter update fallback
      }
    }
    if (this.noiseNode) {
      try {
        (this.noiseNode as AudioBufferSourceNode).stop();
      } catch {
        // already stopped
      }
      this.noiseNode = null;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return this.isPlaying;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }

  private startNoise() {
    if (!this.ctx || !this.gainNode) return;
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.008; // subtle vinyl floor
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(this.gainNode);
      noise.start();
      this.noiseNode = noise;
    } catch {
      // Audio node error fallback
    }
  }

  private scheduleChord() {
    if (!this.isPlaying || !this.ctx || !this.gainNode) return;

    try {
      const chord = this.chords[this.currentChordIndex];
      this.currentChordIndex = (this.currentChordIndex + 1) % this.chords.length;

      const now = this.ctx.currentTime;

      // Play soft sine/triangle piano chord with gentle tape wow
      chord.forEach((freq, idx) => {
        if (!this.ctx || !this.gainNode) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        // Gentle pitch drift (tape wow)
        osc.detune.setValueAtTime((Math.random() - 0.5) * 6, now);

        // Envelope
        noteGain.gain.setValueAtTime(0.0001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.06, now + 0.8 + idx * 0.1);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.2);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1100, now);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.gainNode);

        osc.start(now + idx * 0.08);
        osc.stop(now + 4.5);
      });

      this.timer = window.setTimeout(() => {
        if (this.isPlaying) {
          this.scheduleChord();
        }
      }, 4000);
    } catch (err) {
      console.warn('Audio scheduling fallback:', err);
    }
  }
}

export const memoryAudio = new MemoryAudioEngine();
