const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),ts=require('typescript');
const jsx=(type,props)=>({type,props:props||{}});
function load(file,mocks={}){
 const exports={};
 vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText,
 {exports,URL,setTimeout,clearTimeout,setInterval,clearInterval,requestAnimationFrame:fn=>setImmediate(fn),cancelAnimationFrame:clearImmediate,require:id=>{
  if(id in mocks)return mocks[id];
  if(id==='react/jsx-runtime')return {jsx,jsxs:jsx};
  throw Error('Unexpected dependency '+id);
 }});return exports;
}
const api=load('utils/youtube.ts');
const id='abcdefghijk',id2='12345678901',id3='ABCDEFGHIJK';
test('recognizes Shorts, watch, embed, live, short links and direct IDs',()=>{
 for(const url of [id,`https://youtube.com/shorts/${id}?si=a`,`https://www.youtube.com/watch?v=${id}`,`https://youtu.be/${id}`,`https://www.youtube-nocookie.com/embed/${id}`,`https://m.youtube.com/live/${id}`])assert.equal(api.getYoutubeVideoId(url),id);
 for(const url of [null,{},'bad','https://evil.test/watch?v='+id,'https://youtube.com.evil.test/shorts/'+id])assert.equal(api.getYoutubeVideoId(url),'');
});
test('malformed records are skipped, duplicates removed and empty titles have a fallback',()=>{
 const items=api.normalizeVideoFeed([null,{}, {video_url:`https://youtube.com/shorts/${id}`,video_title:' Smile '},{video_url:id},{video_url:id2}]);
 assert.equal(items.length,2);assert.equal(items[0].isShort,true);assert.equal(items[0].title,'Smile');assert.ok(items[1].title);
 assert.throws(()=>api.normalizeVideoFeed({error:true}));
});
test('resume positions discard invalid values and have a storage bound',()=>{
 const positions=api.normalizeVideoProgress({[id]:42,[id2]:Infinity,'bad':10,'ABCDEFGHIJK':-1});
 assert.equal(positions[id],42);assert.equal(Object.keys(positions).length,1);
 const many=Object.fromEntries(Array.from({length:120},(_,i)=>[String(i).padStart(11,'0'),i]));
 assert.equal(Object.keys(api.normalizeVideoProgress(many)).length,100);
});
const all=n=>!n||typeof n!=='object'?[]:[n,...[n.props?.children].flat(Infinity).flatMap(all)];
const tick=()=>new Promise(setImmediate);
function fixture({response={code:200,data:[{video_url:`https://youtube.com/shorts/${id}`,video_title:'Short'},{video_url:`https://youtube.com/shorts/${id2}`,video_title:'Short 2'},{video_url:id3,video_title:'Long'}]}, fail=false}={}){
 let cursor=0,focused=true,listener,cleaned=false;const hooks=[],pendingEffects=[],storage=new Map();
 const react={__esModule:true,default:{},useMemo(f,deps){const i=cursor++;if(!hooks[i]||deps.some((v,j)=>v!==hooks[i].deps[j]))hooks[i]={deps,value:f()};return hooks[i].value;},useCallback(f,deps){const i=cursor++;if(!hooks[i]||deps.some((v,j)=>v!==hooks[i].deps[j]))hooks[i]={deps,value:f};return hooks[i].value;},
  useState(initial){const i=cursor++;if(!(i in hooks))hooks[i]=initial;return [hooks[i],value=>hooks[i]=typeof value==='function'?value(hooks[i]):value];},
  useRef(initial){const i=cursor++;if(!(i in hooks))hooks[i]={current:initial};return hooks[i];},
  useEffect(fn,deps){const i=cursor++;const prev=hooks[i];if(!prev||deps.some((v,j)=>v!==prev.deps[j])){hooks[i]={deps,cleanup:prev?.cleanup};pendingEffects.push(()=>{hooks[i].cleanup?.();hooks[i].cleanup=fn();});}}
 };
 react.useLayoutEffect=react.useEffect;
 const native={...Object.fromEntries(['ActivityIndicator','FlatList','Pressable','Text','View'].map(n=>[n,n])),StyleSheet:{create:s=>s},AppState:{currentState:'active',addEventListener:(_,fn)=>{listener=fn;return {remove(){cleaned=true;}};}}};
 const mod=load('screens/video/videos.screen.tsx',{
 react,'react-native':native,'react-native-safe-area-context':{SafeAreaView:'SafeAreaView'},'@react-navigation/native':{useIsFocused:()=>focused},
 'expo-router':{router:{}},'@expo/vector-icons':{Ionicons:'Icon'},'@react-native-async-storage/async-storage':{__esModule:true,default:{getItem:async k=>storage.get(k),setItem:async(k,v)=>storage.set(k,v)}},
 '@/lib/apiCall':{getVideos:async()=>{if(fail)throw Error('offline');return response;}},'@/utils/youtube':api,'@/components/video/FeedVideoCard':{__esModule:true,default:'Card'}
 });
 const render=()=>{cursor=0;const tree=mod.default();while(pendingEffects.length)pendingEffects.shift()();return all(tree);};
 const list=()=>render().find(n=>n.type==='FlatList');
 return {render,list,storage,async ready(){render();await tick();render().find(n=>n.props.onLayout).props.onLayout({nativeEvent:{layout:{width:390,height:620}}});render();await tick();await tick();},background(){listener('background');},blur(){focused=false;},cleanup(){hooks.forEach(h=>h?.cleanup?.());return cleaned;}};
}
test('feed keeps adjacent players ready but plays only the selected visible video',async()=>{
 const f=fixture();await f.ready();let props=f.list().props;
 assert.equal(props.renderItem({item:props.data[0],index:0}).type,'Card');
 assert.equal(props.renderItem({item:props.data[1],index:1}).type,'Card');
 assert.equal(props.renderItem({item:props.data[1],index:1}).props.playing,false);
 props.onViewableItemsChanged({viewableItems:[]});props=f.list().props;
 assert.equal(props.renderItem({item:props.data[0],index:0}).props.playing,false);
 props.onViewableItemsChanged({viewableItems:[{isViewable:true,index:1}]});props=f.list().props;
 assert.equal(props.renderItem({item:props.data[0],index:0}).type,'Card');
 assert.equal(props.renderItem({item:props.data[0],index:0}).props.playing,false);
 assert.equal(props.renderItem({item:props.data[1],index:1}).props.playing,true);
 f.background();props=f.list().props;assert.equal(props.renderItem({item:props.data[1],index:1}).props.playing,false);
 f.blur();props=f.list().props;assert.equal(props.renderItem({item:props.data[1],index:1}).type,'View');
 assert.equal(f.cleanup(),true);
});
test('saved videos persist locally and the saved filter shows only bookmarks',async()=>{
 const f=fixture();await f.ready();let props=f.list().props;
 const chosenId=props.data[0].id;props.renderItem({item:props.data[0],index:0}).props.onSave();await tick();
 assert.deepEqual(JSON.parse([...f.storage.values()][0]).saved,[chosenId]);
 const tab=f.render().find(n=>n.type==='Pressable'&&all(n).some(v=>v.props.children==='Đã lưu'));
 tab.props.onPress();props=f.list().props;assert.equal(props.data.length,1);assert.equal(props.data[0].id,chosenId);
});
test('API errors and invalid payloads offer retry instead of a blank feed',async()=>{
 for(const settings of [{fail:true},{response:{code:200,data:{error:true}}},{response:{code:500}}]){
  const f=fixture(settings);await f.ready();assert.equal(f.list(),undefined);
  assert.ok(f.render().some(n=>n.props.children==='Thử lại'));f.cleanup();
 }
});


