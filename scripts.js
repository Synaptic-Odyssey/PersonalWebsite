const track = document.querySelector(".webring-track");

if (track) {
    const SPEED = 0.5; // pixels per frame

    // Clone the original links once
    track.innerHTML += track.innerHTML;

    const originalWidth = track.scrollWidth / 2;

    let x = 0;
    let paused = false;

    const windowEl = document.querySelector(".webring-window");

    windowEl.addEventListener("mouseenter", () => paused = true);
    windowEl.addEventListener("mouseleave", () => paused = false);

    function animate() {
        if (!paused) {
            x += SPEED; // move left -> right

            if (x >= originalWidth) {
                x = 0;
            }

            track.style.transform = `translateX(${x - originalWidth}px)`;
        }

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener("resize", () => {
        location.reload();
    });
}