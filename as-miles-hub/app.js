// ==========================================================================
// AS Miles Hub - Interactive Logic & Calculations
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initNavigationTabs();
    initItineraryTimeline();
    initInteractiveCalculator();
    initPointsTracker();
});

/* --------------------------------------------------------------------------
   1. Theme Toggle (Dark Mode / Light Mode)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
    const themeBtn = document.getElementById('themeToggle');
    const htmlEl = document.documentElement;

    // 檢查 localStorage 歷史紀錄
    const savedTheme = localStorage.getItem('as_miles_theme') || 'dark';
    htmlEl.setAttribute('data-theme', savedTheme);

    themeBtn.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('as_miles_theme', newTheme);
    });
}

/* --------------------------------------------------------------------------
   2. Main Navigation Tabs Switching
   -------------------------------------------------------------------------- */
function initNavigationTabs() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // 切換按鈕 active
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 切換頁面 active
            tabPanels.forEach(panel => {
                if (panel.id === targetTab) {
                    panel.classList.add('active');
                } else {
                    panel.classList.remove('active');
                }
            });
        });
    });
}

/* --------------------------------------------------------------------------
   3. 12-Day Itinerary Dynamic Renderer
   -------------------------------------------------------------------------- */
const ITINERARY_DATA = {
    1: {
        title: "Day 1：華航/國泰抵達倫敦 ➡️ 初探泰晤士河夜景",
        light: "🌆 傍晚 16:30 ~ 20:00 抵達（黃昏轉黑夜）",
        schedule: [
            { time: "16:30 / 20:00", title: "抵達倫敦希斯洛 (LHR)", desc: "辦理入境、提取行李，搭乘 Heathrow Express 快線或地鐵進入倫敦市區飯店 Check-in。" },
            { time: "18:30 - 20:30", title: "泰晤士河夜景散步", desc: "漫步至大笨鐘 (Big Ben)、國會大廈與倫敦眼 (London Eye) 欣賞璀璨燈火。" },
            { time: "20:30", title: "英式 Pub 晚餐", desc: "在經典英式酒吧享用炸魚薯條 (Fish & Chips) 搭配精釀啤酒。" }
        ],
        hotel: "倫敦市區飯店 (Soho / Covent Garden)"
    },
    2: {
        title: "Day 2：倫敦大英博物館 ➡️ 皇家衛兵 ➡️ 音樂劇盛宴",
        light: "☀️ 日間亮光 (09:00 - 16:30)",
        schedule: [
            { time: "09:30 - 12:00", title: "大英博物館 (British Museum)", desc: "朝聖埃及木乃伊與羅塞塔石碑（建議提前線上預約免費入場）。" },
            { time: "12:30 - 14:00", title: "白金漢宮衛兵交接", desc: "觀賞帥氣的英國皇家衛兵交接儀式。" },
            { time: "14:30 - 17:30", title: "科芬園 (Covent Garden)", desc: "漫步文青市集、品嚐卡諾里捲與街頭藝人表演。" },
            { time: "19:30", title: "西區看音樂劇", desc: "觀賞經典名劇《歌劇魅影》或《悲慘世界》，感受頂級視聽震撼。" }
        ],
        hotel: "倫敦市區飯店"
    },
    3: {
        title: "Day 3：倫敦聖誕燈飾 ➡️ 波羅市場美食 ➡️ Sky Garden 夜景",
        light: "🎄 11月中旬首波聖誕燈飾發光時刻",
        schedule: [
            { time: "10:00 - 12:00", title: "聖保羅大教堂 ➡️ 千禧橋", desc: "橫跨千禧橋前往泰特現代藝術館。" },
            { time: "12:30 - 14:30", title: "波羅市場 (Borough Market)", desc: "倫敦最古老美食市集，享用生蠔、松露起司通心粉與黑松露燉飯。" },
            { time: "16:00 - 18:00", title: "攝政街 (Regent Street) 聖誕飛天天使燈", desc: "欣賞 11 月開跑的亮麗聖誕燈飾海。" },
            { time: "18:30", title: "Sky Garden 觀景台", desc: "免費預約 360 度俯瞰倫敦夜景。" }
        ],
        hotel: "倫敦市區飯店"
    },
    4: {
        title: "Day 4：easyJet 飛冰島 ➡️ 藍湖溫泉 (Blue Lagoon)",
        light: "🌋 冰島初體驗（14:45 到達 ➡️ 16:00 天黑泡湯）",
        schedule: [
            { time: "08:30 - 11:30", title: "前往蓋威克機場 (LGW)", desc: "搭乘 easyJet 飛往冰島 KEF 機場（使用阿聯酋哩程全額兌換）。" },
            { time: "14:45 - 15:30", title: "抵達冰島 KEF 取車", desc: "提取 4WD SUV，確認全額保險車況。" },
            { time: "16:00 - 19:30", title: "藍湖溫泉 (Blue Lagoon)", desc: "在冷冽空氣中敷火山泥面膜，浸泡夢幻 Tiffany 藍火山溫泉。" },
            { time: "20:30", title: "雷克雅維克晚餐", desc: "品嚐熱騰騰的冰島羊肉湯與魚排。" }
        ],
        hotel: "雷克雅維克市區飯店"
    },
    5: {
        title: "Day 5：冰島黃金圈 (Golden Circle) ➡️ 追極光",
        light: "❄️ 6小時日照 (10:00 日出 - 16:00 日落)",
        schedule: [
            { time: "08:30 - 10:00", title: "【黑夜拉車】出發前往黃金圈", desc: "天黑開車，抵達時剛好天亮！" },
            { time: "10:00 - 12:00", title: "辛格韋德利國家公園", desc: "行走在北美與歐亞板塊大裂縫之間。" },
            { time: "12:30 - 14:00", title: "蓋錫爾間歇泉 (Geysir)", desc: "親眼目睹 Strokkur 間歇泉每 5 分鐘衝上 20 米高空。" },
            { time: "14:30 - 16:00", title: "黃金瀑布 (Gullfoss)", desc: "低角度夕陽照耀下的雙層黃金瀑布。" },
            { time: "21:00", title: "鄉間木屋追極光 🌌", desc: "光害極低，開門即可抬頭觀賞綠色極光舞動。" }
        ],
        hotel: "海拉 (Hella) / 塞里雅蘭鄉間木屋"
    },
    6: {
        title: "Day 6：冰島南岸雙瀑布 ➡️ 雷尼斯黑沙灘",
        light: "🌅 14:30 魔幻低角度夕陽光影",
        schedule: [
            { time: "09:00 - 11:30", title: "塞里雅蘭瀑布 (Seljalandsfoss)", desc: "走進瀑布後方的水濂洞奇景（記得穿防水外套）。" },
            { time: "12:00 - 14:00", title: "斯科加爾瀑布 (Skógafoss)", desc: "磅礡彩虹瀑布，爬上頂端俯瞰南岸平原。" },
            { time: "14:30 - 16:00", title: "雷尼斯黑沙灘 (Reynisfjara)", desc: "玄武岩石柱海蝕洞，夕陽餘暉照射在黑沙灘與巨浪上。" },
            { time: "17:00", title: "維克鎮 (Vík) 入住與龍蝦餐", desc: "享用美味小鎮龍蝦湯。" }
        ],
        hotel: "維克鎮 (Vík) 特色飯店"
    },
    7: {
        title: "Day 7：瓦特納冰川【藍冰洞探險】➡️ 傑古沙龍冰河湖",
        light: "🧊 11月限定重頭戲！藍冰洞 10:00 - 13:00",
        schedule: [
            { time: "09:00 - 10:00", title: "前往瓦特納冰川國家公園", desc: "集合穿上冰爪與安全頭盔。" },
            { time: "10:00 - 13:00", title: "【藍冰洞探險 Blue Ice Cave】", desc: "專業嚮導帶領進入萬年冰川底下的天然水晶藍冰洞！" },
            { time: "13:30 - 15:30", title: "傑古沙龍冰河湖 & 鑽石沙灘", desc: "觀賞漂浮浮冰與散落黑沙灘上如鑽石璀璨的透明冰塊。" }
        ],
        hotel: "維克鎮 (Vík) 或 西部飯店"
    },
    8: {
        title: "Day 8：【12天專屬】斯奈山半島深度遊 (教堂山 Kirkjufell)",
        light: "🏔️ 冰島的縮影全集錦",
        schedule: [
            { time: "09:30 - 11:00", title: "布迪爾黑教堂 (Búðakirkja)", desc: "拍攝屹立在荒野雪原中的孤獨黑色教堂。" },
            { time: "11:30 - 13:30", title: "Arnarstapi 漁村海岸步道", desc: "欣賞巨型玄武岩拱門海蝕洞。" },
            { time: "14:00 - 16:00", title: "【教堂山 Kirkjufell】", desc: "《權力遊戲》地標！草帽形教堂山與瀑布合影。" }
        ],
        hotel: "雷克雅維克市區飯店"
    },
    9: {
        title: "Day 9：雷克雅維克漫活 ➡️ Sky Lagoon 海景溫泉",
        light: "♨️ 17:00 天黑後無邊際溫泉",
        schedule: [
            { time: "10:00 - 12:30", title: "哈爾格林姆教堂 ➡️ 太陽航海者", desc: "登頂俯瞰彩色矮房，品嚐 Bæjarins Beztu 羊肉熱狗。" },
            { time: "14:00 - 16:00", title: "Laugavegur 購物街採購", desc: "購買冰島毛衣 (Lopapeysa) 與火山泥保養品。" },
            { time: "17:00 - 20:00", title: "【Sky Lagoon 海景溫泉】", desc: "崖邊無邊際溫泉，體驗獨家 7 步水療儀式 (7-Step Ritual)。" }
        ],
        hotel: "雷克雅維克市區飯店"
    },
    10: {
        title: "Day 10：冰島飛回倫敦 ➡️ 海德公園 Winter Wonderland",
        light: "🎄 17:00 進入歡樂聖誕嘉年華",
        schedule: [
            { time: "10:20 - 13:30", title: "easyJet 飛回倫敦 (LGW)", desc: "抵達倫敦搭車進市區 Check-in。" },
            { time: "17:00 - 21:00", title: "海德公園 Winter Wonderland", desc: "體驗全球頂級聖誕樂園、摩天輪、熱紅酒與聖誕市集。" }
        ],
        hotel: "倫敦市區飯店"
    },
    11: {
        title: "Day 11：Harrods 皇家百貨 ➡️ 華航/國泰登機返家",
        light: "☕ 14:00 英式下午茶 ➡️ 21:10 登機",
        schedule: [
            { time: "10:30 - 13:30", title: "Harrods / Selfridges 百貨採購", desc: "選購茶葉、精品與倫敦伴手禮。" },
            { time: "14:00 - 16:00", title: "正統英式三層下午茶", desc: "品嚐外酥內軟司康 (Scone) 搭配凝塊奶油。" },
            { time: "18:00 - 21:10", title: "前往希斯洛機場 (LHR) 登機", desc: "辦理退稅、進貴賓室休息，搭機返回台北/香港。" }
        ],
        hotel: "夜宿飛機上"
    },
    12: {
        title: "Day 12：滿載而歸抵達台北",
        light: "🛬 18:30 順利返抵國門",
        schedule: [
            { time: "18:30", title: "抵達台北桃園國際機場 (TPE)", desc: "結束完美的 12 天倫敦聖誕與冰島極光雙城大滿貫之旅！" }
        ],
        hotel: "溫暖的家"
    }
};

