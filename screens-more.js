/* More upsell moments: Account, delivery tracking, plan settings, cancel, member hub (annual), credit nudge */
function acctHead(S) {
  return `<div style="display:flex;align-items:center;gap:10px;margin:4px 0 14px"><div style="width:44px;height:44px;border-radius:50%;background:var(--sand);display:flex;align-items:center;justify-content:center;font-weight:800">V</div>
  <div><b style="font-size:16px">Vimal</b><div class="mm">Customer since Jun 2026 · 4 boxes</div></div></div>`;
}
function acctRows() {
  const r = (ic, l, s, a) => `<div class="ben" data-a="${a}" style="padding:11px 0"><span style="font-size:16px">${ic}</span><div><b>${l}</b>${s ? `<div class="mm">${s}</div>` : ''}</div><span style="margin-left:auto">›</span></div>`;
  return `<div class="card" style="padding:4px 13px">${r('📦', 'Your delivery', 'Arriving today, Mon Aug 24', 'go:tracking')}${r('🗓', 'Plan settings', '4 meals · Chef’s Choice', 'go:plan')}${r('🧾', 'Order history', '', 'logOnly:order_history')}${r('🔔', 'Notifications', '', 'logOnly:notifications')}</div>`;
}
function trackBody(S, extra) {
  const st = ['Packed', 'Shipped', 'Out for delivery', 'Delivered'];
  return SB + hdr('Your delivery', '', 'go:account') + `<div class="content">
    <div class="big">Arriving today</div><div class="mm">Mon, Aug 24 · 8:00 AM – 8:00 PM · FedEx</div>
    <div class="tl" style="margin:14px 0 12px">${st.map((x, i) => `<div><div class="d ${i < 3 ? 'f' : ''}"></div>${i === 2 ? '<b>' + x + '</b>' : x}</div>`).join('')}</div>
    <div class="card"><b>4 meals in this box</b><div style="display:flex;gap:6px;margin-top:8px">${['meal1', 'meal2', 'meal3', 'meal4'].map(m => `<img src="${IMG}${m}.jpg" style="width:52px;height:52px;border-radius:8px">`).join('')}</div>
      <div class="tot" style="margin-top:8px"><div class="r"><span>Shipping on this box</span><span>${S.member ? '<span class="strike">$12.99</span> <span class="grn">$0.00</span>' : '$12.99'}</span></div></div></div>
    ${extra || ''}
    <div class="card"><b>Next week’s menu is live</b><div class="mm" style="margin:3px 0 8px">Choose your Aug 31 meals by Wed, Aug 26</div><button class="btn out sm" data-a="go:home">Browse the menu</button></div>
    <div style="text-align:center"><button class="link" style="color:var(--ink)" data-a="go:plan">Plan settings</button></div>
  </div>${tabbar(S, 'account')}`;
}
function planBody(S, extra) {
  const ship = S.member ? '<span class="strike">$12.99</span> <span class="grn">$0.00</span>' : '$12.99';
  return SB + hdr('Plan settings', '', 'go:account') + `<div class="content">
    <div class="card"><b style="font-size:15px">Plan selection</b>
      <div style="display:flex;gap:8px;margin:10px 0"><div class="pay" style="flex:1;margin:0">Chef’s Choice ⌄</div><div class="pay" style="flex:1;margin:0">4 meals ⌄</div></div>
      <div style="background:var(--cream);border-radius:9px;padding:9px 11px" class="tot">
        <div class="r"><span>4 meals per week</span><span>$69.96</span></div>
        <div class="r"><span>Shipping ${S.member ? '<span class="fp g">F+</span>' : ''}</span><span>${ship}</span></div>
        <div class="r b"><span>Weekly total</span><span>${S.member ? '$69.96' : '$82.95'}</span></div></div>
      ${extra || ''}</div>
    <div class="card"><b>Delivery</b><div class="mm">Mondays · 8:00 AM – 8:00 PM</div></div>
    <div class="card"><b>Status</b><div class="mm" style="margin:3px 0 9px">Your subscription is active. Deactivating your plan skips your deliveries indefinitely.</div>
      <button class="btn out sm" data-a="go:cancel">Deactivate your plan</button></div></div>`;
}
function hubSaved(S) { return 25.98 + (S.variant === 'trial' ? 0 : 20 - credit(S).rem); }

