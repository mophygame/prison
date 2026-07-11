const state = {
  mood: 50,
  honor: 50,
  photo: 0,
  selectedWindow: null,
  correctWindow: Math.floor(Math.random() * 6),
  uploadedFace: null,
  faceTransform: {
    x: 0,
    y: 0,
    scale: 1,
  },
  faceDrag: {
    active: false,
    lastX: 0,
    lastY: 0,
  },
  hasSnapshot: false,
  visit: {
    connected: false,
    insulted: false,
    expression: false,
    currentExpression: null,
  },
};

const screens = {
  choice: document.querySelector("#choiceScreen"),
  visit: document.querySelector("#visitScreen"),
  photo: document.querySelector("#photoScreen"),
};

const scoreEls = {
  mood: document.querySelector("#moodScore"),
  honor: document.querySelector("#honorScore"),
  photo: document.querySelector("#photoScore"),
};

const heroCanvas = document.querySelector("#heroCanvas");
const hero = heroCanvas.getContext("2d");
const mugshotCanvas = document.querySelector("#mugshotCanvas");
const mugshot = mugshotCanvas.getContext("2d");
const resultDialog = document.querySelector("#resultDialog");
const resultTitle = document.querySelector("#resultTitle");
const resultText = document.querySelector("#resultText");
const dialDialog = document.querySelector("#dialDialog");
const dialStatus = document.querySelector("#dialStatus");
const flash = document.querySelector("#flash");

const faceUpload = document.querySelector("#faceUpload");
const faceScaleSlider = document.querySelector("#faceScaleSlider");
const resetFaceButton = document.querySelector("#resetFaceButton");
const faceSelect = document.querySelector("#faceSelect");
const expressionToggle = document.querySelector("#expressionToggle");
const faceStickerSelect = document.querySelector("#faceStickerSelect");
const sloganInput = document.querySelector("#sloganInput");
const plateInput = document.querySelector("#plateInput");
const hairStyleSelect = document.querySelector("#hairStyleSelect");
const hairSlider = document.querySelector("#hairSlider");
const photoCaption = document.querySelector("#photoCaption");
const callButton = document.querySelector("#callButton");
const insultButton = document.querySelector("#insultButton");
const randomInsultButton = document.querySelector("#randomInsultButton");
const insultInput = document.querySelector("#insultInput");
const inmateFace = document.querySelector("#inmateFace");
const inmateReaction = document.querySelector("#inmateReaction");
const phoneStatus = document.querySelector("#phoneStatus");

const visitExpressions = [
  { id: "explode", label: "瞳孔地震", line: "對方眼睛瞬間放大，像剛被 Wi-Fi 密碼背叛。", rotate: -4, scale: 1.04, hue: 0 },
  { id: "cry", label: "委屈掉線", line: "對方假裝堅強，但汗滴已經替他先道歉。", rotate: 2, scale: 0.98, hue: 12 },
  { id: "smug", label: "欠揍微笑", line: "對方露出一個很想被加碼罵兩句的微笑。", rotate: 3, scale: 1, hue: -8 },
  { id: "freeze", label: "當場藍屏", line: "對方整個人定格，腦內系統正在重新開機。", rotate: 0, scale: 1.02, hue: 150 },
  { id: "meltdown", label: "五官離職", line: "對方五官各自提出離職，現場非常混亂。", rotate: -2, scale: 1.05, hue: 28 },
  { id: "explode", label: "泡麵爆雷", line: "他的表情像泡麵沒附叉子，人生突然失去方向。", rotate: 7, scale: 1.07, hue: 18 },
  { id: "cry", label: "滷蛋心碎", line: "他像滷蛋被切半，尊嚴也跟著裂開。", rotate: -6, scale: 0.96, hue: -12 },
  { id: "smug", label: "厚臉皮反彈", line: "他硬擠出微笑，但嘴角明顯在求救。", rotate: 8, scale: 1.01, hue: 34 },
  { id: "freeze", label: "訊號消失", line: "他整張臉斷線，只剩靈魂在轉圈圈。", rotate: -1, scale: 0.99, hue: 190 },
  { id: "meltdown", label: "眉毛罷工", line: "他的眉毛先離場，剩下五官自己開會。", rotate: 5, scale: 1.08, hue: -28 },
  { id: "explode", label: "襪子失蹤", line: "他震驚到像洗衣機吞掉了人生最後一隻襪子。", rotate: -9, scale: 1.06, hue: 42 },
  { id: "cry", label: "豆乾哀傷", line: "他委屈得像豆乾少拿一塊，眼神全是控訴。", rotate: 4, scale: 0.97, hue: 6 },
  { id: "smug", label: "嘴硬冠軍", line: "他明明破防，還要擺出我沒事的臉。", rotate: -7, scale: 1.03, hue: 58 },
  { id: "freeze", label: "腦袋藍屏", line: "他像舊電腦開太多分頁，直接停止回應。", rotate: 2, scale: 1, hue: 210 },
  { id: "meltdown", label: "臉部土石流", line: "他的表情開始往下滑，像情緒遇到颱風。", rotate: -5, scale: 1.1, hue: 78 },
  { id: "explode", label: "飯匙飛走", line: "他嚇到像便當盒打開卻沒有飯匙。", rotate: 10, scale: 1.05, hue: -34 },
  { id: "cry", label: "鼻酸套餐", line: "他看起來像剛點到沒有附湯的套餐。", rotate: -3, scale: 0.95, hue: 22 },
  { id: "smug", label: "尷尬營業笑", line: "他的笑容很努力，但良心已經下班。", rotate: 6, scale: 1.02, hue: -44 },
  { id: "freeze", label: "人格登出", line: "他整個人像帳號被登出，只剩空白頭像。", rotate: -2, scale: 1.04, hue: 166 },
  { id: "meltdown", label: "臉部熔斷", line: "他的臉像插座過載，五官開始冒煙。", rotate: 3, scale: 1.09, hue: 95 },
  { id: "explode", label: "雞排落地", line: "他的震驚程度約等於雞排剛買就掉地上。", rotate: -11, scale: 1.08, hue: 12 },
  { id: "cry", label: "眼神漏水", line: "他的眼神開始漏水，像冷氣滴在枕頭上。", rotate: 1, scale: 0.96, hue: -20 },
  { id: "smug", label: "裝懂大師", line: "他露出那種沒聽懂但還要點頭的表情。", rotate: -8, scale: 1.01, hue: 40 },
  { id: "freeze", label: "靈魂延遲", line: "他的靈魂延遲三秒，現在才收到你的攻擊。", rotate: 4, scale: 1.02, hue: 130 },
  { id: "meltdown", label: "下巴出走", line: "他的下巴像請特休，完全不想回到臉上。", rotate: 7, scale: 1.07, hue: -60 },
  { id: "explode", label: "鍵盤冒煙", line: "他像被連按十次 Enter，內心鍵盤正在冒煙。", rotate: 5, scale: 1.06, hue: 70 },
  { id: "cry", label: "早餐沒蛋", line: "他的委屈像早餐店忘記加蛋，世界失去秩序。", rotate: -4, scale: 0.98, hue: 32 },
  { id: "smug", label: "沒救的自信", line: "他自信得很突然，像答案錯了還圈起來。", rotate: 9, scale: 1.04, hue: 88 },
  { id: "freeze", label: "表情當機", line: "他的臉卡在載入畫面，進度條永遠 87%。", rotate: -6, scale: 1, hue: 178 },
  { id: "meltdown", label: "尊嚴融化", line: "他的尊嚴像冰淇淋掉進熱湯，救不回來。", rotate: -9, scale: 1.11, hue: 118 },
  { id: "explode", label: "發票沒中", line: "他震驚得像對完發票發現連尾數都沒有。", rotate: 12, scale: 1.05, hue: -18 },
  { id: "cry", label: "泡菜太酸", line: "他的臉皺成一團，像泡菜直接攻擊靈魂。", rotate: 5, scale: 0.97, hue: -38 },
  { id: "smug", label: "假裝淡定", line: "他裝得很淡定，但額頭已經開始開記者會。", rotate: -10, scale: 1.02, hue: 24 },
  { id: "freeze", label: "CPU 過熱", line: "他臉色發冷，但腦內 CPU 其實熱到降頻。", rotate: 3, scale: 1.03, hue: 220 },
  { id: "meltdown", label: "五官搬家", line: "他的五官像臨時搬家，地址還互相填錯。", rotate: 8, scale: 1.1, hue: -85 },
  { id: "explode", label: "珍奶沒珍珠", line: "他的眼神像珍奶裡沒有珍珠，荒謬到失語。", rotate: -12, scale: 1.07, hue: 52 },
  { id: "cry", label: "衛生紙剩一張", line: "他的悲傷像衛生紙盒只剩最後一張還破掉。", rotate: 2, scale: 0.95, hue: 46 },
  { id: "smug", label: "反省三秒", line: "他短暫反省三秒，然後又恢復欠揍模式。", rotate: 11, scale: 1.05, hue: -12 },
  { id: "freeze", label: "訊息已讀", line: "他的臉像訊息被已讀不回，空氣突然很冷。", rotate: -5, scale: 0.99, hue: 196 },
  { id: "meltdown", label: "自尊滑倒", line: "他的自尊踩到肥皂，滑得非常有戲。", rotate: -7, scale: 1.08, hue: 132 },
  { id: "explode", label: "便當翻車", line: "他像便當在書包裡翻車，內心全是醬汁。", rotate: 6, scale: 1.09, hue: 10 },
  { id: "cry", label: "提款失敗", line: "他的眼神像 ATM 顯示餘額不足，安靜又絕望。", rotate: -1, scale: 0.96, hue: -55 },
  { id: "smug", label: "錯字硬拗", line: "他像把錯字硬說成創意，嘴角非常忙。", rotate: 13, scale: 1.03, hue: 65 },
  { id: "freeze", label: "人生緩衝", line: "他的人生正在緩衝，請勿關閉視窗。", rotate: 1, scale: 1.01, hue: 240 },
  { id: "meltdown", label: "表情漏氣", line: "他的表情像氣球漏氣，越看越扁。", rotate: 4, scale: 1.12, hue: -105 },
  { id: "explode", label: "鬧鐘背叛", line: "他震驚得像鬧鐘沒響，卻還怪地球自轉。", rotate: -6, scale: 1.05, hue: 36 },
  { id: "cry", label: "湯匙不見", line: "他委屈到像拿到湯卻沒有湯匙，只能凝視人生。", rotate: 7, scale: 0.97, hue: 72 },
  { id: "smug", label: "輸了還嘴", line: "他輸得很明顯，但嘴巴堅持要加班。", rotate: -13, scale: 1.04, hue: -72 },
  { id: "freeze", label: "耳朵休眠", line: "他像聽懂了，又像耳朵先進入省電模式。", rotate: -3, scale: 1.02, hue: 112 },
  { id: "meltdown", label: "最後破防", line: "他終於破防，表情像資料夾被拖進資源回收桶。", rotate: 10, scale: 1.13, hue: 155 },
];

