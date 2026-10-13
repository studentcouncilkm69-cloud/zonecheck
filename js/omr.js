const omrBuildDarkness = (data, W, H) => {
    const D = new Float32Array(W * H);
    for (let i = 0, p = 0; i < D.length; i++, p += 4) {
        const r = data[p], g = data[p + 1], b = data[p + 2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        const spread = Math.max(r, g, b) - Math.min(r, g, b);
        D[i] = Math.min(255, (255 - lum) + spread * 0.65);
    }
    return D;
};

const omrPaperLevel = (D, W, H) => {
    const s = [];
    for (let y = 0; y < H; y += 6) for (let x = 0; x < W; x += 6) s.push(D[y * W + x]);
    s.sort((a, b) => a - b);
    return s[Math.floor(s.length * 0.5)] || 0;
};

const omrFindCorner = (D, W, H, paperD, x0, x1, y0, y1, dx, dy) => {
    x0 = Math.max(0, x0); y0 = Math.max(0, y0); x1 = Math.min(W - 1, x1); y1 = Math.min(H - 1, y1);
    const thr = Math.min(185, paperD + 0.55 * (255 - paperD));
    const w = x1 - x0 + 1, h = y1 - y0 + 1;
    const seen = new Uint8Array(w * h);
    let best = null, bestDist = Infinity;
    for (let sy = 0; sy < h; sy++) {
        for (let sx = 0; sx < w; sx++) {
            const si = sy * w + sx;
            if (seen[si] || D[(y0 + sy) * W + x0 + sx] < thr) continue;
            const stack = [si];
            seen[si] = 1;
            let minX = sx, maxX = sx, minY = sy, maxY = sy, cnt = 0;
            while (stack.length) {
                const c = stack.pop();
                const cx = c % w, cy = (c / w) | 0;
                cnt++;
                if (cx < minX) minX = cx; if (cx > maxX) maxX = cx;
                if (cy < minY) minY = cy; if (cy > maxY) maxY = cy;
                const nb = [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]];
                for (let k = 0; k < 4; k++) {
                    const nx = nb[k][0], ny = nb[k][1];
                    if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
                    const ni = ny * w + nx;
                    if (seen[ni] || D[(y0 + ny) * W + x0 + nx] < thr) continue;
                    seen[ni] = 1;
                    stack.push(ni);
                }
            }
            const bw = maxX - minX + 1, bh = maxY - minY + 1;
            if (bw < 8 || bw > 26 || bh < 8 || bh > 26) continue;
            const ar = bw / bh;
            if (ar < 0.65 || ar > 1.55) continue;
            if (cnt / (bw * bh) < 0.6) continue;
            const mx = x0 + (minX + maxX) / 2, my = y0 + (minY + maxY) / 2;
            const dist = Math.hypot(mx - dx, my - dy);
            if (dist < bestDist) { bestDist = dist; best = { x: mx, y: my, found: true }; }
        }
    }
    return best || { x: dx, y: dy, found: false };
};

const omrMakeMapper = (tl, tr, bl, br) => {
    const x0 = tl.x, y0 = tl.y, x1 = tr.x, y1 = tr.y, x2 = br.x, y2 = br.y, x3 = bl.x, y3 = bl.y;
    const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3;
    const dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
    const den = dx1 * dy2 - dx2 * dy1;
    let a, b, d, e, g = 0, h = 0;
    if ((Math.abs(dx3) < 1e-9 && Math.abs(dy3) < 1e-9) || Math.abs(den) < 1e-9) {
        a = x1 - x0; b = x3 - x0; d = y1 - y0; e = y3 - y0;
    } else {
        g = (dx3 * dy2 - dx2 * dy3) / den;
        h = (dx1 * dy3 - dx3 * dy1) / den;
        a = x1 - x0 + g * x1; b = x3 - x0 + h * x3;
        d = y1 - y0 + g * y1; e = y3 - y0 + h * y3;
    }
    return (u, v) => {
        const k = g * u + h * v + 1;
        return { x: (a * u + b * v + x0) / k, y: (d * u + e * v + y0) / k };
    };
};

const omrBubbleInk = (D, W, H, cx, cy) => {
    const at = (x, y) => D[Math.max(0, Math.min(H - 1, Math.round(y))) * W + Math.max(0, Math.min(W - 1, Math.round(x)))];
    let best = { score: 0, x: cx, y: cy };
    for (let oy = -3; oy <= 3; oy += 1.5) {
        for (let ox = -3; ox <= 3; ox += 1.5) {
            const px = cx + ox, py = cy + oy;
            const ring = [];
            for (let t = 0; t < 8; t++) ring.push(at(px + Math.cos(t * Math.PI / 4) * 10.5, py + Math.sin(t * Math.PI / 4) * 10.5));
            ring.sort((p, q) => p - q);
            const bg = ring[3];
            const cut = Math.max(55, 0.4 * (255 - bg));
            let n = 0;
            for (let dy = -6; dy <= 6; dy++) {
                for (let dx = -6; dx <= 6; dx++) {
                    if (dx * dx + dy * dy <= 36) {
                        const x = px + dx, y = py + dy;
                        if (at(x, y) - bg > cut && !(at(x - 10, y) - bg > cut && at(x + 10, y) - bg > cut)) n++;
                    }
                }
            }
            const sc = n - (Math.abs(ox) + Math.abs(oy)) * 0.15;
            if (sc > best.score) best = { score: sc, x: px, y: py };
        }
    }
    return best;
};
