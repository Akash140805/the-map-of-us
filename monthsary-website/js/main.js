const $=id=>document.getElementById(id);let toastTimer;function toast(s){$('toast').textContent=s;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),2400)}
const scenes=['memories','game','future','letter','ending'];let unlocked=1;function updateMap(){scenes.forEach((s,i)=>{const b=document.querySelector(`[data-scene="${s}"]`);if(!b)return;const ok=i<unlocked;b.disabled=!ok;b.classList.toggle('locked',!ok);});$('progress').textContent=`${unlocked} / 5 places discovered`}
function showScene(s){if(s==='letter') musicSuspendForLetter(); else musicResumeAfterLetter();document.querySelectorAll('.scene').forEach(x=>x.classList.remove('active'));$('world').classList.toggle('hidden',s!=='map');$('home').classList.toggle('hidden',s!=='map');if(s!=='map')$('scene-'+s).classList.add('active');const target=s==='map'?'world':'scene-'+s;requestAnimationFrame(()=>$(target).scrollIntoView({behavior:'smooth',block:'start'}));if(s==='game'){if(!gameStarted)resetAdventure();drawGame();}}
function unlockNext(next){unlocked=Math.max(unlocked,next);updateMap();showScene('map');toast('A new little place has opened on the map ♡')}
document.querySelectorAll('[data-scene]').forEach(b=>b.addEventListener('click',()=>{if(!b.disabled)showScene(b.dataset.scene)}));document.querySelectorAll('[data-map]').forEach(b=>b.onclick=()=>showScene('map'));$('mapBtn').onclick=()=>showScene('map');$('beginBtn').onclick=()=>showScene('map');$('finishMemories').onclick=()=>unlockNext(2);$('finishFuture').onclick=()=>unlockNext(4);$('finishLetter').onclick=()=>unlockNext(5);$('replay').onclick=()=>showScene('map');updateMap();
const memories = (window.siteContent && window.siteContent.memories) || [];
let mi = 0;
function showMemory(i) {
  if (!memories.length) return;
  mi = (i + memories.length) % memories.length;
  const memory = memories[mi];
  const art = $('memoryArt');
  art.replaceChildren();
  if (memory.image) {
    const photo = document.createElement('img');
    photo.src = memory.image;
    photo.alt = memory.caption || 'A memory together';
    photo.onerror = () => { photo.remove(); art.textContent = ['🌷', '🌸', '🌠', '🌙'][mi % 4]; };
    art.appendChild(photo);
  } else {
    art.textContent = ['🌷', '🌸', '🌠', '🌙'][mi % 4];
  }
  $('memoryCaption').textContent = memory.caption;
  $('memoryTitle').textContent = memory.title;
  $('memoryText').textContent = memory.text;
  $('memoryCounter').textContent = `${mi + 1} / ${memories.length}`;
}
$('prevMemory').onclick = () => showMemory(mi - 1);
$('nextMemory').onclick = () => showMemory(mi + 1);
showMemory(0);
// Heartwood Trail: a gentle side-scrolling walk-and-jump adventure.
const canvas=$('gameCanvas');
const ctx=canvas.getContext('2d');
const keys={left:false,right:false,jump:false};
let hero=null, hearts=[], gameWon=false, gameStarted=false, jumpReady=true;
const ground=[
  {x:0,y:405,w:190,h:75},
  {x:250,y:378,w:180,h:102},
  {x:490,y:400,w:190,h:80},
  {x:745,y:365,w:155,h:115}
];
const heartSpots=[
  {x:90,y:365},{x:155,y:365},
  {x:295,y:338},{x:385,y:338},
  {x:535,y:360},{x:635,y:360},
  {x:790,y:325},{x:865,y:325}
];
function resetAdventure(){
  hero={x:35,y:361,w:28,h:42,vx:0,vy:0,on:true,face:1,checkpoint:35};
  hearts=heartSpots.map((h,i)=>({...h,taken:false,i}));
  gameWon=false;gameStarted=true;jumpReady=true;
  $('score').textContent='♡ 0 / 8 hearts';
  $('gameMessage').textContent='Take your time, little adventurer. Walk, hop, and collect the hearts ♡';
  $('finishGame').classList.add('hidden');
  drawGame();
}
function rounded(x,y,w,h,r,color){
  ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();
}
function drawGame(){
  if(!ctx)return;
  const sky=ctx.createLinearGradient(0,0,0,480);
  sky.addColorStop(0,'#f5a8c8');sky.addColorStop(.48,'#f8c9c2');sky.addColorStop(1,'#d9c0eb');
  ctx.fillStyle=sky;ctx.fillRect(0,0,900,480);
  const glow=ctx.createRadialGradient(700,110,8,700,110,260);
  glow.addColorStop(0,'#fff4d5bb');glow.addColorStop(1,'#fff4d500');
  ctx.fillStyle=glow;ctx.fillRect(400,0,500,380);
  // Quiet stars and distant rolling hills.
  for(let i=0;i<48;i++){
    const x=(i*137+35)%900,y=(i*67+19)%260;
    ctx.globalAlpha=.28+(i%4)*.1;ctx.fillStyle='#fff';
    ctx.beginPath();ctx.arc(x,y,i%6===0?2:1,0,Math.PI*2);ctx.fill();
  }
  ctx.globalAlpha=1;
  ctx.fillStyle='#dba9ca';ctx.beginPath();ctx.moveTo(0,350);
  ctx.quadraticCurveTo(180,290,330,355);ctx.quadraticCurveTo(520,300,700,350);
  ctx.quadraticCurveTo(820,315,900,345);ctx.lineTo(900,480);ctx.lineTo(0,480);ctx.fill();
  // Soft crescent moon.
  ctx.fillStyle='#fff1cd';ctx.shadowColor='#fff4d8';ctx.shadowBlur=22;
  ctx.beginPath();ctx.arc(770,75,31,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
  ctx.fillStyle='#f5a8c8';ctx.beginPath();ctx.arc(784,63,27,0,Math.PI*2);ctx.fill();
  // Solid stretches of land with visible gaps between them.
  ground.forEach((p,i)=>{
    ctx.save();ctx.shadowColor='#9f5b8d44';ctx.shadowBlur=12;
    rounded(p.x,p.y,p.w,p.h,12,'#b77ca8');ctx.shadowBlur=0;
    rounded(p.x,p.y,p.w,10,7,i%2?'#fff0f4':'#ffeaf1');
    ctx.fillStyle='#f5bdd4';
    for(let j=0;j<p.w-20;j+=27){
      ctx.beginPath();ctx.arc(p.x+13+j,p.y+12,2.5,0,Math.PI*2);ctx.fill();
    }
    // tiny flowers growing along the path
    for(let j=24;j<p.w-12;j+=58){
      ctx.fillStyle='#6f9b76';ctx.fillRect(p.x+j,p.y-8,2,9);
      ctx.fillStyle='#f9d5e6';ctx.beginPath();ctx.arc(p.x+j,p.y-10,4,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  });
  // Hearts sit just above the ground, easy to reach with a small hop.
  hearts.forEach(h=>{
    if(h.taken)return;
    ctx.save();ctx.translate(h.x,h.y+Math.sin(Date.now()/520+h.i)*2.5);
    ctx.font='25px serif';ctx.textAlign='center';ctx.shadowColor='#ff70ad';ctx.shadowBlur=10;
    ctx.fillText('💗',0,8);ctx.restore();
  });
  // Exit sign at the end of the path.
  ctx.save();ctx.shadowColor='#ffb5d4';ctx.shadowBlur=hearts.every(h=>h.taken)?24:4;
  rounded(850,300,34,55,15,hearts.every(h=>h.taken)?'#fff0bd':'#bba8c8');
  ctx.shadowBlur=0;ctx.font='23px serif';ctx.textAlign='center';
  ctx.fillText(hearts.every(h=>h.taken)?'🌸':'🔒',867,335);ctx.restore();
  // Storybook heroine.
  if(hero){
    ctx.save();ctx.translate(hero.x+hero.w/2,hero.y+hero.h/2);
    if(hero.face<0)ctx.scale(-1,1);
    // hair
    ctx.fillStyle='#75405f';ctx.beginPath();ctx.ellipse(0,-9,14,17,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#8b4c70';ctx.beginPath();ctx.ellipse(-10,1,4.5,14,0,0,Math.PI*2);ctx.ellipse(10,1,4.5,14,0,0,Math.PI*2);ctx.fill();
    // face and fringe
    ctx.fillStyle='#ffd8c9';ctx.beginPath();ctx.arc(0,-10,10,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#75405f';ctx.beginPath();ctx.arc(-1,-15,10,Math.PI,Math.PI*2);ctx.quadraticCurveTo(2,-10,8,-11);ctx.fill();
    ctx.fillStyle='#57374f';ctx.beginPath();ctx.arc(-4,-9,1.4,0,Math.PI*2);ctx.arc(4,-9,1.4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#f49ab0';ctx.globalAlpha=.75;ctx.beginPath();ctx.ellipse(-7,-5,2.3,1.3,0,0,Math.PI*2);ctx.ellipse(7,-5,2.3,1.3,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
    // bow and pink dress
    ctx.fillStyle='#ff7eae';ctx.beginPath();ctx.moveTo(-7,-21);ctx.quadraticCurveTo(-17,-28,-15,-17);ctx.quadraticCurveTo(-11,-14,-7,-18);ctx.moveTo(-7,-18);ctx.quadraticCurveTo(1,-28,2,-18);ctx.quadraticCurveTo(-2,-13,-7,-18);ctx.fill();
    ctx.fillStyle='#ffe9a9';ctx.beginPath();ctx.arc(-7,-18,2,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ff8fba';ctx.beginPath();ctx.moveTo(-7,1);ctx.lineTo(7,1);ctx.lineTo(12,18);ctx.quadraticCurveTo(0,23,-12,18);ctx.closePath();ctx.fill();
    ctx.strokeStyle='#ffd1c3';ctx.lineWidth=3.5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-7,5);ctx.lineTo(-11,11);ctx.moveTo(7,5);ctx.lineTo(11,11);ctx.stroke();
    ctx.strokeStyle='#75405f';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-5,19);ctx.lineTo(-6,23);ctx.moveTo(5,19);ctx.lineTo(6,23);ctx.stroke();
    ctx.fillStyle='#fff0f6';ctx.beginPath();ctx.ellipse(-7,23,4,2.5,0,0,Math.PI*2);ctx.ellipse(7,23,4,2.5,0,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }
}
function tick(){
  requestAnimationFrame(tick);
  if(!gameStarted||!$('scene-game').classList.contains('active'))return;
  const speed=2.15,gravity=.42;
  if(keys.left){hero.vx=-speed;hero.face=-1;}
  else if(keys.right){hero.vx=speed;hero.face=1;}
  else hero.vx*=.72;
  if(!keys.jump)jumpReady=true;
  if(keys.jump&&jumpReady&&hero.on){hero.vy=-9.2;hero.on=false;jumpReady=false;}
  hero.x+=hero.vx;hero.vy+=gravity;hero.y+=hero.vy;
  hero.on=false;
  // Land only while descending; the gaps remain real and can be fallen through.
  ground.forEach(p=>{
    const feet=hero.y+hero.h;
    if(hero.vy>=0&&hero.x+hero.w-4>p.x&&hero.x+4<p.x+p.w&&feet>=p.y&&feet-hero.vy<=p.y){
      hero.y=p.y-hero.h;hero.vy=0;hero.on=true;
      if(p.x>hero.checkpoint)hero.checkpoint=p.x+12;
    }
  });
  hero.x=Math.max(0,Math.min(872,hero.x));
  if(hero.y>500){
    const checkpoint=ground.find(p=>hero.checkpoint>=p.x&&hero.checkpoint<=p.x+p.w)||ground[0];
    hero.x=Math.max(checkpoint.x+8,Math.min(checkpoint.x+30,checkpoint.x+checkpoint.w-hero.w-5));
    hero.y=checkpoint.y-hero.h;hero.vx=0;hero.vy=0;hero.on=true;
    $('gameMessage').textContent='A tiny tumble! You are safely back on the path ♡';
  }
  hearts.forEach(h=>{
    if(!h.taken&&Math.abs(hero.x+hero.w/2-h.x)<22&&Math.abs(hero.y+hero.h/2-h.y)<30){
      h.taken=true;
      const count=hearts.filter(item=>item.taken).length;
      $('score').textContent=`♡ ${count} / 8 hearts`;
      $('gameMessage').textContent=[
        'You make ordinary days sparkle.','You are my favorite hello.',
        'I am so proud of you.','You make my world softer.',
        'You deserve all the gentle things.','You are loved more than you know.',
        'You make every place feel warmer.','I would choose you again.'
      ][h.i]+' ♡';
      if(count===8){
        gameWon=true;$('gameMessage').textContent='You collected every heart! The next path is open, my love. ♡';
        $('finishGame').classList.remove('hidden');toast('All hearts collected! A new place awaits 💗');
      }
    }
  });
  drawGame();
}
function keySet(e,on){
  const key=e.key.toLowerCase();
  if(['arrowleft','a'].includes(key))keys.left=on;
  if(['arrowright','d'].includes(key))keys.right=on;
  if([' ','arrowup','w'].includes(key))keys.jump=on;
  if(['arrowleft','arrowright','arrowup',' '].includes(key))e.preventDefault();
}
window.addEventListener('keydown',e=>keySet(e,true));
window.addEventListener('keyup',e=>keySet(e,false));
document.querySelectorAll('[data-key]').forEach(button=>{
  const key=button.dataset.key;
  const set=value=>{keys[key]=value;};
  button.addEventListener('pointerdown',e=>{e.preventDefault();set(true);});
  ['pointerup','pointerleave','pointercancel'].forEach(event=>button.addEventListener(event,()=>set(false)));
});
$('resetGame').onclick=resetAdventure;
$('finishGame').onclick=()=>unlockNext(3);
canvas.addEventListener('pointerdown',()=>{if(!gameStarted)resetAdventure();});
resetAdventure();
requestAnimationFrame(tick);

// A soft, continuous shower of tiny blossoms makes the final chapter feel alive.
const finaleDecor=document.querySelector('.finale-decor');
if(finaleDecor&&!finaleDecor.dataset.showerReady){
  finaleDecor.dataset.showerReady='true';
  const blossoms=['✿','❀','✽','🌸'];
  for(let i=0;i<30;i++){
    const petal=document.createElement('span');
    petal.className='falling-petal';
    petal.textContent=blossoms[i%blossoms.length];
    petal.style.left=`${(i*37)%100}%`;
    petal.style.animationDelay=`-${(i*1.17)%18}s`;
    petal.style.animationDuration=`${13+(i%8)*1.6}s`;
    petal.style.fontSize=`${12+(i%4)*5}px`;
    petal.style.setProperty('--sway',`${((i%5)-2)*18}px`);
    finaleDecor.appendChild(petal);
  }
}

// Creator-supplied background music with smooth volume fades.
// Add assets/background-music.mp3. Browsers require a visitor tap to start audio.
const musicConfig = window.siteContent?.backgroundMusic || {};
const musicAudio = new Audio(musicConfig.audio || 'assets/background-music.mp3');
musicAudio.loop = true;
musicAudio.preload = 'auto';
let musicWanted = false;
let musicSuspendedForLetter = false;
let musicFadeTimer = null;
const MUSIC_VOLUME = 0.32;

function fadeMusic(target, duration, afterFade) {
  if (musicFadeTimer) clearInterval(musicFadeTimer);
  const startVolume = musicAudio.volume;
  const startedAt = performance.now();
  const tick = () => {
    const progress = Math.min(1, (performance.now() - startedAt) / duration);
    // Smooth ease-in/ease-out curve.
    const eased = progress * progress * (3 - 2 * progress);
    musicAudio.volume = Math.max(0, Math.min(1, startVolume + (target - startVolume) * eased));
    if (progress >= 1) {
      clearInterval(musicFadeTimer);
      musicFadeTimer = null;
      if (afterFade) afterFade();
    }
  };
  tick();
  if (duration > 0) musicFadeTimer = window.setInterval(tick, 30);
}

function updateMusicButton() {
  const playing = musicWanted && !musicSuspendedForLetter;
  $('musicToggle').textContent = playing ? '♫ Music on' : '♫ Music off';
  $('musicToggle').setAttribute('aria-pressed', String(playing));
}

async function startBackgroundMusic() {
  if (!musicWanted || musicSuspendedForLetter) return;
  try {
    await musicAudio.play();
    fadeMusic(MUSIC_VOLUME, 2200);
  } catch (error) {
    musicWanted = false;
    updateMusicButton();
    toast('Add your music file as assets/background-music.mp3, then try again.');
  }
}

function stopBackgroundMusic() {
  fadeMusic(0, 1600, () => {
    if (!musicWanted || musicSuspendedForLetter) musicAudio.pause();
  });
}

function musicSuspendForLetter() {
  if (musicSuspendedForLetter) return;
  musicSuspendedForLetter = true;
  if (!musicAudio.paused) stopBackgroundMusic();
  updateMusicButton();
}

function musicResumeAfterLetter() {
  if (!musicSuspendedForLetter) return;
  musicSuspendedForLetter = false;
  updateMusicButton();
  if (musicWanted) startBackgroundMusic();
}

$('musicToggle').addEventListener('click', () => {
  musicWanted = !musicWanted;
  updateMusicButton();
  if (musicWanted) startBackgroundMusic();
  else stopBackgroundMusic();
});