const reactionLines = [
  "對方整個人定格，腦內系統正在重新開機。",
  "對方眼神飄走，像靈魂先去福利社買飲料。",
  "對方嘴角抽了一下，尊嚴當場掉到桌底。",
  "對方開始假裝沒聽見，但耳朵已經出賣他。",
  "對方的表情像便當翻倒，醬汁流滿人生。",
  "對方瞳孔放大，像剛發現泡麵沒有調味包。",
  "對方臉色一沉，像手機只剩 1% 還找不到充電線。",
  "對方沉默三秒，空氣中飄出尷尬的警報聲。",
  "對方像被按下暫停鍵，連呼吸都在緩衝。",
  "對方努力微笑，但看起來像系統錯誤訊息。",
  "對方額頭冒汗，彷彿被人生點名回答問題。",
  "對方的自信瞬間縮水，像洗壞的毛衣。",
  "對方五官各自逃難，臉上只剩混亂排隊。",
  "對方皺成一團，像收到沒有附筷子的便當。",
  "對方眼睛失焦，像腦袋正在搜尋不存在的藉口。",
  "對方下巴差點掉下來，幸好玻璃先接住氣氛。",
  "對方的笑容裂開，像過期貼紙硬撕下來。",
  "對方整張臉變冷，像冷氣遙控器突然失蹤。",
  "對方開始眨眼求救，但現場沒有人想救。",
  "對方臉上寫著不服，字體還是標楷體。",
  "對方像聽到鬧鐘沒響，人生遲到三小時。",
  "對方的表情像提款失敗，安靜又無助。",
  "對方嘴硬到快冒煙，像鍵盤連按壞掉。",
  "對方臉部肌肉開會，結論是暫時停工。",
  "對方的靈魂慢半拍，剛剛才收到傷害通知。",
  "對方看起來像珍奶沒有珍珠，震驚中帶點空虛。",
  "對方眼角一抖，像發票差一號中獎。",
  "對方像被現實打卡，表情準時下班。",
  "對方整個人像舊電腦，風扇聲都快聽得見。",
  "對方的驕傲開始漏氣，越看越扁。",
  "對方嘴巴開了又關，像魚缸裡沒有台詞的魚。",
  "對方臉上浮現一種剛吃到牙膏橘子的痛苦。",
  "對方突然很安靜，像 Wi-Fi 名稱被改成你輸了。",
  "對方的表情彎掉，像雨傘被風吹反。",
  "對方像被老師抽問，答案還留在上輩子。",
  "對方眼神閃爍，像正在刪除瀏覽紀錄。",
  "對方的氣勢斷電，剩下外殼勉強發亮。",
  "對方臉部開始延遲，畫面和聲音不同步。",
  "對方像踩到樂高，尊嚴和腳底一起痛。",
  "對方的心防倒下，像紙杯遇到颱風。",
  "對方看起來像吃火鍋沒沾醬，人生突然很淡。",
  "對方整張臉寫著算你狠，但筆跡很抖。",
  "對方像輸入密碼三次錯誤，自己也被鎖住。",
  "對方一臉想反駁，但語言功能正在維修。",
  "對方眼神像未讀訊息，明明存在卻不想面對。",
  "對方被你罵到表情管理臨時請假。",
  "對方看起來像飲料封膜沒戳開，悶到不行。",
  "對方的腦袋轉了一圈，最後決定裝死。",
  "對方像迷路的游標，在臉上到處亂點。",
  "對方最後破防，表情像資料夾被拖進資源回收桶。",
];