test('Shorts is the default; Video contains only regular videos and All is removed',async()=>{
 const f=fixture();await f.ready();let props=f.list().props;
 assert.equal(props.data.length,2);assert.ok(props.data.every(v=>v.isShort));
 assert.equal(f.render().some(n=>n.props.children==='Tất cả'),false);
 const tab=f.render().find(n=>n.type==='Pressable'&&n.props.accessibilityRole==='tab'&&all(n).some(v=>v.props.children==='Video'));
 tab.props.onPress();props=f.list().props;
 assert.equal(props.data.length,1);assert.equal(props.data[0].id,id3);assert.equal(props.data[0].isShort,false);
 f.cleanup();
});

test('resizing the viewport and entering fullscreen retain the selected second video',async()=>{
 const f=fixture();await f.ready();let props=f.list().props;
 props.onViewableItemsChanged({viewableItems:[{isViewable:true,index:1}]});props=f.list().props;
 const current=()=>{const p=f.list().props;return p.renderItem({item:p.data[1],index:1});};
 assert.equal(current().type,'Card');
 f.render().find(n=>n.props.onLayout).props.onLayout({nativeEvent:{layout:{width:390,height:650}}});
 props=f.list().props;props.onViewableItemsChanged({viewableItems:[{isViewable:true,index:0}]});
 await tick();await tick();assert.equal(current().type,'Card');
 current().props.onFullScreenChange(true);
 f.render().find(n=>n.props.onLayout).props.onLayout({nativeEvent:{layout:{width:780,height:340}}});
 props=f.list().props;props.onViewableItemsChanged({viewableItems:[{isViewable:true,index:0}]});
 assert.equal(current().type,'Card');assert.equal(current().props.height,650);assert.equal(props.scrollEnabled,false);
 current().props.onFullScreenChange(false);
 await tick();await tick();await tick();
 assert.equal(current().type,'Card');assert.equal(f.list().props.scrollEnabled,true);
 f.cleanup();
});


