/* Factor Plus acquisition — clickable prototype: screen templates
   T = today (current product + Q3 design), P = proposed, SH = shared */
const IMG = 'assets/';
const SB = '<div class="sb">9:41<i>●●● ᯤ ▮</i></div>';
const money = n => '$' + n.toFixed(2);

function hdr(title, sub, act) {
  return `<div class="ch"><span class="x" data-a="${act || 'noop'}">${act && act !== 'noop' ? '‹' : '✕'}</span>
  <div class="t"><b>${title}</b>${sub ? `<div>${sub}</div>` : ''}</div></div>`;
}
const MEALS = [['meal1.jpg', 'Roasted Garlic Chicken'], ['meal2.jpg', 'Nonna’s Sunday Beef Bolognese'],
  ['meal3.jpg', 'Cavatappi &amp; Meatballs'], ['meal4.jpg', 'Smoky Tomato Chicken']];
function meals() {
  return MEALS.map(m => `<div class="meal"><img src="${IMG}${m[0]}"><div class="n">${m[1]}</div>
  <div class="step"><span>−</span><span>1</span><span>+</span></div></div>`).join('');
}
function planLabel(S) {
  if (S.mode === 'proposed' && S.variant === 'trial') return 'Free trial: $0 shipping on 2 boxes, then $24.99 every 4 weeks';
  return S.plan === 'annual' ? '$99 / year (+ tax)' : '$24.99 every 4 weeks (+ tax)';
}
function totalsInner(S) {
  const sub = S.flow === 'post' ? 86.94 : 69.96, n = S.flow === 'post' ? 6 : 4;
  const ship = S.member ? `<span class="strike">$12.99</span> <span class="grn">$0.00</span>` : '$12.99';
  const tot = S.member ? `<span class="strike">${money(sub + 12.99)}</span> ${money(sub)}` : money(sub + 12.99);
  return `<div class="tot"><div class="r"><span>${n} meals</span><span>${money(sub)}</span></div>
  <div class="r"><span>Shipping ${S.member ? '<span class="fp g">F+</span>' : ''}</span><span>${ship}</span></div>
  <div class="r b"><span>Total</span><span>${tot}</span></div>
  ${S.member ? `<div class="mm" style="margin-top:4px">Factor Plus (${planLabel(S)}) is billed separately.</div>` : ''}</div>`;
}
function tabbar(S, on) {
  const t = (id, ic, l) => `<div class="${on === id ? 'on' : ''}" data-a="${on === id ? 'noop' : 'go:' + id}"><i>${ic}</i>${l}</div>`;
  return `<div class="tabbar">${t('home', '🍽', 'My Menu')}${t('premium', '⭐', 'Premium')}${t('benefits', '🎁', 'Benefits')}${t('account', '👤', 'Account')}</div>`;
}

/* ---------- premium meals + credit ---------- */
const PREM = [
  { id: 'filet', img: 'filet.jpg', name: 'Truffle Butter Filet Mignon', s: 12.99, big: true },
  { id: 'shrimp', img: 'meal3.jpg', name: 'Garlic Butter Shrimp', s: 6.99 },
  { id: 'chicken', img: 'meal1.jpg', name: 'Truffle Roasted Chicken', s: 4.99 }
];
function credit(S) {
  let rem = 20; const pay = {};
  S.addOrder.forEach(id => { const m = PREM.find(x => x.id === id); const a = Math.min(rem, m.s); rem -= a; pay[id] = m.s - a; });
  return { rem: Math.max(0, rem), pay };
}
function premTiles(S) {
  const c = credit(S);
  return PREM.map(m => {
    const added = S.addOrder.includes(m.id);
    let price;
    if (S.mode === 'today' || !S.member) {
      price = `<b>+${money(m.s)}</b><span class="mm">per serving</span>`;
      if (S.mode === 'proposed') price += `<button class="link" style="margin-left:auto" data-a="p_open:premium_tile">$0 with Factor Plus ›</button>`;
    } else {
      const p = added ? c.pay[m.id] : Math.max(0, m.s - c.rem);
      price = `<span class="strike">+${money(m.s)}</span><span class="fp g">F+</span><b class="grn">${p < 0.005 ? '$0' : '+' + money(p)}</b><span class="mm">${added ? 'with your credit' : ''}</span>`;
    }
    const btn = `<button class="add ${added ? 'on' : ''}" data-a="addMeal:${m.id}">${added ? 'Added ✓' : 'Add'}</button>`;
    if (m.big) return `<div class="tile"><img src="${IMG}${m.img}"><div class="tb"><div style="display:flex;align-items:center"><span class="chip">PREMIUM</span>${S.mode === 'proposed' && S.member ? '' : ''}<span style="margin-left:auto">${btn}</span></div>
      <div class="nm">${m.name}</div><div class="pr">${price}</div></div></div>`;
    return `<div class="tile row"><img src="${IMG}${m.img}"><div style="flex:1"><span class="chip">PREMIUM</span><div class="nm" style="font-weight:800;font-size:13px">${m.name}</div>
      <div class="pr" style="display:flex;gap:6px;align-items:center;font-size:12px;flex-wrap:wrap">${price}</div></div>${btn}</div>`;
  }).join('');
}