const phonePickupLines = [
  "對方拿起電話：有話快說，我等等要回去排隊領豆乾。",
  "對方拿起電話：你最好是有帶好消息，不然我先掛精神上的。",
  "對方拿起電話：我剛把便當打開，你不要影響我跟滷蛋培養感情。",
  "對方拿起電話：講重點，我的自由時間比泡麵調味包還薄。",
  "對方拿起電話：你是不是又來展示語言攻擊天賦？",
  "對方拿起電話：我人在裡面，心已經排隊下班。",
  "對方拿起電話：先說好，今天不接受人生大道理。",
  "對方拿起電話：你聲音一出來，我牆上的壁癌都醒了。",
  "對方拿起電話：快講，我等等要去跟天花板對視。",
  "對方拿起電話：如果是借錢，我現在只剩尊嚴可以轉帳。",
  "對方拿起電話：這通電話有保固嗎？我怕心情壞掉。",
  "對方拿起電話：我剛在反省，反省到一半被你打斷了。",
  "對方拿起電話：不要罵太快，我拿筆記一下。",
  "對方拿起電話：你來得正好，我剛缺一點精神傷害。",
  "對方拿起電話：我現在很脆，請用低音量攻擊。",
  "對方拿起電話：如果你要笑我，請排隊，前面還有警衛。",
  "對方拿起電話：我今天已經很倒楣了，你要加菜嗎？",
  "對方拿起電話：你講話前先想一下，我耳朵還想活。",
  "對方拿起電話：這裡訊號不好，但你的嘲諷一定收得到。",
  "對方拿起電話：我先聲明，我的表情不代表我認輸。",
  "對方拿起電話：你是不是帶著嘴砲探監證來的？",
  "對方拿起電話：我剛睡醒，靈魂還在點名。",
  "對方拿起電話：今天菜色已經夠難吃了，你別再調味了。",
  "對方拿起電話：快點，我等等要去參加發呆大賽。",
  "對方拿起電話：如果是安慰，請直接跳到罵醒我。",
  "對方拿起電話：我現在心如止水，但你看起來像石頭。",
  "對方拿起電話：你這通電話感覺不單純，我先坐穩。",
  "對方拿起電話：不要講太深，我今天腦容量只剩半碗湯。",
  "對方拿起電話：你是不是又想讓我表情管理失業？",
  "對方拿起電話：我先把臉放鬆，等一下比較好崩。",
  "對方拿起電話：講吧，我的尊嚴已經繫好安全帶。",
  "對方拿起電話：你每次來，我的眉毛都會想請假。",
  "對方拿起電話：如果你要問我好不好，我建議你看背景。",
  "對方拿起電話：我剛跟牆壁聊天，它比你溫柔一點。",
  "對方拿起電話：這裡沒什麼娛樂，你可以開始傷害我了。",
  "對方拿起電話：你一句話最好值得我離開床板。",
  "對方拿起電話：我目前狀態是低電量，請勿長篇大論。",
  "對方拿起電話：你不要一開口就讓我想回去關機。",
  "對方拿起電話：今天我的耐心只有一張餐巾紙那麼厚。",
  "對方拿起電話：我聽著，但我的靈魂可能不在服務區。",
  "對方拿起電話：先不要情緒勒索，我這裡押金不夠。",
  "對方拿起電話：你如果是來講幹話，那我準備好了。",
  "對方拿起電話：我已經把臉擺好，請開始你的表演。",
  "對方拿起電話：你說話小心點，玻璃後面也是有自尊的。",
  "對方拿起電話：今天我只接受三種話，幹話、廢話、笑話。",
  "對方拿起電話：我剛被豆乾噎到，現在又要被你噎一次嗎？",
  "對方拿起電話：你是不是把良心寄放在門口置物櫃？",
  "對方拿起電話：如果這是關心，為什麼我已經想防禦？",
  "對方拿起電話：我的人生已經很像低配版了，你別更新。",
  "對方拿起電話：好，來吧，我的臉今天很有戲。",
];

const insultIdeas = [
  "你連泡麵調味包都撕歪",
  "你的人生像沒存檔就當機",
  "你講話比監獄菜湯還淡",
  "你的藉口連警衛都聽到打哈欠",
  "你是不是把腦袋寄放在置物櫃",
  "你連電風扇三段風速都能選錯",
  "你的人生規劃像早餐店菜單，很多但都很混亂",
  "你講話像沒加鹽的湯，存在但沒必要",
  "你是不是用試用版的大腦在過完整版人生",
  "你連自動門都要猶豫要不要幫你開",
  "你的判斷力像雨天穿拖鞋，滑得很自然",
  "你的人生像沒蓋好的便當，湯汁到處都是",
  "你講道理的樣子像印表機卡紙，努力但沒輸出",
  "你是不是把聰明留在上一個版本沒更新",
  "你連垃圾桶都會想把你分類成其他",
  "你的藉口像廉價雨衣，風一吹就破",
  "你的人生像鬧鐘貪睡，永遠晚五分鐘",
  "你講話像電梯音樂，大家聽到只想快點結束",
  "你是不是連 QR code 都掃出人生錯誤頁",
  "你的存在感像沒電的遙控器，按了也沒反應",
  "你連泡麵三分鐘都能煮成考古現場",
  "你的自信像夜市氣球，亮但很容易爆",
  "你講話比塑膠袋打結還難解",
  "你是不是把邏輯放進洗衣機脫水了",
  "你的人生像沒帶吸管的飲料，只能乾瞪眼",
  "你連路過都像迷路，氣質很有方向感問題",
  "你的嘴硬程度可以拿去鋪柏油路",
  "你講話像低電量通知，煩但不能忽略",
  "你是不是連微波爐都會對你按取消",
  "你的效率像冰箱裡的燈，只在門開時表演",
  "你的人生像壞掉的自動販賣機，投了努力也不出貨",
  "你講話像沒對焦的照片，重點永遠糊掉",
  "你連找藉口都像導航重算路線，一直迷航",
  "你的反省像限時動態，二十四小時後自動消失",
  "你是不是連便利商店店員都想對你按靜音",
  "你的氣勢像開封三天的洋芋片，軟掉得很徹底",
  "你講話像沒有字幕的外星廣播，聽起來很努力",
  "你的人生像被貓踩過的鍵盤，滿滿亂碼",
  "你是不是把常識設定成飛航模式",
  "你的計畫像紙吸管，還沒開始就軟了",
  "你連排隊都能排出支線任務",
  "你的腦袋像塞滿未讀訊息，重點永遠沉底",
  "你講話像沒轉緊的水龍頭，一直滴但沒用",
  "你是不是連影印機都會拒絕複製你的想法",
  "你的成熟度像半熟蛋，晃一下就破",
  "你的人生像錯過站的公車，越坐越不對",
  "你講話像自動更正，越改越離譜",
  "你是不是連計算機都算不出你的操作",
  "你的自尊像貼歪的保護貼，氣泡很多",
  "你連沉默都很吵，真的不簡單",
];

let audioContext;
let dialTimer;

function getAudioContext() {
  audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}

function playTone({ frequency = 440, duration = 0.08, type = "square", gain = 0.055, delay = 0 }) {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const volume = ctx.createGain();
  const start = ctx.currentTime + delay;
  const end = start + duration;
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  volume.gain.setValueAtTime(0.0001, start);
  volume.gain.exponentialRampToValueAtTime(gain, start + 0.012);
  volume.gain.exponentialRampToValueAtTime(0.0001, end);
  oscillator.connect(volume);
  volume.connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(end + 0.02);
}

function playButtonSound(kind = "tap") {
  const presets = {
    tap: [
      { frequency: 520, duration: 0.045, type: "triangle", gain: 0.04 },
      { frequency: 740, duration: 0.055, type: "triangle", gain: 0.035, delay: 0.035 },
    ],
    disabled: [{ frequency: 160, duration: 0.08, type: "sawtooth", gain: 0.03 }],
    success: [
      { frequency: 520, duration: 0.08, type: "sine", gain: 0.045 },
      { frequency: 880, duration: 0.11, type: "sine", gain: 0.045, delay: 0.075 },
    ],
    shutter: [
      { frequency: 180, duration: 0.035, type: "square", gain: 0.05 },
      { frequency: 90, duration: 0.07, type: "square", gain: 0.04, delay: 0.035 },
    ],
  };
  presets[kind].forEach(playTone);
}

