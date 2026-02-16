export function formatTime(secs){
  const m = Math.floor(secs/60).toString().padStart(2,'0');
  const s = Math.floor(secs%60).toString().padStart(2,'0');
  return `${m}:${s}`;
}

export function formatTimeMs(seconds){
  const hrs = Math.floor(seconds/3600);
  const mins = Math.floor((seconds % 3600)/60).toString().padStart(2,'0');
  const secs = Math.floor(seconds % 60).toString().padStart(2,'0');
  const ms = Math.floor((seconds - Math.floor(seconds)) * 1000).toString().padStart(3,'0');
  if(hrs>0){
    return `${hrs}:${mins}:${secs}.${ms}`;
  }
  return `${mins}:${secs}.${ms}`;
}

export function beep(){
  try{
    const ctx = new (window.AudioContext||window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    // read settings if set
    const cfg = (window.__SOUND_SETTINGS__ || { type: 'sine', volume: 0.08 });
    o.type = cfg.type || 'sine';
    o.frequency.value = cfg.freq || 880;
    g.gain.value = Math.max(0, Math.min(1, cfg.volume || 0.08));
    o.start();
    setTimeout(()=>{try{o.stop();}catch(e){};try{ctx.close()}catch(e){}},320);
  }catch(e){
    try{alert('Timer finished!')}catch(e){}
  }
}

export function setSoundOptions(opts={}){
  window.__SOUND_SETTINGS__ = Object.assign({}, window.__SOUND_SETTINGS__ || { type:'sine', volume:0.08, freq:880 }, opts);
}

export function getSoundOptions(){
  return window.__SOUND_SETTINGS__ || { type:'sine', volume:0.08, freq:880 };
}

export function notify(title, body){
  try{
    if(!('Notification' in window)) return;
    if(Notification.permission === 'granted'){
      new Notification(title, { body });
    }else if(Notification.permission !== 'denied'){
      Notification.requestPermission().then(p=>{ if(p === 'granted') new Notification(title, { body }); });
    }
  }catch(e){ /* ignore */ }
}
