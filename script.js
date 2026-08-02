const screens = document.querySelectorAll(".screen");
const hearts = document.getElementById("hearts");
const music = document.getElementById("music");
const musicBtn = document.getElementById("musicBtn");
let musicPlaying = false;

function showScreen(id) {
  screens.forEach(screen => screen.classList.remove("active"));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function startMusic() {
  music.play().then(() => {
    musicPlaying = true;
    musicBtn.textContent = "🔊";
  }).catch(() => {
    musicPlaying = false;
    musicBtn.textContent = "🎵";
  });
}

musicBtn.addEventListener("click", () => {
  if (musicPlaying) {
    music.pause();
    musicPlaying = false;
    musicBtn.textContent = "🎵";
  } else {
    startMusic();
  }
});

document.getElementById("openBtn").addEventListener("click", () => {
  startMusic();
  showScreen("birthday");
  launchConfetti(300);
});

document.querySelectorAll(".next-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    showScreen(btn.dataset.next);
  });
});

/* Floating hearts */
function createHeart() {
  const heart = document.createElement("div");
  heart.className = "floating-heart";
  heart.textContent = ["💗", "💕", "💖", "🌸", "✨"][Math.floor(Math.random() * 5)];
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = (12 + Math.random() * 20) + "px";
  heart.style.animationDuration = (5 + Math.random() * 6) + "s";
  hearts.appendChild(heart);
  setTimeout(() => heart.remove(), 12000);
}
setInterval(createHeart, 650);

/* Love letter */
const envelope = document.getElementById("envelope");
const letterHint = document.getElementById("letterHint");
const letterNext = document.getElementById("letterNext");

envelope.addEventListener("click", () => {
  if (!envelope.classList.contains("open")) {
    envelope.classList.add("open");
    letterHint.textContent = "A little piece of my heart for you ❤️";
    setTimeout(() => letterNext.classList.remove("hidden"), 900);
  }
});

/* =========================================
   CAKE - MAKE A WISH + FORMSPREE
   ========================================= */

const candle =
  document.getElementById("candle");

const flame =
  document.getElementById("flame");

const wishForm =
  document.getElementById("wishForm");

const wishInput =
  document.getElementById("wishInput");

const wishCounter =
  document.getElementById("wishCounter");

const makeWishButton =
  document.getElementById("makeWishButton");

const wishArea =
  document.getElementById("wishArea");

const wishResult =
  document.getElementById("wishResult");

const wishTextResult =
  document.getElementById("wishTextResult");

const wishExplosion =
  document.getElementById("wishExplosion");

const confettiContainer =
  document.getElementById("confettiContainer");

const cakeSection =
  document.getElementById("cake");


/* =========================================
   WISH COUNTER
   ========================================= */

if (wishInput) {

  wishInput.addEventListener(
    "input",
    () => {

      wishCounter.textContent =
        `${wishInput.value.length} / 200`;

    }
  );

}


/* =========================================
   MAKE A WISH
   ========================================= */

wishForm.addEventListener("submit", async (event) => {

  event.preventDefault();

  const wish = wishInput.value.trim();

  if (!wish) {
    wishInput.focus();
    return;
  }

  /* Simpan wish */
  localStorage.setItem("birthdayWish", wish);

  /* Tombol */
  makeWishButton.disabled = true;
  makeWishButton.innerHTML = `
    <span>Making my wish...</span>
    <span>✨</span>
  `;


  /* =====================================
     KIRIM KE FORMSPREE
     ===================================== */

  fetch("https://formspree.io/f/mykrrkon", {
    method: "POST",
    body: new FormData(wishForm),
    headers: {
      "Accept": "application/json"
    }
  })
  .then(response => {

    console.log("Wish dikirim ke Formspree:", response.status);

  })
  .catch(error => {

    console.error(
      "Formspree error:",
      error
    );

  });


  /* =====================================
     ANIMASI LANGSUNG
     ===================================== */

  cakeSection.classList.add(
    "wish-started"
  );


  /* =====================================
     API MELEDAK
     ===================================== */

  setTimeout(() => {

    cakeSection.classList.add(
      "wish-exploded"
    );

    if (flame) {

      const rect =
        flame.getBoundingClientRect();

      const explosionX =
        rect.left +
        rect.width / 2;

      const explosionY =
        rect.top +
        rect.height / 2;


      createWishExplosion(
        explosionX,
        explosionY
      );


      createWishConfetti(
        explosionX,
        explosionY
      );

    }

  }, 700);


  /* =====================================
     PINDAH KE GIFT
     ===================================== */

  setTimeout(() => {

    showScreen("gift");

  }, 1400);

});

/* Gift */
const giftBox = document.getElementById("giftBox");
const finalMessage = document.getElementById("finalMessage");

giftBox.addEventListener("click", () => {
  if (giftBox.classList.contains("opened")) return;

  giftBox.classList.add("opened");
  launchConfetti(300);

  setTimeout(() => {
    giftBox.classList.add("hidden");
    finalMessage.classList.remove("hidden");
  }, 700);
});

