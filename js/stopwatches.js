import { formatTimeMs } from './utils.js';

export class StopwatchItem{
  constructor(label){
    this.label = label || 'Stopwatch';
    this.running = false;
    this.baseElapsed = 0; // seconds
    this.startAt = null; // timestamp from performance.now()
    this.raf = null;
    this.laps = [];
    this._createElement();
    this._updateUI();
  }

  _createElement(){
    this.el = document.createElement('div');
    this.el.className = 'timer stopwatch';

    const meta = document.createElement('div'); meta.className='meta';
    this.nameEl = document.createElement('div'); this.nameEl.className='name'; this.nameEl.textContent = this.label;
    this.timeEl = document.createElement('div'); this.timeEl.className='time';
    meta.appendChild(this.nameEl);
    meta.appendChild(this.timeEl);

    const controls = document.createElement('div'); controls.className='controls';
    this.startBtn = document.createElement('button'); this.startBtn.textContent='Start';
    this.pauseBtn = document.createElement('button'); this.pauseBtn.textContent='Pause';
    this.resetBtn = document.createElement('button'); this.resetBtn.textContent='Reset';
    this.lapBtn = document.createElement('button'); this.lapBtn.textContent='Lap';
    this.delBtn = document.createElement('button'); this.delBtn.textContent='Remove';

    this.startBtn.addEventListener('click',()=>this.start());
    this.pauseBtn.addEventListener('click',()=>this.pause());
    this.resetBtn.addEventListener('click',()=>this.reset());
    this.lapBtn.addEventListener('click',()=>this.lap());
    this.delBtn.addEventListener('click',()=>this.remove());

    controls.append(this.startBtn,this.pauseBtn,this.resetBtn,this.lapBtn,this.delBtn);
    this.el.appendChild(meta); this.el.appendChild(controls);
    // laps container shown below the controls, as a vertical column
    this.lapsEl = document.createElement('div'); this.lapsEl.className = 'laps';
    this.el.appendChild(this.lapsEl);
    document.getElementById('stopwatches').prepend(this.el);
  }

  _updateUI(){
    const elapsed = this.baseElapsed + (this.running && this.startAt ? (performance.now() - this.startAt)/1000 : 0);
    this.timeEl.textContent = formatTimeMs(elapsed);
  }

  _tick = (ts) => {
    this._updateUI();
    this.raf = requestAnimationFrame(this._tick);
  }

  start(){
    if(this.running) return;
    this.running = true;
    this.startAt = performance.now();
    this.raf = requestAnimationFrame(this._tick);
  }

  pause(){
    if(!this.running) return;
    this.running = false;
    cancelAnimationFrame(this.raf); this.raf = null;
    this.baseElapsed += (performance.now() - this.startAt)/1000;
    this.startAt = null;
    this._updateUI();
  }

  reset(){
    this.pause();
    this.baseElapsed = 0;
    // clear recorded laps when resetting
    this.laps = [];
    if(this.lapsEl) this.lapsEl.innerHTML = '';
    this._updateUI();
  }

  remove(){
    this.pause();
    this.el.remove();
  }

  lap(){
    const elapsed = this.baseElapsed + (this.running && this.startAt ? (performance.now() - this.startAt)/1000 : 0);
    const label = formatTimeMs(elapsed);
    const item = document.createElement('div');
    item.className = 'lap';
    const num = this.laps.length + 1;
    item.textContent = `Lap ${num}: ${label}`;
    this.laps.unshift(elapsed);
    this.lapsEl.prepend(item);
    
  }
}
