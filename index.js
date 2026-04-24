const setupList = document.getElementById('setup-list');
const roleContainer = document.getElementById('role-container');

const topHeadName = document.querySelector('.setup-name');
const topHeadRule = document.querySelector('.setup-rule-tip');
const introLeft = document.querySelector('.intro-left');
const introMid = document.querySelector('.intro-mid');
const introRight = document.querySelector('.intro-right');

// 初始化版型列表
function initSetups() {
    gameSetups.forEach(setup => {
        const item = document.createElement('div');
        item.className = 'setup-item';
        item.textContent = setup.name;
        item.onclick = () => {
            document.querySelectorAll('.setup-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            renderSetup(setup);
        };
        setupList.appendChild(item);
    });
}

// 陣列每5個一組換行
function chunkArr(arr, size = 5) {
    const res = [];
    for (let i = 0; i < arr.length; i += size) {
        res.push(arr.slice(i, i + size));
    }
    return res;
}

// 渲染單一分類
function renderGroup(title, list, className) {
    if (list.length === 0) return '';
    const chunks = chunkArr(list, 5);
    let html = `<div class="group-title">${title}</div>`;
    chunks.forEach(row => {
        html += `<div class="role-grid">${makeGridRow(row, className)}</div>`;
    });
    return html;
}

// 單行5格，不足補空白
function makeGridRow(list, className) {
    let html = '';
    for (let i = 0; i < 5; i++) {
        const name = list[i] || '';
        if (name) {
            html += `<div class="role-card ${className}" onclick="showIntro('${name}')">${name}</div>`;
        } else {
            html += `<div class="role-card empty"></div>`;
        }
    }
    return html;
}

// 載入版型
function renderSetup(setup) {
    const groups = {
        狼人: [],
        神職: [],
        平民: [],
        第三方: [],
        變化: []
    };

    setup.roles.forEach(name => {
        const r = roleData[name];
        if (!r) return;
        switch (r.type) {
            case "狼人": groups.狼人.push(name); break;
            case "神職": groups.神職.push(name); break;
            case "平民": groups.平民.push(name); break;
            case "第三方": groups.第三方.push(name); break;
            case "變化": groups.變化.push(name); break;
        }
    });

    // 版型名稱 + 規則同行
    topHeadName.innerText = setup.name;
    topHeadRule.innerText = `📜 ${setup.rules}`;

    // 角色分類區塊
    let html = "";
    html += renderGroup("狼人", groups.狼人, "wolf");
    html += renderGroup("神職", groups.神職, "good");
    html += renderGroup("平民", groups.平民, "good");
    html += renderGroup("第三方", groups.第三方, "third");
    html += renderGroup("變化", groups.變化, "change");

    roleContainer.innerHTML = html;

    // 清空角色介紹
    introLeft.innerText = "";
    introMid.innerText = "";
    introRight.innerHTML = "";
}

// 三欄角色介紹
function showIntro(name) {
    const data = roleData[name];
    if (!data) return;

    introLeft.innerText = name;
    introMid.innerText = data.camp;
    introRight.innerHTML = data.intro.replaceAll('\n', '<br>');
}

window.addEventListener('DOMContentLoaded', () => {
    initSetups();
    autoSelectFirstSetup();
});

// 預設選中「黑狼崛起」版型
function autoSelectFirstSetup() {
    const items = document.querySelectorAll('.setup-item');
    items.forEach(item => {
        if (item.innerText.includes('黑狼崛起')) {
            item.click();
        }
    });
}