/* ================= TODAY ================= */
const T = {
  cart(S) {
    return SB + hdr('Your cart <span class="cnt">4</span>', 'Edit delivery by Wed, Aug 19') +
      `<div class="content"><div class="h3">Meals <span class="cnt">4</span></div>${meals()}
      <div class="banner" style="background:var(--cream)">＋ Add a 5th meal for only $9.99 per serving!<span style="margin-left:auto">›</span></div>
      <div class="h3" style="margin-top:14px">Order total</div>${totalsInner(S)}</div>
      <div class="bottom">${S.member ? `<div class="cb"><span class="fp g">F+</span><div>Factor Plus member</div></div>` :
        `<div class="cb ${S.cb ? 'on' : ''}" data-a="t_tick"><div class="box ${S.cb ? 'on' : ''}">${S.cb ? '✓' : ''}</div><div>Save <span class="red">$12.99</span> &amp; more with Factor Plus on this order</div></div>`}
      ${S.cb && !S.member ? `<button class="btn" data-a="t_seeBenefits">See Factor Plus benefits</button>` : `<button class="btn" data-a="allDone">All done!</button>`}</div>`;
  },
  join(S) {
    return SB + hdr('Factor Plus', '', 't_back') +
      `<div class="content"><div class="big" style="font-size:24px;margin:4px 0 12px">Factor Plus membership</div>
      <div class="card"><div style="font-weight:700;margin-bottom:6px">Factor Plus Benefits</div>
        <div class="ben"><span class="ok">✓</span><div><b>Free shipping on all orders</b><div class="mm">Save $12.99 per week on delivery fees</div></div></div>
        <div class="ben"><span class="ok">✓</span><div><b>$20 off premium meals per box</b><div class="mm">Exclusive discounts on Chef’s Choice and premium selections</div></div></div></div>
      <div class="card" style="border:1.5px solid var(--green);position:relative;margin-top:16px">
        <span style="position:absolute;top:-9px;left:50%;transform:translateX(-50%);background:var(--green);color:#fff;font-size:9px;font-weight:800;padding:2px 7px;border-radius:4px">BEST VALUE</span>
        <div style="font-weight:700">ANNUAL</div><div style="font-size:19px;font-weight:800">$99.00</div><div class="mm">per year + tax</div>
        <div class="grn" style="font-size:11.5px;margin:4px 0 10px">$8.25 / mo • Save 67%</div>
        <button class="btn" data-a="t_joinPlan:annual">Join Annual Plan</button></div>
      <div class="card"><div style="font-weight:700">MONTHLY</div><div style="font-size:19px;font-weight:800">$24.99</div><div class="mm">per 4 weeks + tax</div>
        <button class="btn out sm" style="margin-top:10px" data-a="t_joinPlan:monthly">Join Monthly Plan</button></div>
      <div class="h3" style="margin-top:16px">FAQs</div>
      ${['When will I be charged?', 'When do my benefits activate?', 'How do I cancel?', 'What happens to unused premium benefit?']
        .map(q => `<div class="ben" style="justify-content:space-between"><b>${q}</b><span>⌄</span></div>`).join('')}</div>`;
  },
  joined(S) {
    return SB + hdr('Factor Plus', '', 't_back') +
      `<div class="content"><div class="big" style="font-size:24px;margin:4px 0 12px">Factor Plus membership</div>
      <div class="card"><div style="font-weight:700;margin-bottom:6px">Factor Plus Benefits</div>
        <div class="ben"><span class="ok">✓</span><div><b>Free shipping on all orders</b><div class="mm">Save $12.99 per week on delivery fees</div></div></div>
        <div class="ben"><span class="ok">✓</span><div><b>$20 off premium meals per box</b><div class="mm">Exclusive discounts on Chef’s Choice and premium selections</div></div></div></div>
      <div class="card mm" style="text-align:center;padding:28px 14px;border-style:dashed">The modal closed.<br>No confirmation, welcome or teach screen exists in the Figma file.<br><br>Tap ‹ to find your way back.</div></div>`;
  },
  post(S) {
    return SB + `<div class="content" style="background:#DCD8CF"></div><div class="dim" style="animation:none"></div>
      <div class="sheet" style="top:52px;animation:none">
      <div class="grab"></div>
      <div style="display:flex;gap:10px;align-items:center;background:#F3EFE6;border-radius:11px;padding:9px;margin-bottom:12px">
        <div style="width:46px;height:46px;border-radius:8px;background:#1d1d1b;color:#fff;font-size:8px;display:flex;align-items:center;justify-content:center;text-align:center;font-weight:800">MEAL<br>SHAKE</div>
        <div style="font-size:11.5px"><b>NEW! Discover Meal Shake</b><br>30g protein, 7g fiber. Member pricing available. <u data-a="noop">Shop on Factor Form</u></div></div>
      <span class="grn" style="background:var(--mint);font-size:10.5px;padding:2px 7px;border-radius:4px">Order saved</span>
      <div class="big" style="font-size:18px;margin-top:5px">Arriving on Sat, Sep 12</div>
      <div class="mm">You can make changes up until Mon, Sep 7 (3 days left)</div>
      <div style="border:1px solid #9FCB90;border-radius:11px;margin-top:12px;overflow:hidden">
        <div style="background:var(--mint);padding:9px 11px;font-weight:800;font-size:12.5px">Save $12.99 &amp; more this week with Factor plus ⌃</div>
        <div style="padding:9px 11px">
          <div class="mm">Just $6.25/week · billed $24.99 every 4 weeks · cancel anytime</div>
          <div class="ben"><span class="ok">✓</span>Free shipping, every box<span class="v grn">+$12.99</span></div>
          <div class="ben"><span class="ok">✓</span>$20 off premium upgrades / wk<span class="v grn">+$20.00</span></div>
          <div class="tot"><div class="r b"><span>New box total:</span><span>$86.94</span></div><div class="r"><b>You save today:</b><span class="grn">-$12.99</span></div></div>
          <button class="btn" style="margin-top:8px" data-a="t_postAdd">Add Factor Plus &amp; save $12.99</button>
          <button class="btn out" style="margin-top:7px" data-a="t_decline">No thanks, keep paying for shipping</button>
          <div class="mm" style="text-align:center;font-size:10.5px;margin-top:7px">No charge now · review your plan on the next step</div>
        </div></div></div>`;
  },
  premium(S) {
    return SB + `<div class="ch" style="background:var(--cream)"><span class="x" data-a="noop">✕</span><div class="t" style="text-align:left"><b style="font-size:14px">Shop for Mon, Aug 24</b></div><span data-a="go:cart">🛒</span></div>
      <div class="tabs"><span>This Week’s Menu</span><span>Top Rated</span><span class="on">Premium</span><span>My Faves</span></div>
      <div class="content"><div class="big">Premium</div><div class="mm">Craveable, restaurant-worthy meals made with premium proteins</div>
      ${S.member ? '' : `<div class="banner" data-a="t_entry:premium_banner"><span class="fp">F+</span>Save $20 on Premium Meals<span style="margin-left:auto">›</span></div>`}
      ${premTiles(S)}</div>${tabbar(S, 'premium')}`;
  },
  home(S) {
    return SB + `<div class="logo">FACTOR_</div><div class="content">
      <div class="big" style="margin-bottom:10px">My Menu · Aug 24</div>
      <div class="card" style="display:flex;gap:10px;align-items:center"><img src="${IMG}meal1.jpg" style="width:52px;height:52px;border-radius:8px"><div><b>Roasted Garlic Chicken</b><div class="mm">+ 3 more meals</div></div></div>
      <div class="card" style="height:180px;background:#E9E4D9;display:flex;align-items:flex-end"><div><b>Supplements</b><div class="mm">Shop Factor Form protein &amp; more</div></div></div>
      <div class="card" style="height:180px;background:#E3EDE6;display:flex;align-items:flex-end"><div><b>Berry Street</b><div class="mm">Personalised nutrition support</div></div></div>
      <div class="fold">⌄ fold · most users don’t scroll this far</div>
      ${S.member ? `<div class="card"><span class="fp g">F+</span> <b>Factor Plus member</b></div>` :
        `<div class="card" style="background:var(--mint)"><div style="display:flex;gap:7px;align-items:center"><span class="fp">F+</span><b>Save on every order</b></div>
        <div class="mm" style="color:var(--ink);margin:5px 0 9px">Get free shipping + up to $20 off Premium meals every week with Factor Plus.</div>
        <button class="btn out sm" data-a="t_entry:home_bar">Join Now</button></div>`}</div>${tabbar(S, 'home')}`;
  },
  benefits(S) {
    return SB + `<div class="content">
      <div class="big" style="margin:4px 0 12px">Your benefits <span class="cnt" style="background:#1e2a78;color:#fff">2</span></div>
      <div class="card"><b>Welcome offer</b><div class="mm">Box 1 50% off · Box 2 10% off · Box 3 coming soon</div></div>
      ${S.member ? `<div class="card"><span class="fp g">F+</span> <b>Factor Plus</b><div class="mm">Member</div></div>` :
        `<div class="card"><div style="display:flex;justify-content:space-between"><span style="font-size:17px">🔒</span><span class="lock">LOCKED</span></div>
        <div class="mm" style="margin-top:6px">Factor Plus</div><div class="big" style="font-size:16px">Unlock free shipping &amp; premium meals</div>
        <div class="mm" style="margin:5px 0 9px">Join Factor Plus to unlock these perks on every order.</div>
        <div class="ben"><span>📦</span><div><b>Free standard shipping</b><div class="mm">On every box</div></div><span style="margin-left:auto">🔒</span></div>
        <div class="ben"><span>🎁</span><div><b>Premium meals — $20 off</b><div class="mm">Every single week</div></div><span style="margin-left:auto">🔒</span></div>
        <button class="btn" style="margin-top:9px" data-a="t_entry:benefits_card">Join Factor Plus</button></div>
        <div class="card" data-a="t_entry:benefits_dupe" style="display:flex;justify-content:space-between;align-items:center"><div><b>Factor Plus</b><div class="mm">Join Factor Plus and save on shipping, plus unlock $20 off Premium Meals every week <u>Join Now</u></div></div></div>`}
      <div class="card mm">Rewards · Refer your friends · Nutrition coaching …</div></div>${tabbar(S, 'benefits')}`;
  },
  ov_modal(S) {
    const a = S.plan === 'annual';
    return `<div class="sheet" style="top:64px">
      <div class="grab"></div><div style="display:flex;align-items:center"><b style="letter-spacing:.04em;font-size:13px">FACTOR_PLUS</b><span class="sx" data-a="closeOverlay">✕</span></div>
      <div class="big" style="font-size:17px;margin:6px 0 12px">Members save on average $80 a month</div>
      <div class="radio ${!a ? 'on' : ''}" data-a="t_plan:monthly"><span class="rd"></span><div><b>Monthly</b> $24.99 / every 4 weeks + tax<div class="grn" style="font-size:11px">Pays for itself in 2 orders</div></div></div>
      <div class="radio ${a ? 'on' : ''}" data-a="t_plan:annual"><span class="rd"></span><div><b>Annual</b> <span class="grn" style="font-size:10px;background:var(--mint);padding:1px 5px;border-radius:4px">SAVE 70%</span><br>$99.00 / every 365 days + tax</div></div>
      <div class="pay"><span class="pp">Pay<span>Pal</span></span> vimal.g•••@gmail.com</div>
      <div style="background:var(--blue-soft);border-radius:9px;padding:9px 10px;font-size:11.5px"><b>Try it - risk-free.</b> Cancel within 48 hours for a full refund - if you haven’t used your benefits.</div>
      <div style="display:flex;gap:9px;margin:12px 0;font-size:10.5px;color:var(--muted)" data-a="t_consent"><div class="box ${S.consent ? 'on' : ''}">${S.consent ? '✓' : ''}</div>
        <div>By checking this box, I agree to the ${a ? '$99.00 annual' : '$24.99 every-4-weeks'}, <b style="color:var(--ink)">nonrefundable</b>, auto-renewing charge and the Factor Plus Terms.</div></div>
      <button class="btn ${S.consent ? '' : 'dis'}" data-a="t_join">Join Factor Plus</button>
      ${S.blocked ? '<div class="red" style="font-size:11.5px;text-align:center;margin-top:7px">Button is disabled. Tick the consent box first.</div>' : ''}
      <div class="mm" style="border-top:1px solid var(--line);margin-top:12px;padding-top:9px">Free delivery — Always $0 - you save $12.99 per order<br>Premium upgrades — $20.00 off every week</div></div>`;
  }
};
