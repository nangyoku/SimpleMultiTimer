import { formatTimeMs, beep, notify } from './utils.js';

export class TimerItem{
  constructor(totalSeconds,label){
    this.total = totalSeconds;
    this.remaining = totalSeconds;
    this.label = label||'Timer';
    this.running = false;
    this.interval = null;
    this._createElement();
    this._updateUI();
  }

  _createElement(){
    this.el = document.createElement('div');
    this.el.className = 'timer';

    const meta = document.createElement('div'); meta.className='meta';
    this.nameEl = document.createElement('div'); this.nameEl.className='name'; this.nameEl.textContent = this.label;
    this.timeEl = document.createElement('div'); this.timeEl.className='time';
    this.progress = document.createElement('div'); this.progress.className='progress';
    this.bar = document.createElement('div'); this.bar.className='bar'; this.progress.appendChild(this.bar);
    meta.appendChild(this.nameEl); meta.appendChild(this.timeEl); meta.appendChild(this.progress);

    const controls = document.createElement('div'); controls.className='controls';
    this.startBtn = document.createElement('button'); this.startBtn.textContent='Start';
    this.pauseBtn = document.createElement('button'); this.pauseBtn.textContent='Pause';
    this.resetBtn = document.createElement('button'); this.resetBtn.textContent='Reset';
    this.delBtn = document.createElement('button'); this.delBtn.textContent='Remove';

    this.startBtn.addEventListener('click',()=>this.start());
    this.pauseBtn.addEventListener('click',()=>this.pause());
    this.resetBtn.addEventListener('click',()=>this.reset());
    this.delBtn.addEventListener('click',()=>this.remove());

    controls.append(this.startBtn,this.pauseBtn,this.resetBtn,this.delBtn);
    this.el.appendChild(meta); this.el.appendChild(controls);
    document.getElementById('timers').prepend(this.el);
  }

  _updateUI(){
    this.timeEl.textContent = formatTimeMs(Math.max(0,this.remaining));
    const pct = this.total>0 ? Math.max(0, Math.min(100, (1 - this.remaining/this.total)*100)) : 100;
    this.bar.style.width = `${pct}%`;
    if(this.remaining<=0){
      this.bar.style.width = '100%';
      this.timeEl.textContent = formatTimeMs(0);
      this.startBtn.disabled = true;
      this.pauseBtn.disabled = true;
      this.resetBtn.disabled = false;
    }
  }

  start(){
    if(this.running || this.remaining<=0) return;
    this.running = true;
    this.endAt = Date.now() + this.remaining*1000;
    // update frequently to show milliseconds; 50ms tick is a good balance
    this.interval = setInterval(()=>{
      const now = Date.now();
      this.remaining = Math.max(0, (this.endAt - now)/1000);
      this._updateUI();
      if(this.remaining<=0){
        this.pause();
        beep();
        notify(this.label || 'Timer finished', 'Your timer has completed.');
      }
    },50);
  }

  pause(){
    if(!this.running) return;
    this.running = false;
    clearInterval(this.interval); this.interval = null;
  }

  reset(){
    this.pause();
    this.remaining = this.total;
    this._updateUI();
  }

  remove(){
    this.pause();
    this.el.remove();
  }
}
