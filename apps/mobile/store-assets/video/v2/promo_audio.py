import numpy as np, wave
SR=44100; DUR=25.0; N=int(SR*DUR)
out=np.zeros((N,2))
BPM=112; beat=60/BPM
def note(f): return 440*2**((f-69)/12)
def add(sig,t,pan=0.5,g=1.0):
    i=int(t*SR); j=min(N,i+len(sig))
    if i>=N: return
    out[i:j,0]+=sig[:j-i]*g*(1-pan)*2*0.5; out[i:j,1]+=sig[:j-i]*g*pan*2*0.5
def pluck(f,d=0.5,bright=1.0):
    t=np.arange(int(SR*d))/SR
    env=np.exp(-t*7)*(1-np.exp(-t*400))
    s=np.sin(2*np.pi*f*t)+0.35*bright*np.sin(2*np.pi*2*f*t)*np.exp(-t*10)+0.12*np.sin(2*np.pi*3*f*t)*np.exp(-t*14)
    return s*env
def kick():
    t=np.arange(int(SR*0.25))/SR
    f=50+90*np.exp(-t*30); ph=2*np.pi*np.cumsum(f)/SR
    return np.sin(ph)*np.exp(-t*14)
def hat():
    t=np.arange(int(SR*0.05))/SR
    n=np.random.randn(len(t)); n=np.diff(n,prepend=0)
    return n*np.exp(-t*90)*0.25
def pop(f=880):
    t=np.arange(int(SR*0.18))/SR
    fr=f*(1+0.6*np.exp(-t*40)); ph=2*np.pi*np.cumsum(fr)/SR
    return np.sin(ph)*np.exp(-t*22)
def tick():
    t=np.arange(int(SR*0.03))/SR
    return np.random.randn(len(t))*np.exp(-t*250)*0.5
def whoosh(d=0.35):
    t=np.arange(int(SR*d))/SR
    n=np.random.randn(len(t)); k=np.ones(40)/40; n=np.convolve(n,k,'same')*6
    env=np.sin(np.pi*t/d)**2
    return n*env*0.35
np.random.seed(3)
# progression C - G - Am - F (2 beats each? 4 beats each)
chords=[[60,64,67],[55,59,62,67],[57,60,64],[53,57,60,65]]
bass=[36,43,45,41]
arp_pattern=[0,1,2,1,2,1,0,2]
t=0.0; bar=0
while t<DUR-1.2:
    ch=chords[bar%4]
    for k in range(8):
        tt=t+k*beat/2
        n=ch[arp_pattern[k]%len(ch)]+12
        add(pluck(note(n),0.45),tt,0.35+0.3*(k%2),0.16)
    add(pluck(note(bass[bar%4]),1.6,0.3),t,0.5,0.32)
    add(pluck(note(bass[bar%4]),0.8,0.3),t+2*beat,0.5,0.22)
    for b in range(4):
        if t>2.9: add(kick(),t+b*beat,0.5,0.5)
        if t>2.9: add(hat(),t+b*beat+beat/2,0.6,0.6)
    t+=4*beat; bar+=1
# sfx
for x in [0.15,0.45,0.75]: add(pop(660+220*[0.15,0.45,0.75].index(x)),x,0.5,0.35)
for x in [3.0,7.6,11.8,16.4,19.6,21.8]: add(whoosh(),x-0.2,0.5,0.6)
for k in range(5): add(tick(),3.0+0.8+k*0.15,0.5,0.5)
for x in [5.2,9.2,14.3,17.4]: add(pop(990),x,0.5,0.4)
for x in [5.9,9.9]: add(pop(1320),x,0.5,0.25)
for k in range(10): add(tick(),19.7+k*0.09,0.5,0.35)
add(pop(1180),21.9,0.5,0.4)
# fade out
fo=int(SR*1.6); out[N-fo:]*=np.linspace(1,0,fo)[:,None]
fi=int(SR*0.05); out[:fi]*=np.linspace(0,1,fi)[:,None]
out/=np.abs(out).max()/0.85
with wave.open('music.wav','wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((out*32767).astype(np.int16).tobytes())
