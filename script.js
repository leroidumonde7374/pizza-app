let deferredPrompt;

// Enregistrement du Service Worker avec détection des mises à jour
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js').then((reg) => {
    console.log('Service Worker enregistré');
    
    // Détection des mises à jour
    reg.addEventListener('updatefound', () => {
      const newWorker = reg.installing;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // Nouvelle version disponible !
          if (confirm('🍕 Nouvelle version disponible ! Recharger pour voir les nouveautés ?')) {
            window.location.reload();
          }
        }
      });
    });
    
    // Vérification périodique des mises à jour (toutes les heures)
    setInterval(() => {
      reg.update();
    }, 3600000);
  }).catch((err) => {
    console.log('Service Worker échoué:', err);
  });
}

document.addEventListener('DOMContentLoaded', function(){
  const splash = document.getElementById('splash');
  const pop = document.getElementById('popSound');
  const ding = document.getElementById('dingSound');
  const installBanner = document.getElementById('installBanner');
  const installNow = document.getElementById('installNow');
  const installLater = document.getElementById('installLater');
  const installNote = document.getElementById('installNote');
  const title = document.getElementById('mainTitle');
  
  // Animation de démarrage
  setTimeout(()=>{ 
    try{ ding.play().catch(()=>{}); }catch(e){}; 
    splash.style.opacity=0; 
    setTimeout(()=>{ 
      splash.style.display='none'; 
      document.querySelector('.main-card').classList.add('fade-in'); 
      installNote.classList.add('show'); 
      setTimeout(()=>{ installNote.classList.remove('show'); },5000); 
    },800); 
  },2200);
  
  setTimeout(()=>{ 
    if(title){ 
      title.classList.add('beat-medium'); 
      setTimeout(()=>{ title.classList.remove('beat-medium'); },1500); 
    } 
  },2000);
  
  // Éléments du formulaire
  const numBalls = document.getElementById('numBalls');
  const weightPerBall = document.getElementById('weightPerBall');
  const hydration = document.getElementById('hydration');
  const hydrationVal = document.getElementById('hydrationVal');
  const saltPct = document.getElementById('saltPct');
  const kneadTemp = document.getElementById('kneadTemp');
  
  // Événements
  [numBalls, weightPerBall, hydration, saltPct].forEach(el=>el.addEventListener('input', recalc));
  hydration.addEventListener('input', ()=>{ 
    hydrationVal.textContent = hydration.value + '%'; 
    recalc(); 
  });
  
  // Événements pour le calculateur de température
  const roomTemp = document.getElementById('roomTemp');
  const flourTemp = document.getElementById('flourTemp');
  [roomTemp, flourTemp, kneadTemp].forEach(el=>el.addEventListener('input', calcWater));
  
  // Calcul des ingrédients
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
    
    try{ pop.play().catch(()=>{}); }catch(e){}; 
    calcWater();
  }
  
  // Calcul température de l'eau - Méthode des 3T
  function calcWater(){
    const targetDoughTemp = 60; // Température cible totale
    const fT = Number(document.getElementById('flourTemp').value)||20;
    const rT = Number(document.getElementById('roomTemp').value)||22;
    const kT = Number(document.getElementById('kneadTemp').value)||2;
    
    // Formule : TE = 60 - (TA + TF + TP)
    const wT = targetDoughTemp - fT - rT - kT;
    
    document.getElementById('waterTemp').textContent = wT + ' °C';
    document.getElementById('waterResult').classList.add('show');
    
    // Afficher le détail du calcul
    const explanation = document.getElementById('waterExplanation');
    const calcDetails = document.getElementById('calcDetails');
    calcDetails.textContent = `60 - (${rT} + ${fT} + ${kT}) = 60 - ${rT + fT + kT} = ${wT}°C`;
    explanation.style.display = 'block';
    
    // Avertissement si température anormale
    if(wT < 5){
      calcDetails.innerHTML += '<br><span style="color:#d97706">⚠️ Température très froide, difficile à obtenir</span>';
    } else if(wT > 35){
      calcDetails.innerHTML += '<br><span style="color:#dc2626">⚠️ Attention : eau trop chaude peut tuer la levure !</span>';
    } else if(wT >= 15 && wT <= 25){
      calcDetails.innerHTML += '<br><span style="color:#059669">✅ Température idéale pour la fermentation</span>';
    }
  }
  
  // Bouton reset
  document.getElementById('resetBtn').addEventListener('click', ()=>{ 
    document.getElementById('numBalls').value=4; 
    document.getElementById('weightPerBall').value=250; 
    document.getElementById('hydration').value=60; 
    document.getElementById('hydrationVal').textContent='60%'; 
    document.getElementById('saltPct').value=2; 
    document.getElementById('roomTemp').value=22; 
    document.getElementById('flourTemp').value=20;
    kneadTemp.value=2;
    recalc(); 
  });
  
  // Calcul initial
  recalc();
  
  // Détection iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator.standalone);
  
  // Gestion de l'installation PWA
  window.addEventListener('beforeinstallprompt', (e)=> {
    e.preventDefault();
    deferredPrompt = e;
    setTimeout(()=>{ 
      installBanner.classList.add('show'); 
      try{ document.getElementById('popSound').play().catch(()=>{}); }catch(e){} 
    },1500);
  });
  
  // Si iOS et pas encore installé, afficher le message manuel
  if(isIOS && !isInStandaloneMode){
    setTimeout(()=>{ 
      installNote.classList.add('show'); 
      setTimeout(()=>{ installNote.classList.remove('show'); },8000);
    },2000);
  }
  
  installNow.addEventListener('click', async ()=> {
    installBanner.classList.remove('show');
    if(deferredPrompt){
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if(choice.outcome === 'accepted'){
        try{ document.getElementById('popSound').play().catch(()=>{}); }catch(e){} 
      }
      deferredPrompt = null;
    } else if(isIOS) {
      // Sur iOS, afficher les instructions
      installNote.classList.add('show');
      setTimeout(()=>{ installNote.classList.remove('show'); },8000);
    }
  });
  
  installLater.addEventListener('click', ()=>{ 
    installBanner.classList.remove('show'); 
  });
});
