/* Generated from the app plan builder (core.js) — the same schedule + edits logic the app uses. */
const START='2026-10-19', END='2026-11-30';
/* PLAN_V: bump whenever the plan builder changes task order, so ticks / edits saved for the old plan
   are not attached to different tasks of the new one (task ids are date-index). */
const PLAN_V=4;
const SUBJ={
  sft:{n:'SFT',c:'var(--sft)',full:'Science for Technology'},
  et:{n:'ET',c:'var(--et)',full:'Engineering Technology'},
  ict:{n:'ICT',c:'var(--ict)',full:'Information & Communication Technology'},
  dip:{n:'DIPLOMA',c:'var(--dip)',full:'Technology diploma'},
  hex:{n:'HEXORA',c:'var(--hex)',full:'Hexora site සහ apps'},
  asg:{n:'ASSIGNMENT',c:'var(--asg)',full:'Diploma assignments (Mini Magazine ඇතුළුව)'},
  rev:{n:'REVIEW',c:'var(--rev)',full:'Review'},
  mix:{n:'පන්ති',c:'var(--mix)',full:''}
};
const KIND={old:'පරණ වැඩ',now:'දැන් යන',cls:'පන්තිය',daily:'හැමදාම',rev:'Review',buf:'Buffer',rest:''};
const DAYS=['ඉරිදා','සඳුදා','අඟහරුවාදා','බදාදා','බ්‍රහස්පතින්දා','සිකුරාදා','සෙනසුරාදා'];
const DSH=['ඉරි','සඳු','අඟ','බදා','බ්‍රහ','සිකු','සෙන'];
const MON={1:'ජන',2:'පෙබ',3:'මාර්',4:'අප්‍රේ',5:'මැයි',6:'ජූනි',7:'ජූලි',8:'අගෝ',9:'සැප්',10:'ඔක්',11:'නොවැ',12:'දෙසැ'};
const MONF={1:'ජනවාරි',2:'පෙබරවාරි',3:'මාර්තු',4:'අප්‍රේල්',5:'මැයි',6:'ජූනි',7:'ජූලි',8:'අගෝස්තු',9:'සැප්තැම්බර්',10:'ඔක්තෝබර්',11:'නොවැම්බර්',12:'දෙසැම්බර්'};
const DAYTYPE={1:['SFT දවස','sft'],2:['ICT දවස · පන්තිය','ict'],3:['ET දවස','et'],4:['Campus දවස · Diploma','dip'],5:['Buffer දවස · ICT + Diploma පන්තිය','mix'],6:['පන්ති දවස · ET + SFT','mix'],0:['App development · Assignments','hex']};

const isoAdd=(iso,n)=>{const d=new Date(iso+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)};
const dow=iso=>new Date(iso+'T00:00:00Z').getUTCDay();
const diff=(a,b)=>Math.round((new Date(b+'T00:00:00Z')-new Date(a+'T00:00:00Z'))/864e5);
const yr=iso=>iso.slice(0,4)!=='2026'?' '+iso.slice(0,4):'';
const fmt=iso=>{const m=+iso.slice(5,7),d=+iso.slice(8,10);return MON[m]+' '+d+yr(iso)};
const fmtLong=iso=>{const m=+iso.slice(5,7),d=+iso.slice(8,10);return MONF[m]+' '+d+yr(iso)};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* 12-hour clock -> minutes after midnight ("12:30" am = 00:30, "12:30" pm = 12:30) */
function mins(t,ap){let[h,m]=t.split(':').map(Number);if(ap==='pm'&&h<12)h+=12;if(ap==='am'&&h===12)h=0;return h*60+m}
function todayISO(){try{return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Colombo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}catch(e){return new Date().toISOString().slice(0,10)}}

/* =====================================================================
   PLAN v4 · ඔක් 19 → නොවැ 30
   Wake 8:30 · sleep 1:00. Work 9:30 am – 11 pm in 3-hour blocks.
   Mon SFT · Tue ICT (+class) · Wed ET · Thu Campus · Fri ICT + buffer + Diploma class ·
   Sat ET/SFT classes + notes + Diploma class · Sun assignments + app development
   Subject day: block 1 (9:30–12:30) පරණ වැඩ · block 2 (2–5) දැන් යන වැඩ · block 3 (7–9) papers / short notes
   ===================================================================== */
