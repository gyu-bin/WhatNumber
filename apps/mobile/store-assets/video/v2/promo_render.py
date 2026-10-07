import math, sys, subprocess
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

R = '/mnt/user-data/uploads/WhatNumber/apps/mobile/'
S = R + 'store-assets/video/source/assets/'
W, H, FPS = 1080, 1920, 30
DUR = 25.0

KR = {w: ('/usr/share/fonts/opentype/noto/NotoSansCJK-%s.ttc' % w, 1) for w in ('Black', 'Bold', 'Medium', 'Regular')}
_fc = {}
def font(w, size):
    k = (w, size)
    if k not in _fc: _fc[k] = ImageFont.truetype(KR[w][0], size, index=KR[w][1])
    return _fc[k]

CORAL = (255, 90, 85)
CORAL_D = (232, 64, 60)
CREAM = (255, 247, 246)
INK = (25, 25, 25)
GREY = (116, 116, 116)
WHITE = (255, 255, 255)

def clamp(x, a=0.0, b=1.0): return max(a, min(b, x))
def prog(t, a, b): return clamp((t - a) / (b - a))
def eo(x): return 1 - (1 - x) ** 3
def eio(x): return 3 * x * x - 2 * x * x * x
def eback(x, s=1.7):
    x = clamp(x) - 1
    return x * x * ((s + 1) * x + s) + 1

def L(p): return Image.open(p).convert('RGBA')
shots = {k: L(S + k + '.png') for k in ('home', 'search', 'er', 'er_beds', 'widget')}
logo_img = L(S + 'logo.png')
icon = L(R + 'assets/icon.png')

def rounded_mask(w, h, r):
    m = Image.new('L', (w * 2, h * 2), 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, w * 2 - 1, h * 2 - 1), radius=r * 2, fill=255)
    return m.resize((w, h), Image.LANCZOS)

def shadow_of(layer, radius=30, alpha=0.28, offset=(0, 18), color=(80, 20, 20)):
    pad = radius * 2
    out = Image.new('RGBA', (layer.width + pad * 2, layer.height + pad * 2), (0, 0, 0, 0))
    a = Image.new('L', out.size, 0)
    a.paste(layer.getchannel('A'), (pad + offset[0], pad + offset[1]))
    a = a.filter(ImageFilter.GaussianBlur(radius)).point(lambda v: int(v * alpha))
    sh = Image.new('RGBA', out.size, color + (0,)); sh.putalpha(a)
    out.alpha_composite(sh); out.alpha_composite(layer, (pad, pad))
    return out

def paste(base, img, x, y, alpha=1.0):
    if alpha <= 0.003: return
    if alpha < 1:
        img = img.copy(); img.putalpha(img.getchannel('A').point(lambda v: int(v * alpha)))
    base.alpha_composite(img, (int(round(x)), int(round(y))))

def put_center(base, layer, cx, cy, alpha=1.0, scale=1.0):
    if alpha <= 0.003: return
    if abs(scale - 1) > 1e-3:
        layer = layer.resize((max(1, int(layer.width * scale)), max(1, int(layer.height * scale))), Image.BICUBIC)
    paste(base, layer, cx - layer.width / 2, cy - layer.height / 2, alpha)

def text(txt, w, size, fill, spacing=0, align='center'):
    d0 = ImageDraw.Draw(Image.new('RGBA', (1, 1)))
    f = font(w, size)
    bb = d0.multiline_textbbox((0, 0), txt, font=f, spacing=spacing, align=align)
    im = Image.new('RGBA', (int(bb[2] - bb[0]) + 8, int(bb[3] - bb[1]) + 8), (0, 0, 0, 0))
    ImageDraw.Draw(im).multiline_text((4 - bb[0], 4 - bb[1]), txt, font=f, fill=fill, spacing=spacing, align=align)
    return im

_tc = {}
def T(*a, **k):
    key = (a, tuple(sorted(k.items())))
    if key not in _tc: _tc[key] = text(*a, **k)
    return _tc[key]