/* Replay */
document.getElementById("replayBtn").addEventListener("click", () => {
  document.getElementById("envelope").classList.remove("open");
  letterNext.classList.add("hidden");
  letterHint.textContent = "Klik amplopnya untuk membuka 💕";

  candle.classList.remove("off");
  /* Replay */
document.getElementById("replayBtn").addEventListener("click", () => {

  document.getElementById("envelope")
    .classList.remove("open");

  letterNext.classList.add("hidden");

  letterHint.textContent =
    "Klik amplopnya untuk membuka 💕";


  /* Reset Cake */

  cakeSection.classList.remove(
    "wish-started",
    "wish-exploded"
  );

  wishInput.value = "";

  wishCounter.textContent =
    "0 / 200";

  makeWishButton.disabled = false;

  makeWishButton.style.pointerEvents =
    "auto";

  wishArea.style.display =
    "";

  wishResult.classList.remove(
    "show"
  );

  wishTextResult.textContent = "";

  wishExplosion.innerHTML = "";

  confettiContainer.innerHTML = "";


  /* Reset Gift */

  giftBox.classList.remove(
    "opened",
    "hidden"
  );

  finalMessage.classList.add(
    "hidden"
  );


  showScreen("opening");

});

  giftBox.classList.remove("opened", "hidden");
  finalMessage.classList.add("hidden");

  showScreen("opening");
});

/* Confetti */
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let pieces = [];
let animationFrame;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function launchConfetti(amount = 150) {
  const colors = ["#ff7fa8", "#ffd86b", "#cbb7ff", "#8bd3dd", "#ffb6c1"];
  for (let i = 0; i < amount; i++) {
    pieces.push({
      x: window.innerWidth / 2,
      y: window.innerHeight * .35,
      size: 5 + Math.random() * 8,
      vx: (Math.random() - .5) * 12,
      vy: -4 - Math.random() * 11,
      gravity: .25 + Math.random() * .1,
      rotation: Math.random() * Math.PI,
      rotationSpeed: (Math.random() - .5) * .3,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 100 + Math.random() * 80
    });
  }

  cancelAnimationFrame(animationFrame);
  animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  pieces.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.rotation += p.rotationSpeed;
    p.life -= 1;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * .6);
    ctx.restore();
  });

  pieces = pieces.filter(p => p.life > 0 && p.y < canvas.height + 50);

  if (pieces.length) {
    animationFrame = requestAnimationFrame(animateConfetti);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
/* =========================================
   SOFT FLOATING MEMORIES
   Natural drifting animation
   ========================================= */

const photoFiles = [
  "image20.png",
  "image21.png",
  "image22.png",
  "image23.png",
  "image24.png",
  "image25.png",
  "image26.png",
  "image27.png",
  "image28.png",
  "image29.png",
  "image30.png",
  "image31.png",
  "image32.png",
  "image33.png",
  "image34.png",
  "image35.png",
  "image36.png",
  "image37.png",
  "image38.png",
  "image39.png",
  "image40.png"
];

const gallery = document.getElementById("floatingGallery");

const viewer = document.getElementById("photoViewer");
const viewerImage = document.getElementById("viewerImage");
const viewerCaption = document.getElementById("viewerCaption");
const closePhoto = document.getElementById("closePhoto");

const floatingPhotos = [];


/* =========================================
   RANDOM
   ========================================= */

function random(min, max) {
  return Math.random() * (max - min) + min;
}


/* =========================================
   CREATE PHOTO
   ========================================= */

photoFiles.forEach((filename, index) => {

  const photo = document.createElement("div");

  photo.className = "floating-photo";


  const image = document.createElement("img");

  image.src = `images/${filename}`;

  image.alt = `Memory ${index + 1}`;


  /*
    Ukuran
  */

  const size = random(120, 185);


  /*
    Posisi awal
  */

  const x = random(5, 82);
  const y = random(5, 76);


  /*
    Setiap foto mempunyai
    "arah tujuan" sendiri.
  */

  const targetX = random(5, 82);
  const targetY = random(5, 76);


  /*
    Kecepatan sangat lambat
  */

  const speed = random(0.00045, 0.00085);


  /*
    Rotasi
  */

  const rotation = random(-10, 10);

  const targetRotation = random(-14, 14);


  /*
    Scale sedikit berbeda
  */

  const scale = random(.9, 1.08);


  photo.style.width = `${size}px`;

  photo.style.left = `${x}%`;

  photo.style.top = `${y}%`;

  photo.style.transform =
    `rotate(${rotation}deg) scale(${scale})`;


  photo.appendChild(image);

  gallery.appendChild(photo);


  floatingPhotos.push({

    element: photo,

    x: x,

    y: y,

    targetX: targetX,

    targetY: targetY,

    speed: speed,

    rotation: rotation,

    targetRotation: targetRotation,

    scale: scale,

    paused: false,

    pauseUntil: 0

  });


  /* =====================================
     CLICK
     ===================================== */

  photo.addEventListener("click", () => {

    viewerImage.src = image.src;

    viewerCaption.textContent =
      `Memory #${index + 1} with you ♡`;

    viewer.classList.remove("hidden");

    requestAnimationFrame(() => {
      viewer.classList.add("show");
    });

  });

});


/* =========================================
   NEW DESTINATION
   ========================================= */

function chooseNewDestination(photo) {

  photo.targetX = random(5, 82);

  photo.targetY = random(5, 76);

  photo.targetRotation = random(-14, 14);

}


/* =========================================
   SMOOTH FLOATING
   ========================================= */

function animateFloatingPhotos(time) {

  floatingPhotos.forEach(photo => {

    /*
      Hover = berhenti sementara
    */

    if (
      photo.element.matches(":hover")
    ) {

      return;

    }


    /*
      Kalau sedang pause
    */

    if (time < photo.pauseUntil) {

      return;

    }


    /*
      Jarak menuju tujuan
    */

    const dx =
      photo.targetX - photo.x;

    const dy =
      photo.targetY - photo.y;


    const distance =
      Math.sqrt(
        dx * dx +
        dy * dy
      );


    /*
      Kalau sudah dekat tujuan,
      pilih tujuan baru.
    */

    if (distance < 2.5) {

      /*
        Berhenti sebentar secara natural
      */

      photo.pauseUntil =
         time + random(250, 700);


      chooseNewDestination(photo);

      return;

    }


    /*
      Easing movement

      Semakin dekat tujuan,
      semakin pelan.
    */

    photo.x += dx * photo.speed;
    photo.y += dy * photo.speed;


    /*
      Rotasi juga bergerak perlahan
    */

    const rotationDifference =
      photo.targetRotation -
      photo.rotation;


    photo.rotation +=
      rotationDifference * 0.003;


    /*
      Sedikit floating vertikal.
      Bukan gerakan utama.
    */

    const floatOffset =
      Math.sin(
        time * 0.0012 +
        photo.x
      ) * 1.5;


    /*
      Terapkan posisi
    */

    photo.element.style.left =
      `${photo.x}%`;

    photo.element.style.top =
      `${photo.y + floatOffset}%`;

    photo.element.style.transform =
      `
      rotate(${photo.rotation}deg)
      scale(${photo.scale})
      `;

  });


  requestAnimationFrame(
    animateFloatingPhotos
  );

}


/* =========================================
   START
   ========================================= */

requestAnimationFrame(
  animateFloatingPhotos
);


/* =========================================
   CLOSE VIEWER
   ========================================= */

function closeViewer() {

  viewer.classList.remove("show");

  setTimeout(() => {

    viewer.classList.add("hidden");

  }, 300);

}


closePhoto.addEventListener(
  "click",
  closeViewer
);


viewer.addEventListener(
  "click",
  event => {

    if (
      event.target === viewer
    ) {

      closeViewer();

    }

  }
);


document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape"
    ) {

      closeViewer();

    }

  }
);
const herPhotos = [
  "image2.png",
  "image3.png",
  "image4.png",
  "image5.png",
  "image6.png",
  "image7.png",
  "image8.png",
  "image9.png",
  "image10.png",
  "image11.png",
  "image12.png",
  "image13.png",
  "image14.png",
  "image15.png",
  "image16.png",
  "image17.png",
  "image18.png",
  "image19.png"
];