function playDialSound() {
  [0, 0.42, 0.84].forEach((delay) => {
    playTone({ frequency: 430, duration: 0.16, type: "sine", gain: 0.05, delay });
    playTone({ frequency: 480, duration: 0.16, type: "sine", gain: 0.035, delay });
  });
}

function clearInmateExpression() {
  state.visit.currentExpression = null;
  inmateFace.dataset.expression = "idle";
  inmateFace.style.transform = "";
  inmateFace.style.filter = "";
}

function applyInmateExpression(expression) {
  state.visit.currentExpression = expression;
  inmateFace.dataset.expression = expression.id;
  const rotate = expression.rotate ?? 0;
  const scale = expression.scale ?? 1;
  const hue = expression.hue ?? 0;
  inmateFace.style.transform = `translate(-50%, -50%) rotate(${rotate}deg) scale(${scale})`;
  inmateFace.style.filter = `hue-rotate(${hue}deg) saturate(1.18)`;
}

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function updateScores() {
  scoreEls.mood.textContent = state.mood;
  scoreEls.honor.textContent = state.honor;
  scoreEls.photo.textContent = state.photo;
}

function drawHero() {
  const w = heroCanvas.width;
  const h = heroCanvas.height;
  hero.clearRect(0, 0, w, h);

  hero.fillStyle = "#2d3936";
  hero.fillRect(0, 0, w, h);

  hero.fillStyle = "#222b2a";
  hero.fillRect(0, 240, w, 100);

  hero.fillStyle = "#475955";
  for (let x = 38; x < w; x += 92) {
    hero.fillRect(x, 42, 40, 198);
  }

  hero.fillStyle = "#6b837b";
  hero.fillRect(0, 72, w, 22);
  hero.fillRect(0, 184, w, 22);

  hero.fillStyle = "#f3b84f";
  hero.beginPath();
  hero.arc(132, 66, 34, 0, Math.PI * 2);
  hero.fill();

  drawPerson(hero, 208, 215, "#71c7d3", "visitor");
  drawPerson(hero, 528, 215, "#ef7373", "prisoner");

  hero.fillStyle = "#141817";
  hero.fillRect(368, 112, 24, 132);
  hero.fillRect(344, 136, 72, 18);
  hero.fillRect(344, 202, 72, 18);

  hero.fillStyle = "#f8f5ea";
  hero.font = "900 28px system-ui";
  hero.fillText("探監", 158, 292);
  hero.fillText("拍照", 482, 292);
}

function drawPerson(ctx, x, y, color, type) {
  ctx.fillStyle = "#f0c493";
  ctx.beginPath();
  ctx.arc(x, y - 74, 34, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = type === "visitor" ? "#2c2a24" : "#111";
  ctx.fillRect(x - 30, y - 108, 60, 24);

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x - 48, y - 42, 96, 88, 16);
  ctx.fill();

  ctx.strokeStyle = "#151818";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(x - 12, y - 78, 2, 0, Math.PI * 2);
  ctx.arc(x + 14, y - 78, 2, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 4;
  ctx.beginPath();
  if (type === "visitor") {
    ctx.arc(x + 3, y - 66, 12, 0, Math.PI);
  } else {
    ctx.moveTo(x - 14, y - 60);
    ctx.lineTo(x + 14, y - 60);
  }
  ctx.stroke();
}

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.add("hidden"));
  screens[name].classList.remove("hidden");
  if (name === "photo") {
    drawMugshot();
  }
}

function updateVisitProgress() {
  const steps = [
    ["#visitStep1", state.visit.connected, "電話接通"],
    ["#visitStep2", state.visit.insulted, "送出幹話"],
    ["#visitStep3", state.visit.expression, "觸發荒謬表情"],
  ];

  steps.forEach(([selector, done, label]) => {
    const el = document.querySelector(selector);
    el.textContent = `${done ? "✓" : "□"} ${label}`;
    el.classList.toggle("done", done);
  });

  document.querySelector("#finishVisitButton").disabled = !(
    state.visit.connected &&
    state.visit.insulted &&
    state.visit.expression
  );
}

function callInmate() {
  clearTimeout(dialTimer);
  callButton.disabled = true;
  phoneStatus.textContent = "撥號中...";
  dialStatus.textContent = "嘟... 嘟... 嘟...";
  playDialSound();
  if (!dialDialog.open) {
    dialDialog.showModal();
  }

  dialTimer = setTimeout(() => {
    state.visit.connected = true;
    state.mood = clamp(state.mood + 6);
    phoneStatus.textContent = "已接通：對方開始後悔接電話";
    phoneStatus.classList.add("connected");
    callButton.disabled = false;
    insultButton.disabled = false;
    clearInmateExpression();
    inmateReaction.textContent = phonePickupLines[Math.floor(Math.random() * phonePickupLines.length)];
    document.querySelector("#visitPrompt").textContent =
      "電話接通了。現在可以輸入一句幹話，看看他的臉會怎麼崩。";
    dialStatus.textContent = "接通了，對方準備承受精神傷害。";
    playButtonSound("success");
    updateVisitProgress();
    updateScores();
    setTimeout(() => {
      if (dialDialog.open) {
        dialDialog.close();
      }
    }, 520);
  }, 1400);
}

function sendInsult() {
  const insult = insultInput.value.trim();
  if (!state.visit.connected) {
    playButtonSound("disabled");
    document.querySelector("#visitPrompt").textContent = "電話還沒接通，你罵的是玻璃，玻璃很無辜。";
    state.mood = clamp(state.mood - 2);
    updateScores();
    return;
  }

  const line = insult || "你沉默的樣子很像手機沒訊號";
  const reaction = visitExpressions[Math.floor(Math.random() * visitExpressions.length)];
  const reactionLine = reactionLines[Math.floor(Math.random() * reactionLines.length)];
  state.visit.insulted = true;
  state.visit.expression = true;
  state.mood = clamp(state.mood + 8);
  state.honor = clamp(state.honor - 5);
  applyInmateExpression(reaction);
  inmateReaction.textContent = `你說：「${line}」${reactionLine}`;
  document.querySelector("#visitPrompt").textContent = `表情抽中：${reaction.label}。可以繼續罵，他每次都會換一張臉。`;
  playButtonSound("success");
  updateVisitProgress();
  updateScores();
}

function randomizeInsult() {
  insultInput.value = insultIdeas[Math.floor(Math.random() * insultIdeas.length)];
  document.querySelector("#visitPrompt").textContent = "幹話已亂數產生。按送出看看玻璃後面那位怎麼接招。";
}

function wrapCanvasText(ctx, text, maxWidth) {
  const chars = [...text];
  const lines = [];
  let line = "";
  chars.forEach((char) => {
    const next = line + char;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = char;
    } else {
      line = next;
    }
  });
  if (line) {
    lines.push(line);
  }
  return lines.slice(0, 4);
}

function inlineComputedStyles(source, target) {
  const computed = getComputedStyle(source);
  const style = Array.from(computed)
    .map((property) => `${property}:${computed.getPropertyValue(property)};`)
    .join("");
  target.setAttribute("style", style);

  Array.from(source.children).forEach((sourceChild, index) => {
    inlineComputedStyles(sourceChild, target.children[index]);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image), { once: true });
    image.addEventListener("error", reject, { once: true });
    image.src = src;
  });
}