Object.assign(T, {
  account(S) {
    return SB + `<div class="content">${acctHead(S)}
      <div class="card"><b>Credit balance</b><div class="mm">You have $0.00 of credits</div></div>
      ${S.member ? `<div class="card"><div class="mm" style="font-size:10px;letter-spacing:.06em">ACTIVE · MEMBERSHIP</div><b>Factor Plus</b><div class="mm">${S.plan === 'annual' ? '$99 / year' : '$24.99 / 4 weeks'}</div><button class="btn out sm" style="margin-top:8px" data-a="go:hub">Manage membership</button></div>` :
      `<div class="card"><div class="mm" style="font-size:10px;letter-spacing:.06em">AVAILABLE SUBSCRIPTIONS · MEMBERSHIP</div><b>Factor Plus</b><div class="mm">Free shipping · $20 off premium meals per box</div>
        <button class="btn sm" style="margin-top:8px" data-a="t_entry:manage_subscriptions">Join Membership</button><button class="btn out sm" style="margin-top:6px" data-a="t_entry:more_details">More details</button></div>`}
      ${acctRows()}</div>${tabbar(S, 'account')}`;
  },
  tracking(S) { return trackBody(S, ''); },
  plan(S) { return planBody(S, ''); },
  cancel(S) {
    const c = (t, d, b, a) => `<div class="card" style="text-align:center"><b style="font-size:14px">${t}</b><div class="mm" style="margin:3px 0 9px">${d}</div><button class="btn grnb sm" data-a="${a}">${b}</button></div>`;
    return SB + hdr('Deactivate plan', '', 'go:plan') + `<div class="content">
      <div class="big" style="text-align:center;margin:4px 0 12px">Hold up! You still have benefits to use.</div>
      <div class="card" style="background:var(--mint)"><b>Free add-ons for life</b><div class="mm" style="color:var(--ink);margin:3px 0 8px">2 free add-ons per box with an active subscription</div><button class="btn grnb sm" data-a="go:benefits">Go to benefits</button></div>
      <div class="h3" style="text-align:center">Maybe we can help!</div>
      ${c('Too expensive?', 'Choosing a smaller and cheaper plan is quick and easy!', 'Switch plans', 'logOnly:switch_plans')}
      ${c('Having issues?', 'Our customer experience team is ready to assist.', 'Contact us', 'logOnly:contact_us')}
      ${c('Need a break?', 'You can always put your deliveries on hold at no extra cost.', 'Skip a week', 'logOnly:skip_week')}
      <button class="btn out" data-a="cancelAnyway">Cancel anyway</button></div>`;
  },
  hub(S) {
    const a = S.plan === 'annual';
    return SB + hdr('Factor Plus', '', 'go:account') + `<div class="content">
      <div class="card"><b style="letter-spacing:.04em">FACTOR_PLUS</b> <span class="grn" style="font-size:11px">Active</span>
        <div style="font-size:17px;font-weight:800;margin-top:6px">${a ? '$99 / year' : '$24.99 / 4 weeks'}</div><div class="mm">${a ? 'Annual from Nov 2' : 'Renews Nov 2'}</div></div>
      <div class="card"><b>Your benefits</b>
        <div class="ben"><span class="ok">✓</span><div><b>Free shipping on all orders</b><div class="mm">Save $12.99 per week on delivery fees</div></div></div>
        <div class="ben"><span class="ok">✓</span><div><b>$20 off premium meals per box</b><div class="mm">Exclusive discounts on Chef’s Choice and premium selections</div></div></div>
        <button class="btn out sm" style="margin-top:8px" data-a="go:benefits">View my benefits</button></div>
      ${a ? '' : `<div class="card"><b>Switch plan</b><div class="mm" style="margin:3px 0 8px">Change your billing period</div><button class="btn out sm" data-a="t_annual">Switch to Annual Plan</button></div>`}
      <div style="text-align:center"><button class="link" style="color:var(--muted)" data-a="logOnly:cancel_membership">Cancel membership</button></div></div>${tabbar(S, 'account')}`;
  },
  ov_annual(S) {
    return `<div class="sheet"><div class="grab"></div><div style="display:flex;align-items:center"><b style="font-size:15px">Switch to Annual Plan</b><span class="sx" data-a="closeOverlay">✕</span></div>
      <div class="mm" style="margin:6px 0">Current: $24.99/mo → $99/year</div>
      <div style="display:flex;gap:8px;align-items:center;background:var(--mint);border-radius:9px;padding:9px;font-weight:700"><span class="ok">✓</span>Save $226.76/year vs monthly</div>
      <div class="mm" style="margin:8px 0 12px">Takes effect 2 Nov</div>
      <button class="btn" data-a="t_annualConfirm">Confirm</button><button class="btn out sm" style="margin-top:7px" data-a="closeOverlay">Keep current plan</button></div>`;
  }
});

