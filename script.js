document.addEventListener('DOMContentLoaded', () => {
    // 1. Danh sách nhạc
    const playlist = [
        {
            title: "Sớm Như Vậy",
            artist: "Bùi Trường Linh",
            cover: "images/BTLThumbnail.png",
            src: "music/WayTooSoon.mp3"
        },
        {
            title: "Too Little Too Late",
            artist: "Laufey",
            cover: "images/LaufeyThumbnail.png",
            src: "music/TooLittleTooLate.mp3"
        },
        {
            title: "Những Lời Hứa Bỏ Quên",
            artist: "Vũ. x Dear Jane",
            cover: "images/VuThumbnail.png",
            src: "music/ForgottenPromises.mp3"
        },
        {
            title: "THÁNG NĂM",
            artist: "Soobin",
            cover: "images/soobinthumbnail.png",
            src: "music/ThangNam.mp3"
        }
    ];

    let currentIndex = 0;
    let isPlaying = false;
    let isRepeat = false;

    // 2. Truy vấn các phần tử giao diện
    const audio = document.getElementById('main-audio');
    const playBtn = document.querySelector('.fa-play');
    const nextBtn = document.querySelector('.fa-step-forward');
    const prevBtn = document.querySelector('.fa-step-backward');
    const repeatBtn = document.querySelector('.fa-redo');

    const volumeSlider = document.getElementById('volume-slider');
    const volumeValue = document.getElementById('volume-value');

    const seekSlider = document.getElementById('seek-slider');
    const currentTimeMsg = document.getElementById('current-time');
    const durationTimeMsg = document.getElementById('duration-time');

    const songTitle = document.querySelector('.song-title');
    const songArtist = document.querySelector('.song-artist');
    const songImg = document.querySelector('.song-img');

    // Các phần tử Dropdown Playlist
    const toggleBtn = document.getElementById('playlist-toggle-btn');
    const dropdown = document.getElementById('playlist-dropdown');
    const songItems = document.querySelectorAll('.song-item');

    // 3. Định dạng thời gian
    function formatTime(seconds) {
        let min = Math.floor(seconds / 60);
        let sec = Math.floor(seconds % 60);
        if (sec < 10) sec = `0${sec}`;
        return `${min}:${sec}`;
    }

    // 4. Cập nhật trạng thái hiển thị
    function updateVisualStatus(playing) {
        if (playing) {
            playBtn.classList.replace('fa-play', 'fa-pause');
            songImg.classList.add('playing');
        } else {
            playBtn.classList.replace('fa-pause', 'fa-play');
            songImg.classList.remove('playing');
        }
    }

    // 5. Hàm tải thông tin bài hát và đồng bộ class Active trong danh sách xổ xuống
    function loadSong(index) {
        currentIndex = index;
        const song = playlist[currentIndex];
        
        if (songTitle) songTitle.textContent = song.title;
        if (songArtist) songArtist.textContent = song.artist;
        if (songImg) songImg.src = song.cover;
        audio.src = song.src;

        seekSlider.value = 0;
        currentTimeMsg.textContent = "0:00";

        // Đồng bộ class 'active' trong danh sách chữ
        songItems.forEach((item, idx) => {
            if (idx === currentIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // 6. Hàm xử lý Phát/Tạm dừng
    function togglePlay() {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        isPlaying = !isPlaying;
        updateVisualStatus(isPlaying);
    }

    // 7. Hàm chuyển bài tiếp theo
    function nextSong() {
        currentIndex = (currentIndex + 1) % playlist.length;
        loadSong(currentIndex);
        if (isPlaying) audio.play();
        else updateVisualStatus(false);
    }

    // 8. Hàm quay lại bài trước
    function prevSong() {
        currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentIndex);
        if (isPlaying) audio.play();
        else updateVisualStatus(false);
    }

    // 9. Cập nhật giao diện Slider
    function updateSliderBackground(slider, value) {
        const percent = (value - slider.min) / (slider.max - slider.min) * 100;
        slider.style.background = `linear-gradient(to right, #00ffff ${percent}%, #222 ${percent}%)`;
    }

    // --- GẮN SỰ KIỆN ĐIỀU KHIỂN ---
    playBtn.addEventListener('click', togglePlay);
    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);

    repeatBtn.addEventListener('click', () => {
        isRepeat = !isRepeat;
        repeatBtn.style.color = isRepeat ? "#00ffff" : "#ccc";
        repeatBtn.style.textShadow = isRepeat ? "0 0 10px #00ffff" : "none";
    });

    volumeSlider.addEventListener('input', () => {
        const value = volumeSlider.value;
        audio.volume = value / 100;
        volumeValue.textContent = `${value}%`;
        updateSliderBackground(volumeSlider, value);
    });

    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const currentPos = (audio.currentTime / audio.duration) * 100;
            seekSlider.value = currentPos;
            currentTimeMsg.textContent = formatTime(audio.currentTime);
            durationTimeMsg.textContent = formatTime(audio.duration);
            updateSliderBackground(seekSlider, currentPos);
        }
    });

    seekSlider.addEventListener('input', () => {
        const seekTo = audio.duration * (seekSlider.value / 100);
        audio.currentTime = seekTo;
        updateSliderBackground(seekSlider, seekSlider.value);
    });

    audio.addEventListener('ended', () => {
        if (isRepeat) {
            audio.currentTime = 0;
            audio.play();
        } else {
            nextSong();
        }
    });

    // --- LOGIC XỬ LÝ DROPDOWN PLAYLIST ---
    toggleBtn.addEventListener('click', (e) => {
        dropdown.classList.toggle('show');
        e.stopPropagation();
    });

    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && e.target !== toggleBtn) {
            dropdown.classList.remove('show');
        }
    });

    songItems.forEach(item => {
        item.addEventListener('click', () => {
            const songIndex = parseInt(item.getAttribute('data-index'));
            loadSong(songIndex);
            
            // Tự động phát khi chọn từ danh sách
            isPlaying = true;
            audio.play();
            updateVisualStatus(true);
            
            dropdown.classList.remove('show');
        });
    });

    // --- KHỞI TẠO BAN ĐẦU ---
    loadSong(currentIndex);
    updateSliderBackground(volumeSlider, volumeSlider.value);
});
