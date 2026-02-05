
let testNo = 1;
function addRow(){
 let t=document.querySelector("#data tbody");
 let r=t.insertRow();
 r.innerHTML=`<td>${testNo++}</td>` +
 [...Array(5)].map(()=>'<td><input></td>').join('') +
 '<td></td><td></td>';
 r.querySelectorAll("input").forEach(i=>i.oninput=()=>calc(r));
}

function calc(r){
 let gamma=+gamma_s.value||1, gs=+gs_i.value||1, mdd=+mdd_i.value||1;
 let v=[...r.querySelectorAll("input")].map(i=>+i.value||0);
 let sand=v[0]-v[1];
 let vtotal=sand/gamma;
 let vstone=v[3]/gs;
 let vsoil=vtotal-vstone;
 let wet=(v[2]-v[3])/vsoil;
 let dry=wet/(1+v[4]/100);
 let comp=(dry/mdd)*100;
 r.cells[6].innerText=dry.toFixed(3);
 r.cells[7].innerText=comp.toFixed(1);
 r.cells[7].className=comp>=95?'pass':'fail';
}
