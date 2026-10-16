/* ================= PROPOSED ================= */
function joinCopy(S) {
  if (S.variant === 'trial') return { cta: 'Start free trial', legal: 'No charge today. We’ll remind you 3 days before your trial ends. Then $24.99 every 4 weeks (+ tax), auto-renewing until you cancel. The $20 Premium credit isn’t included in the trial.' };
  if (S.plan === 'annual') return { cta: 'Join for $99 / year · save $12.99 today', legal: 'By tapping Join, you agree to a $99 annual charge (+ tax) that auto-renews until you cancel. Cancel anytime in Account → Subscriptions. <u>Terms</u>' };
  return { cta: 'Join for $24.99 · save $12.99 today', legal: 'By tapping Join, you agree to a $24.99 charge every 4 weeks (+ tax) that auto-renews until you cancel. Cancel anytime in Account → Subscriptions. <u>Terms</u>' };
}
function payRow() { return `<div class="pay"><span class="pp">Pay<span>Pal</span></span> vimal.g•••@gmail.com<button class="link" style="margin-left:auto" data-a="noop">Change</button></div>`; }

const P = {
  cart(S) {
    return SB + hdr('Your cart <span class="cnt">4</span>', 'Edit delivery by Wed, Aug 19') +
      `<div class="content"><div class="h3">Meals <span class="cnt">4</span></div>${meals()}
      <div class="banner" style="background:var(--cream)">＋ Shop for desserts, snacks, and more<span style="margin-left:auto">›</span></div>
      <div class="h3" style="margin-top:14px">Order total</div>${totalsInner(S)}</div>
      <div class="bottom">${S.member ?
        `<div class="cb"><span class="fp g">F+</span><div>Member · you’re saving <span class="grn">$12.99</span> on this box</div></div>` :
        `<div class="cb ${S.pulse ? 'pulse' : ''}" data-a="p_open:cart_toggle"><span class="fp g">F+</span><div>Save <span class="grn">$12.99</span> on this box with Factor Plus<div class="mm" style="font-weight:400">Pays for itself in 2 boxes</div></div><div class="tgl"></div></div>`}
      <button class="btn" data-a="allDone">All done!</button></div>`;
  },
  ov_sheet(S) {
    const j = joinCopy(S);
    if (S.variant === 'trial') return `<div class="sheet">
      <div class="grab"></div><div style="display:flex;align-items:center;gap:7px"><span class="fp g">F+</span><b>Factor Plus</b><span class="sx" data-a="closeOverlay">✕</span></div>
      <div class="big" style="margin:9px 0 3px">Free shipping on your next 2 boxes</div>
      <div class="mm">Then $24.99 every 4 weeks · cancel anytime</div>
      <div class="tl"><div><div class="d f"></div><b>Today</b><br>$0 · shipping free</div><div><div class="d"></div><b>Aug 30</b><br>Reminder</div><div><div class="d"></div><b>Sep 2</b><br>$24.99, if you stay</div></div>
      <div class="ben"><span class="ok">✓</span>Free shipping, every box<span class="v grn">starts today</span></div>
      <div class="ben"><span class="ok off">✓</span>$20 off Premium meals, every box<span class="v mm">after trial</span></div>
      <div style="margin-top:10px">${payRow()}</div>
      <button class="btn grnb" data-a="p_join">${j.cta}</button><div class="legal">${j.legal}</div></div>`;
    const a = S.plan === 'annual';
    return `<div class="sheet">
      <div class="grab"></div><div style="display:flex;align-items:center;gap:7px"><span class="fp g">F+</span><b>Factor Plus</b><span class="sx" data-a="closeOverlay">✕</span></div>
      <div class="big" style="margin:9px 0 3px">Save $12.99 on this box</div>
      <div class="mm">Pays for itself in 2 boxes · cancel anytime</div>
      <div style="margin-top:6px"><div class="ben"><span class="ok">✓</span>Free shipping, every box<span class="v grn">−$12.99</span></div>
      <div class="ben"><span class="ok">✓</span>$20 off Premium meals, every box<span class="v grn">up to −$20</span></div></div>
      <div class="seg"><div class="${!a ? 'on' : ''}" data-a="p_plan:monthly"><b>Monthly</b>$24.99 / 4 weeks</div><div class="${a ? 'on' : ''}" data-a="p_plan:annual"><b>Annual</b>$99 / year · save 70%</div></div>
      ${payRow()}<button class="btn grnb" data-a="p_join">${j.cta}</button><div class="legal">${j.legal}</div></div>`;
  },
  post(S) {
    const j = joinCopy(S);
    const trial = S.variant === 'trial';
    return SB + `<div class="content" style="background:#DCD8CF"></div><div class="dim" style="animation:none"></div>
      <div class="sheet" style="top:96px;animation:none"><div class="grab"></div>
      <div style="display:flex;gap:10px;align-items:center"><div style="width:34px;height:34px;border-radius:50%;background:var(--mint);color:var(--green);display:flex;align-items:center;justify-content:center;font-weight:900">✓</div>
        <div><span class="grn" style="font-size:10.5px">Order saved</span><div class="big" style="font-size:17px">Arriving Sat, Sep 12</div></div><span class="sx" data-a="p_decline">✕</span></div>
      <div style="border:1.5px solid var(--green-2);border-radius:13px;margin-top:14px;padding:11px">
        <div style="display:flex;align-items:center;gap:7px"><span class="fp g">F+</span><b style="font-size:13.5px">${trial ? 'Free shipping on your next 2 boxes' : 'Save $12.99 on this box with Factor Plus'}</b></div>
        <div class="mm" style="margin:4px 0 5px">${trial ? 'Then $24.99 every 4 weeks · cancel anytime' : '$24.99 every 4 weeks · pays for itself in 2 boxes · cancel anytime'}</div>
        <div class="ben"><span class="ok">✓</span>Free shipping, every box<span class="v grn">−$12.99</span></div>
        <div class="ben"><span class="ok ${trial ? 'off' : ''}">✓</span>$20 off Premium meals, every box<span class="v ${trial ? 'mm' : 'grn'}">${trial ? 'after trial' : 'up to −$20'}</span></div>
        <div class="tot"><div class="r b"><span>Box total</span><span><span class="strike">$99.93</span> $86.94</span></div></div>
        <div style="margin-top:9px">${payRow()}</div>
        <button class="btn grnb" data-a="p_join">${trial ? j.cta : 'Join for $24.99 · save $12.99'}</button>
        <button class="btn out sm" style="margin-top:7px;border-color:var(--line)" data-a="p_decline">Not now</button>
        <div class="legal" style="text-align:center">${trial ? j.legal : 'By tapping Join, you agree to $24.99 every 4 weeks (+ tax), auto-renewing until you cancel.'}</div></div></div>`;
  },
  welcome(S) {
    return `<div class="sheet" style="top:110px">
      <div class="grab"></div>
      <div style="text-align:center;margin:6px 0 12px"><span class="fp g lg">F+</span>
        <div class="big" style="font-size:23px;margin-top:9px">You’re in.</div>
        <div class="mm">Here’s how to get the most from Factor Plus</div></div>
      <div class="ben" style="align-items:flex-start;padding:10px 0"><span style="font-size:17px">🚚</span><div><b>Shipping is $0</b><div class="mm">Starting with your ${S.flow === 'post' ? 'Sep 12' : 'Aug 24'} box.</div></div></div>
      <div class="ben" style="align-items:flex-start;padding:10px 0"><span style="font-size:17px">🥩</span><div><b>$20 off Premium meals, every box</b><div class="mm">${S.variant === 'trial' ? 'Starts after your free trial. ' : 'Your credit refreshes every box. '}Look for <span class="fp g">F+</span> <b style="color:var(--green)">$0</b> on Premium meals.</div></div></div>
      <div class="ben" style="align-items:flex-start;padding:10px 0"><span style="font-size:17px">📈</span><div><b>See what you’ve saved</b><div class="mm">Account → Factor Plus shows your savings each cycle.</div></div></div>
      <button class="btn grnb" style="margin-top:12px" data-a="p_pickPremium">Pick a Premium meal</button>
      <div style="text-align:center;margin-top:10px"><button class="link" style="color:var(--ink)" data-a="p_welcomeBack">${S.flow === 'cart' ? 'Back to my cart' : 'Done'}</button></div></div>`;
  },
  premium(S) {
    const c = credit(S), used = 20 - c.rem;
    return SB + `<div class="ch" style="background:var(--cream)"><span class="x" data-a="noop">✕</span><div class="t" style="text-align:left"><b style="font-size:14px">Shop for Mon, Aug 24</b></div><span data-a="go:cart">🛒</span></div>
      <div class="tabs"><span>This Week’s Menu</span><span>Top Rated</span><span class="on">Premium</span><span>My Faves</span></div>
      <div class="content"><div class="big">Premium</div>
      ${S.member && S.variant !== 'trial' ? `<div class="banner" style="display:block;cursor:default"><div style="display:flex;align-items:center;gap:6px"><span class="fp g">F+</span>Your Premium credit<span style="margin-left:auto" class="grn">${money(c.rem)} left on this box</span></div><div class="meter"><i style="width:${(c.rem / 20) * 100}%"></i></div>${used > 0 ? `<div class="mm" style="margin-top:5px;font-weight:400">You’ve used ${money(used)} of your credit on this box.</div>` : ''}</div>` :
        S.member ? `<div class="banner" style="cursor:default"><span class="fp g">F+</span>Premium credit starts after your free trial</div>` :
        `<div class="banner" data-a="p_open:premium_banner"><span class="fp g">F+</span>Premium meals from $0 with Factor Plus<span style="margin-left:auto">›</span></div>`}
      ${premTiles(S)}</div>${tabbar(S, 'premium')}`;
  },
  home(S) {
    return SB + `<div class="logo">FACTOR_</div><div class="content">
      <div class="big" style="margin-bottom:10px">My Menu · Aug 24</div>
      ${S.member ? `<div class="card hl"><div style="display:flex;gap:7px;align-items:center"><span class="fp g">F+</span><b>Factor Plus · saved $12.99 so far</b></div><div class="mm" style="margin-top:4px">Shipping $0 on this box${S.variant === 'trial' ? ' · free trial' : ' · $20 Premium credit ready'}</div></div>` :
      `<div class="card hl"><div style="display:flex;align-items:center;gap:7px"><span class="fp g">F+</span><b style="font-size:13.5px">Save $12.99 on every box</b></div>
        <div style="background:var(--mint-2);border-radius:9px;padding:9px;margin:9px 0;font-size:11.5px">
          <div style="display:flex;justify-content:space-between"><span>Shipping you paid, last 4 weeks (3 boxes)</span><b>$38.97</b></div>
          <div style="display:flex;justify-content:space-between"><span>Factor Plus, 4 weeks</span><b>−$24.99</b></div>
          <div style="display:flex;justify-content:space-between;border-top:1px solid #BFD9B5;margin-top:4px;padding-top:4px"><b>You’d have kept</b><b class="grn">$13.98</b></div></div>
        <div class="mm" style="margin-bottom:9px">Plus $20 off Premium meals, every box. Cancel anytime.</div>
        <button class="btn grnb sm" data-a="p_open:home_card">Join for $24.99 / 4 weeks</button>
        <div class="mm" style="font-size:10px;margin-top:6px">Shown only to prospects who paid shipping on ≥2 of the last 4 boxes or order Premium.</div></div>`}
      <div class="card" style="display:flex;gap:10px;align-items:center"><img src="${IMG}meal1.jpg" style="width:52px;height:52px;border-radius:8px"><div><b>Roasted Garlic Chicken</b><div class="mm">+ 3 more meals</div></div></div>
      <div class="card mm">Supplements · Berry Street · …</div></div>${tabbar(S, 'home')}`;
  },
  benefits(S) {
    return SB + `<div class="content">
      <div class="big" style="margin:4px 0 12px">Your benefits</div>
      <div class="card"><b>Welcome offer</b><div class="mm">Box 1 50% off · Box 2 10% off · Box 3 coming soon</div></div>
      ${S.member ? `<div class="card hl"><div style="display:flex;gap:7px;align-items:center"><span class="fp g">F+</span><b>Factor Plus</b><span class="grn" style="margin-left:auto;font-size:11px">Active</span></div>
        <div class="ben"><span class="ok">✓</span>Free shipping, every box<span class="v grn">−$12.99</span></div>
        <div class="ben"><span class="ok ${S.variant === 'trial' ? 'off' : ''}">✓</span>$20 off Premium meals, every box<span class="v ${S.variant === 'trial' ? 'mm' : 'grn'}">${S.variant === 'trial' ? 'after trial' : money(credit(S).rem) + ' left'}</span></div></div>` :
      `<div class="card hl"><div style="display:flex;justify-content:space-between;align-items:center"><span class="fp g">F+</span><span class="grn" style="font-size:10.5px;background:var(--mint);padding:2px 7px;border-radius:5px">Available to you</span></div>
        <div class="mm" style="margin-top:6px">Factor Plus</div><div class="big" style="font-size:17px">−$12.99 on your next box</div>
        <div class="mm" style="margin:4px 0 7px">Pays for itself in 2 boxes · cancel anytime</div>
        <div class="ben"><span class="ok">✓</span>Free shipping, every box<span class="v grn">−$12.99</span></div>
        <div class="ben"><span class="ok">✓</span>$20 off Premium meals, every box<span class="v grn">up to −$20</span></div>
        <button class="btn grnb" style="margin-top:9px" data-a="p_open:benefits_card">Join for $24.99 / 4 weeks</button></div>`}
      <div class="card mm">Rewards · Refer your friends · Nutrition coaching …</div></div>${tabbar(S, 'benefits')}`;
  }
};

/* ---------- shared ---------- */
const SH = {
  ordered(S) {
    return SB + `<div class="content" style="text-align:center">
      <div class="done-ic">✓</div><div class="big">Order saved</div>
      <div class="mm" style="margin:4px 0 18px">Arriving Mon, Aug 24</div>
      ${totalsInner(S)}
      <div class="card" style="text-align:left;margin-top:16px">${S.member ? `<span class="fp g">F+</span> <b>Factor Plus member</b> · shipping $0` : `<b>Not a member</b> · paid $12.99 shipping`}</div>
      <button class="btn" style="margin-top:10px" data-a="go:tracking">Track my delivery</button>
      <button class="btn out" style="margin-top:8px" data-a="reset">Start again</button></div>${tabbar(S, '')}`;
  }
};
