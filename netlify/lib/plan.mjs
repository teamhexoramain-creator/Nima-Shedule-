/* Generated from the app plan builder — the same schedule the app shows. */
const START='2026-10-12', END='2026-11-30';
const SUBJ={
  sft:{n:'SFT',c:'var(--sft)',full:'Science for Technology'},
  et:{n:'ET',c:'var(--et)',full:'Engineering Technology'},
  ict:{n:'ICT',c:'var(--ict)',full:'Information & Communication Technology'},
  dip:{n:'DIPLOMA',c:'var(--dip)',full:'Technology diploma'},
  hex:{n:'HEXORA',c:'var(--hex)',full:'Hexora site සහ apps'},
  asg:{n:'කඩේ PC',c:'var(--asg)',full:'Diploma assignments (Mini Magazine ඇතුළුව)'},
  rev:{n:'REVIEW',c:'var(--rev)',full:'Review'},
  mix:{n:'පන්ති',c:'var(--mix)',full:''}
};
const KIND={old:'පරණ වැඩ',now:'දැන් යන',cls:'පන්තිය',daily:'හැමදාම',rev:'Review',rest:''};
const DAYS=['ඉරිදා','සඳුදා','අඟහරුවාදා','බදාදා','බ්‍රහස්පතින්දා','සිකුරාදා','සෙනසුරාදා'];
const DSH=['ඉරි','සඳු','අඟ','බදා','බ්‍රහ','සිකු','සෙන'];
const MON={10:'ඔක්',11:'නොවැ'}; const MONF={10:'ඔක්තෝබර්',11:'නොවැම්බර්'};
const DAYTYPE={1:['SFT දවස','sft'],2:['ICT දවස','ict'],3:['ET දවස','et'],4:['ICT දවස','ict'],5:['SFT දවස','sft'],6:['පන්ති දවස · ET + SFT','mix'],0:['Diploma · Assignments · Hexora','dip']};

const isoAdd=(iso,n)=>{const d=new Date(iso+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)};
const dow=iso=>new Date(iso+'T00:00:00Z').getUTCDay();
const diff=(a,b)=>Math.round((new Date(b+'T00:00:00Z')-new Date(a+'T00:00:00Z'))/864e5);
const fmt=iso=>{const m=+iso.slice(5,7),d=+iso.slice(8,10);return MON[m]+' '+d};
const fmtLong=iso=>{const m=+iso.slice(5,7),d=+iso.slice(8,10);return MONF[m]+' '+d};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function mins(t,ap){let[h,m]=t.split(':').map(Number);if(ap==='pm'&&h<12)h+=12;return h*60+m}
function todayISO(){try{return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Colombo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}catch(e){return new Date().toISOString().slice(0,10)}}