def pill(txt, size, fg, bg, padx=34, pady=18, outline=None, weight='Bold'):
    key = ('pill', txt, size, fg, bg, outline, weight)
    if key in _tc: return _tc[key]
    t = text(txt, weight, size, fg + (255,))
    w, h = t.width + padx * 2, t.height + pady * 2
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    ImageDraw.Draw(im).rounded_rectangle((0, 0, w - 1, h - 1), radius=h // 2, fill=bg, outline=outline, width=3 if outline else 0)
    im.alpha_composite(t, (padx, pady - 2))
    _tc[key] = im
    return im

# ---------- phone ----------
PH_W = 820
SCR_W = PH_W - 32
SC = SCR_W / 1206
SCR_H = int(2240 * SC)                 # crop above the test-ad banner (never on screen anyway)
PH_H = SCR_H + 16 + 60
SCR_MASK = rounded_mask(SCR_W, SCR_H + 80, 70).crop((0, 0, SCR_W, SCR_H))
_frame = None
def phone_frame():
    global _frame
    if _frame is None:
        f = Image.new('RGBA', (PH_W, PH_H), (0, 0, 0, 0))
        ImageDraw.Draw(f).rounded_rectangle((0, 0, PH_W - 1, PH_H + 200), radius=86, fill=(24, 24, 26, 255))
        _frame = f
    return _frame
_scr = {}
def screen(key):
    if key not in _scr:
        im = shots[key].crop((0, 0, 1206, 2240)).resize((SCR_W, SCR_H), Image.LANCZOS)
        im.putalpha(SCR_MASK)
        _scr[key] = im
    return _scr[key]

def phone(content):
    ph = phone_frame().copy()
    ph.alpha_composite(content, (16, 16))
    d = ImageDraw.Draw(ph)
    d.rounded_rectangle((PH_W // 2 - 95, 34, PH_W // 2 + 95, 84), radius=25, fill=(8, 8, 8, 255))
    return ph

PH_X = (W - PH_W) // 2
PH_Y = 760
def sx(x): return PH_X + 16 + x * SC          # screenshot px -> frame px
def sy(y, py=PH_Y): return py + 16 + y * SC

def callout(key, box, width=960, radius=34):
    k = ('co', key, box, width)
    if k in _tc: return _tc[k]
    c = shots[key].crop(box)
    s = width / c.width
    c = c.resize((width, int(c.height * s)), Image.LANCZOS)
    c.putalpha(rounded_mask(c.width, c.height, radius))
    ring = Image.new('RGBA', (c.width + 12, c.height + 12), (0, 0, 0, 0))
    ImageDraw.Draw(ring).rounded_rectangle((0, 0, ring.width - 1, ring.height - 1), radius=radius + 6, fill=CORAL + (255,))
    ring.alpha_composite(c, (6, 6))
    _tc[k] = shadow_of(ring, 36, 0.35)
    return _tc[k]

def ripple(base, x, y, lt, period=0.9, maxr=90, color=CORAL):
    if lt < 0: return
    lay = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    for j in range(2):
        p = ((lt / period) + j * 0.5) % 1.0
        r = 20 + p * maxr
        d.ellipse((x - r, y - r, x + r, y + r), outline=color + (int(255 * (1 - p)),), width=7)
    d.ellipse((x - 22, y - 22, x + 22, y + 22), fill=color + (45,))
    base.alpha_composite(lay)

def headline(base, lt, a, b, eyebrow, head, sub=None, y=330, dark=False):
    """staggered text block at the top"""
    al = min(eo(prog(lt, a, a + 0.35)), 1 - prog(lt, b - 0.25, b))
    if al <= 0: return
    fg = WHITE if dark else INK
    yy = y
    if eyebrow:
        e = pill(eyebrow, 34, CORAL if not dark else WHITE, (255, 230, 228, 255) if not dark else (255, 255, 255, 60))
        k = eo(prog(lt, a, a + 0.4))
        put_center(base, e, W / 2, yy - 150 + (1 - k) * 30, al)
    h = T(head, 'Black', 92, fg + (255,), spacing=14)
    k = eo(prog(lt, a + 0.08, a + 0.5))
    put_center(base, h, W / 2, yy + (1 - k) * 40, al * k)
    if sub:
        s = T(sub, 'Medium', 40, (GREY if not dark else (255, 225, 223)) + (255,))
        k = eo(prog(lt, a + 0.2, a + 0.65))
        put_center(base, s, W / 2, yy + h.height / 2 + 50 + (1 - k) * 30, al * k)

def bg(color):
    return Image.new('RGBA', (W, H), color + (255,))

_cream = None
def cream_bg():
    global _cream
    if _cream is None:
        g = Image.new('RGBA', (1, 256))
        top, bot = (255, 226, 222), CREAM
        for i in range(256):
            f = eio(min(1, i / 150))
            g.putpixel((0, i), tuple(int(top[k] + (bot[k] - top[k]) * f) for k in range(3)) + (255,))
        _cream = g.resize((W, H), Image.BICUBIC)
    return _cream.copy()

def phone_rise(lt, a=0.0):
    k = eo(prog(lt, a, a + 0.55))
    return PH_Y + (1 - k) * 900

# ---------- S0: hook 0-3.0 ----------
CHIPS = ['카드 분실 몇번?', '견인차 몇번?', '응급실 어디?', '보이스피싱 신고?', '전세 상담 몇번?', '층간소음 상담?', '유실물 문의?', '해외에서 사고?']
def s0(t):
    fr = bg(CORAL)
    # floating question chips
    for i, c in enumerate(CHIPS):
        p = pill(c, 38, WHITE, (255, 255, 255, 46), weight='Bold')
        col = i % 2
        x = 260 + col * 560 + math.sin(i * 1.7) * 90
        y0 = 2050 + i * 150
        y = y0 - t * 520 - 120 * i * 0.4
        y = ((y + 400) % 2400) - 400
        put_center(fr, p, x, y, 0.9 * eo(prog(t, 0.05 * i, 0.4 + 0.05 * i)))
    veil = Image.new('RGBA', (W, H), CORAL + (0,))
    g = Image.new('L', (W, H), 0); ImageDraw.Draw(g).rounded_rectangle((20, 600, W - 20, 1300), radius=80, fill=255)
    veil.putalpha(g.filter(ImageFilter.GaussianBlur(70)))
    fr.alpha_composite(veil)
    lines = [('급할 때,', 'Bold', 70, 0.15), ('그 번호', 'Black', 150, 0.45), ('몇번이었지?', 'Black', 150, 0.75)]
    ys = [760, 930, 1110]
    for (s, w, sz, a), y in zip(lines, ys):
        k = eback(prog(t, a, a + 0.4), 1.4)
        put_center(fr, T(s, w, sz, WHITE + (255,)), W / 2, y + (1 - clamp(k)) * 60, clamp(k * 1.5))
    if t > 2.75:
        fr.alpha_composite(Image.new('RGBA', (W, H), CREAM + (int(255 * prog(t, 2.75, 3.0)),)))
    return fr

# ---------- S1: card lost (search) 3.0-7.6 ----------
QUERY = '카드 분실'
SEARCH_TXT_BOX = (175, 575, 1100, 690)       # area holding typed text inside the search bar
RESULT_BOX = (0, 760, 1206, 2240)
def s1(t):
    lt = t - 3.0
    fr = cream_bg()
    headline(fr, lt, 0.0, 4.6, '상황 01', '카드를 잃어버렸다', '상황만 검색하면 바로 나와요')
    py = phone_rise(lt, 0.15)
    scr = screen('search').copy()
    d = ImageDraw.Draw(scr)
    # typing: hide typed text, then type char by char
    n = int(clamp((lt - 0.8) / 0.75) * len(QUERY) + 0.0001)
    bx0, by0, bx1, by1 = [v * SC for v in SEARCH_TXT_BOX]
    d.rectangle((bx0, by0, bx1, by1), fill=(255, 255, 255, 255))
    if n > 0:
        d.text((bx0 + 2, (by0 + by1) / 2), QUERY[:n], font=font('Medium', int(44 * SC * 1.02)), fill=(25, 25, 25, 255), anchor='lm')
    if (lt * 2) % 1 < 0.55 and lt < 1.8:
        tw = d.textlength(QUERY[:n], font=font('Medium', int(44 * SC * 1.02))) if n else 0
        d.rectangle((bx0 + 6 + tw, by0 + 14, bx0 + 9 + tw, by1 - 14), fill=CORAL + (255,))
    # results appear after typing
    ra = eo(prog(lt, 1.65, 2.0))
    if ra < 1:
        cover = Image.new('RGBA', (SCR_W, int((RESULT_BOX[3] - RESULT_BOX[1]) * SC)), (252, 251, 250, int(255 * (1 - ra))))
        scr.alpha_composite(cover, (0, int(RESULT_BOX[1] * SC)))
    scr.putalpha(ImageChops.multiply(scr.getchannel('A'), SCR_MASK))
    paste(fr, phone(scr), PH_X, py)
    # callout of first result
    k = eback(prog(lt, 2.2, 2.6), 1.5)
    if lt > 2.2:
        co = callout('search', (40, 785, 1166, 1040))
        cy = sy(912, py) + 30
        put_center(fr, co, W / 2, cy - (1 - clamp(k)) * 0 , clamp(k * 2), 0.85 + 0.15 * k)
        # tap on number pill
        if lt > 2.9:
            ripple(fr, W / 2 + 165, cy + 48, lt - 2.9, 0.9, 60)
            lab = pill('탭 한 번에 바로 전화', 40, WHITE, CORAL + (255,))
            put_center(fr, shadow_of(lab, 20, 0.3), W / 2, cy + 230, eo(prog(lt, 3.0, 3.3)))
    if lt > 4.35:
        fr.alpha_composite(Image.new('RGBA', (W, H), CREAM + (int(255 * prog(lt, 4.35, 4.6)),)))
    return fr

# ---------- S2: highway (home + chip + card) 7.6-11.8 ----------
def app_card(icon_label, title, desc, num, icon_color=(229, 72, 66)):
    k = ('card', title)
    if k in _tc: return _tc[k]
    w, h = 960, 300
    c = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(c)
    d.rounded_rectangle((0, 0, w - 1, h - 1), radius=40, fill=WHITE + (255,), outline=CORAL + (255,), width=6)
    d.rounded_rectangle((44, 48, 154, 158), radius=28, fill=icon_color + (255,))
    t = text(icon_label, 'Bold', 36, WHITE + (255,)); c.alpha_composite(t, (99 - t.width // 2, 103 - t.height // 2))
    c.alpha_composite(text(title, 'Black', 48, INK + (255,)), (190, 44))
    c.alpha_composite(text(desc, 'Regular', 34, GREY + (255,)), (190, 116))
    p = pill(num, 46, CORAL, (255, 238, 236, 255), padx=34, pady=16, weight='Black')
    c.alpha_composite(p, (190, 184))
    _tc[k] = shadow_of(c, 36, 0.32)
    return _tc[k]

def s2(t):
    lt = t - 7.6
    fr = cream_bg()
    headline(fr, lt, 0.0, 4.2, '상황 02', '고속도로에서\n차가 멈췄다', None, y=360)
    py = phone_rise(lt, 0.15) + 60
    scr = screen('home')
    paste(fr, phone(scr), PH_X, py)
    # chip "차가 고장났어요" in screenshot ~ x 985, y 800
    if 0.9 < lt < 2.0:
        ripple(fr, sx(985), sy(802, py), lt - 0.9, 0.8, 70)
    k = eback(prog(lt, 1.6, 2.0), 1.5)
    if lt > 1.6:
        cd = app_card('도로', '고속도로 긴급견인 안내', '고장·사고 차량 안전지대 이동 안내', '1588-2504')
        put_center(fr, cd, W / 2, 1300, clamp(k * 2), 0.85 + 0.15 * k)
        if lt > 2.3:
            ripple(fr, W / 2 - 160, 1300 + 90, lt - 2.3, 0.9, 60)
        lab = pill('상황별 칩으로 한 번에', 40, WHITE, CORAL + (255,))
        put_center(fr, shadow_of(lab, 20, 0.3), W / 2, 1590, eo(prog(lt, 2.4, 2.7)))
    if lt > 3.95:
        fr.alpha_composite(Image.new('RGBA', (W, H), CREAM + (int(255 * prog(lt, 3.95, 4.2)),)))
    return fr

# ---------- S3: ER 11.8-16.4 ----------
def s3(t):
    lt = t - 11.8
    fr = cream_bg()
    headline(fr, lt, 0.0, 4.6, '상황 03', '한밤중,\n응급실 어디지?', '내 주변 응급실과 실시간 병상까지', y=360)
    py = phone_rise(lt, 0.15) + 80
    swap = eio(prog(lt, 2.0, 2.4))
    a = screen('er'); b = screen('er_beds')
    scr = a if swap <= 0 else (b if swap >= 1 else Image.blend(a, b, swap))
    # gentle scroll: show map then lower list
    paste(fr, phone(scr), PH_X, py)
    k = eback(prog(lt, 2.5, 2.9), 1.5)
    if lt > 2.5:
        co = callout('er_beds', (40, 1690, 1166, 2080))
        put_center(fr, co, W / 2, 1480, clamp(k * 2), 0.85 + 0.15 * k)
    foot = T('응급실 정보: 국립중앙의료원 제공 · 위급하면 먼저 119', 'Medium', 30, (255, 255, 255, 255))
    fb = Image.new('RGBA', (foot.width + 50, foot.height + 26), (0, 0, 0, 0))
    ImageDraw.Draw(fb).rounded_rectangle((0, 0, fb.width - 1, fb.height - 1), radius=fb.height // 2, fill=(25, 25, 25, 215))
    fb.alpha_composite(foot, (25, 13))
    put_center(fr, fb, W / 2, 1830, eo(prog(lt, 1.0, 1.4)) * (1 - prog(lt, 4.35, 4.6)))
    if lt > 4.35:
        fr.alpha_composite(Image.new('RGBA', (W, H), CREAM + (int(255 * prog(lt, 4.35, 4.6)),)))
    return fr

# ---------- S4: widget 16.4-19.6 ----------
def s4(t):
    lt = t - 16.4
    fr = cream_bg()
    headline(fr, lt, 0.0, 3.2, '즐겨찾기 + 위젯', '자주 쓰는 번호는\n홈 화면에', None, y=360)
    py = phone_rise(lt, 0.1) + 60
    paste(fr, phone(screen('widget')), PH_X, py)
    k = eback(prog(lt, 1.0, 1.4), 1.5)
    if lt > 1.0:
        co = callout('widget', (60, 250, 1146, 790), 940, 60)
        put_center(fr, co, W / 2, 1180, clamp(k * 2), 0.85 + 0.15 * k)
    if lt > 2.95:
        fr.alpha_composite(Image.new('RGBA', (W, H), CORAL + (int(255 * prog(lt, 2.95, 3.2)),)))
    return fr

# ---------- S5: 95 numbers 19.6-21.8 ----------
LANGS = ['한국어', 'English', '日本語', '中文']
def s5(t):
    lt = t - 19.6
    fr = bg(CORAL)
    n = int(round(95 * eo(prog(lt, 0.1, 1.0))))
    k = eback(prog(lt, 0.0, 0.4), 1.4)
    put_center(fr, T(str(n), 'Black', 330, WHITE + (255,)), W / 2, 760, clamp(k * 2), 0.8 + 0.2 * clamp(k))
    put_center(fr, T('개의 공공·생활 번호', 'Black', 80, WHITE + (255,)), W / 2, 1000, eo(prog(lt, 0.25, 0.6)))
    put_center(fr, T('공식 출처와 직접 대조한 번호만 담았어요', 'Medium', 40, (255, 228, 226, 255)), W / 2, 1100, eo(prog(lt, 0.45, 0.8)))
    ps = [pill(l, 40, WHITE, (255, 255, 255, 50)) for l in LANGS]
    tot = sum(p.width for p in ps) + 24 * 3
    x = (W - tot) / 2
    for i, p in enumerate(ps):
        kk = eback(prog(lt, 0.7 + i * 0.1, 1.05 + i * 0.1), 1.6)
        paste(fr, p, x, 1260 + (1 - clamp(kk)) * 40, clamp(kk * 2)); x += p.width + 24
    put_center(fr, T('4개 언어 지원', 'Bold', 34, (255, 228, 226, 255)), W / 2, 1400, eo(prog(lt, 1.1, 1.4)))
    if lt > 1.95:
        fr.alpha_composite(Image.new('RGBA', (W, H), CREAM + (int(255 * prog(lt, 1.95, 2.2)),)))
    return fr

# ---------- S6: end card 21.8-25 ----------
def s6(t):
    lt = t - 21.8
    fr = cream_bg()
    k = eback(prog(lt, 0.05, 0.6), 1.8)
    lg = logo_img.resize((860, int(860 * logo_img.height / logo_img.width)), Image.LANCZOS)
    put_center(fr, lg, W / 2, 760, clamp(k * 2), 0.7 + 0.3 * clamp(k))
    put_center(fr, T('필요한 번호, 바로 찾아드릴게요.', 'Bold', 52, INK + (255,)), W / 2, 1070, eo(prog(lt, 0.5, 0.9)))
    put_center(fr, T('검색 · 상황별 칩 · 내 주변 응급실 · 위젯', 'Medium', 36, GREY + (255,)), W / 2, 1150, eo(prog(lt, 0.7, 1.1)))
    ic = icon.resize((230, 230), Image.LANCZOS); ic.putalpha(rounded_mask(230, 230, 52))
    kk = eo(prog(lt, 0.9, 1.4))
    put_center(fr, shadow_of(ic, 26, 0.3), W / 2, 1400 + (1 - kk) * 40, kk)
    cta = pill("앱에서 '몇번이야' 만나보세요", 46, WHITE, CORAL + (255,), padx=56, pady=28, weight='Black')
    pulse = 1 + 0.02 * math.sin(lt * 6) * (lt > 1.6)
    put_center(fr, shadow_of(cta, 26, 0.35), W / 2, 1640, eo(prog(lt, 1.2, 1.6)), pulse)
    if lt > 2.9:
        fr.alpha_composite(Image.new('RGBA', (W, H), CREAM + (int(255 * prog(lt, 2.9, 3.2)),)))
    return fr

def frame_at(t):
    if t < 3.0: f = s0(t)
    elif t < 7.6: f = s1(t)
    elif t < 11.8: f = s2(t)
    elif t < 16.4: f = s3(t)
    elif t < 19.6: f = s4(t)
    elif t < 21.8: f = s5(t)
    else: f = s6(t)
    return f.convert('RGB')

def render_idx(i): return frame_at(i / FPS).tobytes()

if __name__ == '__main__':
    if sys.argv[1] == 'still':
        for ts in sys.argv[2:]:
            frame_at(float(ts)).save(f'/home/claude/wn/still_{ts}.jpg', quality=88)
    else:
        from multiprocessing import Pool
        out = sys.argv[2]; n = int(DUR * FPS)
        p = subprocess.Popen(['ffmpeg', '-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS),
                              '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', out], stdin=subprocess.PIPE)
        with Pool(2) as pool:
            for k, b in enumerate(pool.imap(render_idx, range(n), chunksize=4)):
                p.stdin.write(b)
        p.stdin.close(); p.wait()
