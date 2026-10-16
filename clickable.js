/* Controller: state, actions, notes, scoring */
const START = { cart: 'cart', post: 'post', browse: 'home', account: 'account', tracking: 'tracking', plan: 'plan', cancel: 'cancel', hub: 'hub' };
let S;
function fresh(keep) {
  const k = keep || {};
  S = { mode: k.mode || 'today', flow: k.flow || 'cart', variant: k.variant || 'paid',
    screen: START[k.flow || 'cart'], prev: null, overlay: null, plan: 'monthly', cb: false, consent: false, blocked: false,
    member: false, toast: false, taps: 0, pages: 0, atJoin: null, addOrder: [], log: [], returned: null, pulse: true, dismissed: {}, reason: 'price', annual: false };
  if (S.flow === 'hub') { S.member = true; S.plan = 'monthly'; S.addOrder = []; }
  if (S.mode === 'today' && S.flow === 'cart') S.plan = 'annual';
  if (S.flow === 'hub') S.plan = 'monthly';
  logE('start', `${S.mode} · ${S.flow}${S.mode === 'proposed' ? ' · ' + S.variant : ''}`);
}
function logE(ev, d) { S.log.unshift({ ev, d: d || '' }); }
function page(to) { if (S.screen !== to) { S.prev = S.screen; S.screen = to; if (!S.member) S.pages++; } }
function becomeMember() {
  S.member = true; S.atJoin = { taps: S.taps, pages: S.pages };
  const plan = S.mode === 'proposed' && S.variant === 'trial' ? 'trial → monthly' : S.plan;
  logE('join', plan);
}

const ACT = {
  noop() {},
  reset() { fresh({ mode: S.mode, flow: S.flow, variant: S.variant }); },
  go(x) { page(x); },
  allDone() { if (S.screen === 'cart' && !S.member && S.mode === 'today' && S.cb) return; page('ordered'); logE('order_complete', S.member ? 'member' : 'non-member'); },
  closeOverlay() { if (S.overlay && S.overlay !== 'welcome') logE('dismiss', S.overlay); S.overlay = null; S.blocked = false; },
  addMeal(id) { const i = S.addOrder.indexOf(id); if (i > -1) S.addOrder.splice(i, 1); else { S.addOrder.push(id); logE('premium_add', id); } },
  /* today */
  t_tick() { S.cb = !S.cb; logE('cart_checkbox', S.cb ? 'ticked' : 'unticked'); },
  t_seeBenefits() { logE('entry', 'cart_checkbox → join page'); page('join'); },
  t_entry(src) { logE('entry', src); page('join'); },
  t_joinPlan(p) { S.plan = p; S.overlay = 'modal'; S.consent = false; S.blocked = false; logE('plan_select', p); },
  t_plan(p) { S.plan = p; logE('plan_change', p); },
  t_consent() { S.consent = !S.consent; S.blocked = false; },
  t_join() { if (!S.consent) { S.blocked = true; logE('blocked', 'consent not ticked'); return; } becomeMember(); S.overlay = null; S.screen = 'joined'; },
  t_back() {
    if (S.member) { const to = S.flow === 'post' ? 'ordered' : (S.flow === 'cart' ? 'cart' : S.prev && S.prev !== 'join' ? S.prev : 'home'); S.screen = to; if (S.flow === 'cart') S.returned = 'manual'; logE('back', to); return; }
    page(S.prev && S.prev !== 'join' ? S.prev : START[S.flow]); },
  t_postAdd() { logE('entry', 'post-order interstitial → next step'); S.plan = 'annual'; S.consent = false; page('join'); S.overlay = 'modal'; logE('plan_preselected', 'annual (interstitial sold monthly)'); },
  t_decline() { logE('decline', 'No thanks, keep paying for shipping'); page('ordered'); },
  /* proposed */
  p_open(src) { S.pulse = false; S.plan = 'monthly'; S.overlay = 'sheet'; logE('entry', src + ' → sheet'); },
  p_plan(p) { S.plan = p; logE('plan_change', p); },
  p_join() {
    becomeMember();
    if (S.screen === 'post') { S.screen = 'ordered'; S.overlay = 'welcome'; }
    else if (S.screen === 'cancel') { S.overlay = null; S.screen = 'plan'; S.toast = true; logE('save', 'cancel deflected by Factor Plus'); }
    else { S.overlay = null; S.toast = true; if (S.screen === 'cart') S.returned = true; }
  },
  p_seeHow() { S.toast = false; S.overlay = 'welcome'; logE('welcome_view', 'from toast'); },
  p_pickPremium() { S.overlay = null; S.toast = false; S.screen = 'premium'; logE('welcome_cta', 'Pick a Premium meal'); },
  p_welcomeBack() { S.overlay = null; S.toast = false; if (S.flow === 'cart') S.screen = 'cart'; },
  p_decline() { logE('decline', 'Not now'); page('ordered'); },
  /* added moments */
  logOnly(x) { logE('tap', x); },
  p_dismiss(k) { S.dismissed[k] = true; logE('dismiss', k + ' card (frequency cap 4 wks)'); },
  reason(r) { S.reason = r; logE('cancel_reason', r); },
  cancelAnyway() { logE('cancel', 'plan deactivated'); page('cancelled'); },
  t_annual() { S.overlay = 'annual'; logE('annual_prompt', 'hub'); },
  t_annualConfirm() { S.plan = 'annual'; S.annual = true; S.overlay = null; logE('annual_switch', 'confirmed'); },
  p_annual() { S.overlay = 'annual'; logE('annual_prompt', 'hub, after 2 cycles'); },
  p_annualConfirm() { S.plan = 'annual'; S.annual = true; S.overlay = null; logE('annual_switch', 'at renewal, $0 today'); }
};

