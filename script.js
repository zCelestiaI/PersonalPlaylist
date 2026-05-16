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
            title: "Những Lời Hứa Bỏ Quên",
            artist: "Vũ. x Dear Jane",
            cover: "images/VuThumbnail.png",
            src: "music/ForgottenPromises.mp3"
        }
    ];

    let currentIndex = 0;
    let isPlaying = false;
    let isRepeat = false; // Trạng thái lặp lại

    // 2. Truy vấn các phần tử giao diện
    const audio = document.getElementById('main-audio');
    const playBtn = document.querySelector('.fa-play');
    const nextBtn = document.querySelector('.fa-step-forward');
    const prevBtn = document.querySelector('.fa-step-backward');
    const repeatBtn = document.querySelector('.fa-redo');

    const volumeSlider = document.getElementById('volume-slider');
    const volumeValue = document.getElementById('volume-value');

    const seekSlider = document.getElementById('seek-slider'); // Thanh tua nhạc
    const currentTimeMsg = document.getElementById('current-time');
    const durationTimeMsg = document.getElementById('duration-time');

    const songTitle = document.querySelector('.song-title');
    const songArtist = document.querySelector('.song-artist');
    const songImg = document.querySelector('.song-img');
    const mainAvatar = document.querySelector('.profile-img img');

    // 3. Định dạng thời gian (Giây -> Phút:Giây)
    function formatTime(seconds) {
        let min = Math.floor(seconds / 60);
        let sec = Math.floor(seconds % 60);
        if (sec < 10) sec = `0${sec}`;
        return `${min}:${sec}`;
    }

    // 4. Cập nhật trạng thái hiển thị (Xoay ảnh & Icon Play)
    function updateVisualStatus(playing) {
        if (playing) {
            playBtn.classList.replace('fa-play', 'fa-pause');
            songImg.classList.add('playing');
        } else {
            playBtn.classList.replace('fa-pause', 'fa-play');
            songImg.classList.remove('playing');
        }
    }

    // 5. Hàm tải thông tin bài hát lên giao diện
    function loadSong(song) {
        if (songTitle) songTitle.textContent = song.title;
        if (songArtist) songArtist.textContent = song.artist;
        if (songImg) songImg.src = song.cover;
        audio.src = song.src;

        // Reset thanh seek khi đổi bài
        seekSlider.value = 0;
        currentTimeMsg.textContent = "0:00";
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
        loadSong(playlist[currentIndex]);
        if (isPlaying) audio.play();
        else updateVisualStatus(false);
    }

    // 8. Hàm quay lại bài trước
    function prevSong() {
        currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        loadSong(playlist[currentIndex]);
        if (isPlaying) audio.play();
        else updateVisualStatus(false);
    }

    // 9. Cập nhật giao diện Slider (Dải màu Cyan)
    function updateSliderBackground(slider, value) {
        const percent = (value - slider.min) / (slider.max - slider.min) * 100;
        slider.style.background = `linear-gradient(to right, #00ffff ${percent}%, #222 ${percent}%)`;
    }

    // --- GẮN SỰ KIỆN ---

    playBtn.addEventListener('click', togglePlay);
    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);

    // Nút lặp lại bài hát
    repeatBtn.addEventListener('click', () => {
        isRepeat = !isRepeat;
        repeatBtn.style.color = isRepeat ? "#00ffff" : "#ccc";
        repeatBtn.style.textShadow = isRepeat ? "0 0 10px #00ffff" : "none";
    });

    // Xử lý Âm lượng
    volumeSlider.addEventListener('input', () => {
        const value = volumeSlider.value;
        audio.volume = value / 100;
        volumeValue.textContent = `${value}%`;
        updateSliderBackground(volumeSlider, value);
    });

    // Cập nhật thanh tiến trình và thời gian khi nhạc chạy
    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const currentPos = (audio.currentTime / audio.duration) * 100;
            seekSlider.value = currentPos;

            currentTimeMsg.textContent = formatTime(audio.currentTime);
            durationTimeMsg.textContent = formatTime(audio.duration);

            updateSliderBackground(seekSlider, currentPos);
        }
    });

    // Khi người dùng tua nhạc qua thanh Seekbar
    seekSlider.addEventListener('input', () => {
        const seekTo = audio.duration * (seekSlider.value / 100);
        audio.currentTime = seekTo;
        updateSliderBackground(seekSlider, seekSlider.value);
    });

    // Tự động chuyển bài hoặc lặp lại khi kết thúc
    audio.addEventListener('ended', () => {
        if (isRepeat) {
            audio.currentTime = 0;
            audio.play();
        } else {
            nextSong();
        }
    });

    // --- KHỞI TẠO BAN ĐẦU ---
    loadSong(playlist[currentIndex]);
    updateSliderBackground(volumeSlider, volumeSlider.value);
});
