// Convert the checked-in Spring course Markdown into validated, deterministic quiz data.
// No answer may be guessed when a source marker is missing or ambiguous.
export function buildQuizRegistry(course) {
 const expected={"lesson-05":10,"lesson-10":10,"lesson-14":10,"lesson-21":5,"lesson-28":5,"lesson-30":10,"lesson-38":5,"lesson-43":5,"lesson-45":10};
 const ABC="ABCD";
 const assert=(ok,m)=>{if(!ok)throw Error("Quiz integrity: "+m);};
 const grab=(s,rs)=>{for(const r of rs){const m=s.match(r);if(m?.[1]?.trim())return m[1].trim();}return "";};
 function split(id,md){
  const re=id==="lesson-30"?/^### Question \d+/gm:["lesson-38","lesson-43","lesson-45"].includes(id)?/^## \d+\./gm:/^## Question \d+/gm;
  const ms=[...md.matchAll(re)]; return ms.map((m,i)=>md.slice(m.index,ms[i+1]?.index??md.length));
 }
 function question(id,b){
  const h=b.split(/\n(?:###\s*(?:Choices|Các lựa chọn|Lựa chọn)|\*\*(?:Options|Các lựa chọn))/)[0];
  let en="",vi="";
  if(id==="lesson-14"){en=grab(h,[/^\*\*EN \(Original Question\):\*\*\s*(.+)$/m]);vi=grab(h,[/^\*\*VI \(Câu hỏi\):\*\*\s*(.+)$/m]);}
  if(id==="lesson-21"){en=grab(h,[/^\*\*EN [—–-] Question:\*\*\s*(.+)$/m]);vi=grab(h,[/^\*\*VI [—–-] Câu hỏi:\*\*\s*(.+)$/m]);}
  if(id==="lesson-28"){en=grab(h,[/^\*\*EN \(Question[^)]*\):\*\*\s*(.+)$/m]);vi=grab(h,[/^\*\*VI \(Câu hỏi\):\*\*\s*(.+)$/m]);}
  if(id==="lesson-30"){en=grab(h,[/^\*\*EN \(Question, Coursera\):\*\*\s*(.+)$/m]);vi=grab(h,[/^\*\*VI \(Câu hỏi\):\*\*\s*(.+)$/m]);}
  if(id==="lesson-38"||id==="lesson-45"){
   const valid=s=>!/^(Question\s*\d+|Câu hỏi\s*\d+|Do you understand|Bạn có hiểu)/i.test(s);
   en=[...h.matchAll(/^\*\*EN:\*\*\s*(.+)$/gm)].map(m=>m[1].trim()).filter(valid).join(" ");
   vi=[...h.matchAll(/^\*\*VI:\*\*\s*(.+)$/gm)].map(m=>m[1].trim()).filter(valid).join(" ");
  }
  if(id==="lesson-43"){
   en=grab(h,[/^(?!Question \d+)([^\n*#][^\n]*\?)\s*$/m]);
   vi=grab(h,[/^\*\*VI:\*\*\s*(?!Câu hỏi\s*\d+|Bạn đã hiểu)(.+\?)\s*$/m]);
  }
  assert(en&&vi,id+" missing question "+b.slice(0,140));return {en,vi};
 }
 function options(id,b){
  const lines=b.split("\n");
  const start=lines.findIndex(l=>/^(?:###\s*(?:Choices|Các lựa chọn|Lựa chọn)|\*\*(?:Options|Các lựa chọn))/.test(l.trim()));
  assert(start>=0,id+" missing options section");
  const es=/^\s*(?:-\s*)?\*{0,2}([A-D]|\d+)\.\s*\*{0,2}EN:\*\*\s*(.+?)\s*$/;
  const vs=/^\s*(?:-\s*)?\*{0,2}(?:[A-D]|\d+)\.\s*VI:\*\*\s*(.+?)\s*$|^\s*\*\*VI:\*\*\s*(.+?)\s*$/;
  const out=[], marked=[];
  for(let i=start+1;i<lines.length;i++){
   const line=lines[i],em=line.match(es);
   if(em){
    if(out.length===4)break;
    const pos=/^[A-D]$/.test(em[1])?ABC.indexOf(em[1]):Number(em[1])-1;
    assert(pos===out.length,id+" option order "+line);
    out.push({id:ABC[out.length],textEn:em[2].trim(),textVi:"",isCorrect:false});marked.push(false);
    continue;
   }
   const vm=line.match(vs);
   if(vm&&out.length&&!out[out.length-1].textVi){
    const txt=(vm[1]||vm[2]).trim();
    marked[out.length-1]=txt.includes("(Đúng)");
    out[out.length-1].textVi=txt.replace(/\s*\*{0,2}\(Đúng\)\*{0,2}\s*$/,"").trim();
   }
   if(out.length===4&&out[3].textVi)break;
  }
  assert(out.length===4,id+" needs 4 options, found "+out.length);
  assert(out.every(o=>o.textEn&&o.textVi),id+" has blank option");
  return {out,marked};
 }
 function answer(id,b,opts,marked){
  let pos=-1,prov="coursera";
  if(id==="lesson-14"){pos=ABC.indexOf(grab(b,[/\*\*Đáp án dự kiến:\s*([A-D])\./]));prov="study-analysis";}
  if(id==="lesson-21")pos=marked.findIndex(Boolean);
  if(id==="lesson-28"){pos=ABC.indexOf(grab(b,[/\*\*Đáp án (?:đúng|suy luận)[^:]*:\*\*\s*([A-D])\./]));if(/Đáp án suy luận, chưa xác nhận/.test(b))prov="study-analysis";}
  if(id==="lesson-30"){
   const val=grab(b,[/\*\*Đáp án đúng[^\n]*?:\*\*\s*([^\n]+)/]);
   const norm=s=>s.replace(/[\x60*_]/g,"").replace(/\s+/g," ").trim().toLowerCase().replace(/[.]$/,"");
   pos=opts.findIndex(o=>norm(o.textEn)===norm(val));
  }
  if(id==="lesson-38"){
    pos=Number(grab(b,[/\*\*Đáp án phù hợp theo nội dung:\*\*\s*Lựa chọn\s*(\d)/]))-1;
    // The source records a 100% graded result and "Nice work" for all five questions,
    // but does not preserve the exact clicked option. Keep that distinction explicit.
    const source=course.lessons.find(l=>l.id===id)?.contentMarkdown||"";
    const hasGradedEvidence=/\*\*EN:\*\* Your grade: 100%/.test(source) &&
      (source.match(/^\*\*EN:\*\* Nice work$/gm)||[]).length===expected[id] &&
      /\*\*Đáp án phù hợp theo nội dung:\*\*/.test(b);
    prov=hasGradedEvidence?"graded-evidence":"study-analysis";
  }
  if(id==="lesson-43")pos=ABC.indexOf(grab(b,[/\*\*Đáp án đúng:\*\*\s*([A-D])\./]));
  if(id==="lesson-45")pos=Number(grab(b,[/\*\*Đáp án đúng \/ Correct answer:\*\*\s*(\d)\./]))-1;
  assert(pos>=0&&pos<4,id+" missing/ambiguous answer "+b.slice(0,140));
  opts[pos].isCorrect=true;return prov;
 }
 function explanations(id,b){
  let en=grab(b,[
   /^\*\*EN \(Original explanation, Coursera\):\*\*\s*(.+)$/m,
   /^\*\*EN [—–-] Explanation:\*\*\s*(.+)$/m,
   /^\*\*EN \(Giải thích gốc Coursera\):\*\*\s*(.+)$/m,
   /^\*\*Explanation \(EN\):\*\*\s*(.+)$/m
  ]);
  let vi=grab(b,[
   /^\*\*VI \(Dịch giải thích gốc\):\*\*\s*(.+)$/m,
   /^\*\*VI [—–-] Giải thích:\*\*\s*(.+)$/m,
   /^\*\*Giải thích \(VI\):\*\*\s*(.+)$/m,
   /^\*\*VI \(Dịch giải thích gốc Coursera\):\*\*\s*(.+)$/m
  ]);
  if(id==="lesson-43"){
   const m=b.match(/(?:^|\n)Nice work\s*\n\*\*VI:\*\*[^\n]*\n\s*\n([^\n]+)\n\*\*VI:\*\*\s*([^\n]+)/);
   if(m){en=m[1].trim();vi=m[2].trim();}
  }
  if(id==="lesson-45"){
   const sec=b.match(/### Phản hồi của Coursera[^\n]*\n([\s\S]*?)(?=\n### Giải thích bổ sung|\n---|$)/)?.[1]||"";
   if(sec){
    en=[...sec.matchAll(/^\*\*EN:\*\*\s*(.+)$/gm)].map(m=>m[1].trim()).filter(x=>!x.includes("1 / 1 point")).join(" ");
    vi=[...sec.matchAll(/^\*\*VI:\*\*\s*(.+)$/gm)].map(m=>m[1].trim()).filter(x=>!x.includes("1 / 1 điểm")).join(" ");
   }
  }
  if(id==="lesson-38"){
   const m=b.match(/^\*\*EN:\*\*\s*Nice work\s*\n\*\*VI:\*\*[^\n]*\n\s*\n\*\*EN:\*\*\s*(.+)\n\*\*VI:\*\*\s*(.+)$/m);
   if(m){en=m[1].trim();vi=m[2].trim();}
  }
  return {en,vi};
 }
 const reg={};
 for(const l of course.lessons){
  const id=l.id;
  if(!(id in expected))continue;
  if(id==="lesson-05"||id==="lesson-10"){
   reg[id]=l.flashcards.slice(0,10).map((card,index)=>{
    const distractors=l.flashcards.filter((x,j)=>j!==index&&x.answerEn!==card.answerEn);
    const list=[{textEn:card.answerEn,textVi:card.answerVi,isCorrect:true},...distractors.slice(0,3).map(x=>({textEn:x.answerEn,textVi:x.answerVi,isCorrect:false}))];
    const rot=index%4,order=list.slice(rot).concat(list.slice(0,rot));
    return {id:"l"+id.slice(-2)+"-q"+(index+1),number:index+1,title:(id==="lesson-05"?"Khám phá Spring":"Nền tảng Spring")+" - Câu "+(index+1),
      questionEn:card.questionEn,questionVi:card.questionVi,options:order.map((x,i)=>({id:ABC[i],...x})),
      feedbackEn:"",feedbackVi:"",explanationEn:"",explanationVi:card.explanationVi||card.answerVi,answerProvenance:"flashcard"};
   });
   continue;
  }
  const bs=split(id,l.contentMarkdown);assert(bs.length===expected[id],id+" question count "+bs.length);
  reg[id]=bs.map((b,i)=>{
   const q=question(id,b),{out,marked}=options(id,b),answerProvenance=answer(id,b,out,marked),ex=explanations(id,b);
   const fb=/Nice work/.test(b);
   return {id:"l"+id.slice(-2)+"-q"+(i+1),number:i+1,title:"Câu "+(i+1),questionEn:q.en,questionVi:q.vi,
     options:out,feedbackEn:fb?"Nice work":"",feedbackVi:fb?"Làm tốt lắm!":"",explanationEn:ex.en,explanationVi:ex.vi,answerProvenance};
  });
 }
 assert(Object.keys(reg).length===9,"expected 9 quiz lessons");
 let total=0;
 for(const [id,n] of Object.entries(expected)){
  assert(reg[id]?.length===n,id+" count invalid");
  for(let i=0;i<n;i++){
   const q=reg[id][i];total++;
   assert(q.id==="l"+id.slice(-2)+"-q"+(i+1),q.id+" bad ID");
   assert(q.questionEn&&q.questionVi,q.id+" empty question");
   assert(q.options.length===4&&q.options.map(x=>x.id).join("")==="ABCD",q.id+" options invalid");
   assert(q.options.every(x=>x.textEn&&x.textVi),q.id+" option blank");
   assert(q.options.filter(x=>x.isCorrect).length===1,q.id+" answer invalid");
   assert(!/(\*\*EN:|\*\*VI:)/.test(q.questionEn+" "+q.questionVi),q.id+" marker leaked");
  }
 }
 assert(total===70,"expected 70 questions");
 return reg;
}
