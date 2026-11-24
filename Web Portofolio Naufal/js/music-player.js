/**
 * ==============================================================================
 * CyberPulse Audio Engine & Music Player - Muhammad Naufal
 * Menyediakan pemutar musik interaktif dengan lagu bawaan, playlist favorit,
 * visualizer equalizer, dan integrasi REST API backend.
 * ==============================================================================
 */

(function () {
  // Default fallback playlist (in case running without server / offline)
  const FALLBACK_PLAYLIST = [
    {
      id: "track-1",
      title: "Midnight Lo-Fi Coding",
      artist: "Lofi Sleep Chill",
      album: "Code & Dreams Vol. 1",
      duration: "2:45",
      genre: "Lofi Hip-Hop",
      cover: "assets/images/music/cover-lofi.svg",
      audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3",
      isFavorite: true,
      likes: 142,
      vibe: "Santai, relaks, cocok untuk deep coding tengah malam."
    },
    {
      id: "track-2",
      title: "Cyberpunk Neon Drive",
      artist: "Retro Synth Wave",
      album: "Night City 2088",
      duration: "3:12",
      genre: "Synthwave / Retrowave",
      cover: "assets/images/music/cover-synthwave.svg",
      audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=synthwave-80s-110045.mp3",
      isFavorite: true,
      likes: 98,
      vibe: "Penuh energi, ketukan synth 80-an saat memecahkan bug sulit."
    },
    {
      id: "track-3",
      title: "Coffee Shop & Rain",
      artist: "Acoustic Chillhop",
      album: "Sunday Morning Vibes",
      duration: "2:30",
      genre: "Chillhop / Jazzhop",
      cover: "assets/images/music/cover-chillhop.svg",
      audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=coffee-chill-out-15283.mp3",
      isFavorite: true,
      likes: 87,
      vibe: "Suasana kafe berhujan, piano lembut & ketukan hangat."
    },
    {
      id: "track-4",
      title: "Deep Focus Flow",
      artist: "Flow State Lab",
      album: "Binaural Synthesis",
      duration: "3:05",
      genre: "Ambient Electronic",
      cover: "assets/images/music/cover-ambient.svg",
      audioUrl: "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f772dd.mp3?filename=ambient-piano-amp-strings-10711.mp3",
      isFavorite: false,
      likes: 64,
      vibe: "Frekuensi tenang tanpa vokal untuk konsentrasi 100%."
    },
    {
      id: "track-5",
      title: "Senja & Nostalgia Jakarta",
      artist: "Naufal's Indie Picks",
      album: "Indie Senja Playlist",
      duration: "3:20",
      genre: "Indie Pop / Folk",
      cover: "assets/images/music/cover-indie.svg",
      audioUrl: "https://cdn.pixabay.com/download/audio/2022/11/06/audio_c97bb690d5.mp3?filename=acoustic-guitar-ambient-chill-125547.mp3",
      isFavorite: true,
      likes: 115,
      vibe: "Melodi gitar akustik hangat peneman sore hari."
    }
  ];

  class CyberMusicPlayer {
    constructor() {
      this.playlist = [...FALLBACK_PLAYLIST];
      this.currentIndex = 0;
      this.isPlaying = false;
      this.audio = new Audio();
      this.audio.preload = "metadata";
      this.volume = 0.7;
      this.isMuted = false;
      this.isShuffle = false;
      this.isRepeat = false;
      this.isExpanded = false;
      this.hasUserInteracted = false;

      // Web Audio Synth Fallback (in case audio URL fails or is offline)
      this.synthContext = null;
      this.synthInterval = null;
      this.usingSynthFallback = false;

      this.init();
    }

    async init() {
      // 1. Try to fetch playlist from backend API
      await this.fetchPlaylistFromApi();

      // 2. Setup Audio events
      this.setupAudioListeners();

      // 3. Render floating UI & Music lounge section
      this.createPlayerDOM();
      this.renderMusicLoungeCards();
      this.setupEventListeners();

      // 4. Load initial track
      this.loadTrack(0, false);

      // 5. Handle first interaction auto-prompt
      this.setupAutoPrompt();
    }

    async fetchPlaylistFromApi() {
      try {
        const res = await fetch("/api/music", { signal: AbortSignal.timeout(2000) });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            this.playlist = json.data;
          }
        }
      } catch (err) {
        // Fallback silently to built-in playlist
      }
    }

    setupAudioListeners() {
      this.audio.volume = this.volume;

      this.audio.addEventListener("timeupdate", () => {
        this.updateProgressBar();
      });

      this.audio.addEventListener("ended", () => {
        if (this.isRepeat) {
          this.playTrack();
        } else {
          this.nextTrack();
        }
      });

      this.audio.addEventListener("error", (e) => {
        console.warn("Audio stream error, activating ambient synth mode:", e);
        this.startSynthFallback();
      });

      this.audio.addEventListener("play", () => {
        this.isPlaying = true;
        this.updatePlayStateUI(true);
      });

      this.audio.addEventListener("pause", () => {
        this.isPlaying = false;
        this.updatePlayStateUI(false);
      });
    }

    loadTrack(index, autoPlay = true) {
      if (index < 0 || index >= this.playlist.length) return;
      this.stopSynthFallback();

      this.currentIndex = index;
      const track = this.playlist[index];

      this.audio.src = track.audioUrl;
      this.audio.load();

      this.updateTrackInfoUI(track);

      if (autoPlay) {
        this.playTrack();
      }
    }

    playTrack() {
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isPlaying = true;
            this.updatePlayStateUI(true);
            if (window.showToast) {
              window.showToast(`🎵 Memutar: ${this.getCurrentTrack().title}`);
            }
          })
          .catch((err) => {
            console.warn("Autoplay blocked or stream error:", err);
            // Browser autoplay restrictions - waiting for user click
          });
      }
    }

    pauseTrack() {
      this.audio.pause();
      this.stopSynthFallback();
      this.isPlaying = false;
      this.updatePlayStateUI(false);
    }

    togglePlay() {
      if (this.isPlaying) {
        this.pauseTrack();
      } else {
        if (this.usingSynthFallback) {
          this.startSynthFallback();
          this.isPlaying = true;
          this.updatePlayStateUI(true);
        } else {
          this.playTrack();
        }
      }
    }

    nextTrack() {
      if (this.isShuffle) {
        let nextIndex = Math.floor(Math.random() * this.playlist.length);
        if (nextIndex === this.currentIndex && this.playlist.length > 1) {
          nextIndex = (nextIndex + 1) % this.playlist.length;
        }
        this.loadTrack(nextIndex, true);
      } else {
        const next = (this.currentIndex + 1) % this.playlist.length;
        this.loadTrack(next, true);
      }
    }

    prevTrack() {
      const prev = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
      this.loadTrack(prev, true);
    }

    getCurrentTrack() {
      return this.playlist[this.currentIndex] || this.playlist[0];
    }

    seek(percent) {
      if (this.audio.duration) {
        this.audio.currentTime = (percent / 100) * this.audio.duration;
      }
    }

    setVolume(val) {
      this.volume = val;
      this.audio.volume = val;
      this.isMuted = val === 0;
      this.updateVolumeUI();
    }

    toggleMute() {
      if (this.isMuted) {
        this.audio.volume = this.volume || 0.5;
        this.isMuted = false;
      } else {
        this.audio.volume = 0;
        this.isMuted = true;
      }
      this.updateVolumeUI();
    }

    async toggleFavorite(trackId) {
      const track = this.playlist.find((t) => t.id === trackId);
      if (!track) return;

      track.isFavorite = !track.isFavorite;
      track.likes = track.isFavorite ? track.likes + 1 : Math.max(0, track.likes - 1);

      this.updateFavoriteUI(track);

      // Call backend API if running
      try {
        await fetch("/api/music/favorite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: trackId })
        });
      } catch (e) {
        // Local state already updated
      }

      if (window.showToast) {
        window.showToast(track.isFavorite ? `❤️ Menyukai "${track.title}"` : `Batal menyukai "${track.title}"`);
      }
    }

    // ------------------------------------------------------------------------
    // WEB AUDIO SYNTHESIZER FALLBACK (Zero External Downloads)
    // ------------------------------------------------------------------------
    startSynthFallback() {
      this.usingSynthFallback = true;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!this.synthContext) {
          this.synthContext = new AudioCtx();
        }
        if (this.synthContext.state === "suspended") {
          this.synthContext.resume();
        }

        // Chords frequencies (Am - F - C - G chill lofi progression)
        const chords = [
          [220.0, 261.63, 329.63, 392.0], // Am7
          [174.61, 220.0, 261.63, 329.63], // Fmaj7
          [261.63, 329.63, 392.0, 493.88], // Cmaj7
          [196.0, 246.94, 293.66, 349.23]  // G7
        ];

        let chordStep = 0;
        if (this.synthInterval) clearInterval(this.synthInterval);

        this.synthInterval = setInterval(() => {
          if (!this.isPlaying) return;
          const currentChord = chords[chordStep % chords.length];
          chordStep++;

          currentChord.forEach((freq, i) => {
            const osc = this.synthContext.createOscillator();
            const gain = this.synthContext.createGain();

            osc.type = i === 0 ? "triangle" : "sine";
            osc.frequency.setValueAtTime(freq, this.synthContext.currentTime);

            gain.gain.setValueAtTime(0.04 * this.volume, this.synthContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.synthContext.currentTime + 1.8);

            osc.connect(gain);
            gain.connect(this.synthContext.destination);

            osc.start();
            osc.stop(this.synthContext.currentTime + 1.8);
          });
        }, 2000);
      } catch (err) {
        console.warn("Synth fallback error:", err);
      }
    }

    stopSynthFallback() {
      if (this.synthInterval) {
        clearInterval(this.synthInterval);
        this.synthInterval = null;
      }
      this.usingSynthFallback = false;
    }

    // ------------------------------------------------------------------------
    // UI BUILDER & DOM CREATION
    // ------------------------------------------------------------------------
    createPlayerDOM() {
      const widget = document.createElement("div");
      widget.id = "cyber-music-widget";
      widget.className = "music-widget-wrapper";

      widget.innerHTML = `
        <!-- Floating Minimized Pill -->
        <div class="music-pill-mini" id="music-pill-mini" title="Buka CyberPulse Player">
          <div class="mini-vinyl-wrapper" id="mini-vinyl">
            <img src="${this.getCurrentTrack().cover}" alt="Album Art" class="mini-album-art" id="mini-album-img">
          </div>
          <div class="mini-track-info">
            <span class="mini-title" id="mini-track-title">${this.getCurrentTrack().title}</span>
            <span class="mini-artist" id="mini-track-artist">${this.getCurrentTrack().artist}</span>
          </div>
          <div class="mini-equalizer-bars" id="mini-eq-bars">
            <span class="eq-bar bar-1"></span>
            <span class="eq-bar bar-2"></span>
            <span class="eq-bar bar-3"></span>
            <span class="eq-bar bar-4"></span>
          </div>
          <button class="mini-btn-play" id="mini-play-btn" aria-label="Play or Pause">
            <span id="mini-play-icon">▶</span>
          </button>
          <button class="mini-btn-expand" id="mini-expand-btn" aria-label="Buka Player Penuh">
            <span>⛶</span>
          </button>
        </div>

        <!-- Full Expanded Music Player Card -->
        <div class="music-player-card" id="music-card-expanded">
          <div class="player-header">
            <div class="player-header-badge">
              <span class="pulse-indicator"></span>
              <span>CYBERPULSE MUSIC LOUNGE</span>
            </div>
            <button class="btn-close-player" id="btn-minimize-player" title="Minimize Player">✕</button>
          </div>

          <div class="player-body">
            <!-- Vinyl Disc & Album Art -->
            <div class="vinyl-display">
              <div class="vinyl-outer-disc" id="main-vinyl-disc">
                <div class="vinyl-groove"></div>
                <img src="${this.getCurrentTrack().cover}" alt="Vinyl Center" class="vinyl-center-art" id="main-album-img">
              </div>
            </div>

            <!-- Track Info & Like Button -->
            <div class="track-details-row">
              <div class="track-names">
                <h3 class="player-track-title" id="player-track-title">${this.getCurrentTrack().title}</h3>
                <p class="player-track-artist" id="player-track-artist">${this.getCurrentTrack().artist}</p>
                <span class="player-genre-badge" id="player-genre">${this.getCurrentTrack().genre}</span>
              </div>
              <button class="btn-like-track" id="btn-like-current" title="Sukai Lagu Ini">
                <span id="like-heart-icon">${this.getCurrentTrack().isFavorite ? "❤️" : "🤍"}</span>
                <span id="like-count-display">${this.getCurrentTrack().likes}</span>
              </button>
            </div>

            <!-- Progress & Time -->
            <div class="player-progress-area">
              <div class="progress-bar-container" id="player-progress-bar">
                <div class="progress-bar-fill" id="progress-bar-fill"></div>
              </div>
              <div class="time-row">
                <span id="time-current">0:00</span>
                <span id="time-total">${this.getCurrentTrack().duration}</span>
              </div>
            </div>

            <!-- Main Controls -->
            <div class="player-controls-row">
              <button class="ctrl-btn" id="btn-shuffle" title="Acak Lagu">
                <span>🔀</span>
              </button>
              <button class="ctrl-btn" id="btn-prev-track" title="Lagu Sebelumnya">
                <span>⏮</span>
              </button>
              <button class="ctrl-btn btn-play-large" id="btn-play-main" title="Putar/Jeda">
                <span id="main-play-icon">▶</span>
              </button>
              <button class="ctrl-btn" id="btn-next-track" title="Lagu Berikutnya">
                <span>⏭</span>
              </button>
              <button class="ctrl-btn" id="btn-repeat" title="Ulangi Lagu">
                <span>🔁</span>
              </button>
            </div>

            <!-- Volume & Playlist Drawer Toggle -->
            <div class="player-footer-tools">
              <div class="volume-slider-group">
                <button class="vol-btn" id="btn-mute-toggle" title="Mute/Unmute">
                  <span id="vol-icon">🔊</span>
                </button>
                <input type="range" class="vol-slider" id="vol-slider" min="0" max="1" step="0.05" value="0.7">
              </div>
              <button class="btn-playlist-toggle" id="btn-playlist-toggle">
                <span>Daftar Lagu (5)</span>
                <span>▼</span>
              </button>
            </div>

            <!-- Expandable Playlist Drawer -->
            <div class="playlist-drawer" id="playlist-drawer">
              <div class="playlist-items-list" id="playlist-items-list">
                <!-- Rendered dynamically -->
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(widget);
      this.renderPlaylistDrawerItems();
    }

    renderPlaylistDrawerItems() {
      const container = document.getElementById("playlist-items-list");
      if (!container) return;

      container.innerHTML = this.playlist
        .map(
          (track, i) => `
        <div class="playlist-track-row ${i === this.currentIndex ? "active" : ""}" data-track-index="${i}">
          <div class="track-row-left">
            <span class="track-num">${i + 1}</span>
            <img src="${track.cover}" alt="cover" class="track-row-thumb">
            <div>
              <div class="track-row-title">${track.title}</div>
              <div class="track-row-artist">${track.artist}</div>
            </div>
          </div>
          <div class="track-row-right">
            <span class="track-row-dur">${track.duration}</span>
            <button class="btn-row-heart" data-fav-id="${track.id}">
              ${track.isFavorite ? "❤️" : "🤍"}
            </button>
          </div>
        </div>
      `
        )
        .join("");

      // Bind row clicks
      container.querySelectorAll(".playlist-track-row").forEach((row) => {
        row.addEventListener("click", (e) => {
          if (e.target.closest(".btn-row-heart")) return;
          const idx = parseInt(row.getAttribute("data-track-index"), 10);
          this.loadTrack(idx, true);
        });
      });

      // Bind row heart clicks
      container.querySelectorAll(".btn-row-heart").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const id = btn.getAttribute("data-fav-id");
          this.toggleFavorite(id);
          this.renderPlaylistDrawerItems();
          this.renderMusicLoungeCards();
        });
      });
    }

    renderMusicLoungeCards() {
      const loungeContainer = document.getElementById("music-lounge-grid");
      if (!loungeContainer) return;

      loungeContainer.innerHTML = this.playlist
        .map(
          (track, i) => `
        <div class="music-card-item ${i === this.currentIndex && this.isPlaying ? "is-playing" : ""}" data-index="${i}">
          <div class="music-card-cover-wrap">
            <img src="${track.cover}" alt="${track.title}" class="music-card-cover">
            <button class="music-card-play-overlay" data-play-index="${i}" title="Putar Lagu Ini">
              <span>${i === this.currentIndex && this.isPlaying ? "⏸" : "▶"}</span>
            </button>
            <span class="music-card-genre">${track.genre}</span>
          </div>
          <div class="music-card-info">
            <h4 class="music-card-title">${track.title}</h4>
            <p class="music-card-artist">${track.artist} • ${track.album}</p>
            <p class="music-card-vibe">"${track.vibe}"</p>
            <div class="music-card-footer">
              <span class="music-card-duration">⏱ ${track.duration}</span>
              <button class="btn-card-heart" data-id="${track.id}">
                <span>${track.isFavorite ? "❤️" : "🤍"}</span>
                <span>${track.likes}</span>
              </button>
            </div>
          </div>
        </div>
      `
        )
        .join("");

      // Bind play overlay clicks
      loungeContainer.querySelectorAll(".music-card-play-overlay").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.getAttribute("data-play-index"), 10);
          if (idx === this.currentIndex) {
            this.togglePlay();
          } else {
            this.loadTrack(idx, true);
          }
          this.renderMusicLoungeCards();
        });
      });

      // Bind heart clicks
      loungeContainer.querySelectorAll(".btn-card-heart").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const id = btn.getAttribute("data-id");
          this.toggleFavorite(id);
          this.renderMusicLoungeCards();
          this.renderPlaylistDrawerItems();
        });
      });
    }

    setupEventListeners() {
      // Toggle Expanded / Minimized
      const pillMini = document.getElementById("music-pill-mini");
      const cardExpanded = document.getElementById("music-card-expanded");
      const btnMinimize = document.getElementById("btn-minimize-player");
      const btnExpand = document.getElementById("mini-expand-btn");

      const expandPlayer = () => {
        this.isExpanded = true;
        pillMini.style.display = "none";
        cardExpanded.classList.add("open");
      };

      const minimizePlayer = () => {
        this.isExpanded = false;
        cardExpanded.classList.remove("open");
        pillMini.style.display = "flex";
      };

      if (btnExpand) btnExpand.addEventListener("click", expandPlayer);
      if (pillMini) {
        pillMini.addEventListener("click", (e) => {
          if (e.target.closest("#mini-play-btn")) return;
          expandPlayer();
        });
      }
      if (btnMinimize) btnMinimize.addEventListener("click", minimizePlayer);

      // Play / Pause Buttons
      const miniPlayBtn = document.getElementById("mini-play-btn");
      const mainPlayBtn = document.getElementById("btn-play-main");

      if (miniPlayBtn) miniPlayBtn.addEventListener("click", () => this.togglePlay());
      if (mainPlayBtn) mainPlayBtn.addEventListener("click", () => this.togglePlay());

      // Prev / Next
      const btnNext = document.getElementById("btn-next-track");
      const btnPrev = document.getElementById("btn-prev-track");
      if (btnNext) btnNext.addEventListener("click", () => this.nextTrack());
      if (btnPrev) btnPrev.addEventListener("click", () => this.prevTrack());

      // Shuffle & Repeat
      const btnShuffle = document.getElementById("btn-shuffle");
      const btnRepeat = document.getElementById("btn-repeat");
      if (btnShuffle) {
        btnShuffle.addEventListener("click", () => {
          this.isShuffle = !this.isShuffle;
          btnShuffle.classList.toggle("active", this.isShuffle);
          if (window.showToast) window.showToast(this.isShuffle ? "🔀 Mode Acak Aktif" : "Mode Acak Nonaktif");
        });
      }
      if (btnRepeat) {
        btnRepeat.addEventListener("click", () => {
          this.isRepeat = !this.isRepeat;
          btnRepeat.classList.toggle("active", this.isRepeat);
          if (window.showToast) window.showToast(this.isRepeat ? "🔁 Ulangi Lagu Aktif" : "Ulangi Lagu Nonaktif");
        });
      }

      // Volume & Mute
      const volSlider = document.getElementById("vol-slider");
      const btnMute = document.getElementById("btn-mute-toggle");
      if (volSlider) {
        volSlider.addEventListener("input", (e) => {
          this.setVolume(parseFloat(e.target.value));
        });
      }
      if (btnMute) btnMute.addEventListener("click", () => this.toggleMute());

      // Favorite Current Track
      const btnLikeCurrent = document.getElementById("btn-like-current");
      if (btnLikeCurrent) {
        btnLikeCurrent.addEventListener("click", () => {
          const track = this.getCurrentTrack();
          this.toggleFavorite(track.id);
          this.renderMusicLoungeCards();
          this.renderPlaylistDrawerItems();
        });
      }

      // Progress bar click
      const progressBar = document.getElementById("player-progress-bar");
      if (progressBar) {
        progressBar.addEventListener("click", (e) => {
          const rect = progressBar.getBoundingClientRect();
          const percent = ((e.clientX - rect.left) / rect.width) * 100;
          this.seek(percent);
        });
      }

      // Playlist drawer toggle
      const btnPlaylistToggle = document.getElementById("btn-playlist-toggle");
      const playlistDrawer = document.getElementById("playlist-drawer");
      if (btnPlaylistToggle && playlistDrawer) {
        btnPlaylistToggle.addEventListener("click", () => {
          playlistDrawer.classList.toggle("open");
        });
      }

      // Song Recommendation Modal
      this.setupRecommendModal();
    }

    setupRecommendModal() {
      const openModalBtn = document.getElementById("btn-open-recommend-modal");
      const modal = document.getElementById("recommend-modal");
      const closeModalBtn = document.getElementById("close-recommend-modal");
      const form = document.getElementById("recommend-song-form");

      if (openModalBtn && modal) {
        openModalBtn.addEventListener("click", () => {
          modal.classList.add("open");
        });
      }

      if (closeModalBtn && modal) {
        closeModalBtn.addEventListener("click", () => {
          modal.classList.remove("open");
        });
      }

      if (modal) {
        modal.addEventListener("click", (e) => {
          if (e.target === modal) modal.classList.remove("open");
        });
      }

      if (form) {
        form.addEventListener("submit", async (e) => {
          e.preventDefault();
          const title = document.getElementById("rec-title").value.trim();
          const artist = document.getElementById("rec-artist").value.trim();
          const recommender = document.getElementById("rec-name").value.trim();
          const note = document.getElementById("rec-note").value.trim();

          if (!title || !artist) return;

          try {
            await fetch("/api/music/recommend", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ title, artist, recommender, note })
            });
          } catch (err) {
            // Handled
          }

          if (modal) modal.classList.remove("open");
          form.reset();
          if (window.showToast) {
            window.showToast(`🎶 Terima kasih! Lagu "${title}" telah dikirim ke Naufal.`);
          }
        });
      }
    }

    setupAutoPrompt() {
      // Invite user to play on first page interaction
      const promptBanner = document.getElementById("music-welcome-prompt");
      const startMusicBtn = document.getElementById("btn-start-welcome-music");
      const closePromptBtn = document.getElementById("btn-close-music-prompt");

      if (startMusicBtn) {
        startMusicBtn.addEventListener("click", () => {
          this.playTrack();
          if (promptBanner) promptBanner.style.display = "none";
        });
      }

      if (closePromptBtn && promptBanner) {
        closePromptBtn.addEventListener("click", () => {
          promptBanner.style.display = "none";
        });
      }
    }

    updateTrackInfoUI(track) {
      // Mini pill
      const miniTitle = document.getElementById("mini-track-title");
      const miniArtist = document.getElementById("mini-track-artist");
      const miniImg = document.getElementById("mini-album-img");
      if (miniTitle) miniTitle.textContent = track.title;
      if (miniArtist) miniArtist.textContent = track.artist;
      if (miniImg) miniImg.src = track.cover;

      // Expanded card
      const playerTitle = document.getElementById("player-track-title");
      const playerArtist = document.getElementById("player-track-artist");
      const playerGenre = document.getElementById("player-genre");
      const mainImg = document.getElementById("main-album-img");
      const timeTotal = document.getElementById("time-total");

      if (playerTitle) playerTitle.textContent = track.title;
      if (playerArtist) playerArtist.textContent = track.artist;
      if (playerGenre) playerGenre.textContent = track.genre;
      if (mainImg) mainImg.src = track.cover;
      if (timeTotal) timeTotal.textContent = track.duration;

      this.updateFavoriteUI(track);
      this.renderPlaylistDrawerItems();
      this.renderMusicLoungeCards();
    }

    updatePlayStateUI(isPlaying) {
      const miniIcon = document.getElementById("mini-play-icon");
      const mainIcon = document.getElementById("main-play-icon");
      const miniVinyl = document.getElementById("mini-vinyl");
      const mainVinyl = document.getElementById("main-vinyl-disc");
      const eqBars = document.getElementById("mini-eq-bars");

      if (miniIcon) miniIcon.textContent = isPlaying ? "⏸" : "▶";
      if (mainIcon) mainIcon.textContent = isPlaying ? "⏸" : "▶";

      if (miniVinyl) miniVinyl.classList.toggle("spinning", isPlaying);
      if (mainVinyl) mainVinyl.classList.toggle("spinning", isPlaying);
      if (eqBars) eqBars.classList.toggle("active", isPlaying);

      this.renderMusicLoungeCards();
    }

    updateProgressBar() {
      const fill = document.getElementById("progress-bar-fill");
      const currentLabel = document.getElementById("time-current");

      if (!this.audio.duration) return;

      const progress = (this.audio.currentTime / this.audio.duration) * 100;
      if (fill) fill.style.width = `${progress}%`;

      if (currentLabel) {
        const mins = Math.floor(this.audio.currentTime / 60);
        const secs = Math.floor(this.audio.currentTime % 60);
        currentLabel.textContent = `${mins}:${secs < 10 ? "0" : ""}${secs}`;
      }
    }

    updateVolumeUI() {
      const volIcon = document.getElementById("vol-icon");
      const slider = document.getElementById("vol-slider");

      if (slider) slider.value = this.isMuted ? 0 : this.volume;
      if (volIcon) {
        if (this.isMuted || this.volume === 0) {
          volIcon.textContent = "🔇";
        } else if (this.volume < 0.5) {
          volIcon.textContent = "🔉";
        } else {
          volIcon.textContent = "🔊";
        }
      }
    }

    updateFavoriteUI(track) {
      const heartIcon = document.getElementById("like-heart-icon");
      const countDisplay = document.getElementById("like-count-display");

      if (heartIcon) heartIcon.textContent = track.isFavorite ? "❤️" : "🤍";
      if (countDisplay) countDisplay.textContent = track.likes;
    }
  }

  // Initialize on DOM load
  window.addEventListener("DOMContentLoaded", () => {
    window.CYBER_PLAYER = new CyberMusicPlayer();
  });
})();
