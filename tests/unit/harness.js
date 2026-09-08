// Minimal DOM/browser stubs
const elems = {};
function mkEl(){ return {
  style:{setProperty(){}, width:''}, classList:{toggle(){},add(){},remove(){},contains(){return false}},
  dataset:{}, innerHTML:'', textContent:'', value:'', hidden:false, href:'', className:'',
  childNodes:[{nodeValue:''}], offsetWidth:0,
  addEventListener(){}, appendChild(){}, setAttribute(){}, getAttribute(){return ''}, querySelector(){return mkEl()}, querySelectorAll(){return []},
  getContext(){ return new Proxy({},{get:()=> ()=>{} }); }, width:0, height:0,
};}
global.document = {
  getElementById:(id)=> (elems[id] ||= mkEl()),
  documentElement: mkEl(), addEventListener(){}, hidden:false,
  createElement:()=> mkEl(), querySelector:()=> mkEl(), querySelectorAll:()=> [],
};
global.window = { addEventListener(){}, innerWidth:1730, innerHeight:950 };
global.Image = class { constructor(){ this.complete=false; this.naturalWidth=0; } };
global.localStorage = { getItem:()=>null, setItem(){}, removeItem(){} };
global.fetch = () => Promise.reject(new Error('blocked'));
global.AbortController = class { constructor(){this.signal=null} abort(){} };
global.setInterval = ()=>0;

