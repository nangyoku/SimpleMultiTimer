import { TimerItem } from './timers.js';
import { StopwatchItem } from './stopwatches.js';
import { Pomodoro } from './pomodoro.js';

function initTimers(){
  const addBtn = document.getElementById('addBtn');
  addBtn && addBtn.addEventListener('click', addTimer);
  ['seconds','minutes','label'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.addEventListener('keydown', e=>{ if(e.key==='Enter') addTimer() });
  });

  function addTimer(){
    const hrs = Math.max(0,parseInt(document.getElementById('hours').value)||0);
    const min = Math.max(0,parseInt(document.getElementById('minutes').value)||0);
    const sec = Math.max(0,parseInt(document.getElementById('seconds').value)||0);
    const label = document.getElementById('label').value.trim() || `Timer ${new Date().toLocaleTimeString()}`;
    const total = hrs*3600 + min*60 + sec;
    if(total<=0){ alert('Enter a time greater than 0'); return }
    const t = new TimerItem(total,label);
    t.start();
    document.getElementById('hours').value = 0; document.getElementById('minutes').value = 0; document.getElementById('seconds').value = 30; document.getElementById('label').value = '';
  }

  // sound settings controls
  const soundVolume = document.getElementById('soundVolume');
  const soundType = document.getElementById('soundType');
  const soundTest = document.getElementById('soundTest');
  import('./utils.js').then(({ setSoundOptions, getSoundOptions, beep })=>{
    const cfg = getSoundOptions();
    if(soundVolume) soundVolume.value = Math.round((cfg.volume||0.08)*100);
    if(soundType) soundType.value = cfg.type || 'sine';
    if(soundVolume) soundVolume.addEventListener('input', ()=>{
      const v = Math.max(0, Math.min(100, parseInt(soundVolume.value)||0))/100;
      setSoundOptions({ volume: v });
      localStorage.setItem('soundSettings', JSON.stringify(getSoundOptions()));
    });
    if(soundType) soundType.addEventListener('change', ()=>{
      setSoundOptions({ type: soundType.value });
      localStorage.setItem('soundSettings', JSON.stringify(getSoundOptions()));
    });
    if(soundTest) soundTest.addEventListener('click', ()=>beep());
    // load saved
    try{
      const saved = JSON.parse(localStorage.getItem('soundSettings')||'null');
      if(saved) setSoundOptions(saved);
    }catch(e){}
  });
}

function initStopwatches(){
  const addSwBtn = document.getElementById('addSwBtn');
  addSwBtn && addSwBtn.addEventListener('click', addStopwatch);
  const swLabel = document.getElementById('sw_label');
  swLabel && swLabel.addEventListener('keydown', e=>{ if(e.key==='Enter') addStopwatch() });

  function addStopwatch(){
    const label = document.getElementById('sw_label').value.trim() || `Stopwatch ${new Date().toLocaleTimeString()}`;
    const s = new StopwatchItem(label);
    s.start();
    document.getElementById('sw_label').value = '';
  }
}

function initPomodoro(){
  const pom = new Pomodoro();
  pom.bindUI({
    mode: 'pom_mode',
    time: 'pom_time',
    cycles: 'pomCycles',
    start: 'pomStart',
    pause: 'pomPause',
    reset: 'pomReset',
    short: 'pomShort',
    long: 'pomLong',
    work: 'pom_work',
    short: 'pom_short',
    long: 'pom_long',
    apply: 'pomApply'
  });
  // keep instance available for debugging
  window.pom = pom;
}

document.addEventListener('DOMContentLoaded', ()=>{
  initTimers();
  initStopwatches();
  initPomodoro();
});