function initItineraryTimeline() {
    const dayBtns = document.querySelectorAll('.day-btn');
    const container = document.getElementById('dayDetailContainer');

    function renderDay(dayNum) {
        const data = ITINERARY_DATA[dayNum];
        if (!data) return;

        let scheduleHtml = data.schedule.map(item => `
            <div class="itin-item">
                <span class="itin-time">${item.time}</span>
                <div class="itin-body">
                    <h4>${item.title}</h4>
                    <p>${item.desc}</p>
                </div>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="itin-header">
                <div class="itin-day-title">${data.title}</div>
                <span class="light-tag">${data.light}</span>
            </div>
            <div class="itin-timeline">
                ${scheduleHtml}
            </div>
            <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px dashed var(--border-color); font-size: 0.9rem; color: var(--accent-blue);">
                🏨 <strong>當晚住宿安排：</strong> ${data.hotel}
            </div>
        `;
    }

    dayBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const dayNum = btn.getAttribute('data-day');
            dayBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderDay(dayNum);
        });
    });

    // 預設渲染 Day 1
    renderDay(1);
}

/* --------------------------------------------------------------------------
   4. Interactive Budget Calculator Engine
   -------------------------------------------------------------------------- */
function initInteractiveCalculator() {
    const flightSelect = document.getElementById('flightSelect');
    const asBonusSelect = document.getElementById('asBonusSelect');
    const asDiscountGroup = document.getElementById('asDiscountGroup');
    const peopleRadios = document.querySelectorAll('input[name="peopleCount"]');
    
    const chkEasyjet = document.getElementById('chkEasyjet');
    const chkIcecave = document.getElementById('chkIcecave');
    const chkBluelagoon = document.getElementById('chkBluelagoon');
    const chkSkylagoon = document.getElementById('chkSkylagoon');
    const chkMusical = document.getElementById('chkMusical');
    const chkCarInsurance = document.getElementById('chkCarInsurance');

    const totalPricePerPersonEl = document.getElementById('totalPricePerPerson');
    const totalPriceGroupEl = document.getElementById('totalPriceGroup');

    const bkFlightEl = document.getElementById('bkFlight');
    const bkTaxEl = document.getElementById('bkTax');
    const bkHotelEl = document.getElementById('bkHotel');
    const bkTransportEl = document.getElementById('bkTransport');
    const bkActivitiesEl = document.getElementById('bkActivities');
    const bkFoodEl = document.getElementById('bkFood');
    const savingsNoticeEl = document.getElementById('savingsNotice');

    function calculateBudget() {
        const flightType = flightSelect.value;
        const asBonus = parseFloat(asBonusSelect.value);
        let people = 2;
        peopleRadios.forEach(r => { if (r.checked) people = parseInt(r.value); });

        // 更新 radio active 樣式
        document.querySelectorAll('.radio-label').forEach(label => {
            const input = label.querySelector('input');
            if (input && input.checked) label.classList.add('active');
            else label.classList.remove('active');
        });

        // 1. 估算哩程單價 (美金/萬哩 轉換成 TWD)
        // 60% Bonus => ~$185/萬哩 ($185 * 32 = NT$ 5,920)
        let costPer10kMilesUSD = 185;
        if (asBonus === 50) costPer10kMilesUSD = 198;
        if (asBonus === 40) costPer10kMilesUSD = 210;
        if (asBonus === 0) costPer10kMilesUSD = 295;
        const costPerMileTWD = (costPer10kMilesUSD / 10000) * 32;

        let flightCostPerPerson = 0;
        let taxCostPerPerson = 0;
        let isMileage = true;

        if (flightType === 'cathay') {
            flightCostPerPerson = Math.round(75000 * costPerMileTWD);
            taxCostPerPerson = 3500;
        } else if (flightType === 'finnair') {
            flightCostPerPerson = Math.round(75000 * costPerMileTWD);
            taxCostPerPerson = 2500;
        } else if (flightType === 'qatar') {
            flightCostPerPerson = Math.round(80000 * costPerMileTWD);
            taxCostPerPerson = 6400;
        } else if (flightType === 'chinaair') {
            flightCostPerPerson = 43280;
            taxCostPerPerson = 0;
            isMileage = false;
        } else if (flightType === 'etihad') {
            flightCostPerPerson = 28126;
            taxCostPerPerson = 0;
            isMileage = false;
        }

        // 控制 AS 折扣選單顯示
        asDiscountGroup.style.display = isMileage ? 'block' : 'none';

        // 2. 住宿費 (倫敦4晚 + 冰島6晚)
        // 雙人同行每人 NT$ 28,000；單人每人 NT$ 56,000
        const hotelCostPerPerson = people === 2 ? 28000 : 56000;

        // 3. 交通費 (倫敦地鐵 $3,500 + 冰島 4WD 車費油資分攤)
        let carInsuranceTotal = chkCarInsurance.checked ? 12000 : 0;
        const transportCostPerPerson = 3500 + Math.round(carInsuranceTotal / people);

        // 4. easyJet 跨國段
        let easyjetCost = chkEasyjet.checked ? 0 : 6000;

        // 5. 門票與活動
        let activitiesCostPerPerson = easyjetCost;
        if (chkIcecave.checked) activitiesCostPerPerson += 5000;
        if (chkBluelagoon.checked) activitiesCostPerPerson += 3500;
        if (chkSkylagoon.checked) activitiesCostPerPerson += 2800;
        if (chkMusical.checked) activitiesCostPerPerson += 3200;

        // 6. 餐飲預算
        const foodCostPerPerson = 22000;

        // 7. 總額計算
        const grandTotalPerPerson = flightCostPerPerson + taxCostPerPerson + hotelCostPerPerson + transportCostPerPerson + activitiesCostPerPerson + foodCostPerPerson;
        const grandTotalGroup = grandTotalPerPerson * people;

        // 更新 DOM
        totalPricePerPersonEl.textContent = `NT$ ${grandTotalPerPerson.toLocaleString()}`;
        totalPriceGroupEl.textContent = `NT$ ${grandTotalGroup.toLocaleString()} (${people}人總和)`;

        bkFlightEl.textContent = isMileage ? `NT$ ${flightCostPerPerson.toLocaleString()} (AS哩程買票)` : `NT$ ${flightCostPerPerson.toLocaleString()} (現金機票)`;
        bkTaxEl.textContent = `NT$ ${taxCostPerPerson.toLocaleString()} /人`;
        bkHotelEl.textContent = `NT$ ${hotelCostPerPerson.toLocaleString()} /人 (${people === 2 ? '雙人平分' : '單人房'})`;
        bkTransportEl.textContent = `NT$ ${transportCostPerPerson.toLocaleString()} /人`;
        bkActivitiesEl.textContent = `NT$ ${activitiesCostPerPerson.toLocaleString()} /人`;
        bkFoodEl.textContent = `NT$ ${foodCostPerPerson.toLocaleString()} /人`;

        // 提示語句
        if (isMileage) {
            savingsNoticeEl.textContent = `採用 AS 哩程購買商務艙，單人機票成本僅約 NT$ ${(flightCostPerPerson + taxCostPerPerson).toLocaleString()}，省下數萬台幣！`;
        } else {
            savingsNoticeEl.textContent = `選擇直飛/便宜現金票，機票支出約 NT$ ${flightCostPerPerson.toLocaleString()}，免去哩程兌換步驟。`;
        }
    }

    // 事件監聽 Event Listeners
    flightSelect.addEventListener('change', calculateBudget);
    asBonusSelect.addEventListener('change', calculateBudget);
    peopleRadios.forEach(r => r.addEventListener('change', calculateBudget));
    
    [chkEasyjet, chkIcecave, chkBluelagoon, chkSkylagoon, chkMusical, chkCarInsurance].forEach(chk => {
        chk.addEventListener('change', calculateBudget);
    });

    // 初次計算
    calculateBudget();
}