/* ---------- notes per state ---------- */
function notes() {
  const t = S.mode === 'today', o = S.overlay, s = S.screen;
  const R = x => ['r', x], G = x => ['g', x];
  if (t) {
    if (o === 'modal') return { title: 'Join modal', hint: 'Try tapping “Join Factor Plus” before ticking the consent box.', items: [
      R('“Members save on average $80 a month”: a fourth savings number with no basis given'),
      R('Annual $99 is preselected' + (S.flow === 'post' ? ', although the interstitial you just saw sold monthly at $6.25/week' : '')),
      R('“SAVE 70%” here vs “Save 67%” on the page behind it'),
      R('“Risk-free” and “nonrefundable” in the same modal; the refund is 48h and only if benefits are unused'),
      R('A required consent checkbox keeps the button disabled')] };
    const m = {
      cart: S.member ? { title: 'Cart (member)', hint: 'Tap “All done!” to finish.', items: [R('You got back here, but only by tapping back yourself. Today’s flow doesn’t bring you back (teardown Q4)')] } :
        S.cb ? { title: 'Cart, box ticked', hint: 'Notice “All done!” is gone. Tap “See Factor Plus benefits”.', items: [R('Ticking the box added nothing; the order total is unchanged'), R('“All done!” has been replaced by a link out of the cart. The user can no longer finish the order from here'), R('A checkbox in a cart promises “add to my order”')] } :
        { title: 'Cart', hint: 'Tick the Factor Plus checkbox.', items: [R('“Save $12.99 & more”: hedged copy, and “more” isn’t explained'), R('The checkbox looks like it adds Factor Plus to this order')] },
      join: { title: 'Join page (page change)', hint: 'Pick a plan.', items: [R('H1 describes the product rather than the value: “Factor Plus membership”'), R('Annual is filled and labelled BEST VALUE; monthly is an outline button'), R('“Save 67%” conflicts with “70%” in the next modal'), R('4 FAQs, collapsed, with the cancel and refund answers hidden')] },
      joined: { title: 'After joining', hint: 'Tap ‹ to get back to your order.', items: [R('No welcome or teach screen: 44% of members never redeem the Premium credit'), R('You’re left on the join page, not your cart, so add-ons and meal edits may be lost'), R('Nothing tells you where the $20 credit shows up')] },
      post: { title: 'Q3 post-order interstitial', hint: 'Tap “Add Factor Plus & save $12.99” and see what the next step preselects.', items: [R('A second offer (Meal Shake) competes in the same modal'), R('“+$12.99” / “+$20.00” have plus signs, so they read as charges'), R('“New box total” without the old total'), R('“No thanks, keep paying for shipping” is mild confirmshaming'), R('“Review your plan on the next step” hands off to an annual default'), R('Naming drift: “Factor plus”, “premium upgrades / wk”')] },
      home: { title: 'Home / My Menu', hint: 'Scroll to the bottom to find the Factor Plus bar.', items: [R('The Factor Plus bar sits below supplements and Berry Street, under the fold'), R('“up to $20” hedges the claim'), R('Outline button, so it reads as low priority')] },
      premium: { title: 'Premium tab', hint: S.member ? 'Add a Premium meal. Is the member price shown?' : 'Tap the banner, or add a meal.', items: [R('Tiles show the full surcharge; the member price is never shown'), R('The banner says “Save $20” but not how or where'), R(S.member ? 'Even as a member you don’t see the credit applied here' : 'Prospects see no nudge on the tile itself')] },
      benefits: { title: 'Benefits page', hint: 'Tap either Factor Plus card.', items: [R('Framed as LOCKED, with lock icons: a benefit withheld, not gained'), R('“Free standard shipping” is a fourth name for the shipping benefit'), R('No number and no reason to act now'), R('A duplicate Factor Plus card below')] },
      account: { title: 'Account / Manage subscriptions', hint: 'Open “Your delivery”, “Plan settings”, or tap Join Membership.', items: S.member ? [R('No savings figure anywhere. The member can’t see what Factor Plus has done for them')] : [R('Factor Plus is listed as an “available subscription” with no number and no reason to join now'), R('No look-back: we know exactly what this customer paid in shipping and don’t show it (Swiggy, Thrive and Gopuff all do)'), R('“Join Membership” leads to the 5-tap flow')] },
      tracking: { title: 'Delivery tracking', hint: 'Notice there’s no Factor Plus message here.', items: [R('Missed moment: the highest-attention screen of the week (Uber Eats, Deliveroo, Gojek and Skip all use tracking for offers)'), R('Shipping is shown as a cost on the box that’s arriving, and nothing connects it to the next one'), R('No “make your next box ship free” prompt')] },
      plan: { title: 'Plan settings', hint: 'Notice that shipping is a fixed line, then tap “Deactivate your plan”.', items: [R('Shipping $12.99 is shown as an unavoidable cost on the weekly total'), R('No member-price alternative on the place the customer goes to change price (Angi and Gopuff show member price as an option right here)')] },
      cancel: { title: 'Cancel deflection', hint: 'Try “Cancel anyway”.', items: [R('“Too expensive?” only offers a smaller plan, which cuts revenue. It never offers Factor Plus, which lowers the price per box and keeps the plan size'), R('Same three cards whatever the reason'), R('Free add-ons are the only benefit mentioned')] },
      hub: { title: 'Factor Plus hub (member)', hint: 'Tap “Switch to Annual Plan”.', items: [R('No savings this cycle (Uber One, Wolt, Walmart+, Gopuff all lead with it)'), R('Annual upsell is a plain button with no proof the member has got value first'), R('Benefit copy repeats the generic pitch, not this member’s usage')] },
      cancelled: { title: 'Plan deactivated', hint: 'Compare with Proposed: pick “Too expensive” on the cancel screen.', items: [R('Lost the customer; Factor Plus was never offered as a cheaper way to stay')] },
      ordered: { title: 'Order complete', hint: 'Compare the scorecard with the Proposed mode.', items: [R(S.member ? 'Joined, but via ' + (S.atJoin ? S.atJoin.taps : '?') + ' taps and ' + (S.atJoin ? S.atJoin.pages : '?') + ' page change(s)' : 'Didn’t join; paid $12.99 shipping')] }
    };
    return m[s] || { title: s, items: [] };
  }
  if (o === 'sheet') return { title: 'Join sheet (over the current page)', hint: S.variant === 'trial' ? 'Tap “Start free trial”.' : 'Try switching plans, then tap Join.', items: S.variant === 'trial' ? [
      G('Variant B: 2 boxes of free shipping; the $20 Premium credit starts after the first paid cycle (Grubhub model)'), G('A timeline shows today, the reminder date and the first charge'), G('Trial cost is capped at 2 × $12.99 per trialist'), ['f', 'P&L-gated: ship only if trial-to-paid ≥50%']] : [
      G('Opens over the page you’re on, so the cart or menu is still visible behind it'), G('One claim, shipping first: “Save $12.99 on this box · pays for itself in 2 boxes”'),
      G('Monthly is the default; annual is one tap away, “save 70%” (the correct figure)'), G('The button states the price and the outcome; “By tapping Join…” replaces the consent box'), ['f', 'Legal check (Q2): is the consent checkbox required under state auto-renewal laws?']] };
  if (o === 'annual') return { title: 'Annual at renewal', hint: 'Confirm or keep monthly.', items: [G('$0 today; $99 is charged on the renewal date'), G('Shows the year’s maths: $99 vs 13 × $24.99'), G('Sequenced: annual only after 2 paid cycles with benefits used (monthly first, annual later, per the teardown)')] };
  if (o === 'welcome') return { title: 'Welcome screen', hint: 'Tap “Pick a Premium meal”.', items: [G('Three lines: what you get, when it starts, where to look'), G('The main button goes straight to Premium meals, so the first redemption happens in the same session'), G('Targets 44% → ≤30% zero-Premium-redemption within 4 boxes')] };
  const m = {
    cart: S.member ? { title: 'Back in the cart', hint: S.toast ? 'Tap “See how” in the toast, or “All done!”.' : 'Tap “All done!”.', items: [G('You never left the cart'), G('Shipping now shows $0 and the total has been recalculated'), G('“All done!” is still there; the order flow isn’t interrupted'), G('“See how” opens the welcome screen')] } :
      { title: 'Cart', hint: 'Tap the Factor Plus toggle.', items: [G('A toggle, not a checkbox that navigates away; it opens a sheet over the cart'), G('One claim with its basis: $12.99 shipping, pays for itself in 2 boxes'), G('“All done!” stays visible the whole time')] },
    post: { title: 'Proposed interstitial', hint: 'Tap Join, or “Not now”.', items: [G('One offer per modal; Meal Shake moves elsewhere'), G('“−$12.99”, not “+$12.99”'), G('The old total is struck through next to the new one'), G('Joins here on the plan shown, with no hand-off to an annual default'), G('Neutral decline: “Not now”'), ['f', 'A/B the decline copy against “keep paying for shipping”']] },
    home: { title: 'Home (targeted prospect)', hint: 'Tap “Join for $24.99 / 4 weeks”.', items: [G('Above the fold, but only for prospects who paid shipping on ≥2 of the last 4 boxes or order Premium'), G('A personal look-back, maths shown: shipping paid − membership = what you’d have kept'), ['f', 'Data check: do we have ≥3 recent boxes per prospect?']] },
    premium: S.member ? { title: 'Premium tab (member)', hint: 'Add the Filet, then the Shrimp, and watch the credit meter.', items: [G('A credit meter shows how much of the $20 is left on this box'), G('Tiles show the price after the credit (“$0”), not the surcharge'), G('This is where the 44% zero-redemption gets fixed')] } :
      { title: 'Premium tab (prospect)', hint: 'Tap “$0 with Factor Plus ›” on a tile.', items: [G('Every tile carries a nudge in context: “$0 with Factor Plus”'), G('It opens the same join sheet as every other entry point')] },
    benefits: { title: 'Benefits page', hint: S.member ? 'Your benefits, live.' : 'Tap Join.', items: S.member ? [G('Shows active benefits and the credit left')] : [G('Framed as a gain: “−$12.99 on your next box”, not LOCKED'), G('The same claim, names and sheet as every other surface'), G('The duplicate card is removed')] },
    account: S.member ? { title: 'Account (member)', hint: 'Tap the Factor Plus card.', items: [G('Savings this cycle sits at the top of Account (Uber One, Wolt and Walmart+ pattern)')] } :
      { title: 'Account: personal look-back', hint: 'Tap Join.', items: [G('NEW · Uses the customer’s own shipping charges: $51.96 paid over 4 boxes vs $24.99 for Factor Plus'), G('Pattern: Swiggy (“₹538 saved with previous plan”), Thrive Market and Gopuff show savings in Account'), G('It’s on a surface the user already visits; there’s no interruption in checkout'), ['f', 'Data check: realised shipping per prospect for the last 4 weeks']] },
    tracking: S.member ? { title: 'Delivery tracking (member)', hint: 'Go to Account → Factor Plus.', items: [G('Reinforces value on the day the box arrives: “This box shipped free”')] } :
      { title: 'Delivery tracking: next box free', hint: 'Tap Join, or “Not now” to see the frequency cap.', items: [G('NEW · Uses the highest-attention moment of the week (Uber Eats, Deliveroo, Gojek and Skip all do)'), G('Framed on the next box: “Your Aug 31 box will cost $12.99 to ship”'), G('Outside checkout, so it can’t repeat the in-funnel test’s −5% activation loss'), G('“Not now” hides it for 4 weeks (frequency cap)')] },
    plan: S.member ? { title: 'Plan settings (member)', hint: 'Shipping shows $0.', items: [G('The weekly total now shows the member price')] } :
      { title: 'Plan settings: member price as an option', hint: 'Tap the Factor Plus row.', items: [G('NEW · Member price shown where the customer manages cost: “With Factor Plus: $69.96 / week”'), G('Pattern: Angi (“Key member price” vs regular price), Gopuff (“$0.00 with FAM”)'), G('Shows the 4-week maths, not just the headline')] },
    cancel: { title: 'Cancel: reason-routed save', hint: S.reason === 'price' ? 'Tap “Keep my plan, add Factor Plus”, or try another reason.' : 'Switch the reason to “Too expensive”.', items: [G('NEW · Ask the reason first, then show the one option that fits'), G('“Too expensive” → Factor Plus keeps the plan size and lowers the cost per box ($26.97 saved every 4 weeks). Today we offer a smaller plan, which cuts revenue'), G('Only shown to customers ordering ≥2 boxes in 4 weeks, so the maths is true'), ['f', 'Guardrail: save-rate vs today’s “switch plans”, and 8-wk AOR of saved customers']] },
    hub: S.annual ? { title: 'Hub: annual confirmed', hint: 'Done.', items: [G('Plain confirmation, no pre-confirm success tick')] } :
      { title: 'Member hub: savings + annual', hint: 'Tap “Switch at renewal”.', items: [G('NEW · Savings this cycle with a “pays for itself” meter (Uber One, Wolt, Gopuff)'), G('Remaining Premium credit with a button to use it'), G('NEW · Annual offered only after 2 paid cycles, using the member’s own savings as proof ($51.96 saved)'), G('$0 today, switch at renewal')] },
    cancelled: { title: 'Plan deactivated', hint: 'Restart and pick “Too expensive” to see the save.', items: [G('Reason was logged, so the save offer can be tuned per reason')] },
    ordered: { title: 'Order complete', hint: 'Compare the scorecard with Today mode.', items: [G(S.member && S.atJoin ? 'Joined in ' + S.atJoin.taps + ' taps and ' + S.atJoin.pages + ' page change(s)' : S.member ? 'Already a member' : 'Declined; the order still went through cleanly')] }
  };
  return m[s] || { title: s, items: [] };
}