test('player warmup is bounded to current and immediate neighbors',async()=>{
 const data=Array.from({length:6},(_,i)=>({video_url:'https://youtube.com/shorts/'+String(i).padStart(11,'0'),video_title:'Clip '+i}));
 const f=fixture({response:{code:200,data}});await f.ready();let props=f.list().props;
 props.onViewableItemsChanged({viewableItems:[{isViewable:true,index:3}]});props=f.list().props;
 const cards=props.data.map((item,index)=>props.renderItem({item,index}));
 assert.deepEqual(cards.map((n,i)=>n.type==='Card'?i:null).filter(i=>i!==null),[2,3,4]);
 assert.equal(cards.filter(n=>n.props.playing===true).length,1);
 assert.equal(props.removeClippedSubviews,false);
 f.background();props=f.list().props;
 assert.equal(props.data.map((item,index)=>props.renderItem({item,index})).filter(n=>n.props.playing===true).length,0);
 f.cleanup();
});


test('shuffle keeps every Short once, leaves input unchanged and avoids repeating the first clip',()=>{
 const videos=[{id,isShort:true},{id:id2,isShort:true},{id:id3,isShort:false}];
 const result=api.shuffleShorts(videos,id,()=>0.99);
 assert.equal(result.length,2);assert.equal(result[0].id,id2);
 assert.equal(new Set(result.map(v=>v.id)).size,2);assert.equal(videos[0].id,id);
 assert.equal(api.shuffleShorts([],null).length,0);
 assert.equal(api.shuffleShorts([videos[0]],id)[0].id,id);
});

test('Shorts order stays stable while watching but changes on tab re-entry',async()=>{
 const f=fixture();await f.ready();let props=f.list().props;
 const initial=props.data.map(v=>v.id);
 props.onViewableItemsChanged({viewableItems:[{isViewable:true,index:1}]});
 assert.deepEqual(f.list().props.data.map(v=>v.id),initial);
 const select=label=>f.render().find(n=>n.type==='Pressable'&&n.props.accessibilityRole==='tab'&&all(n).some(v=>v.props.children===label)).props.onPress();
 select('Video');f.render();select('Shorts');f.render();props=f.list().props;
 assert.notEqual(props.data[0].id,initial[0]);
 await tick();assert.equal(JSON.parse([...f.storage.values()][0]).lastShortFirst,props.data[0].id);
 f.cleanup();
});
