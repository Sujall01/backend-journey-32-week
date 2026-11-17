/**
 * audio-recorder.js - Local In-Browser Voice Recording Component
 * Completely local using the browser MediaRecorder API.
 * Never uploads recordings to any server.
 */

export class LocalAudioRecorder {
  constructor(containerElement, onRecordingComplete) {
    this.container = containerElement;
    this.onRecordingComplete = onRecordingComplete;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.recordingInterval = null;
    this.elapsedSeconds = 0;
    this.audioBlob = null;
    this.audioUrl = null;
    this.isRecording = false;

    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="audio-recorder-box">
        <div style="font-size: 0.85rem; color: var(--text-muted);">
          Local Client-Side Practice Recorder (Audio stays private in your browser)
        </div>

        <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
          <button type="button" class="record-btn-round" id="record-toggle-btn" title="Click to start/stop speaking practice">
            <span id="record-btn-icon">🎙️</span>
          </button>
          <div style="font-size: 1.25rem; font-family: var(--font-mono); font-weight: 700; color: var(--text-primary);" id="record-timer-display">
            00:00
          </div>
          <div style="font-size: 0.8rem; color: var(--text-secondary);" id="record-status-label">
            Click microphone to begin 3-minute technical explanation practice
          </div>
        </div>

        <div id="audio-playback-area" style="display: none; width: 100%; max-width: 400px; margin-top: 8px;">
          <audio id="audio-player" controls style="width: 100%;"></audio>
          <div style="display: flex; justify-content: center; gap: 8px; margin-top: 8px;">
            <button type="button" class="btn btn-secondary btn-sm" id="discard-audio-btn">
              Discard Recording
            </button>
          </div>
        </div>
      </div>
    `;

    this.setupListeners();
  }

  setupListeners() {
    const recordBtn = this.container.querySelector('#record-toggle-btn');
    const discardBtn = this.container.querySelector('#discard-audio-btn');

    recordBtn.addEventListener('click', () => {
      if (this.isRecording) {
        this.stopRecording();
      } else {
        this.startRecording();
      }
    });

    discardBtn.addEventListener('click', () => {
      this.discardRecording();
    });
  }

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioChunks = [];
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.audioUrl = URL.createObjectURL(this.audioBlob);

        const player = this.container.querySelector('#audio-player');
        player.src = this.audioUrl;
        this.container.querySelector('#audio-playback-area').style.display = 'block';

        if (typeof this.onRecordingComplete === 'function') {
          this.onRecordingComplete(this.audioBlob, this.elapsedSeconds);
        }

        // Stop all tracks to release mic hardware
        stream.getTracks().forEach(track => track.stop());
      };

      this.mediaRecorder.start();
      this.isRecording = true;
      this.elapsedSeconds = 0;

      const recordBtn = this.container.querySelector('#record-toggle-btn');
      recordBtn.classList.add('recording');
      this.container.querySelector('#record-btn-icon').textContent = '⏹️';
      this.container.querySelector('#record-status-label').textContent = 'Recording in progress... speak slowly and complete each sentence.';

      this.recordingInterval = setInterval(() => {
        this.elapsedSeconds++;
        const mins = String(Math.floor(this.elapsedSeconds / 60)).padStart(2, '0');
        const secs = String(this.elapsedSeconds % 60).padStart(2, '0');
        this.container.querySelector('#record-timer-display').textContent = `${mins}:${secs}`;
      }, 1000);

    } catch (err) {
      console.warn('Microphone access denied or unsupported:', err);
      this.container.querySelector('#record-status-label').textContent =
        'Microphone access was denied or is not supported. You can still practice speaking aloud and log your self-assessment below!';
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      clearInterval(this.recordingInterval);

      const recordBtn = this.container.querySelector('#record-toggle-btn');
      recordBtn.classList.remove('recording');
      this.container.querySelector('#record-btn-icon').textContent = '🎙️';
      this.container.querySelector('#record-status-label').textContent = 'Recording saved locally. Listen back to review your pace and clarity.';
    }
  }

  discardRecording() {
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
      this.audioUrl = null;
    }
    this.audioBlob = null;
    this.container.querySelector('#audio-playback-area').style.display = 'none';
    this.container.querySelector('#record-timer-display').textContent = '00:00';
    this.container.querySelector('#record-status-label').textContent = 'Click microphone to begin speaking practice.';
  }
}

