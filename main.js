let disks = 3;
let field_1_towers = [...Array(disks)].map((_, i) => i + 1);
let field_2_towers = Array.from({ length: disks }, () => 0);
let field_3_towers = Array.from({ length: disks }, () => 0);
let answer = [...Array(disks)].map((_, i) => i + 1);
let count = 0;
const counter = document.getElementById("counter");
const field_1 = document.getElementById("field_1");
const field_2 = document.getElementById("field_2");
const field_3 = document.getElementById("field_3");
const resetButton = document.getElementById("resetButton");

let tower_tmp = "";
let selectedField = null;

// Cookieからゲーム状態を読み込む
const loadGameState = () => {
    const gameState = getCookie("hanoiGameState");
    if (gameState) {
        const { disks: d, field_1_towers: f1, field_2_towers: f2, field_3_towers: f3, count: c } = JSON.parse(gameState);
        disks = d;
        field_1_towers = f1;
        field_2_towers = f2;
        field_3_towers = f3;
        count = c;
    }
};

// Cookieにゲーム状態を保存する
const saveGameState = () => {
    const gameState = { disks, field_1_towers, field_2_towers, field_3_towers, count };
    setCookie("hanoiGameState", JSON.stringify(gameState), 365);
};

// Cookieの取得
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

// Cookieの保存
const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 3600 * 1000));
        expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `<span class="math-inline">\{name\}\=</span>{value || ''}${expires}; path=/`;
};

// Cookieの削除
const eraseCookie = (name) => {
    document.cookie = name + '=; Max-Age=-99999999;';
}

// 繝上ヮ繧､縺ｮ蝪疲緒逕ｻ
const towerDrawing = (field, towers) => {
  field.innerHTML = "";
  towers.forEach((value, i) => {
    if (value > 0) { // valueが0より大きい場合のみ円盤を描画
      let tower = document.createElement("div");
      if (disks <= 10) {
        tower.style.width = `${value * 10}%`; // 修正: 円盤の幅を適切に計算
      } else {
        tower.style.width = `${(value * 100) / disks}%`; // 修正: 円盤の幅を適切に計算
      }
      tower.style.height = "20px";
      tower.style.backgroundColor = value % 2 === 0 ? "#777777" : "#660000";
      tower.style.margin = "4px auto";
      field.appendChild(tower);
    }
  });
  field.classList.remove("click_field");
};
// 豁｣隗｣蛻､螳
const isCorrect = () => {
    if (
        JSON.stringify(field_2_towers) === JSON.stringify(answer) ||
        JSON.stringify(field_3_towers) === JSON.stringify(answer)
    ) {
        return true;
    } else {
        return false;
    }
};

// 繝槭せ縺後け繝ｪ繝け縺輔ｌ縺滓凾縺ｮ蜃ｦ逅
const clickField = (field, towers) => {
    if (towers.every((value) => value === towers[0] && tower_tmp === "")) {
        return;
    }
    if (tower_tmp
