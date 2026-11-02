// Voice Letter: the creator supplies one recording and its matching letter text.
// Visitors can only listen, pause, resume, and replay.
(() => {
  const config = window.siteContent?.voiceLetter;
  const playButton = document.getElementById('letterPlay');
  const replayButton = document.getElementById('letterReplay');
  const status = document.getElementById('letterAudioStatus');
  const progress = document.getElementById('letterProgress');
  const note = document.getElementById('voiceSyncNote');
  const letter = document.querySelector('#scene-letter .letter');

  if (!config || !playButton || !letter) return;

  const salutation = letter.querySelector('.to');
  const signature = letter.querySelector('.sign');
  salutation.textContent = config.salutation || '';
  signature.textContent = config.signature || '';

  letter.querySelectorAll('p').forEach((paragraph) => paragraph.remove());
  (config.paragraphs || []).forEach((text) => {
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    letter.insertBefore(paragraph, signature);
  });

  const sentences = [];
  letter.querySelectorAll('p').forEach((paragraph) => {
    const originalText = paragraph.textContent.trim();
    const parts = originalText.match(/[^.!?]+[.!?]+(?:[”"’']?)(?:\s+|$)|[^.!?]+$/g) || [originalText];
    paragraph.textContent = '';
    parts.forEach((part) => {
      const clean = part.trim();
      if (!clean) return;
      const span = document.createElement('span');
      span.className = 'narration-sentence';
      span.textContent = `${clean} `;
      paragraph.appendChild(span);
      sentences.push(span);
    });
  });

  let audio = null;
  let cues = [];
  let activeIndex = -1;
  let hasStarted = false;

  function setSentence(index) {
    if (index === activeIndex) return;
    activeIndex = index;
    sentences.forEach((sentence, i) => {
      sentence.classList.toggle('is-current', i === index);
      sentence.classList.toggle('is-revealed', i <= index || (index === -1 && hasStarted));
    });
  }

  function prepareCues(duration) {
    const weights = sentences.map((sentence) => Math.max(1, sentence.textContent.trim().split(/\s+/).length));
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    let elapsed = 0;
    cues = weights.map((weight, index) => {
      const start = elapsed;
      elapsed += duration * weight / total;
      return { start, end: elapsed, index };
    });
  }

  function resetLetter() {
    hasStarted = false;
    activeIndex = -1;
    sentences.forEach((sentence) => sentence.classList.remove('is-current', 'is-revealed'));
    progress.style.width = '0%';
  }

  function syncLetter() {
    if (!audio || !Number.isFinite(audio.duration) || !audio.duration) return;
    const time = audio.currentTime;
    const cue = cues.find((item) => time >= item.start && time < item.end);
    const index = cue ? cue.index : (time >= audio.duration ? sentences.length - 1 : -1);
    hasStarted = true;
    setSentence(index);
    progress.style.width = `${Math.min(100, time / audio.duration * 100)}%`;
  }

  function startPlayback(fromBeginning = false) {
    if (!audio) return;
    if (fromBeginning || audio.ended) {
      audio.currentTime = 0;
      resetLetter();
    }
    audio.play().catch(() => {
      status.textContent = 'The recording could not be played. Please check the audio file.';
    });
  }

  if (!config.audio) {
    status.textContent = 'Your voice recording will appear here when you add it to the project.';
    note.textContent = 'The creator can add the recording at assets/voice-letter.mp3.';
    return;
  }

  audio = new Audio(config.audio);
  audio.preload = 'metadata';
  audio.addEventListener('loadedmetadata', () => {
    prepareCues(audio.duration);
    playButton.disabled = false;
    replayButton.disabled = false;
    status.textContent = 'Your letter is ready. Press play when you are ready. ♡';
    note.textContent = 'Your words appear sentence by sentence as your recording plays. Timing is estimated from sentence length.';
    resetLetter();
  });
  audio.addEventListener('error', () => {
    playButton.disabled = true;
    replayButton.disabled = true;
    status.textContent = 'Your voice recording will be ready when the creator adds it. ♡';
    note.textContent = 'The recording belongs in assets/voice-letter.mp3.';
  });
  audio.addEventListener('timeupdate', syncLetter);
  audio.addEventListener('ended', () => {
    hasStarted = true;
    setSentence(sentences.length - 1);
    progress.style.width = '100%';
    playButton.textContent = '↻ Play again';
    status.textContent = 'The whole letter is here for you to read again. ♡';
  });
  audio.addEventListener('play', () => {
    playButton.textContent = 'Ⅱ Pause';
    status.textContent = 'Reading this letter to you… ♡';
  });
  audio.addEventListener('pause', () => {
    if (!audio.ended) playButton.textContent = '▶ Resume';
  });

  playButton.addEventListener('click', () => {
    if (!audio) return;
    if (!audio.paused) audio.pause();
    else startPlayback(audio.ended);
  });
  replayButton.addEventListener('click', () => startPlayback(true));
})();