/* --------------------------------------------------------------------------
   5. Points & Miles Tracker Engine
   -------------------------------------------------------------------------- */
function initPointsTracker() {
    const ptDbs = document.getElementById('ptDbs');
    const ptCathay = document.getElementById('ptCathay');
    const ptTaishin = document.getElementById('ptTaishin');
    const ptEsun = document.getElementById('ptEsun');

    const resDbs = document.getElementById('resDbs');
    const resCathay = document.getElementById('resCathay');
    const resTaishin = document.getElementById('resTaishin');
    const resEsun = document.getElementById('resEsun');

    const totalMilesEl = document.getElementById('totalMiles');
    const milesProgressEl = document.getElementById('milesProgress');
    const milesStatusEl = document.getElementById('milesStatus');

    const TARGET_MILES = 35000;

    function calculateMiles() {
        // 取得輸入值
        const dbsVal = parseFloat(ptDbs.value) || 0;
        const cathayVal = parseFloat(ptCathay.value) || 0;
        const taishinVal = parseFloat(ptTaishin.value) || 0;
        const esunVal = parseFloat(ptEsun.value) || 0;

        // 套用轉換公式
        const dbsMiles = Math.floor(dbsVal * (100 / 90));
        const cathayMiles = Math.floor(cathayVal * (1000 / 360));
        
        // 台新 11 換 14, 只能換整數組
        const taishinGroups = Math.floor(taishinVal / 11);
        const taishinMiles = taishinGroups * 14;

        // 玉山 200 換 180, 只能換整數組
        const esunGroups = Math.floor(esunVal / 200);
        const esunMiles = esunGroups * 180;

        const totalMiles = dbsMiles + cathayMiles + taishinMiles + esunMiles;

        // 更新 DOM 分項
        resDbs.textContent = `${dbsMiles.toLocaleString()} 哩`;
        resCathay.textContent = `${cathayMiles.toLocaleString()} 哩`;
        resTaishin.textContent = `${taishinMiles.toLocaleString()} 哩`;
        resEsun.textContent = `${esunMiles.toLocaleString()} 哩`;

        // 更新總和與進度條
        totalMilesEl.textContent = `${totalMiles.toLocaleString()} 哩`;
        
        let percent = (totalMiles / TARGET_MILES) * 100;
        if (percent > 100) percent = 100;
        milesProgressEl.style.width = `${percent}%`;

        if (totalMiles >= TARGET_MILES) {
            milesProgressEl.style.background = 'linear-gradient(90deg, #10B981, #34D399)';
            milesStatusEl.innerHTML = `✅ 恭喜！已超越門檻，多出 <strong>${(totalMiles - TARGET_MILES).toLocaleString()} 哩</strong>！可升等商務艙！`;
            milesStatusEl.style.color = '#10B981';
        } else {
            milesProgressEl.style.background = 'linear-gradient(90deg, var(--accent-aurora), var(--accent-blue))';
            milesStatusEl.innerHTML = `⚠️ 距離升等門檻還差 <strong>${(TARGET_MILES - totalMiles).toLocaleString()} 哩</strong>`;
            milesStatusEl.style.color = 'var(--accent-gold)';
        }
    }

    // 綁定事件
    [ptDbs, ptCathay, ptTaishin, ptEsun].forEach(input => {
        input.addEventListener('input', calculateMiles);
    });

    // 初始計算
    calculateMiles();
}
