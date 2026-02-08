// Fungsi untuk kontrol musik
document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const musicIcon = musicToggle.querySelector('i');
    const volumeSlider = document.getElementById('volume-slider');
    const musicToast = document.getElementById('music-toast');
    const toastMessage = document.getElementById('toast-message');
    
    // Set volume awal dari slider
    audio.volume = volumeSlider.value;
    
    // Cek status musik dari localStorage
    let isMusicPlaying = localStorage.getItem('musicPlaying') === 'true';
    
    // Atur status awal musik
    if (isMusicPlaying) {
        audio.play().catch(e => {
            console.log("Autoplay diblokir, butuh interaksi pengguna");
            isMusicPlaying = false;
            updateMusicButton();
        });
    }
    
    // Update tampilan tombol musik
    function updateMusicButton() {
        if (isMusicPlaying) {
            musicIcon.className = 'fas fa-volume-up';
            musicToggle.title = 'Matikan Musik';
        } else {
            musicIcon.className = 'fas fa-volume-mute';
            musicToggle.title = 'Nyalakan Musik';
        }
        localStorage.setItem('musicPlaying', isMusicPlaying);
    }
    
    // Fungsi untuk menampilkan toast
    function showToast(message) {
        toastMessage.textContent = message;
        musicToast.classList.add('show');
        setTimeout(() => {
            musicToast.classList.remove('show');
        }, 3000);
    }
    
    // Update tombol saat halaman dimuat
    updateMusicButton();
    
    // Toggle musik saat tombol diklik
    musicToggle.addEventListener('click', function() {
        isMusicPlaying = !isMusicPlaying;
        
        if (isMusicPlaying) {
            audio.play().then(() => {
                showToast('Musik dihidupkan');
            }).catch(e => {
                console.log("Gagal memutar musik:", e);
                isMusicPlaying = false;
                showToast('Gagal memutar musik');
            });
        } else {
            audio.pause();
            showToast('Musik dimatikan');
        }
        
        updateMusicButton();
    });
    
    // Kontrol volume dengan slider
    volumeSlider.addEventListener('input', function() {
        audio.volume = this.value;
        // Simpan preferensi volume
        localStorage.setItem('musicVolume', this.value);
    });
    
    // Load volume preference dari localStorage
    const savedVolume = localStorage.getItem('musicVolume');
    if (savedVolume !== null) {
        audio.volume = savedVolume;
        volumeSlider.value = savedVolume;
    }
    
    // Memulai musik setelah interaksi pengguna (fallback)
    function startAudioOnInteraction() {
        if (!isMusicPlaying) {
            isMusicPlaying = true;
            audio.play().then(() => {
                updateMusicButton();
                showToast('Musik dimulai');
            }).catch(e => {
                console.log("Gagal memutar musik:", e);
                isMusicPlaying = false;
            });
        }
        // Hapus event listeners setelah interaksi pertama
        document.removeEventListener('click', startAudioOnInteraction);
        document.removeEventListener('touchstart', startAudioOnInteraction);
        document.removeEventListener('keydown', startAudioOnInteraction);
    }
    
    // Tambah event listeners untuk interaksi
    document.addEventListener('click', startAudioOnInteraction);
    document.addEventListener('touchstart', startAudioOnInteraction);
    document.addEventListener('keydown', startAudioOnInteraction);
    
    // Deteksi kapan musik selesai loading
    audio.addEventListener('loadeddata', function() {
        console.log("Musik berhasil dimuat dari:", audio.src);
    });
    
    audio.addEventListener('error', function(e) {
        console.error("Error loading audio:", e);
        showToast('Gagal memuat musik');
        // Coba fallback URL jika yang pertama gagal
        if (audio.src !== 'https://files.catbox.moe/sm9dt2.mp3') {
            audio.src = 'https://files.catbox.moe/sm9dt2.mp3';
            audio.load();
        }
    });
});

// Efek scroll halus untuk semua link
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        if(this.getAttribute('href') !== '#') {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Fungsi untuk mengkonfirmasi sebelum meninggalkan halaman jika musik sedang diputar
window.addEventListener('beforeunload', function(e) {
    const audio = document.getElementById('bg-music');
    if (!audio.paused) {
        // Hapus event untuk menghindari dialog konfirmasi
        // (kebanyakan browser modern tidak mengizinkan custom message)
        return null;
    }
});