/* ---------- render ---------- */
function render() {
  const lib = S.mode === 'today' ? T : P;
  const scr = (lib[S.screen] || SH[S.screen] || SH.ordered)(S);
  const cream = ['benefits', 'home', 'join', 'joined', 'account', 'tracking', 'plan', 'cancel', 'hub'].includes(S.screen) ? 'cream' : '';
  let ov = '';
  if (S.overlay) {
    const fn = S.overlay === 'modal' ? T.ov_modal : S.overlay === 'sheet' ? P.ov_sheet : S.overlay === 'annual' ? (S.mode === 'today' ? T.ov_annual : P.ov_annual) : P.welcome;
    ov = `<div class="dim" data-a="closeOverlay"></div>${fn(S)}`;
  }
  const toast = S.toast && !S.overlay ? `<div class="toast"><span class="fp g">F+</span><div><b>You’re a Factor Plus member.</b><br>Shipping is $0 from this box.</div><button class="link" style="margin-left:auto" data-a="p_seeHow">See how</button></div>` : '';
  document.getElementById('phone').innerHTML = `<div class="scr ${cream}">${scr}${ov}${toast}</div><div class="home-ind"></div>`;

  const n = notes();
  const tag = S.mode === 'today' ? '<span class="tag">Today</span>' : '<span class="tag p">Proposed</span>';
  document.getElementById('side').innerHTML = `${tag}<h2>${n.title}</h2>
    ${n.hint ? `<div class="hint">👉 ${n.hint}</div>` : ''}
    <ul class="notes">${n.items.map((it, i) => it[0] === 'f' ? `<li style="background:#FFF8E6;border-color:#F0D58C"><span class="flag">Open</span><span>${it[1]}</span></li>` :
      `<li class="${it[0] === 'g' ? 'g' : ''}"><span class="dotp">${i + 1}</span><span>${it[1]}</span></li>`).join('')}</ul>
    <h4 style="margin:16px 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)">Event log (what we’d track)</h4>
    <div class="log">${S.log.map(l => `<div><b>${l.ev}</b> ${l.d}</div>`).join('')}</div>`;

  const j = S.atJoin;
  document.getElementById('score').innerHTML = `
    <div class="${j ? 'done' : ''}"><b>${j ? j.taps : S.taps}</b><span>${j ? 'taps to member ✓' : 'taps so far'}</span></div>
    <div class="${j ? 'done' : ''}"><b>${j ? j.pages : S.pages}</b><span>page changes${j ? ' to member' : ''}</span></div>
    <div><b style="font-size:15px">${S.member ? (S.mode === 'proposed' && S.variant === 'trial' && S.flow !== 'hub' ? 'Trial, $0 today' : S.plan === 'annual' ? '$99 annual' : '$24.99 / 4 wks') : '—'}</b><span>${S.flow === 'hub' ? 'plan (member start: monthly)' : 'plan joined'}</span></div>
    <div><b style="font-size:15px">${S.flow !== 'cart' ? 'n/a' : S.returned === null ? (S.member ? 'No' : '—') : S.returned === 'manual' ? 'Only via ‹ back' : 'Yes, automatically'}</b><span>back in cart after join</span></div>`;
  document.querySelectorAll('[data-mode]').forEach(b => b.classList.toggle('on', b.dataset.mode === S.mode));
  document.querySelectorAll('[data-flow]').forEach(b => b.classList.toggle('on', b.dataset.flow === S.flow));
  document.querySelectorAll('[data-variant]').forEach(b => { b.classList.toggle('on', b.dataset.variant === S.variant); b.disabled = S.mode === 'today'; b.style.opacity = S.mode === 'today' ? .45 : 1; });
}