const O=(ti,d)=>({ti,d,bl:1});            // backlog (පරණ වැඩ)
const N=(ti,d)=>({ti,d,k:'now'});          // current work (දැන් යන)
const R=(ti,d,s)=>Object.assign({ti,d,k:'rev'},s?{s}:{});   // check / review
const SFT_DAYS=[ // 7 Mondays: [block 1, block 2, block 3]
 [O('Unit 04 notes පොතේ සම්පූර්ණ කරන්න','පන්තියේ ඉගැන්නුව ඔක්කොම. මුලින් content එක, diagrams සහ පාට පස්සේ. Notes ඉවර නැතුව flash cards හදන්න බෑ, ඒ නිසා මේක මුලින්ම.'),
  O('Unit 04 flash cards හදන්න (card 30–40)','Deadline සෙනසුරාදා (ඔක් 24). ඉස්සරහ ප්‍රශ්නය / පදය, පිටිපස්සේ උත්තරය / සූත්‍රය. එක පාට theme එකක් තියාගෙන අද card ඔක්කොම ලියන්න.'),
  O('Flash cards ඉවර කරලා Unit 04 පාඩම් කරන්න','Cards වලින් තමන්ගෙන්ම ප්‍රශ්න අහන්න. Cards ඉතුරු නම් සිකුරාදා buffer එකේ ඉවර කරන්න, සෙනසුරාදා ගෙනියන්න ඕන. ප්‍රශ්න ටික SFT quiz app එකටත්.')],
 [O('Unit 04 tute සම්පූර්ණ කරන්න','ඉතුරු ප්‍රශ්න ඔක්කොම. බැරි ඒවා ලකුණු කරලා Tools → "ගුරුවරයාගෙන් අහන්න" එකට දාන්න.'),
  N('Unit 01 / 03 tute (පන්තිය ගිය තැනට)','මූලික ගණිතය සහ පයිතගරස් සම්බන්ධය. සෙනසුරාදා ලියපු notes එක්ක කරන්න.'),
  O('Unit 02 + 04 full paper: වැරදුණු ප්‍රශ්න ආයේ කරන්න','වැරදුණු ප්‍රශ්න විතරක්. Discuss කරපු උත්තර එක්ක check කරලා, වැරදුණේ ඇයි කියලා කෙටියෙන් ලියන්න.')],
 [O('Unit 02 tute ගණන් ඔක්කොම','හැම ගණනකම සූත්‍රය උඩින්ම ලියන්න. බැරි ඒවා ලකුණු කරලා පන්තියේ අහන්න.'),
  N('Unit 01 short note + paper','පිටු 2–3: සූත්‍ර, definitions, ඒකක. ඊට පස්සේ වෙලාව තියාගෙන paper එක.'),
  O('Unit 02 short note + definitions පාඩම් කරන්න','පිටු 2–3 උපරිම: සූත්‍ර, definitions, ඒකක, කලින් වැරදුණු තැන්.')],
 [O('Unit 02 පාඩම් paper එක (වෙලාව එක්ක) + විවරණය','වැරදුණු ඒවාට විවරණය ලියන්න. ලකුණු Tools → MCQ ලකුණු එකට දාන්න.'),
  N('Unit 03 tute ඉතුරු ටික + short note'),
  O('Unit 04 short note','Notes සහ flash cards වලින් වැදගත්ම ටික විතරක්.')],
 [O('Unit 04 පාඩම් paper එක (වෙලාව එක්ක) + විවරණය','වැරදුණු ඒවාට විවරණය ලියන්න. ලකුණු Tools → MCQ ලකුණු එකට දාන්න.'),
  N('Unit 03 paper + විවරණය'),
  O('Units 02 + 04: papers වල වැරදුණු ප්‍රශ්න revision','කලින් papers වල වැරදුණු ප්‍රශ්න ආයේ කරලා බලන්න.')],
 [O('Units 01–04 mixed paper (වෙලාව එක්ක)'),
  N('අලුත් පාඩම: notes + tute (පන්තිය ගිය තැනට)'),
  O('Mixed paper එකේ වැරදි විවරණය + දුර්වල කොටස්')],
 [O('SFT ඉතුරු පරණ වැඩ (ප්‍රගතිය tab එක බලලා)','ප්‍රගතිය tab එකේ SFT ලැයිස්තුවේ ඉතුරු ඒවා. ඔක්කොම ඉවර නම් flash cards revision.'),
  N('අලුත් පාඩම: notes + tute (පන්තිය ගිය තැනට) · 2'),
  R('අවසාන balance check: subjects ඔක්කොම','ප්‍රගතිය tab එකේ හැම subject එකක්ම බලලා ඉතුරු දේවල් ලියාගන්න. දෙසැම්බර් plan එකට ඒ ටික.','rev')]
];
const ET_DAYS=[ // 6 Wednesdays
 [O('ET full paper ආයේ කරන්න (වෙලාව එක්ක)','මේ දක්වා උගන්නපු පාඩම් වලින් දීපු paper එක. ඉවර වෙලා වැරදුණු ඒවා ලකුණු කරන්න.'),
  N('Unit 06 (6.4 සිට) notes + tute, පන්තිය ගිය තැනට','6.1–6.3 දැනටමත් පාඩම් කරලා තියෙන නිසා කෙලින්ම 6.4න් පටන් ගන්න.'),
  O('Full paper එකේ වැරදි විවරණය කරගන්න','හැම වැරදුණු ප්‍රශ්නයකටම නිවැරදි ක්‍රමය + වැරදුණේ ඇයි. වැඩිපුර වැරදුණු පාඩම් ලකුණු කරගන්න.')],
 [O('Unit 05 ගණන් පුරුදු වෙන්න','Tute + paper ගණන්. සූත්‍ර ලැයිස්තුවක් පැත්තකින් තියාගන්න.'),
  N('Unit 06 (6.4 සිට) ගණන් + tute'),
  O('Unit 06 (6.1–6.3) ගණන් පුරුදු වෙන්න')],
 [O('Unit 01 flash cards + revision','Cards හදන ගමන්ම පාඩම revise වෙනවා. ප්‍රශ්න ටික ET quiz app එකටත්.'),
  N('Unit 06 දැන් යන කොටස: tute + paper ප්‍රශ්න'),
  O('Unit 01 short note + paper')],
 [O('Unit 03 flash cards + revision'),
  N('අලුත් පාඩම: notes + tute (පන්තිය ගිය තැනට)'),
  O('Unit 03 short note + paper')],
 [O('Unit 05 flash cards + revision'),
  N('Unit 06 flash cards + short note'),
  O('Unit 05 short note + paper')],
 [O('Unit 06 paper + විවරණය'),
  N('Units 01–06 mixed paper (වෙලාව එක්ක)'),
  R('Mixed paper වැරදි + Balance check: ET','ප්‍රගතිය tab එකේ ET ලැයිස්තුවේ ඉතුරු දේවල් ලියාගන්න.')]
];
const ICT_Q=[ // Tuesday + Friday morning blocks, in date order
 O('Unit 03 notes සම්පූර්ණ කරන්න','දැනට උගන්නපු කොටස ඔක්කොම. Unit 03 ගණන් කරන්න කලින් මේක ඉවර වෙන්නම ඕන.'),
 O('Unit 03 ගණන් practice','Notes ඉවර නිසා දැන් ගණන් කරන්න පුළුවන්. බැරි ඒවා අඟහරුවාදා පන්තියේ අහන්න.'),
 O('Unit 01 + 02 full paper ආයේ කරලා වැරදි හදාගන්න','වැරදුණු ප්‍රශ්න විතරක් ආයේ කරන්න. ඒ විවරණය apps වලට.'),
 O('Past paper book: Unit 03 + විවරණ','Unit 03 notes සහ ගණන් ඉවර නිසා දැන් past paper ප්‍රශ්න.'),
 O('Unit 01 + 02 short notes','පිටු 2–3 බැගින්: definitions, වැදගත් කරුණු, MCQ වල වැරදුණු තැන්.'),
 O('Past paper book: Unit 04 + විවරණ'),
 O('Unit 01 + 02 flash cards + ICT quiz app එකට'),
 O('ICT recording 1 (ඉස්සරහ පාඩම) + notes','1.5–2x speed. Slides තියෙනවා නම් ඒවා පැත්තකින් තියාගෙන.'),
 O('ICT recording 2 + notes','1.5–2x speed.'),
 O('ICT recording 3 + notes','1.5–2x speed.'),
 N('Unit 03 short note + flash cards + ගණන් revision'),
 R('Units 01–03 mixed paper + Balance check: ICT','වෙලාව තියාගෙන. ඊට පස්සේ ප්‍රගතිය tab එකේ ICT ලැයිස්තුව බලන්න.')
];
const DIP_ASG=[ // Thursday 8–9 pm (campus written work)
 {s:'asg',k:'now',ti:'Diploma assignments ලැයිස්තුව + deadlines + Magazine පිටු වලට text (EN + SI)',d:'Mini Magazine ඇතුළුව ඔක්කොම deadlines ලියාගන්න. ඉරිදා කඩේ PC එකේ කරන්න ඕන ඒවා වෙනම ලකුණු කරන්න.'},
 {s:'asg',k:'now',ti:'Magazine: text සහ images ලෑස්ති කරන්න (ඉරිදා PC එකට)'},
 {s:'asg',k:'now',ti:'Magazine: group එකේ පිටු ආවද බලලා final text check'},
 {s:'asg',k:'now',ti:'Diploma assignments: written කොටස් (deadline ළඟම ඒවා)'},
 {s:'asg',k:'now',ti:'Diploma assignments: written කොටස් (deadline ළඟම ඒවා)'},
 {s:'asg',k:'now',ti:'Diploma assignments: ඉතුරු ඒවා ලැයිස්තුව + balance check'}
];
const SUN_ASG=[ // Sunday 9:30–12:30 at the shop PC
 {ti:'Magazine: පිටු 8 බෙදාගන්න + මගේ පිටු layout + design පටන් ගන්න',d:'කාටද මොන පිටුව කියලා group chat එකේ ලියන්න. Fonts සහ පාට ටිකත් එකඟ වෙන්න. ඊට පස්සේ Photoshop / Illustrator වලින් design පටන් ගන්න.'},
 {ti:'Magazine: මගේ පිටු design ඉවර කරලා group එකේ පිටු එකතු කරන්න',d:'Final file එක අද හදාගන්න. ඊළඟ ඉරිදා polish කරලා submit කරන්න විතරයි.'},
 {ti:'Magazine: final check, export, submit (අද deadline)',d:'උදේම export කරලා submit කරන්න. ඉතුරු වෙලාවේ deadline ළඟම අනිත් assignment එක.'},
 {ti:'Diploma assignments (deadline ළඟම ඒවා මුලින්)'},
 {ti:'Diploma assignments (deadline ළඟම ඒවා මුලින්)'},
 {ti:'Diploma assignments: ඉතුරු ඔක්කොම ඉවර කරන්න'}
];
const HEX_A=[ // Sunday 2–5 pm
 {ti:'Hexora site: team එකට කොටස් බෙදලා ඉතුරු වැඩ ලැයිස්තුව හදන්න',d:'උඹ කරන්නේ admin panel සහ quote calculator. අනිත් පිටු team එකට.'},
 {ti:'Hexora site: Services + Pricing පිටු (USD / LKR) review'},
 {ti:'Hexora site: Project request form + quote calculator'},
 {ti:'Hexora site: Admin panel (requests + quotes)'},
 {ti:'Hexora site: testing (phone + desktop) + Singlish text check + speed',d:'අද හවස launch කරනවා. Bugs ලැයිස්තුවක් හදලා පුළුවන් ඒවා දැන්ම හදන්න.'},
 {ti:'A/L Tech Notes app: screens plan + project setup',d:'උඹේ short notes තමා content එක. Coding ඊළඟ මාසෙ.'}
];
const HEX_B=[ // Sunday 6:30–8:30 pm
 {ti:'Quiz apps: papers ඉක්මනට දාන admin form එකක්',d:'Daily quiz / Day papers apps දෙකට ප්‍රශ්න ඉක්මනට දාන්න form එකක් හැදුවොත් හැමදාම විනාඩි 5න් වැඩේ ඉවරයි.'},
 {ti:'Hexora site: quote calculator logic + test'},
 {ti:'Hexora site: Admin panel: requests list + quotes'},
 {ti:'Hexora site: Admin panel ඉවර කරලා bugs හදන්න'},
 {ti:'Hexora site launch කරලා customersලාට link එක share කරන්න',d:'WhatsApp status / groups වලට link එක. Team එකට thanks!'},
 {ti:'ET / SFT quiz apps: flash card ප්‍රශ්න add + maintenance'}
];
const CLS_N=[5,5,5,4,4,4];   // old Day papers (class, 7 Q each) per Tuesday = 27
const OLD_DQ=3;              // old Daily quiz papers (5 Q each) per night = 72 in 24 nights

