let deferredPrompt;
document.addEventListener('DOMContentLoaded', function(){
  const splash = document.getElementById('splash');
  const pop = document.getElementById('popSound');
  const ding = document.getElementById('dingSound');
  const installBanner = document.getElementById('installBanner');
  const installNow = document.getElementById('installNow');
  const installLater = document.getElementById('installLater');
  const installNote = document.getElementById('installNote');
  const title = document.getElementById('mainTitle');

  setTimeout(()=>{ try{ ding.play().catch(()=>{}); }catch(e){}; splash.style.opacity=0; setTimeout(()=>{ splash.style.display='none'; document.querySelector('.main-card').classList.add('fade-in'); installNote.classList.add('show'); setTimeout(()=>{ installNote.classList.remove('show'); },5000); },800); },2200);
  setTimeout(()=>{ if(title){ title.classList.add('beat-medium'); setTimeout(()=>{ title.classList.remove('beat-medium'); },1500); } },2000);

  const numBalls = document.getElementById('numBalls');
  const weightPerBall = document.getElementById('weightPerBall');
  const hydration = document.getElementById('hydration');
  const hydrationVal = document.getElementById('hydrationVal');
  const saltPct = document.getElementById('saltPct');
  [numBalls, weightPerBall, hydration, saltPct].forEach(el=>el.addEventListener('input', recalc));
  hydration.addEventListener('input', ()=>{ hydrationVal.textContent = hydration.value + '%'; recalc(); });
  function recalc(){
    const nb = Math.max(1, Number(numBalls.value)||1);
    const wp = Math.max(1, Number(weightPerBall.value)||250);
    const total = Math.round(nb*wp);
    const hyd = Number(hydration.value)/100;
    const salt = Number(saltPct.value)/100||0.02;
    const yeastPct = 0.002;
    const combine = 1 + hyd + salt + yeastPct;
    const F = total / combine;
    const W = F * hyd;
    const S = F * salt;
    const Y = F * yeastPct;
    document.getElementById('flour').textContent = Math.round(F) + ' g';
    document.getElementById('water').textContent = Math.round(W) + ' g';
    document.getElementById('salt').textContent = S.toFixed(1) + ' g';
    document.getElementById('yeast').textContent = Y.toFixed(2) + ' g';
    document.getElementById('yeastFresh').textContent = (Y*3).toFixed(2) + ' g (approx.)';
    document.getElementById('totalDesc').textContent = total + ' g — ' + nb + ' pâtons × ' + wp + ' g';
    try{ pop.play().catch(()=>{}); }catch(e){}; calcWater();
  }
  function calcWater(){
    const DDT = 24;
    const fT = Number(document.getElementById('flourTemp').value)||20;
    const rT = Number(document.getElementById('roomTemp').value)||22;
    const friction = 2;
    const wT = Math.round(DDT*3 - fT - rT - friction);
    document.getElementById('waterTemp').textContent = wT + ' °C';
    document.getElementById('waterResult').classList.add('show');
  }

  document.getElementById('resetBtn').addEventListener('click', ()=>{ document.getElementById('numBalls').value=4; document.getElementById('weightPerBall').value=250; document.getElementById('hydration').value=60; document.getElementById('hydrationVal').textContent='60%'; document.getElementById('saltPct').value=2; document.getElementById('roomTemp').value=22; document.getElementById('flourTemp').value=20; recalc(); });
  recalc();

  window.addEventListener('beforeinstallprompt', (e)=> {
    e.preventDefault();
    deferredPrompt = e;
    setTimeout(()=>{ installBanner.classList.add('show'); try{ document.getElementById('popSound').play().catch(()=>{}); }catch(e){} },1500);
  });
  installNow.addEventListener('click', async ()=> {
    installBanner.classList.remove('show');
    if(deferredPrompt){
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if(choice.outcome === 'accepted'){
        try{ document.getElementById('popSound').play().catch(()=>{}); }catch(e){} 
      }
      deferredPrompt = null;
    }
  });
  installLater.addEventListener('click', ()=>{ installBanner.classList.remove('show'); });
});