/* ---------- queues ---------- */
const SFT_Q=[
 [{ti:'Unit 04 notes පොතේ ලියන්න — 1 කොටස',d:'පන්තියේ ඉගැන්නුව කොටස ඔක්කොම පොතට. මුලින් content එක, diagrams සහ පාට පස්සේ.',bl:1},
  {ti:'Unit 04 notes ඉවර කරන්න',d:'Notes ඉවර නැතුව flash cards හදන්න බෑ. ඒ නිසා අද ඉවර කරන්නම ඕන.',bl:1}],
 [{ti:'Unit 02 + 04 full paper — වැරදුණු ප්‍රශ්න ආයේ කරන්න',d:'වැරදුණු ප්‍රශ්න විතරක්. Discuss කරපු උත්තර එක්ක check කරලා, වැරදුණේ ඇයි කියලා කෙටියෙන් ලියන්න.',bl:1},
  {ti:'Unit 04 tute සම්පූර්ණ කරන්න',d:'ඉතුරු ප්‍රශ්න ඔක්කොම. බැරි ඒවා ලකුණු කරලා සෙනසුරාදා පන්තියේ අහන්න.',bl:1}],
 [{ti:'Unit 04 flash cards හදන්න',d:'Deadline හෙට (ඔක් 24). Card 30–40ක්: ඉස්සරහ ප්‍රශ්නය/පදය, පිටිපස්සේ උත්තරය/සූත්‍රය. එක පාට theme එකක් තියාගෙන ලස්සනට.',bl:1},
  {ti:'Flash cards ඉවර කරලා Unit 04 පාඩම් කරන්න',d:'Cards වලින්ම තමන්ගෙන්ම ප්‍රශ්න අහලා පාඩම් කරන්න. ඒ ප්‍රශ්නම SFT quiz app එකටත් දාන්න පුළුවන්.',bl:1}],
 [{ti:'Unit 02 tute ගණන් — 1 කොටස',d:'බාගයක් විතර. හැම ගණනකම සූත්‍රය උඩින්ම ලියන්න.',bl:1},
  {ti:'Unit 01 / 03 tute (අලුත් වැඩ)',d:'මූලික ගණිතය සහ පයිතගරස් සම්බන්ධය tute එක, පන්තිය ගිය තැනට.',k:'now'}],
 [{ti:'Unit 02 tute ගණන් ඉවර කරලා පාඩම් කරන්න',d:'ඉතුරු ගණන් + පාඩමේ definitions/සූත්‍ර පාඩම් කරන්න.',bl:1},
  {ti:'Unit 02 short note',d:'පිටු 2–3ක් උපරිම: සූත්‍ර, definitions, ඒකක, කලින් වැරදුණු තැන්.',bl:1}],
 [{ti:'Unit 04 short note',d:'Notes සහ flash cards වලින් වැදගත්ම ටික විතරක්.',bl:1},
  {ti:'Unit 01 / 03 tute (අලුත් වැඩ)',d:'පන්තිය ගිය තැනට.',k:'now'}],
 [{ti:'Unit 02 පාඩම් paper එක',d:'වෙලාව තියාගෙන කරන්න. වැරදුණු ඒවට විවරණය ලියන්න.',bl:1},
  {ti:'Unit 04 පාඩම් paper එක',d:'වෙලාව තියාගෙන කරන්න. වැරදුණු ඒවට විවරණය ලියන්න.',bl:1}],
 [{ti:'Unit 01 short note + paper',d:'පාඩම ඉවර නම්. නැත්නම් මේ කාලය tute එකට දෙන්න.',k:'now'},
  {ti:'අලුත් පාඩම: notes + tute',d:'පන්තිය ගිය තැනට.',k:'now'}],
 [{ti:'Unit 03 short note',k:'now'},{ti:'අලුත් පාඩම: notes + tute',k:'now'}],
 [{ti:'Unit 03 paper + විවරණය',k:'now'},{ti:'අලුත් පාඩම: notes + tute',k:'now'}],
 [{ti:'Units 02 + 04 වැරදුණු ප්‍රශ්න revision',d:'Papers වල වැරදුණු ප්‍රශ්න ආයේ කරලා බලන්න.',k:'now'},{ti:'අලුත් පාඩම: notes + tute',k:'now'}],
 [{ti:'Units 01–04 mixed paper (වෙලාව එක්ක)',k:'now'},{ti:'අලුත් පාඩම: notes + tute',k:'now'}],
 [{ti:'Mixed paper එකේ වැරදි විවරණය + දුර්වල කොටස්',k:'now'},{ti:'අලුත් පාඩම: notes + tute',k:'now'}],
 [{ti:'Balance check — SFT',d:'"පරණ වැඩ" tab එකේ SFT ලැයිස්තුව බලලා ඉතුරු දේවල් තියෙනවා නම් ලියාගන්න.',k:'rev'},{ti:'අලුත් පාඩම: notes + tute',k:'now'}]
];
const ET_Q=[
 [{ti:'ET full paper ආයේ කරන්න',d:'මේ දක්වා උගන්නපු පාඩම් වලින් දීපු paper එක. වෙලාව තියාගෙන.',bl:1},
  {ti:'Full paper එකේ වැරදි විවරණය කරගන්න',d:'වැරදුණු හැම ප්‍රශ්නයකටම නිවැරදි ක්‍රමය + වැරදුණේ ඇයි. වැඩිපුර වැරදුණු පාඩම් ලකුණු කරගන්න.',bl:1}],
 [{ti:'Unit 05 ගණන් පුරුදු වෙන්න',d:'Tute + paper ගණන්. සූත්‍ර ලැයිස්තුවක් පැත්තකින් තියාගන්න.',bl:1},
  {ti:'Unit 06 notes + tute (දැන් යන කොටස)',d:'6.4 සිට පන්තිය ගිය තැනට notes සම්පූර්ණ කරලා tute එක.',k:'now'}],
 [{ti:'Unit 06 (6.1–6.3) ගණන් පුරුදු වෙන්න',bl:1},
  {ti:'Unit 01 flash cards + revision',d:'Cards හදන ගමන්ම පාඩම revise වෙනවා. ප්‍රශ්න ටික ET quiz app එකටත්.',bl:1}],
 [{ti:'Unit 03 flash cards + revision',bl:1},{ti:'Unit 01 short note + paper',bl:1}],
 [{ti:'Unit 05 flash cards + revision',bl:1},{ti:'Unit 03 short note + paper',bl:1}],
 [{ti:'Unit 06 flash cards + revision',bl:1},{ti:'Unit 05 short note + paper',bl:1}],
 [{ti:'Unit 06 short note + paper',bl:1},{ti:'Units 01–06 mixed paper + දුර්වල කොටස්',k:'now'}]
];
const ICT_TUE=[
 {ti:'Unit 03 notes ලියන්න — 1 කොටස',d:'දැනට උගන්නපු කොටස. ගණන් කරන්න කලින් මේක ඉවර වෙන්න ඕන.',bl:1},
 {ti:'Unit 03 notes ඉවර කරන්න',bl:1},
 {ti:'Unit 02 short note',d:'පිටු 2–3: definitions, වැදගත් කරුණු, MCQ වල වැරදුණු තැන්.',bl:1},
 {ti:'Past paper book — Unit 03 (2 කොටස) + විවරණ',bl:1},
 {ti:'Past paper book — Unit 04 (2 කොටස) + විවරණ',bl:1},
 {ti:'Unit 03 short note',k:'now'},
 {ti:'ICT recording 3 — 1 කොටස + notes',bl:1}
];
const ICT_THU=[
 [{ti:'Unit 01 full paper ආයේ කරලා වැරදි හදාගන්න',d:'වැරදුණු ප්‍රශ්න විතරක් ආයේ කරන්න.',bl:1},{ti:'Unit 02 full paper ආයේ කරලා වැරදි හදාගන්න',d:'වැරදුණු ප්‍රශ්න විතරක් ආයේ කරන්න.',bl:1}],
 [{ti:'Unit 03 ගණන් practice',d:'Notes ඉවර නිසා දැන් ගණන් කරන්න පුළුවන්.',bl:1},{ti:'Unit 01 short note + flash cards',d:'Flash card ප්‍රශ්න ICT quiz app එකටත්.',bl:1}],
 [{ti:'Past paper book — Unit 03 (1 කොටස) + විවරණ',bl:1},{ti:'Unit 02 flash cards + app එකට',bl:1}],
 [{ti:'Past paper book — Unit 04 (1 කොටස) + විවරණ',bl:1},{ti:'Unit 03 ගණන් practice — 2',k:'now'}],
 [{ti:'ICT recording 1 (ඉස්සරහ පාඩම) + notes',d:'1.5–2x speed. Slides තියෙනවා නම් ඒවා පැත්තකින් තියාගෙන.',bl:1},{ti:'Unit 01 + Unit 02 පාඩම් papers',k:'now'}],
 [{ti:'ICT recording 2 + notes',bl:1},{ti:'Unit 03 flash cards + app එකට',k:'now'}],
 [{ti:'ICT recording 3 ඉවර කරලා notes',bl:1},{ti:'Units 01–03 mixed paper + දුර්වල කොටස්',k:'now'}]
];
const MAG=[
 {ti:'Magazine: group එකත් එක්ක පිටු 8 බෙදාගන්න + මගේ පිටු වල layout sketch',d:'කාටද මොන පිටුව කියලා group chat එකේ ලියලා තියන්න. Fonts සහ පාට ටිකත් එකඟ වෙන්න.'},
 {ti:'Magazine: මගේ පිටු design කරන්න (Photoshop / Illustrator)'},
 {ti:'Magazine: මගේ පිටු ඉවර + group එකේ පිටු එකතු කරන්න',d:'Final file එක මේ සතියේම හදාගන්න. ඊළඟ ඉරිදා polish කරන්න විතරයි.'},
 {ti:'Magazine: final check, export, submit',d:'Deadline අද (නොවැ 8). Export කරලා group එකට share කරන්න.'}
];
const HEX_SUN=[
 {ti:'Hexora site: team එකට කොටස් බෙදලා ඉතුරු වැඩ ලැයිස්තුව හදන්න',d:'උඹ කරන්නේ admin panel සහ quote calculator විතරයි. අනිත් පිටු team එකට.'},
 {ti:'Hexora site: Services + Pricing පිටු (USD / LKR) review'},
 {ti:'Hexora site: Project request form + quote calculator'},
 {ti:'Hexora site: Admin panel (requests + quotes)'},
 {ti:'Hexora site: testing (phone + desktop) + Singlish text check'},
 {ti:'Hexora site: launch කරලා customersලාට link එක share කරන්න'},
 {ti:'A/L Tech Notes app: screens plan + project setup',d:'උඹේ short notes තමා content එක. Coding ඊළඟ මාසෙ.'}
];