/* ---------- build plan ---------- */
const BASE={}, ORDER=[];
(function build(){
  let sd=0,ed=0,iq=0,td=0,ti=0,sn=0,cls=0,dq=0;
  const pc=(t,ap)=>{const p=t.split(':').map(Number);return p[0]*60+p[1]};
  for(let iso=START;iso<=END;iso=isoAdd(iso,1)){
    const w=dow(iso), wk=Math.floor(diff(START,iso)/7)+1, L=[];
    /* every task is written in 24-hour time and stored as 12-hour pieces (t, e, ap, ap2) */
    const P=(a,b,o)=>{const x=Object.assign({},o);x.k=x.k||(x.bl?'old':'now');
      const A=pc(a),B=pc(b),p=(m)=>{const h=Math.floor(m/60)%24,mm=m%60;return {t:(h%12===0?12:h%12)+':'+String(mm).padStart(2,'0'),ap:h>=12?'pm':'am'}};
      const s=p(A),e=p(B);x.t=s.t;x.ap=s.ap;x.e=e.t;x.ap2=e.ap===s.ap?'':e.ap;x.h=(B-A)/60;L.push(x);return x};
    const REST=(a,b,ti)=>P(a,b,{s:'rev',k:'rest',fx:1,ti:ti||'විවේකය + කෑම'});
    const B=(a,b,s,it)=>P(a,b,Object.assign({s},it));
    const daily=late=>{
      if(late){P('23:10','23:40',{s:'ict',k:'daily',ti:'රෑ 10 Daily quiz paper + විවරණය',d:'Diploma පන්තිය නිසා අද පරක්කුයි. අද paper එක විතරක්. ප්‍රශ්න 5. Daily quiz app එකට දාන්න.'});return}
      P('22:00','22:30',{s:'ict',k:'daily',ti:'රෑ 10 Daily quiz paper + විවරණය',d:'ප්‍රශ්න 5. වැරදුණු / අනුමාන කරපු ප්‍රශ්න වලට විතරක් විවරණය. ඒකම Daily quiz app එකට දාන්න.'});
      if(dq<72){const a=dq+1,b=Math.min(dq+OLD_DQ,72);dq=b;const c=b-a+1;
        P('22:30','23:00',{s:'ict',bl:1,mc:{d:c},ti:'පරණ Daily quiz papers '+(a===b?'#'+a:'#'+a+'–#'+b),d:'ප්‍රශ්න '+(c*5)+'ක්. විවරණය ලියලා Daily quiz app එකට දාන්න.'})}
    };
    const subjDay=(s,day,last)=>{ // Mon / Wed template
      B('09:30','12:30',s,day[0]);REST('12:30','14:00','දවල් කෑම + විවේකය');
      B('14:00','17:00',s,day[1]);REST('17:00','19:00','විවේකය · ව්‍යායාම · නාන්න');
      B('19:00','21:00',day[2].s||s,day[2]);REST('21:00','22:00','රෑ කෑම');daily(false)};
    if(w===1){subjDay('sft',SFT_DAYS[Math.min(sd++,SFT_DAYS.length-1)])}
    else if(w===3){subjDay('et',ET_DAYS[Math.min(ed++,ET_DAYS.length-1)])}
    else if(w===2){ // ICT + class
      const it=ICT_Q[Math.min(iq++,ICT_Q.length-1)];B('09:30','12:30','ict',it);
      REST('12:30','14:15','දවල් කෑම + පන්තියට යන්න');
      P('15:00','17:30',{s:'ict',k:'cls',fx:1,ti:'ICT පන්තිය',d:'Day paper එක (ප්‍රශ්න 7) පන්තියේදීම කරන්න.'});
      REST('17:30','19:00','ගෙදර එන්න + විවේකය');
      P('19:00','19:30',{s:'ict',k:'now',ti:'අද Day paper එකේ විවරණය',d:'වැරදුණු සහ අනුමාන කරපු ප්‍රශ්න වලට. ඒ ප්‍රශ්නම Day papers app එකට.'});
      P('19:30','20:30',{s:'ict',k:'now',ti:'අද උගන්නපු කොටසේ notes සම්පූර්ණ කරන්න',d:'පන්තියේ දේ එදාම. එතකොට ICT වල අලුත් backlog එකක් හැදෙන්නේ නෑ.'});
      const n=CLS_N[Math.min(td++,CLS_N.length-1)];
      if(cls<27){const a=cls+1,b=Math.min(cls+n,27);cls=b;const c=b-a+1;
        P('20:30','21:30',{s:'ict',bl:1,mc:{c},ti:'පරණ Day papers (පන්තියේ) #'+a+'–#'+b,d:'ප්‍රශ්න '+(c*7)+'ක්. ප්‍රශ්නයට විනාඩි 1–1.5ක්. වැරදුණු / අනුමාන කරපු ඒවාට විතරක් විවරණය, Day papers app එකට.'})}
      else P('20:30','21:30',{s:'ict',k:'now',ti:'ICT: වැරදුණු MCQ ප්‍රශ්න revision',d:'පරණ Day papers ඔක්කොම ඉවරයි. විවරණ ලියපු ප්‍රශ්න ආයේ බලන්න.'});
      REST('21:30','22:00','රෑ කෑම');daily(false);
    }
    else if(w===4){ // Campus
      const n=Math.min(ti+1,6),i=ti++;
      B('09:30','12:30','dip',O('Diploma පාඩම '+n+': slides / PDF වලින් notes skeleton',(n===1?'පාඩම 1 = assignment එකට අදාළ පාඩම (Photoshop / Illustrator). ':'')+'Recording බලන්න කලින් slides වලින් headings සහ වැදගත් කරුණු ලියාගන්න. එතකොට recording එකේ බලන්න ඕන තැන් විතරක් පේනවා.'));
      REST('12:30','14:00','දවල් කෑම + විවේකය');
      B('14:00','17:00','dip',O('Diploma පාඩම '+n+': වැදගත් recordings (2x) + notes සම්පූර්ණ','Skeleton එකේ හිස් තැන් වලට අදාළ කොටස් විතරක් බලන්න. ඔක්කොම බලන්න ගියොත් ඉවර වෙන්නේ නෑ.'));
      REST('17:00','19:00','විවේකය · ව්‍යායාම · නාන්න');
      P('19:00','20:00',{s:'dip',k:'now',ti:i===0?'ගිය සිකු + සෙන Diploma පන්ති notes සම්පූර්ණ':'මේ සතියේ Diploma පන්ති notes (සිකු + සෙන)',d:'පන්තියේදී ලියාගත්ත කෙටි notes පිළිවෙළට.'});
      P('20:00','21:00',DIP_ASG[Math.min(i,DIP_ASG.length-1)]);
      REST('21:00','22:00','රෑ කෑම');daily(false);
    }
    else if(w===5){ // Friday: ICT block + buffer + Diploma class
      const it=ICT_Q[Math.min(iq++,ICT_Q.length-1)];B('09:30','12:30','ict',it);
      REST('12:30','14:00','දවල් කෑම + විවේකය');
      P('14:00','17:00',{s:'rev',k:'buf',fx:1,ti:'Buffer: මේ සතියේ මඟ ඇරුණු වැඩ',
        d:(iso==='2026-10-23'?'SFT Unit 04 flash cards ඉතුරු නම් මුලින්ම ඒවා. හෙට පන්තියට ගෙනියන්න ඕන. ':'')+'සතියේ මඟ ඇරුණු වැඩ "මාරු කරන්න" බොත්තමෙන් මෙතනට එනවා. කිසිම දෙයක් මඟ ඇරිලා නැත්නම් flash cards revision, past paper ප්‍රශ්න, නැත්නම් විවේකය.'});
      REST('17:00','19:30','විවේකය · ව්‍යායාම · නාන්න');
      P('20:00','23:00',{s:'dip',k:'cls',fx:1,ti:'Diploma පන්තිය (live)',d:'පන්තියේදීම කෙටි notes ලියාගන්න. බ්‍රහස්පතින්දා සම්පූර්ණ කරනවා.'});
      daily(true);
    }
    else if(w===6){ // Saturday classes
      P('07:30','09:30',{s:'et',k:'cls',fx:1,ti:'ET පන්තිය',d:'අද උදේ 6:30ට නැගිටින්න.'});
      P('10:00','12:00',{s:'sft',k:'cls',fx:1,ti:'SFT පන්තිය',d:iso==='2026-10-24'?'Unit 04 flash cards අද ගෙනියන්න.':''});
      REST('12:00','13:30','දවල් කෑම + විවේකය');
      P('13:30','15:30',{s:'et',k:'now',ti:'අද ET පන්තියේ notes සම්පූර්ණ + tute',d:'පන්තියේ දේ එදාම. මේක කළොත් ET වල අලුත් backlog එකක් හැදෙන්නේ නෑ.'});
      P('15:45','17:45',{s:'sft',k:'now',ti:'අද SFT පන්තියේ notes සම්පූර්ණ + tute',d:'පන්තිය ගිය තැනට. 5:45 – 8 හිස්: මඟ ඇරුණු පොඩි වැඩක් තියෙනවා නම් මෙතනට.'});
      P('20:00','23:00',{s:'dip',k:'cls',fx:1,ti:'Diploma පන්තිය (live)'});
      daily(true);
    }
    else if(w===0){ // Sunday: assignments (shop PC) + app development
      const i=sn++;
      const sa=SUN_ASG[Math.min(i,SUN_ASG.length-1)];
      P('09:30','12:30',Object.assign({s:'asg',k:'now'},sa,{d:'කඩේ PC එකේ. '+(sa.d||'')}));
      REST('12:30','14:00','දවල් කෑම + විවේකය');
      P('14:00','17:00',Object.assign({s:'hex',k:'now'},HEX_A[Math.min(i,HEX_A.length-1)]));
      REST('17:00','18:30','විවේකය');
      P('18:30','20:30',Object.assign({s:'hex',k:'now'},HEX_B[Math.min(i,HEX_B.length-1)]));
      P('20:30','21:15',{s:'rev',k:'rev',ti:'සතියේ review + ඊළඟ සතිය බලන්න',d:'ප්‍රගතිය tab එකේ මඟ ඇරුණු වැඩ බලලා "මාරු කරන්න" එකෙන් සිකුරාදා buffer එකට දාන්න.'});
      REST('21:15','22:00','රෑ කෑම');daily(false);
    }
    L.forEach((t,i)=>{t.id=iso+'-'+i;t.date=iso;if(t.d==='')delete t.d});
    BASE[iso]={iso,w,wk,tasks:L};ORDER.push(iso);
  }
})();