document.addEventListener('click', e => {
  const c = e.target.closest('[data-mode],[data-flow],[data-variant],#reset');
  if (c) {
    if (c.id === 'reset') ACT.reset();
    else if (c.dataset.mode) fresh({ mode: c.dataset.mode, flow: S.flow, variant: S.variant });
    else if (c.dataset.flow) fresh({ mode: S.mode, flow: c.dataset.flow, variant: S.variant });
    else if (c.dataset.variant && S.mode === 'proposed') fresh({ mode: S.mode, flow: S.flow, variant: c.dataset.variant });
    render(); return;
  }
  const a = e.target.closest('#phone [data-a]');
  if (!a) return;
  const [name, arg] = a.dataset.a.split(':');
  if (!ACT[name]) return;
  if (!['noop', 'reset'].includes(name) && !S.member) S.taps++;
  ACT[name](arg);
  render();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && S.overlay) { ACT.closeOverlay(); render(); } });
/* deep link: #mode=proposed&flow=cart&variant=paid&steps=p_open:cart_toggle,p_join */
(function () {
  const h = new URLSearchParams(location.hash.slice(1));
  fresh({ mode: h.get('mode') || 'today', flow: h.get('flow') || 'cart', variant: h.get('variant') || 'paid' });
  (h.get('steps') || '').split(',').filter(Boolean).forEach(st => { const [n, a] = st.split(':'); if (ACT[n]) { if (!S.member) S.taps++; ACT[n](a); } });
  render();
})();