async function renderElementToImage(element) {
  const rect = element.getBoundingClientRect();
  const clone = element.cloneNode(true);
  inlineComputedStyles(element, clone);
  clone.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;
  clone.style.margin = "0";

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${rect.width}" height="${rect.height}" viewBox="0 0 ${rect.width} ${rect.height}">
      <foreignObject width="100%" height="100%">${new XMLSerializer().serializeToString(clone)}</foreignObject>
    </svg>
  `;
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
  try {
    return await loadImage(url);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function drawVisitSnapshotFace(ctx, expressionData, x, y, scale) {
  const expression = expressionData?.id || "idle";
  const rotate = expressionData?.rotate ?? 0;
  const expressionScale = expressionData?.scale ?? 1;
  const hue = expressionData?.hue ?? 0;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rotate * Math.PI) / 180);
  ctx.scale(scale * expressionScale, scale * expressionScale);
  if (ctx.filter !== undefined) {
    ctx.filter = `hue-rotate(${hue}deg) saturate(${expression === "idle" ? 1 : 1.18})`;
  }

  ctx.fillStyle = "#f0c493";
  ctx.beginPath();
  ctx.ellipse(0, 0, 95, 105, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(92, 59, 42, 0.16)";
  ctx.beginPath();
  ctx.ellipse(0, 55, 72, 35, 0, 0, Math.PI);
  ctx.fill();
  ctx.fillStyle = "#151515";
  ctx.beginPath();
  ctx.ellipse(0, -72, 77, 28, 0, Math.PI, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#101414";
  ctx.strokeStyle = "#101414";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";

  if (expression === "explode") {
    ctx.fillStyle = "#ef7373";
    ctx.beginPath();
    ctx.arc(-28, -2, 15, 0, Math.PI * 2);
    ctx.arc(28, -2, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#101414";
    ctx.beginPath();
    ctx.arc(-28, -2, 7, 0, Math.PI * 2);
    ctx.arc(28, -2, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 48, 26, 0, Math.PI * 2);
    ctx.stroke();
  } else if (expression === "cry") {
    ctx.beginPath();
    ctx.moveTo(-48, 0);
    ctx.lineTo(-12, 0);
    ctx.moveTo(12, 0);
    ctx.lineTo(48, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 58, 34, Math.PI, 0);
    ctx.stroke();
    ctx.fillStyle = "#71c7d3";
    ctx.beginPath();
    ctx.ellipse(48, -26, 9, 21, 0.25, 0, Math.PI * 2);
    ctx.fill();
  } else if (expression === "smug") {
    ctx.fillStyle = "#101414";
    ctx.beginPath();
    ctx.arc(-38, -2, 7, 0, Math.PI * 2);
    ctx.arc(28, -2, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-48, -22);
    ctx.lineTo(-18, -28);
    ctx.moveTo(18, -28);
    ctx.lineTo(48, -22);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(8, 48, 39, 0.05 * Math.PI, 0.73 * Math.PI);
    ctx.stroke();
  } else if (expression === "freeze") {
    ctx.fillStyle = "#f8f5ea";
    ctx.beginPath();
    ctx.arc(-28, -2, 16, 0, Math.PI * 2);
    ctx.arc(28, -2, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#101414";
    ctx.beginPath();
    ctx.arc(-28, -2, 7, 0, Math.PI * 2);
    ctx.arc(28, -2, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#101414";
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-30, 54);
    ctx.lineTo(30, 54);
    ctx.stroke();
  } else if (expression === "meltdown") {
    ctx.beginPath();
    ctx.arc(-30, 12, 8, 0, Math.PI * 2);
    ctx.arc(30, -8, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(-42, 50);
    ctx.quadraticCurveTo(0, 88, 48, 44);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(-30, -2, 8, 0, Math.PI * 2);
    ctx.arc(30, -2, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-28, 50);
    ctx.lineTo(28, 50);
    ctx.stroke();
  }

  ctx.restore();
}

async function downloadVisitSnapshot() {
  const canvas = document.createElement("canvas");
  canvas.width = 960;
  canvas.height = 720;
  const ctx = canvas.getContext("2d");
  const expression = state.visit.currentExpression || { id: inmateFace.dataset.expression || "idle" };
  const reaction = inmateReaction.textContent || "對方表情管理已宣告破產。";
  const boothGlass = document.querySelector(".booth-glass");

  ctx.fillStyle = "#121616";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#252d2b";
  ctx.fillRect(56, 52, 848, 580);
  ctx.strokeStyle = "#60706a";
  ctx.lineWidth = 16;
  ctx.strokeRect(96, 92, 768, 424);

  ctx.fillStyle = "rgba(113, 199, 211, 0.2)";
  ctx.fillRect(104, 100, 752, 408);
  ctx.fillStyle = "rgba(255,255,255,0.16)";
  ctx.save();
  ctx.translate(610, 70);
  ctx.rotate(0.28);
  ctx.fillRect(0, 0, 76, 520);
  ctx.restore();

  let usedDomSnapshot = false;
  if (boothGlass) {
    try {
      const boothImage = await renderElementToImage(boothGlass);
      ctx.drawImage(boothImage, 104, 100, 752, 408);
      usedDomSnapshot = true;
    } catch (error) {
      usedDomSnapshot = false;
    }
  }

  if (!usedDomSnapshot) {
    drawVisitSnapshotFace(ctx, expression, 480, 294, 1.35);
    ctx.fillStyle = "#f8f5ea";
    ctx.fillRect(116, 536, 728, 80);
    ctx.fillStyle = "#151818";
    ctx.font = "900 26px system-ui";
    wrapCanvasText(ctx, reaction, 680).forEach((line, index) => {
      ctx.fillText(line, 142, 572 + index * 30);
    });
  }

  ctx.strokeStyle = "#f3b84f";
  ctx.lineWidth = 10;
  ctx.strokeRect(36, 32, 888, 620);
  ctx.fillStyle = "#f3b84f";
  ctx.font = "900 30px system-ui";
  ctx.fillText("VISITATION SNAPSHOT", 112, 82);
  ctx.font = "900 20px system-ui";
  ctx.fillText(new Date().toLocaleString("zh-TW"), 650, 82);

  canvas.toBlob((blob) => {
    if (!blob) {
      return;
    }
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `visitation-photo-${Date.now()}.png`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, "image/png");
}

function finishVisit() {
  state.mood = clamp(state.mood + 15);
  state.honor = clamp(state.honor - 4);
  updateScores();
  playButtonSound("success");
  downloadVisitSnapshot();
  showResult("探監嘴砲完成", "你成功拍下對方被探監的崩壞照片，圖片已下載。");
}

function drawFittedText(ctx, text, x, y, maxWidth, maxSize) {
  const fallback = "我只是路過但姿勢很熟";
  const cleanText = (text || fallback).trim() || fallback;
  let size = maxSize;
  ctx.textAlign = "center";
  ctx.fillStyle = "#f8f5ea";
  ctx.strokeStyle = "#151818";
  ctx.lineWidth = 6;
  do {
    ctx.font = `900 ${size}px system-ui`;
    size -= 1;
  } while (ctx.measureText(cleanText).width > maxWidth && size > 16);
  ctx.strokeText(cleanText, x, y);
  ctx.fillText(cleanText, x, y);
  ctx.textAlign = "left";
}

function drawUploadedFace() {
  if (!state.uploadedFace) {
    return false;
  }

  mugshot.save();
  mugshot.beginPath();
  mugshot.arc(260, 210, 88, 0, Math.PI * 2);
  mugshot.clip();

  const img = state.uploadedFace;
  const scale = Math.max(176 / img.width, 176 / img.height) * state.faceTransform.scale;
  const width = img.width * scale;
  const height = img.height * scale;
  const x = 260 - width / 2 + state.faceTransform.x;
  const y = 210 - height / 2 + state.faceTransform.y;
  mugshot.drawImage(img, x, y, width, height);
  mugshot.restore();

  mugshot.strokeStyle = "#101414";
  mugshot.lineWidth = 5;
  mugshot.beginPath();
  mugshot.arc(260, 210, 90, 0, Math.PI * 2);
  mugshot.stroke();
  return true;
}

function drawPhotoExpressionOverlay(face) {
  if (face === "blank") {
    mugshot.fillStyle = "rgba(248, 245, 234, 0.92)";
    mugshot.beginPath();
    mugshot.arc(232, 208, 17, 0, Math.PI * 2);
    mugshot.arc(288, 208, 17, 0, Math.PI * 2);
    mugshot.fill();
    mugshot.fillStyle = "#101414";
    mugshot.beginPath();
    mugshot.arc(232, 208, 6, 0, Math.PI * 2);
    mugshot.arc(288, 208, 6, 0, Math.PI * 2);
    mugshot.fill();
    mugshot.strokeStyle = "#101414";
    mugshot.lineWidth = 5;
    mugshot.beginPath();
    mugshot.moveTo(238, 258);
    mugshot.lineTo(282, 258);
    mugshot.stroke();
    return;
  }

  if (face === "smirk") {
    mugshot.strokeStyle = "#101414";
    mugshot.lineWidth = 7;
    mugshot.lineCap = "round";
    mugshot.beginPath();
    mugshot.moveTo(214, 205);
    mugshot.quadraticCurveTo(232, 194, 250, 205);
    mugshot.moveTo(274, 205);
    mugshot.quadraticCurveTo(292, 194, 310, 205);
    mugshot.stroke();
    mugshot.beginPath();
    mugshot.arc(269, 250, 38, 0.02 * Math.PI, 0.72 * Math.PI);
    mugshot.stroke();
    mugshot.fillStyle = "rgba(243, 184, 79, 0.92)";
    mugshot.beginPath();
    mugshot.arc(320, 168, 14, 0, Math.PI * 2);
    mugshot.fill();
    return;
  }

  if (face === "panic") {
    mugshot.strokeStyle = "#101414";
    mugshot.lineWidth = 6;
    for (const x of [232, 288]) {
      mugshot.beginPath();
      mugshot.arc(x, 208, 18, 0, Math.PI * 2);
      mugshot.stroke();
      mugshot.beginPath();
      mugshot.moveTo(x - 12, 196);
      mugshot.lineTo(x + 12, 220);
      mugshot.moveTo(x + 12, 196);
      mugshot.lineTo(x - 12, 220);
      mugshot.stroke();
    }
    mugshot.beginPath();
    mugshot.arc(260, 260, 18, 0, Math.PI * 2);
    mugshot.stroke();
    mugshot.fillStyle = "#71c7d3";
    mugshot.beginPath();
    mugshot.ellipse(332, 224, 9, 20, 0.25, 0, Math.PI * 2);
    mugshot.fill();
    return;
  }

  mugshot.strokeStyle = "#101414";
  mugshot.lineWidth = 6;
  mugshot.lineCap = "round";
  mugshot.beginPath();
  mugshot.moveTo(216, 203);
  mugshot.lineTo(250, 196);
  mugshot.moveTo(270, 196);
  mugshot.lineTo(304, 203);
  mugshot.stroke();
  mugshot.beginPath();
  mugshot.moveTo(224, 254);
  mugshot.quadraticCurveTo(260, 282, 302, 248);
  mugshot.stroke();
  mugshot.fillStyle = "#f3b84f";
  mugshot.beginPath();
  mugshot.moveTo(205, 126);
  mugshot.lineTo(232, 92);
  mugshot.lineTo(260, 126);
  mugshot.lineTo(292, 92);
  mugshot.lineTo(318, 126);
  mugshot.closePath();
  mugshot.fill();
}

function drawFaceSticker(sticker) {
  if (sticker === "none") {
    return;
  }

  mugshot.save();
  mugshot.strokeStyle = "#101414";
  mugshot.fillStyle = "#101414";
  mugshot.lineCap = "round";
  mugshot.lineJoin = "round";

  if (sticker === "scar") {
    mugshot.strokeStyle = "#7f2020";
    mugshot.lineWidth = 7;
    mugshot.beginPath();
    mugshot.moveTo(302, 178);
    mugshot.lineTo(336, 224);
    mugshot.stroke();
    mugshot.lineWidth = 4;
    for (let i = 0; i < 4; i += 1) {
      const x = 307 + i * 8;
      const y = 186 + i * 11;
      mugshot.beginPath();
      mugshot.moveTo(x - 8, y + 4);
      mugshot.lineTo(x + 8, y - 4);
      mugshot.stroke();
    }
    mugshot.restore();
    return;
  }

  if (sticker === "mole" || sticker === "hairyMole") {
    mugshot.beginPath();
    mugshot.arc(313, 236, 8, 0, Math.PI * 2);
    mugshot.fill();
    if (sticker === "hairyMole") {
      mugshot.strokeStyle = "#101414";
      mugshot.lineWidth = 3;
      [-0.8, -0.25, 0.25, 0.8].forEach((angle, index) => {
        const length = 20 + index * 2;
        mugshot.beginPath();
        mugshot.moveTo(313, 232);
        mugshot.lineTo(313 + Math.cos(angle) * length, 232 + Math.sin(angle) * length);
        mugshot.stroke();
      });
    }
    mugshot.restore();
    return;
  }

  mugshot.strokeStyle = "#101414";
  mugshot.lineWidth = 10;
  mugshot.beginPath();
  mugshot.moveTo(214, 246);
  mugshot.quadraticCurveTo(238, 226, 260, 246);
  mugshot.quadraticCurveTo(284, 226, 308, 246);
  mugshot.stroke();
  mugshot.lineWidth = 6;
  mugshot.beginPath();
  mugshot.moveTo(260, 244);
  mugshot.lineTo(260, 264);
  mugshot.stroke();
  mugshot.restore();
}

function drawHair(style, volume) {
  const lift = volume / 100;
  mugshot.save();
  mugshot.fillStyle = "#151515";
  mugshot.strokeStyle = "#151515";
  mugshot.lineWidth = 10;
  mugshot.lineCap = "round";
  mugshot.lineJoin = "round";

  if (style === "bald") {
    mugshot.strokeStyle = "rgba(21, 21, 21, 0.42)";
    mugshot.lineWidth = 4;
    mugshot.beginPath();
    mugshot.arc(260, 144, 46, Math.PI * 1.08, Math.PI * 1.92);
    mugshot.stroke();
    mugshot.restore();
    return;
  }

  if (style === "spiky") {
    mugshot.beginPath();
    mugshot.moveTo(176, 154);
    for (let i = 0; i <= 7; i += 1) {
      const x = 176 + i * 24;
      const peak = 104 - lift * 42 - (i % 2) * 10;
      mugshot.lineTo(x + 11, peak);
      mugshot.lineTo(x + 22, 154);
    }
    mugshot.closePath();
    mugshot.fill();
    mugshot.restore();
    return;
  }

  if (style === "middle") {
    mugshot.beginPath();
    mugshot.ellipse(226, 146, 56, 38 + lift * 18, -0.28, Math.PI, Math.PI * 2);
    mugshot.ellipse(294, 146, 56, 38 + lift * 18, 0.28, Math.PI, Math.PI * 2);
    mugshot.fill();
    mugshot.strokeStyle = "#f0c493";
    mugshot.lineWidth = 5;
    mugshot.beginPath();
    mugshot.moveTo(260, 112);
    mugshot.lineTo(260, 164);
    mugshot.stroke();
    mugshot.restore();
    return;
  }

  if (style === "bangs") {
    mugshot.beginPath();
    mugshot.ellipse(260, 142, 94, 38 + lift * 20, 0, Math.PI, Math.PI * 2);
    mugshot.fill();
    for (let x = 178; x <= 326; x += 22) {
      mugshot.beginPath();
      mugshot.roundRect(x, 128, 18, 36 + lift * 26, 8);
      mugshot.fill();
    }
    mugshot.restore();
    return;
  }

  if (style === "slick") {
    mugshot.beginPath();
    mugshot.ellipse(260, 142, 96, 30 + lift * 12, -0.1, Math.PI, Math.PI * 2);
    mugshot.fill();
    mugshot.strokeStyle = "#373737";
    mugshot.lineWidth = 4;
    for (let x = 198; x <= 318; x += 24) {
      mugshot.beginPath();
      mugshot.moveTo(x, 132);
      mugshot.quadraticCurveTo(x + 20, 118 - lift * 14, x + 48, 136);
      mugshot.stroke();
    }
    mugshot.restore();
    return;
  }

  if (style === "afro") {
    const radius = 34 + lift * 16;
    const points = [
      [196, 138],
      [224, 108],
      [260, 98],
      [298, 108],
      [326, 138],
      [206, 170],
      [260, 160],
      [314, 170],
    ];
    points.forEach(([x, y]) => {
      mugshot.beginPath();
      mugshot.arc(x, y, radius, 0, Math.PI * 2);
      mugshot.fill();
    });
    mugshot.restore();
    return;
  }

  if (style === "cap") {
    mugshot.fillStyle = "#f3b84f";
    mugshot.beginPath();
    mugshot.ellipse(260, 132, 82, 34, 0, Math.PI, Math.PI * 2);
    mugshot.fill();
    mugshot.fillRect(190, 132, 140, 34);
    mugshot.fillStyle = "#151818";
    mugshot.font = "900 22px system-ui";
    mugshot.textAlign = "center";
    mugshot.fillText("囚", 260, 157);
    mugshot.textAlign = "left";
    mugshot.restore();
    return;
  }

  mugshot.beginPath();
  mugshot.ellipse(260, 144, 92, 28 + volume / 5, 0, Math.PI, Math.PI * 2);
  mugshot.fill();
  for (let x = 190; x <= 330; x += 28) {
    mugshot.fillRect(x, 132, 16, 18 + volume / 6);
  }
  mugshot.restore();
}

function drawCartoonFace(face) {
  mugshot.fillStyle = "#f0c493";
  mugshot.beginPath();
  mugshot.arc(260, 210, 88, 0, Math.PI * 2);
  mugshot.fill();

  mugshot.fillStyle = "#f0c493";
  mugshot.beginPath();
  mugshot.arc(175, 214, 18, 0, Math.PI * 2);
  mugshot.arc(345, 214, 18, 0, Math.PI * 2);
  mugshot.fill();

  mugshot.fillStyle = "#101414";
  const eyeY = face === "panic" ? 204 : 212;
  mugshot.beginPath();
  mugshot.arc(232, eyeY, face === "panic" ? 8 : 5, 0, Math.PI * 2);
  mugshot.arc(288, eyeY, face === "panic" ? 8 : 5, 0, Math.PI * 2);
  mugshot.fill();

  mugshot.strokeStyle = "#101414";
  mugshot.lineWidth = 6;
  mugshot.lineCap = "round";
  mugshot.beginPath();
  if (face === "smirk") {
    mugshot.arc(268, 254, 34, 0.05 * Math.PI, 0.8 * Math.PI);
  } else if (face === "panic") {
    mugshot.arc(260, 258, 16, 0, Math.PI * 2);
  } else if (face === "proud") {
    mugshot.moveTo(228, 256);
    mugshot.quadraticCurveTo(260, 278, 300, 250);
  } else {
    mugshot.moveTo(232, 260);
    mugshot.lineTo(292, 260);
  }
  mugshot.stroke();
}

function drawMugshot() {
  const w = mugshotCanvas.width;
  const h = mugshotCanvas.height;
  const hair = Number(hairSlider.value);
  const hairStyle = hairStyleSelect.value;
  const face = faceSelect.value;
  const showExpression = expressionToggle.checked;
  const faceSticker = faceStickerSelect.value;
  const plate = plateInput.value.trim() || "NO. 0000";
  const slogan = sloganInput.value.trim() || "我只是路過但姿勢很熟";

  mugshot.clearRect(0, 0, w, h);
  mugshot.fillStyle = "#d8d4c8";
  mugshot.fillRect(0, 0, w, h);

  mugshot.strokeStyle = "#9da29b";
  mugshot.lineWidth = 2;
  for (let y = 86; y < 430; y += 58) {
    mugshot.beginPath();
    mugshot.moveTo(46, y);
    mugshot.lineTo(w - 46, y);
    mugshot.stroke();
  }

  mugshot.fillStyle = "#1d2423";
  mugshot.fillRect(0, 0, w, 76);
  mugshot.fillRect(0, 430, w, 130);
  drawFittedText(mugshot, slogan, 260, 49, 450, 26);

  mugshot.fillStyle = "#ef7373";
  mugshot.beginPath();
  mugshot.roundRect(158, 302, 204, 128, 18);
  mugshot.fill();

  const hasPhotoFace = drawUploadedFace();

  drawHair(hairStyle, hair);

  if (!hasPhotoFace) {
    drawCartoonFace(showExpression ? face : "blank");
  } else {
    if (showExpression) {
      drawPhotoExpressionOverlay(face);
    }
  }
  drawFaceSticker(faceSticker);

  mugshot.fillStyle = "#f8f5ea";
  mugshot.fillRect(148, 344, 224, 66);
  mugshot.fillStyle = "#151818";
  mugshot.font = "900 34px system-ui";
  mugshot.textAlign = "center";
  mugshot.fillText(plate.slice(0, 10), 260, 389);
  mugshot.textAlign = "left";

  mugshot.fillStyle = "#f8f5ea";
  mugshot.font = "900 15px system-ui";
  mugshot.fillText("DOWNLOADABLE EVIDENCE PHOTO", 136, 458);
}

function getCanvasPoint(event) {
  const rect = mugshotCanvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * mugshotCanvas.width,
    y: ((event.clientY - rect.top) / rect.height) * mugshotCanvas.height,
  };
}

function isInsideFaceArea(point) {
  return Math.hypot(point.x - 260, point.y - 210) <= 100;
}

function resetFaceTransform() {
  state.faceTransform = {
    x: 0,
    y: 0,
    scale: 1,
  };
  faceScaleSlider.value = "100";
  drawMugshot();
}

function setFaceControlsEnabled(enabled) {
  faceScaleSlider.disabled = !enabled;
  resetFaceButton.disabled = !enabled;
}

function startFaceDrag(event) {
  if (!state.uploadedFace) {
    return;
  }
  const point = getCanvasPoint(event);
  if (!isInsideFaceArea(point)) {
    return;
  }
  state.faceDrag.active = true;
  state.faceDrag.lastX = point.x;
  state.faceDrag.lastY = point.y;
  mugshotCanvas.classList.add("dragging");
  mugshotCanvas.setPointerCapture?.(event.pointerId);
  event.preventDefault();
}

function moveFaceDrag(event) {
  if (!state.faceDrag.active) {
    return;
  }
  const point = getCanvasPoint(event);
  state.faceTransform.x += point.x - state.faceDrag.lastX;
  state.faceTransform.y += point.y - state.faceDrag.lastY;
  state.faceDrag.lastX = point.x;
  state.faceDrag.lastY = point.y;
  drawMugshot();
}

function stopFaceDrag(event) {
  if (!state.faceDrag.active) {
    return;
  }
  state.faceDrag.active = false;
  mugshotCanvas.classList.remove("dragging");
  mugshotCanvas.releasePointerCapture?.(event.pointerId);
}

function handleFaceUpload(event) {
  const file = event.target.files?.[0];
  if (!file) {
    state.uploadedFace = null;
    resetFaceTransform();
    setFaceControlsEnabled(false);
    drawMugshot();
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const img = new Image();
    img.addEventListener("load", () => {
      state.uploadedFace = img;
      resetFaceTransform();
      setFaceControlsEnabled(true);
      state.photo = clamp(state.photo + 18);
      photoCaption.textContent = "臉已替換。可以拖曳照片位置，也可以用縮放調整大小。";
      updateScores();
      drawMugshot();
    });
    img.src = reader.result;
  });
  reader.readAsDataURL(file);
}

function downloadMugshot() {
  drawMugshot();
  mugshotCanvas.toBlob((blob) => {
    if (!blob) {
      photoCaption.textContent = "下載失敗，再拍一次看看。";
      return;
    }
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `prison-photo-${Date.now()}.png`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    state.hasSnapshot = true;
    photoCaption.textContent = "照片已下載成 PNG。";
  }, "image/png");
}

function snapPhoto() {
  flash.classList.remove("active");
  void flash.offsetWidth;
  flash.classList.add("active");
  playButtonSound("shutter");

  const bonus = state.uploadedFace ? 28 : faceSelect.value === "panic" ? 22 : 14;
  state.photo = clamp(state.photo + bonus);
  state.mood = clamp(state.mood + 6);
  state.honor = clamp(state.honor - 4);
  updateScores();
  drawMugshot();
  downloadMugshot();

  if (state.photo >= 100) {
    showResult("犯人照完成", "荒謬度滿分，照片已下載。這張可以直接放進人生黑歷史資料夾。");
  }
}

function randomizePhoto() {
  const faces = ["blank", "smirk", "panic", "proud"];
  const stickers = ["none", "scar", "mole", "hairyMole", "mustache"];
  const hairstyles = ["short", "spiky", "middle", "bangs", "slick", "afro", "bald", "cap"];
  const slogans = [
    "我只是路過但姿勢很熟",
    "這不是犯罪這是誤會的美學",
    "手機沒電所以人生也沒電",
    "本人拒絕承認髮型參與此案",
    "請把滷肉飯列入證物",
  ];
  faceSelect.value = faces[Math.floor(Math.random() * faces.length)];
  expressionToggle.checked = Math.random() > 0.2;
  faceStickerSelect.value = stickers[Math.floor(Math.random() * stickers.length)];
  hairStyleSelect.value = hairstyles[Math.floor(Math.random() * hairstyles.length)];
  hairSlider.value = String(Math.floor(Math.random() * 101));
  plateInput.value = `NO. ${Math.floor(1000 + Math.random() * 9000)}`;
  sloganInput.value = slogans[Math.floor(Math.random() * slogans.length)];
  state.photo = clamp(state.photo + 8);
  updateScores();
  photoCaption.textContent = "造型師把你交給命運處理。";
  drawMugshot();
}

function showResult(title, text) {
  resultTitle.textContent = title;
  resultText.textContent = text;
  resultDialog.showModal();
}

function resetGame() {
  clearTimeout(dialTimer);
  state.mood = 50;
  state.honor = 50;
  state.photo = 0;
  state.selectedWindow = null;
  state.correctWindow = Math.floor(Math.random() * 6);
  state.uploadedFace = null;
  state.faceDrag.active = false;
  state.faceTransform = {
    x: 0,
    y: 0,
    scale: 1,
  };
  state.hasSnapshot = false;
  state.visit = {
    connected: false,
    insulted: false,
    expression: false,
    currentExpression: null,
  };
  faceUpload.value = "";
  faceScaleSlider.value = "100";
  setFaceControlsEnabled(false);
  faceSelect.value = "blank";
  expressionToggle.checked = true;
  faceStickerSelect.value = "none";
  hairStyleSelect.value = "short";
  sloganInput.value = "我只是路過但姿勢很熟";
  plateInput.value = "NO. 9527";
  hairSlider.value = "45";
  insultInput.value = "你連泡麵調味包都撕歪";
  clearInmateExpression();
  inmateReaction.textContent = "電話還沒接通，他假裝沒看到你。";
  phoneStatus.textContent = "未接通";
  phoneStatus.classList.remove("connected");
  callButton.disabled = false;
  insultButton.disabled = true;
  if (dialDialog.open) {
    dialDialog.close();
  }
  document.querySelector("#visitPrompt").textContent =
    "先播電話，接通後輸入一句話罵對方，他會隨機露出 50 種荒謬表情。";
  photoCaption.textContent = "可以上傳照片替換人臉，再輸入自己的幹話。";
  updateVisitProgress();
  updateScores();
  drawHero();
  drawMugshot();
  showScreen("choice");
}

document.querySelectorAll(".choice-card").forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.route));
});

document.querySelectorAll("[data-back]").forEach((button) => {
  button.addEventListener("click", () => showScreen("choice"));
});

document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }
  if (button.disabled) {
    playButtonSound("disabled");
    return;
  }
  if (button.id === "snapButton" || button.id === "callButton") {
    return;
  }
  playButtonSound("tap");
});

document.querySelector("#resetButton").addEventListener("click", resetGame);
callButton.addEventListener("click", callInmate);
insultButton.addEventListener("click", sendInsult);
randomInsultButton.addEventListener("click", randomizeInsult);
insultInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendInsult();
  }
});
document.querySelector("#finishVisitButton").addEventListener("click", finishVisit);
document.querySelector("#snapButton").addEventListener("click", snapPhoto);
document.querySelector("#randomButton").addEventListener("click", randomizePhoto);
document.querySelector("#closeDialogButton").addEventListener("click", () => resultDialog.close());
faceUpload.addEventListener("change", handleFaceUpload);
faceScaleSlider.addEventListener("input", () => {
  state.faceTransform.scale = Number(faceScaleSlider.value) / 100;
  drawMugshot();
});
resetFaceButton.addEventListener("click", resetFaceTransform);
mugshotCanvas.addEventListener("pointerdown", startFaceDrag);
mugshotCanvas.addEventListener("pointermove", moveFaceDrag);
mugshotCanvas.addEventListener("pointerup", stopFaceDrag);
mugshotCanvas.addEventListener("pointercancel", stopFaceDrag);
mugshotCanvas.addEventListener("pointerleave", stopFaceDrag);

[faceSelect, expressionToggle, faceStickerSelect, hairStyleSelect, sloganInput, plateInput, hairSlider].forEach((input) => {
  input.addEventListener("input", drawMugshot);
});

resetGame();