/* ---------- day label ---------- */
function dayKey(d){return d===END?['SFT දවස · අවසාන balance check','sft']:d==='2026-10-23'?['Buffer දවස · flash cards ඉවරද බලන්න','mix']:DAYTYPE[dow(d)]}

/* ---------- time helpers (12-hour pieces <-> minutes) ---------- */
const endMin=t=>{let a=mins(t.t,t.ap),b=mins(t.e,t.ap2||t.ap);if(b<=a)b+=720;if(b<=a)b+=720;return b};
const startMin=t=>mins(t.t,t.ap);
function toPieces(m){m=((m%1440)+1440)%1440;const h=Math.floor(m/60),mm=m%60,ap=h>=12?'pm':'am',h12=h%12===0?12:h%12;
  return {t:h12+':'+String(mm).padStart(2,'0'),ap}}
/* "HH:MM" 24h -> {t,ap} */
function from24(v){const [h,m]=v.split(':').map(Number);return toPieces(h*60+m)}
function to24(t,ap){const m=mins(t,ap);return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0')}
function setSpan(o,a,b){const p=toPieces(a),q=toPieces(b);o.t=p.t;o.ap=p.ap;o.e=q.t;o.ap2=q.ap===p.ap?'':q.ap;return o}

/* ---------- merged plan: base plan + the person's own changes ----------
   st.edits[id] = {ti,d,date,t,e,ap,ap2}   changed title / day / time of a plan task
   st.hidden[id] = 1                       a plan task the person removed
   st.custom = [{id,date,s,ti,d,t,e,ap,ap2,k}]   tasks the person added                          */
function makePlan(st){
  st=st||{};const ed=st.edits||{},hid=st.hidden||{},cu=st.custom||[];
  const P={};ORDER.forEach(d=>{P[d]={iso:d,w:BASE[d].w,wk:BASE[d].wk,tasks:[]}});
  const put=t=>{if(P[t.date])P[t.date].tasks.push(t)};
  ORDER.forEach(d=>BASE[d].tasks.forEach(b=>{
    if(hid[b.id])return;
    const t=Object.assign({},b,{home:d}),e=ed[b.id];
    if(e){for(const k of ['ti','d','date','t','e','ap','ap2'])if(e[k]!==undefined)t[k]=e[k];
      if((e.date&&e.date!==d)||(e.t&&(e.t!==b.t||e.ap!==b.ap)))t.mv=1;
      if(e.ti!==undefined||e.d!==undefined)t.ed=1}
    put(t)}));
  cu.forEach(c=>{if(!hid[c.id])put(Object.assign({k:'now',cu:1,home:c.date},c))});
  ORDER.forEach(d=>{const L=P[d].tasks;
    L.forEach((t,i)=>{t._i=i});
    if(L.every(t=>t.ap&&t.e))L.sort((a,b)=>startMin(a)-startMin(b)||a._i-b._i);
    L.forEach((t,i)=>{t.id=t.id;t.date=d;
      t.h=(t.t&&t.e&&t.ap)?(endMin(t)-startMin(t))/60:0;t.clash=0;delete t._i});
    const T=L.filter(t=>t.ap&&t.e&&t.k!=='rest'&&t.k!=='buf');
    for(let i=0;i<T.length;i++)for(let j=i+1;j<T.length;j++)if(startMin(T[j])<endMin(T[i])&&startMin(T[i])<endMin(T[j])){T[i].clash=1;T[j].clash=1}
  });
  const ALL=ORDER.flatMap(d=>P[d].tasks);
  return {PLAN:P,ALL,CHECKABLE:ALL.filter(t=>!t.fx&&t.k!=='rest')};
}

/* ---------- streak + daily completion ----------
   A day "counts" when at least 60% of its tickable tasks are done. */
const STREAK_PCT=0.6;
function dayStat(P,iso,done){const L=P[iso].tasks.filter(t=>!t.fx&&t.k!=='rest');const a=L.filter(t=>done[t.id]).length;
  return {iso,n:L.length,a,p:L.length?a/L.length:0,ok:L.length>0&&a/L.length>=STREAK_PCT}}
function streakInfo(P,done,today){
  const last=today<START?START:today>END?END:today;let cur=0,best=0,run=0;
  for(let d=START;d<=last;d=isoAdd(d,1)){const s=dayStat(P,d,done);
    if(s.ok){run++;if(run>best)best=run}else if(d!==last){run=0}else{/* today not finished yet: keep the run alive */}}
  // current streak: walk back from today (today may still be in progress)
  let d=last;if(!dayStat(P,d,done).ok)d=isoAdd(d,-1);
  while(d>=START&&dayStat(P,d,done).ok){cur++;d=isoAdd(d,-1)}
  return {cur,best:Math.max(best,cur),todayOk:dayStat(P,last,done).ok}
}

/* the plan the app starts with */
let PLAN=BASE,ALL=ORDER.flatMap(d=>BASE[d].tasks),CHECKABLE=ALL.filter(t=>!t.fx&&t.k!=='rest');
function applyPlan(st){const r=makePlan(st);PLAN=r.PLAN;ALL=r.ALL;CHECKABLE=r.CHECKABLE}

export { makePlan, BASE, ORDER, SUBJ, KIND, START, END, PLAN_V, mins, isoAdd, dow, dayKey, dayStat, streakInfo, startMin, endMin };
