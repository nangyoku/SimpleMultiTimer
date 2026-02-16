import { formatTime, beep, notify } from './utils.js';

export class Pomodoro {
  constructor(){
    this.work = 25*60;
    this.short = 5*60;
    this.long = 15*60;
    this.cyclesBeforeLong = 4;
    this.mode = 'work';
    this.remaining = this.work;
    this.running = false;
    this.interval = null;
    this.cycles = 0;
  }

  bindUI(ids){
    this.modeEl = document.getElementById(ids.mode);
    this.timeEl = document.getElementById(ids.time);
    this.cyclesEl = document.getElementById(ids.cycles);
    this.startBtn = document.getElementById(ids.start);
    this.pauseBtn = document.getElementById(ids.pause);
    this.resetBtn = document.getElementById(ids.reset);
    this.shortBtn = document.getElementById(ids.short);
    this.longBtn = document.getElementById(ids.long);
    // optional settings elements
    this.workInput = document.getElementById(ids.work);
    this.shortInput = document.getElementById(ids.short);
    this.longInput = document.getElementById(ids.long);
    this.applyBtn = document.getElementById(ids.apply);

    this.startBtn.addEventListener('click', ()=>this.start());
    this.pauseBtn.addEventListener('click', ()=>this.pause());
    this.resetBtn.addEventListener('click', ()=>this.reset());
    this.shortBtn.addEventListener('click', ()=>{ this.switchMode('short'); this.start(); });
    this.longBtn.addEventListener('click', ()=>{ this.switchMode('long'); this.start(); });

    if(this.workInput) this.workInput.value = Math.round(this.work/60);
    if(this.shortInput) this.shortInput.value = Math.round(this.short/60);
    if(this.longInput) this.longInput.value = Math.round(this.long/60);
    if(this.applyBtn){
      this.applyBtn.addEventListener('click', ()=>{
        const w = parseInt(this.workInput.value,10);
        const s = parseInt(this.shortInput.value,10);
        const l = parseInt(this.longInput.value,10);
        if(Number.isFinite(w) && w>0) this.work = w*60; else alert('Invalid work minutes');
        if(Number.isFinite(s) && s>0) this.short = s*60; else alert('Invalid short break minutes');
        if(Number.isFinite(l) && l>0) this.long = l*60; else alert('Invalid long break minutes');
        // If current mode matches changed type, update remaining
        if(this.mode === 'work') this.remaining = this.work;
        if(this.mode === 'short') this.remaining = this.short;
        if(this.mode === 'long') this.remaining = this.long;
        this._updateUI();
      });
    }

    this._updateUI();
  }

  _updateUI(){
    if(this.modeEl) this.modeEl.textContent = this.mode === 'work' ? 'Work' : (this.mode === 'short' ? 'Short Break' : 'Long Break');
    if(this.timeEl) this.timeEl.textContent = formatTime(this.remaining);
    if(this.cyclesEl) this.cyclesEl.textContent = `Cycles: ${this.cycles}`;
  }

  _tick(){
    if(!this.running) return;
    this.remaining = Math.max(0, this.remaining - 1);
    this._updateUI();
    if(this.remaining <= 0){
      this.pause();
      beep();
      notify('Pomodoro', `${this.mode === 'work' ? 'Work session finished' : 'Break finished'}`);
      if(this.mode === 'work'){
        this.cycles++;
        if(this.cycles % this.cyclesBeforeLong === 0) this.switchMode('long'); else this.switchMode('short');
        this.start();
      } else {
        this.switchMode('work');
        this.start();
      }
    }
  }

  start(){
    if(this.running) return;
    this.running = true;
    this.interval = setInterval(()=>this._tick(), 1000);
    this._updateUI();
  }

  pause(){
    if(!this.running) return;
    this.running = false;
    clearInterval(this.interval); this.interval = null;
    this._updateUI();
  }

  reset(){
    this.pause();
    this.mode = 'work';
    this.remaining = this.work;
    this.cycles = 0;
    this._updateUI();
  }

  switchMode(mode){
    this.pause();
    this.mode = mode;
    if(mode === 'work') this.remaining = this.work;
    else if(mode === 'short') this.remaining = this.short;
    else this.remaining = this.long;
    this._updateUI();
  }
}
