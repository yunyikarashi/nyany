<template>
  <div class="container">
    <h1>LoL カスタムチームビルダー</h1>

    <div class="player-input-section">
      <h2>プレイヤー情報入力 (10人)</h2>
      <div id="playerInputs" class="player-grid">
        <PlayerInput v-for="player in players" :key="player.id" :player="player" />
      </div>
    </div>

    <button @click="balanceTeams">チームを振り分ける！</button>

    <div v-if="teamCombinations.length > 0" id="teamResults" class="team-results-area">
      <h2>チーム分け結果</h2>
      <p class="info-text">表示されるチーム分けの中から、合計LP差が最も小さいものを選びましょう。</p>
      <div id="teamCombinations" class="team-combinations-grid">
        <TeamCombination
          v-for="(combo, index) in teamCombinations"
          :key="index"
          :combo="combo"
          :index="index"
          :playersData="players"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PlayerInput from './components/PlayerInput.vue';
import TeamCombination from './components/TeamCombination.vue';

const playerCount = 10;
const players = ref([]); // 全プレイヤーデータ (リアクティブ)
const teamCombinations = ref([]); // 計算されたチーム分け結果 (リアクティブ)

// プレイヤー入力フィールドの初期化
const initializePlayerInputs = () => {
  for (let i = 1; i <= playerCount; i++) {
    players.value.push({
      id: i,
      name: `プレイヤー${i}`,
      rank: "GOLD_4", // デフォルトランク
      lp: 0,
      totalLP: 0 // PlayerInput.vueで初期計算されます
    });
  }
};

// 配列をシャッフルする関数 (Fisher-Yates)
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

// 全ての組み合わせを生成するヘルパー関数
const getAllCombinations = (arr, k) => {
  const result = [];
  function combinations(offset, combo) {
    if (combo.length === k) {
      result.push(combo); 
      return;
    }
    for (let i = offset; i < arr.length; i++) {
      combinations(i + 1, combo.concat(arr[i]));
    }
  }
  combinations(0, []);
  return result;
};

// チーム分けのメインロジック
const balanceTeams = () => {
  // 1. データ検証
  for (const player of players.value) {
    if (["MASTER", "GRANDMASTER", "CHALLENGER"].includes(player.rank)) {
      if (isNaN(player.lp) || player.lp < 0) {
        alert(`${player.name} のLPは0以上の数値を入力してください。`);
        return;
      }
    }
    if (isNaN(player.totalLP)) {
        alert("LPの計算にエラーが発生しました。入力値を確認してください。");
        return;
    }
  }

  // 2. 組み合わせを計算
  const numPlayers = players.value.length;
  const teamSize = numPlayers / 2;

  const allPossibleCombinations = getAllCombinations(players.value, teamSize);
  const balancedResults = [];

  for (const team1 of allPossibleCombinations) {
    const remainingPlayers = players.value.filter(p => !team1.includes(p));
    // チーム2はIDでソートして、組み合わせのキー生成の順序を安定させる
    const team2 = remainingPlayers.slice().sort((a, b) => a.id - b.id); 

    const team1TotalLP = team1.reduce((sum, p) => sum + p.totalLP, 0);
    const team2TotalLP = team2.reduce((sum, p) => sum + p.totalLP, 0);
    const difference = Math.abs(team1TotalLP - team2TotalLP);

    balancedResults.push({ team1, team2, team1TotalLP, team2TotalLP, difference });
  }

  // 3. LP差でソート
  balancedResults.sort((a, b) => a.difference - b.difference);

  // 4. 重複を除外し、表示する組み合わせを選定 (最大9つ)
  const finalCombinationsToShow = [];
  const seenCombinations = new Set();
  const maxCombinationsToDisplay = 9;
  let currentProcessedIndex = 0;

  while (finalCombinationsToShow.length < maxCombinationsToDisplay && currentProcessedIndex < balancedResults.length) {
      const currentDifference = balancedResults[currentProcessedIndex].difference;
      const combinationsAtCurrentDifference = [];

      for (let i = currentProcessedIndex; i < balancedResults.length; i++) {
          if (balancedResults[i].difference === currentDifference) {
              combinationsAtCurrentDifference.push(balancedResults[i]);
          } else {
              break;
          }
      }

      shuffleArray(combinationsAtCurrentDifference);

      for (const combo of combinationsAtCurrentDifference) {
          // チームメンバーのIDをソートして組み合わせのキーを作成 (順序に依存しないように)
          const sortedIDs1 = combo.team1.map(p => p.id).sort((a, b) => a - b).join(',');
          const sortedIDs2 = combo.team2.map(p => p.id).sort((a, b) => a - b).join(',');
          const combinationKey = [sortedIDs1, sortedIDs2].sort().join('|');

          if (!seenCombinations.has(combinationKey)) {
              seenCombinations.add(combinationKey);
              finalCombinationsToShow.push(combo);
              if (finalCombinationsToShow.length >= maxCombinationsToDisplay) {
                  break;
              }
          }
      }
      currentProcessedIndex += combinationsAtCurrentDifference.length;
  }

  // 5. 最終表示順をLP差でソート
  finalCombinationsToShow.sort((a, b) => a.difference - b.difference);

  // 6. 結果を更新
  teamCombinations.value = finalCombinationsToShow;
};

onMounted(() => {
  initializePlayerInputs();
});
</script>