Object.assign(P, {
  account(S) {
    const saved = hubSaved(S);
    return SB + `<div class="content">${acctHead(S)}
      ${S.member ? `<div class="card hl" data-a="go:hub"><div style="display:flex;gap:7px;align-items:center"><span class="fp g">F+</span><b>Factor Plus</b><span class="grn" style="margin-left:auto;font-size:11px">Active</span></div>
        <div style="font-size:17px;font-weight:800;margin-top:6px">${money(saved)} saved this cycle</div><div class="mm">vs $24.99 fee · tap to manage</div></div>` :
      `<div class="card hl"><div style="display:flex;gap:7px;align-items:center"><span class="fp g">F+</span><b>Your shipping so far</b></div>
        <div style="background:var(--mint-2);border-radius:9px;padding:9px;margin:9px 0;font-size:11.5px">
          <div style="display:flex;justify-content:space-between"><span>Shipping you paid since Jul 27 (4 boxes)</span><b>$51.96</b></div>
          <div style="display:flex;justify-content:space-between"><span>Factor Plus over the same 4 weeks</span><b>$24.99</b></div>
          <div style="display:flex;justify-content:space-between;border-top:1px solid #BFD9B5;margin-top:4px;padding-top:4px"><b>You’d have kept</b><b class="grn">$26.97</b></div></div>
        <button class="btn grnb sm" data-a="p_open:account_savings">Join for $24.99 / 4 weeks</button></div>`}
      ${acctRows()}<div class="card"><b>Credit balance</b><div class="mm">You have $0.00 of credits</div></div></div>${tabbar(S, 'account')}`;
  },
  tracking(S) {
    let x;
    if (S.member) x = `<div class="card hl"><span class="fp g">F+</span> <b>This box shipped free</b><div class="mm">Factor Plus saved you $12.99 today · ${money(hubSaved(S))} this cycle</div></div>`;
    else if (S.dismissed && S.dismissed.tracking) x = `<div class="mm" style="text-align:center;margin-bottom:10px">Factor Plus card dismissed · hidden for 4 weeks</div>`;
    else x = `<div class="card hl"><div style="display:flex;gap:7px;align-items:center"><span class="fp g">F+</span><b>Make your next box ship free</b></div>
      <div class="mm" style="margin:4px 0 9px">Your Aug 31 box will cost $12.99 to ship. With Factor Plus it’s $0 · $24.99 / 4 weeks, pays for itself in 2 boxes.</div>
      <button class="btn grnb sm" data-a="p_open:delivery_tracking">Join for $24.99 / 4 weeks</button>
      <div style="text-align:center;margin-top:7px"><button class="link" style="color:var(--muted)" data-a="p_dismiss:tracking">Not now</button></div></div>`;
    return trackBody(S, x);
  },
  plan(S) {
    const x = S.member ? `<div class="mm" style="margin-top:8px"><span class="fp g">F+</span> Factor Plus covers your shipping · $24.99 / 4 weeks billed separately</div>` :
      `<div class="cb" data-a="p_open:plan_settings" style="margin:10px 0 0"><span class="fp g">F+</span><div>With Factor Plus: <span class="grn">$69.96 / week</span><div class="mm" style="font-weight:400">Shipping $0 · plus $24.99 every 4 weeks · you keep $26.97 every 4 weeks on this plan</div></div><div class="tgl"></div></div>`;
    return planBody(S, x);
  },
  cancel(S) {
    const R = S.reason || 'price';
    const chip = (k, l) => `<button class="add ${R === k ? 'on' : ''}" style="margin:0 6px 6px 0" data-a="reason:${k}">${l}</button>`;
    let main;
    if (R === 'price' && !S.member) main = `<div class="card hl"><b style="font-size:14px">Keep your 4 meals and take $12.99 off every box</b>
        <div style="background:var(--mint-2);border-radius:9px;padding:9px;margin:9px 0;font-size:11.5px">
          <div style="display:flex;justify-content:space-between"><span>Shipping, your next 4 boxes</span><span><span class="strike">$51.96</span> <b>$0</b></span></div>
          <div style="display:flex;justify-content:space-between"><span>Factor Plus, 4 weeks</span><b>+$24.99</b></div>
          <div style="display:flex;justify-content:space-between;border-top:1px solid #BFD9B5;margin-top:4px;padding-top:4px"><b>You save every 4 weeks</b><b class="grn">$26.97</b></div></div>
        <button class="btn grnb sm" data-a="p_open:cancel_save">Keep my plan, add Factor Plus</button>
        <div class="mm" style="font-size:10px;margin-top:6px">Shown only when price is the reason and you’ve ordered ≥2 boxes in the last 4 weeks.</div></div>
        <div class="card"><b>Or skip next week</b><div class="mm" style="margin:3px 0 8px">No charge, no box. Come back when you’re ready.</div><button class="btn out sm" data-a="logOnly:skip_week">Skip Aug 31</button></div>`;
    else if (R === 'break') main = `<div class="card hl"><b>Pause instead of cancelling</b><div class="mm" style="margin:3px 0 8px">Skip up to 4 weeks. Nothing is charged while you’re paused.</div><button class="btn grnb sm" data-a="logOnly:pause">Pause for 2 weeks</button></div>`;
    else if (R === 'meals') main = `<div class="card hl"><b>Too much food?</b><div class="mm" style="margin:3px 0 8px">Order every other week instead.</div><button class="btn grnb sm" data-a="logOnly:biweekly">Switch to every 2 weeks</button></div>`;
    else main = `<div class="card hl"><b>Tell us what went wrong</b><div class="mm" style="margin:3px 0 8px">We’ll credit any box that didn’t meet the bar.</div><button class="btn grnb sm" data-a="logOnly:contact_us">Contact us</button></div>`;
    return SB + hdr('Deactivate plan', '', 'go:plan') + `<div class="content">
      <div class="big" style="margin:4px 0 4px">Before you go, what’s the main reason?</div><div class="mm" style="margin-bottom:10px">We’ll show the option that fits.</div>
      <div style="display:flex;flex-wrap:wrap">${chip('price', 'Too expensive')}${chip('meals', 'Too many meals')}${chip('break', 'Taking a break')}${chip('quality', 'Meal quality')}</div>
      ${main}<button class="btn out" data-a="cancelAnyway">Cancel anyway</button></div>`;
  },
  hub(S) {
    const saved = hubSaved(S), a = S.plan === 'annual', rem = credit(S).rem;
    return SB + hdr('Factor Plus', '', 'go:account') + `<div class="content">
      <div class="card hl"><div class="mm">This cycle · Oct 5 – Nov 2</div><div style="font-size:24px;font-weight:800;letter-spacing:-.02em">${money(saved)} saved</div>
        <div class="meter" style="background:var(--sand)"><i style="width:${Math.min(100, saved / 24.99 * 100)}%"></i></div>
        <div class="mm" style="margin-top:5px">${saved >= 24.99 ? '<span class="grn">✓ Factor Plus has paid for itself this cycle</span>' : money(24.99 - saved) + ' to go before it pays for itself'} · $51.96 since Sep 7</div></div>
      <div class="card"><b>Your benefits</b>
        <div class="ben"><span class="ok">✓</span>Free shipping, every box<span class="v grn">−$12.99</span></div>
        <div class="ben"><span class="ok">✓</span>$20 off Premium meals, every box<span class="v grn">${money(rem)} left</span></div>
        ${rem > 0 ? `<button class="btn out sm" style="margin-top:8px" data-a="go:premium">Use my Premium credit</button>` : ''}</div>
      ${a ? `<div class="card"><span class="grn">✓</span> <b>Annual from Nov 2</b><div class="mm">You stay on monthly until then; $99 is charged on Nov 2.</div></div>` :
      `<div class="card hl"><b>You’ve saved $51.96 in 2 cycles</b><div class="mm" style="margin:4px 0 9px">Switch to annual for $99 / year. That’s $225.87 less than 13 monthly payments (13 × $24.99).</div>
        <button class="btn grnb sm" data-a="p_annual">Switch at renewal</button><div class="mm" style="font-size:10px;margin-top:6px">No charge today. Shown only after 2 paid cycles with benefits used.</div></div>`}
      <div class="card"><b>${a ? '$99 / year' : '$24.99 / 4 weeks'}</b><div class="mm">Renews Nov 2 · PayPal</div><div style="margin-top:6px"><button class="link" style="color:var(--muted)" data-a="logOnly:cancel_membership">Cancel membership</button></div></div></div>${tabbar(S, 'account')}`;
  },
  ov_annual(S) {
    return `<div class="sheet"><div class="grab"></div><div style="display:flex;align-items:center;gap:7px"><span class="fp g">F+</span><b>Switch to annual at renewal</b><span class="sx" data-a="closeOverlay">✕</span></div>
      <div class="tot" style="margin:10px 0"><div class="r"><span>Today</span><b>$0</b></div><div class="r"><span>Nov 2 (covers to Nov 2027)</span><b>$99.00 + tax</b></div>
        <div class="r"><span class="mm">Monthly over the same year</span><span class="strike">$324.87</span></div><div class="r b"><span>You save</span><span class="grn">$225.87</span></div></div>
      <button class="btn grnb" data-a="p_annualConfirm">Confirm switch</button><button class="btn out sm" style="margin-top:7px;border-color:var(--line)" data-a="closeOverlay">Keep monthly</button>
      <div class="legal">By tapping Confirm, you agree to a $99 annual charge (+ tax) on Nov 2 that auto-renews yearly until you cancel. Change back anytime before Nov 2.</div></div>`;
  }
});

SH.cancelled = S => SB + `<div class="content" style="text-align:center"><div class="done-ic" style="background:var(--sand);color:var(--ink)">⏸</div>
  <div class="big">Your plan is deactivated</div><div class="mm" style="margin:4px 0 18px">No more deliveries until you reactivate.</div>
  <button class="btn out" data-a="reset">Start again</button></div>`;
