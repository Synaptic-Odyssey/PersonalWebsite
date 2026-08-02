const track = document.querySelector(".webring-track");
const windowEl = document.querySelector(".webring-window");

if (track && windowEl) {
    const SPEED = 0.5;
    const GAP = 10; // matches CSS gap

    track.style.position = "relative";
    track.style.display = "block"; // no longer flex, items are absolutely positioned

    const links = Array.from(track.children);

    // give each link a fixed position we can animate independently
    links.forEach(el => {
        el.style.position = "absolute";
        el.style.top = "0";
        el.style.left = "0";
    });

    let items = [];
    let paused = false;

    function layout() {
        // measure natural widths first (temporarily reset transform)
        items = links.map(el => {
            el.style.transform = "translateX(0px)";
            return { el, width: el.offsetWidth };
        });

        // place them left to right, back to back
        let cursor = 0;
        items.forEach(item => {
            item.x = cursor;
            cursor += item.width + GAP;
        });

        track.style.height = items[0].el.offsetHeight + "px";
    }

    layout();

    windowEl.addEventListener("mouseenter", () => paused = true);
    windowEl.addEventListener("mouseleave", () => paused = false);

    function animate() {
        if (!paused) {
            const winWidth = windowEl.clientWidth;

            items.forEach(item => {
                item.x += SPEED;
                item.el.style.transform = `translateX(${item.x}px)`;
            });

            // recycle: if an item has fully passed the right edge,
            // move it to just before the current leftmost item
            items.forEach(item => {
                if (item.x > winWidth) {
                    const leftmost = items.reduce((a, b) => (a.x < b.x ? a : b));
                    const offscreenLeft = -item.width - GAP;

                    // whichever is further left: right behind the current leftmost item,
                    // or just off the visible window — guarantees it starts hidden
                    item.x = Math.min(leftmost.x - item.width - GAP, offscreenLeft);
                }
            });

        }

        requestAnimationFrame(animate);
    }

    animate();

    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(layout, 150);
    });
}