/* ---------- build plan ---------- */
const PLAN={}, ORDER=[];
(function build(){
  let sq=0,eq=0,tue=0,thu=0,sun=0,cls=0,dp=0;
  const OLDN={0:4,1:2,2:2,3:2,4:2,5:0,6:0};
  for(let iso=START;iso<=END;iso=isoAdd(iso,1)){
    const w=dow(iso), wk=Math.floor(diff(START,iso)/7)+1, L=[];
    const P=(o)=>{L.push(o);return o};
    const Q=(item,s,t,e,ap)=>P(Object.assign({s,k:item.bl?'old':(item.k||'now'),t,e,ap},item));
    const REST=(t,e,ti)=>P({s:'rev',k:'rest',fx:1,t,e,ap:'pm',ti:ti||'විවේකය + කෑම'});
    const clsT=(n,t,e)=>{const a=cls+1;if(a>27)return P({s:'ict',k:'now',t,e,ap:'pm',ti:'ICT: වැරදුණු MCQ ප්‍රශ්න revision',d:'පරණ class papers ඔක්කොම ඉවරයි. දැන් විවරණ ලියපු ප්‍රශ්න ආයේ බලන්න.'});
      const b=Math.min(cls+n,27);cls=b;const c=b-a+1;
      return P({s:'ict',k:'old',bl:1,t,e,ap:'pm',mc:{c},ti:'පරණ class MCQ papers '+(a===b?'#'+a:'#'+a+'–#'+b),d:'ප්‍රශ්න '+(c*7)+'ක්. ප්‍රශ්නයට විනාඩි 1ක් වගේ. වැරදුණු / අනුමාන කරපු ඒවට විතරක් විවරණය.'})};
    const daily=(late)=>{
      if(late){P({s:'ict',k:'daily',t:'11:10',e:'11:30',ap:'pm',ti:'රෑ 10 ICT paper + විවරණය',d:'Diploma පන්තිය නිසා අද පරක්කුයි. අද paper එක විතරක්. Daily quiz app එකට දාන්න.'});return}
      P({s:'ict',k:'daily',t:'10:00',e:'10:30',ap:'pm',ti:'රෑ 10 ICT paper + විවරණය',d:'ප්‍රශ්න 5. වැරදුණු/අනුමාන ප්‍රශ්න වලට විතරක් විවරණය. ඒකම Daily quiz app එකට දාන්න.'});
      const n=OLDN[w];if(n&&dp<72){const a=dp+1,b=Math.min(dp+n,72);dp=b;const c=b-a+1;
        P({s:'ict',k:'old',bl:1,mc:{d:c},t:'10:30',e:c>2?'11:15':'10:55',ap:'pm',ti:'පරණ Day papers '+(a===b?'#'+a:'#'+a+'–#'+b),d:'ප්‍රශ්න '+(c*5)+'ක්. විවරණය ලියලා Day papers app එකට දාන්න.'})}
    };
    if(iso===START){
      P({s:'ict',k:'old',t:'අද',e:'',ap:'',ti:'IT class past papers book එක ඉවර කරන්න',d:'අද මේක ඉවර කරලා හෙට (ඔක් 13) ඉඳන් plan එක පටන් ගන්න.'});
      P({s:'ict',k:'rev',t:'රෑ',e:'',ap:'',ti:'හෙට ICT පන්තියට ලෑස්ති වෙන්න',d:'හෙට ඉඳන් රෑ 10 paper එක හැමදාම කරනවා. Daily quiz app එක ලෑස්ති කරගන්න.'});
    } else if(w===1||w===5){ // SFT
      const it=SFT_Q[sq++]||SFT_Q[SFT_Q.length-1];
      Q(it[0],'sft','3:30','5:30','pm');
      if(w===1){REST('5:30','6:30');Q(it[1],'sft','6:30','8:30','pm');
        if(wk>=8)P({s:'dip',k:'rev',t:'8:45',e:'9:45',ap:'pm',ti:'Balance check — Diploma',d:'පාඩම් 6ටම notes තියෙනවද බලලා ඉතුරු ලැයිස්තුව හදන්න.'});
        else P({s:'dip',k:'old',bl:1,t:'8:45',e:'9:45',ap:'pm',ti:'Diploma පාඩම '+(wk-1)+': notes review + පාඩම් කරන්න',d:'ඊයේ ඉරිදා හදපු notes එක කියවලා වැදගත් කරුණු පාඩම් කරන්න.'});
        daily(false);
      } else {REST('5:30','6:00');Q(it[1],'sft','6:00','7:30','pm');
        P({s:'dip',k:'cls',fx:1,t:'8:00',e:'11:00',ap:'pm',ti:'Diploma පන්තිය (live)',d:'පන්තියේදීම කෙටි notes ලියාගන්න. ඉරිදා සම්පූර්ණ කරනවා.'});
        daily(true);}
    } else if(w===2){ // ICT Tuesday
      P({s:'ict',k:'cls',fx:1,t:'3:00',e:'5:30',ap:'pm',ti:'ICT පන්තිය',d:'පන්ති MCQ paper එක (ප්‍රශ්න 7) පන්තියේදීම කරන්න.'});
      REST('5:30','6:30');
      P({s:'ict',k:'now',t:'6:30',e:'7:15',ap:'pm',ti:'අද class paper එකේ විවරණය',d:'වැරදුණු සහ අනුමාන කරපු ප්‍රශ්න වලට. ඒ ප්‍රශ්නම app එකට.'});
      P({s:'ict',k:'now',t:'7:15',e:'8:00',ap:'pm',ti:'අද උගන්නපු කොටසේ notes සම්පූර්ණ කරන්න'});
      clsT(2,'8:00','8:45');
      Q(ICT_TUE[tue++]||{ti:'ICT revision',k:'now'},'ict','8:45','9:45','pm');
      daily(false);
    } else if(w===3){ // ET
      const it=ET_Q[eq++]||ET_Q[ET_Q.length-1];
      Q(it[0],'et','3:30','5:30','pm');REST('5:30','6:30');Q(it[1],'et','6:30','8:30','pm');
      const hx=iso==='2026-10-14'?{ti:'Quiz apps maintenance + ICT apps වලට papers දාන ක්‍රමය ලේසි කරන්න',d:'Daily quiz / Day papers apps දෙකට ප්‍රශ්න ඉක්මනට දාන්න admin form එකක් හැදුවොත් හැමදාම විනාඩි 5න් වැඩේ ඉවරයි.'}
        :iso==='2026-11-25'?{ti:'A/L Tech Notes app: idea + features ලැයිස්තුව'}
        :{ti:'ET / SFT quiz apps: මේ සතියේ flash card ප්‍රශ්න add + maintenance'};
      P(Object.assign({s:'hex',k:'now',t:'8:45',e:'9:45',ap:'pm'},hx));
      daily(false);
    } else if(w===4){ // ICT Thursday
      const it=ICT_THU[thu++]||ICT_THU[ICT_THU.length-1];
      clsT(3,'3:30','4:15');
      Q(it[0],'ict','4:15','5:45','pm');REST('5:45','6:30');Q(it[1],'ict','6:30','8:30','pm');
      if(wk<=6)P({s:'dip',k:'old',bl:1,t:'8:45',e:'9:45',ap:'pm',ti:'Diploma පාඩම '+wk+': slides/PDF වලින් notes skeleton',d:'Recording බලන්න කලින් slides වලින් headings සහ වැදගත් කරුණු ලියාගන්න. එතකොට recording එකේ බලන්න ඕන තැන් විතරක් පේනවා.'});
      else P({s:'dip',k:'old',t:'8:45',e:'9:45',ap:'pm',ti:'Diploma: ඉතුරු recordings / notes'});
      daily(false);
    } else if(w===6){ // Saturday
      P({s:'et',k:'cls',fx:1,t:'7:30',e:'9:30',ap:'am',ti:'ET පන්තිය'});
      P({s:'sft',k:'cls',fx:1,t:'10:00',e:'12:00',ap:'am',ti:'SFT පන්තිය',d:iso==='2026-10-24'?'Unit 04 flash cards අද ගෙනියන්න.':''});
      P({s:'et',k:'now',t:'1:30',e:'3:30',ap:'pm',ti:iso==='2026-10-17'?'Unit 06 (6.4 සිට) notes සම්පූර්ණ + tute':'අද ET පන්තියේ notes සම්පූර්ණ + tute',d:'පන්තියේ දේ එදාම. මේක කළොත් ET වල අලුත් backlog එකක් හැදෙන්නේ නෑ.'});
      P({s:'sft',k:'now',t:'4:00',e:'5:30',ap:'pm',ti:'අද SFT පන්තියේ notes + Unit 01/03 tute',d:'පන්තිය ගිය තැනට.'});
      if(iso==='2026-10-17')P({s:'sft',k:'old',bl:1,t:'5:30',e:'6:15',ap:'pm',ti:'Unit 04 flash cards වලට ප්‍රශ්න/උත්තර ලැයිස්තුව',d:'Card 30–40ට ඕන ප්‍රශ්න ටික notes එකෙන් තෝරලා ලියාගන්න. ඊළඟ සිකුරාදා cards හදන්න ලේසියි.'});
      P({s:'dip',k:'cls',fx:1,t:'8:00',e:'11:00',ap:'pm',ti:'Diploma පන්තිය (live)'});
      daily(true);
    } else if(w===0){ // Sunday
      const i=sun++;
      if(i<4){P(Object.assign({s:'asg',k:i===3?'now':'now',t:'8:00',e:'10:30',ap:'am',bl:1},MAG[i]));
        P({s:'asg',k:'now',bl:1,t:'10:30',e:'12:00',ap:'am',ti:i===0?'දැන් තියෙන diploma assignments ලැයිස්තුව + deadlines ලියාගන්න':'Deadline ළඟම diploma assignment එක'});}
      else P({s:'asg',k:'now',bl:1,t:'8:00',e:'12:00',ap:'am',ti:'Diploma assignments (deadline ළඟම ඒවා මුලින්)'});
      P({s:'dip',k:'now',t:'1:30',e:'2:15',ap:'pm',ti:'මේ සතියේ Diploma පන්ති notes (සිකු + සෙන)'});
      if(wk<=6)P({s:'dip',k:'old',bl:1,t:'2:15',e:'4:30',ap:'pm',ti:'Diploma පාඩම '+wk+': වැදගත් recordings (2x) + notes සම්පූර්ණ',d:'බ්‍රහස්පතින්දා හදපු skeleton එකේ හිස් තැන් වලට අදාළ කොටස් විතරක් බලන්න.'});
      else P({s:'dip',k:'old',bl:1,t:'2:15',e:'4:30',ap:'pm',ti:'Diploma පාඩම් 1–6 notes check + revision'});
      P(Object.assign({s:'hex',k:'now',bl:1,t:'5:00',e:'7:00',ap:'pm'},HEX_SUN[i]||HEX_SUN[HEX_SUN.length-1]));
      P({s:'rev',k:'rev',t:'7:30',e:'8:30',ap:'pm',ti:'සතියේ review + මඟ ඇරුණු වැඩ',d:'"අද" tab එකේ මඟ ඇරුණු ලැයිස්තුවෙන් පුළුවන් තරම් කරන්න. ඊළඟ සතිය බලලා ලෑස්ති වෙන්න.'});
      daily(false);
    }
    L.forEach((t,i)=>{t.id=iso+'-'+i;t.date=iso;
      t.h=(t.t&&t.e&&t.ap)?(()=>{let a=mins(t.t,t.ap),b=mins(t.e,t.ap);if(b<a)b+=12*60;return (b-a)/60})():0;});
    PLAN[iso]={iso,w,wk,tasks:L};ORDER.push(iso);
  }
})();
const ALL=ORDER.flatMap(d=>PLAN[d].tasks);
const CHECKABLE=ALL.filter(t=>!t.fx&&t.k!=='rest');

export { PLAN, ORDER, SUBJ, KIND, START, END, mins, isoAdd };
