const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),ts=require('typescript');
const jsx=(type,props,key)=>({type,props:props||{},key});
const react={__esModule:true,default:{},useCallback:fn=>fn,useEffect:()=>{}};
const native=new Proxy({},{get:(_,key)=>key});
function load(file,mocks={}){
    const exports={};
    const source=ts.transpileModule(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
    vm.runInNewContext(source,{exports,setTimeout,clearTimeout,require:id=>{
        if(id in mocks)return mocks[id];
        if(id==='react/jsx-runtime')return {jsx,jsxs:jsx};
        if(id==='react')return react;
        if(id==='react-native'||id==='react-native-safe-area-context')return native;
        throw Error('Unexpected dependency '+id);
    }});return exports;
}
const moduleApi=load('components/profile/AccountSwitcher.tsx');
function all(node){if(!node||typeof node!=='object')return [];return [node,...[node.props?.children].flat(Infinity).flatMap(all)];}
const tick=()=>new Promise(setImmediate);
function screenFixture({getAccounts=async()=>({data:[{id:1,ho_va_ten:'A',avatar_id:null},{id:2,ho_va_ten:'B',avatar_id:7}]}),update=async()=>({code:200}),reload=async()=>{},cleanup=async()=>{},signOut=async()=>{}}={}){
    const hooks=[],calls={updates:[],reloads:0,alerts:[],routes:[],refetches:0,logouts:0,cleanups:0};let cursor=0;
    const hookReact={...react,useState(initial){const i=cursor++;if(!(i in hooks))hooks[i]=initial;return [hooks[i],next=>{hooks[i]=typeof next==='function'?next(hooks[i]):next;}];},useRef(initial){const i=cursor++;if(!(i in hooks))hooks[i]={current:initial};return hooks[i];}};
    const mod=load('screens/home/profile/profile.screen.tsx',{
        react:hookReact,'react-native':{...Object.fromEntries(['View','Text','Image','ScrollView','TouchableOpacity','Pressable'].map(x=>[x,x])),Alert:{alert:(...args)=>calls.alerts.push(args)},Linking:{}},
        '@/lib/apiCall':{deleteExpoToken:async()=>{calls.cleanups++;return cleanup();},logout:async()=>{calls.logouts++;return signOut();},getAllAccount:getAccounts,getAvatar:async()=>{throw Error('Missing avatar');},updateMainStatus:async id=>{calls.updates.push(id);return update(id);}},
        '@/constants':{icons:{}},'@/components/common/CustomButton':{__esModule:true,default:'CustomButton'},
        'expo-router':{router:{replace:p=>calls.routes.push(p)}},
        '@/hooks/auth/useUser':{__esModule:true,default:()=>({user:{id:1,so_dien_thoai:'0900000000'},setRefetch:()=>calls.refetches++})},
        '@/components/profile/AccountSwitcher':moduleApi,'@/utils/uri':{SERVER_URL:'https://files.test/'},
        'expo-updates':{isEnabled:true,reloadAsync:async()=>{calls.reloads++;return reload();}},
        '@/hooks/usePushNotifications':{usePushNotifications:()=>({expoPushToken:{data:"test-token"}})},
    });
    const render=()=>{cursor=0;return mod.default();};
    const props=()=>all(render()).find(n=>n.type===moduleApi.default).props;
    return {calls,props,logout(){return all(render()).find(n=>n.props.title==="ĐĂNG XUẤT").props.handlePress();},async fetch(){props().onRetry();await tick();},open(){const button=all(render()).find(n=>n.type==='TouchableOpacity'&&all(n).some(c=>c.type==='Text'&&c.props.children==='Chuyển đổi tài khoản'));assert.ok(button);button.props.onPress();}};
}
test('null, missing and numeric avatars do not crash; URLs are resolved safely',()=>{
    for(const avatar of [null,undefined,7,'7',{}, {value:null}])assert.equal(moduleApi.getAccountAvatarUri(avatar,'https://files.test/'),undefined);
    assert.equal(moduleApi.getAccountAvatarUri({value:'img/a.jpg'},'https://files.test/'),'https://files.test/img/a.jpg');
    assert.equal(moduleApi.getAccountAvatarUri({value:'https://cdn.test/a.jpg'},'https://files.test/'),'https://cdn.test/a.jpg');
    const accounts=moduleApi.normalizeSwitchAccounts([null,{id:'1',ho_va_ten:'A',avatar_id:null},{id:2,ho_va_ten:'B',avatar_id:7},{id:1},{id:0}]);
    assert.equal(accounts.length,2);
    const selected=[];const tree=moduleApi.default({visible:true,accounts,currentId:1,serverUrl:'https://files.test/',switchingId:null,loading:false,error:'',onSelect:id=>selected.push(id),onClose(){},onRetry(){}});
    assert.equal(tree.type,'Modal');
    const buttons=all(tree).filter(n=>n.type==='Pressable'&&['A','B'].includes(n.props.accessibilityLabel));
    buttons[0].props.onPress();buttons[1].props.onPress();assert.deepEqual(selected,[2]);
});
test('opening the native account picker never updates the account or reloads the app',async()=>{
    const f=screenFixture();await f.fetch();f.open();await tick();
    assert.equal(f.props().visible,true);assert.equal(f.props().accounts.length,2);assert.equal(f.props().accounts[1].avatar_id,null);
    assert.equal(f.calls.updates.length,0);assert.equal(f.calls.reloads,0);
});
test('double taps send one switch request and reload only after confirmation',async()=>{
    let resolve;const f=screenFixture({update:()=>new Promise(r=>resolve=r)});await f.fetch();
    const handler=f.props().onSelect;const pending=handler(2);await handler(2);
    assert.deepEqual(f.calls.updates,[2]);assert.equal(f.calls.reloads,0);assert.equal(f.props().switchingId,2);
    resolve({code:200});await pending;assert.equal(f.calls.reloads,1);assert.equal(f.calls.refetches,1);assert.equal(f.props().switchingId,null);
});
test('API failure or expired login never reloads and allows another attempt',async()=>{
    for(const update of [async()=>null,async()=>{throw Error('offline');}]){
        const f=screenFixture({update});await f.fetch();f.open();await tick();await f.props().onSelect(2);
        assert.equal(f.calls.reloads,0);assert.equal(f.props().switchingId,null);assert.equal(f.props().visible,true);assert.equal(f.calls.alerts.length,1);
    }
});
test('invalid lists show a retryable error rather than crashing the screen',async()=>{
    const f=screenFixture({getAccounts:async()=>({data:{message:'bad payload'}})});await f.fetch();
    assert.ok(f.props().error);assert.equal(f.props().loading,false);f.open();assert.equal(f.props().visible,true);
});
test('reload failure reports that the account was already switched',async()=>{
    const f=screenFixture({reload:async()=>{throw Error('reload unavailable');}});await f.fetch();await f.props().onSelect(2);
    assert.equal(f.calls.alerts[0][0],'Đã chuyển tài khoản');assert.equal(f.props().switchingId,null);
});


test('notification cleanup failure does not block local logout',async()=>{
    const f=screenFixture({cleanup:async()=>{throw Error('offline');}});
    await f.logout();assert.equal(f.calls.cleanups,1);assert.equal(f.calls.logouts,1);assert.equal(f.calls.alerts.length,0);
});
test('local logout failure is still reported',async()=>{
    const f=screenFixture({signOut:async()=>{throw Error('storage unavailable');}});
    await f.logout();assert.equal(f.calls.alerts[0][0],'Đăng xuất thất bại');
});
function galleryFixture(params){
    const hooks=[];let cursor=0;
    const mod=load('screens/home/image-gallery/quaTrinhDetail.screen.tsx',{
        react:{...react,useState(initial){const i=cursor++;if(!(i in hooks))hooks[i]=initial;return [hooks[i],v=>hooks[i]=v];}},
        'react-native':{...Object.fromEntries(['View','Text','Image','TouchableOpacity','ActivityIndicator','Modal'].map(x=>[x,x])),Dimensions:{get:()=>({width:400,height:800})},Platform:{OS:'android'}},
        '@/components/common/CustomHeader':{__esModule:true,default:'Header'},
        '@/utils/uri':{SERVER_URL:'https://files.test/'},'@/constants':{icons:new Proxy({},{get:(_,key)=>key})},
        'react-native-image-zoom-viewer':{__esModule:true,default:'Viewer'},'expo-router':{useLocalSearchParams:()=>params},
    });
    return ()=>{cursor=0;return all(mod.default());};
}
test('7, 11 and 13 photos keep matching icons and zoom indexes',()=>{
    const order=[1,9,10,2,3,4,5,7,6,8,11,12,13];
    for(const count of [7,11,13]){
        const params=Object.fromEntries(order.slice(0,count).map(n=>['anh_'+n,'img/'+n+'.jpg']));
        const render=galleryFixture(params);let nodes=render();
        const buttons=nodes.filter(n=>n.type==='TouchableOpacity'&&n.props.className?.includes('w-[14.285'));
        assert.equal(buttons.length,count);
        buttons[count-1].props.onPress();nodes=render();
        const viewer=nodes.find(n=>n.type==='Viewer');assert.equal(viewer.props.index,count-1);
        assert.equal(viewer.props.imageUrls.length,count);
        assert.equal(viewer.props.imageUrls[count-1].url,'https://files.test/img/'+order[count-1]+'.jpg');
    }
});
test('missing and serialized null photos are omitted; empty albums have no spinner',()=>{
    const nodes=galleryFixture({anh_1:null,anh_2:'null',anh_3:'undefined',anh_4:' '})();
    assert.equal(nodes.find(n=>n.type==='Viewer').props.imageUrls.length,0);
    assert.equal(nodes.some(n=>n.type==='ActivityIndicator'),false);
    assert.ok(nodes.some(n=>n.props.children==='Chưa có ảnh quá trình'));
});
test('sparse albums retain the original photo icon and absolute URL',()=>{
    const nodes=galleryFixture({anh_12:'https://nas.test/xray.jpg'})();
    assert.equal(nodes.find(n=>n.type==='Viewer').props.imageUrls[0].url,'https://nas.test/xray.jpg');
    assert.ok(nodes.some(n=>n.type==='Image'&&n.props.source==='panoramaActive'));
});

test('profile loading waits for the API and ends immediately on success or failure',async()=>{
    for(const fail of [false,true]){
        const hooks=[];let cursor=0,effect,resolve,reject;
        const request=new Promise((yes,no)=>{resolve=yes;reject=no;});
        const mod=load('hooks/auth/useUser.tsx',{
            react:{...react,useEffect:fn=>{effect=fn;},useState(initial){const i=cursor++;if(!(i in hooks))hooks[i]=initial;return [hooks[i],v=>hooks[i]=v];}},
            axios:{__esModule:true,default:{defaults:{headers:{common:{}}},get:()=>request}},
            'expo-secure-store':{getItemAsync:async()=>'token'},'@/utils/uri':{SERVER_URI:'https://api.test'},
        });
        const render=()=>{cursor=0;return mod.default();};
        render();effect();await tick();assert.equal(render().loading,true);
        if(fail)reject(Error('offline'));else resolve({data:[{id:1,main_status:1}]});
        await tick();const result=render();assert.equal(result.loading,false);
        if(fail)assert.ok(result.error);else assert.equal(result.user.id,1);
    }
});