const herFloatingPhotos =
  document.getElementById("herFloatingPhotos");


herPhotos.forEach((filename, index) => {

  const card =
    document.createElement("div");

  card.className =
    "her-floating-photo";


  const img =
    document.createElement("img");

  img.src =
    `images/${filename}`;

  img.alt =
    `Her photo ${index + 2}`;


  card.appendChild(img);

  herFloatingPhotos.appendChild(card);

});

/* =========================================
   REPLAY
   ========================================= */

document
  .getElementById("replayBtn")
  .addEventListener(
    "click",
    () => {

      /* Letter */

      envelope.classList.remove(
        "open"
      );

      letterNext.classList.add(
        "hidden"
      );

      letterHint.textContent =
        "Klik amplopnya untuk membuka 💕";


      /* Cake */

      cakeSection.classList.remove(
        "wish-started",
        "wish-exploded"
      );


      wishInput.value = "";

      wishCounter.textContent =
        "0 / 200";


      wishArea.style.display =
        "";


      wishResult.classList.remove(
        "show"
      );


      wishTextResult.textContent =
        "";


      wishExplosion.innerHTML =
        "";


      confettiContainer.innerHTML =
        "";


      makeWishButton.disabled =
        false;


      makeWishButton.style.pointerEvents =
        "auto";


      makeWishButton.innerHTML =
        `
        <span>Make My Wish</span>
        <span>✨</span>
        `;


      /* Gift */

      giftBox.classList.remove(
        "opened",
        "hidden"
      );

      finalMessage.classList.add(
        "hidden"
      );


      /* Kembali awal */

      showScreen("opening");

    }
  );
