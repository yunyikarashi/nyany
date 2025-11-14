<template>
    <div class="team-combination">
        <h3>組み合わせ {{ index + 1 }} (LP差: {{ combo.difference }}LP)</h3>
        <div class="team-display">
            <div class="team-card team-1" ref="teamCard1">
                <h4>チーム 1 (合計: {{ combo.team1TotalLP }}LP)</h4>
                <ul>
                    <li v-for="p in combo.team1" :key="p.id" :class="getRankClass(p.rank)">
                        {{ p.name }}<br />
                        ({{ rankDisplayNames[p.rank] }}{{ isMasterPlusRank(p.rank) ? ` ${p.lp}LP` : '' }})
                    </li>
                </ul>
                <div class="button-group">
                    <button @click="handleRankChange(combo.team1, 'promote')" class="promote-button"><i class="fas fa-arrow-alt-circle-up"></i> 昇格</button>
                    <button @click="handleRankChange(combo.team1, 'demote')" class="demote-button"><i class="fas fa-arrow-alt-circle-down"></i> 降格</button>
                </div>
            </div>

            <div class="team-card team-2" ref="teamCard2">
                <h4>チーム 2 (合計: {{ combo.team2TotalLP }}LP)</h4>
                <ul>
                    <li v-for="p in combo.team2" :key="p.id" :class="getRankClass(p.rank)">
                        {{ p.name }}<br />
                        ({{ rankDisplayNames[p.rank] }}{{ isMasterPlusRank(p.rank) ? ` ${p.lp}LP` : '' }})
                    </li>
                </ul>
                <div class="button-group">
                    <button @click="handleRankChange(combo.team2, 'promote')" class="promote-button"><i class="fas fa-arrow-alt-circle-up"></i> 昇格</button>
                    <button @click="handleRankChange(combo.team2, 'demote')" class="demote-button"><i class="fas fa-arrow-alt-circle-down"></i> 降格</button>
                </div>
            </div>
        </div>
        <p class="point-difference">LP差: {{ combo.difference }}LP</p>
        <button @click="copyTeamImage" class="copy-image-button">結果をコピー <i class="far fa-copy"></i></button>
    </div>
</template>

<script setup>
import html2canvas from 'html2canvas';
import { rankDisplayNames, getRankClass, promoteRank, demoteRank } from '../constants';
import { ref } from 'vue';

const props = defineProps({
    combo: Object, // チーム分けの組み合わせデータ
    index: Number, // 表示順のインデックス
    playersData: Array, // 全プレイヤーのリアクティブなデータ配列 (App.vueから直接渡される)
});

// Master以上のランクかどうかを判定するヘルパー関数
const isMasterPlusRank = (rank) => {
    return ['MASTER', 'GRANDMASTER', 'CHALLENGER'].includes(rank);
};

// チームのランク操作処理
const handleRankChange = (teamPlayers, type) => {
    teamPlayers.forEach((playerInCombo) => {
        // playersData (親から渡されたリアクティブな全プレイヤーデータ) を直接更新
        const playerToUpdate = props.playersData.find((p) => p.id === playerInCombo.id);
        if (playerToUpdate) {
            let newRankData;
            if (type === 'promote') {
                newRankData = promoteRank(playerToUpdate.rank, playerToUpdate.lp);
            } else {
                newRankData = demoteRank(playerToUpdate.rank, playerToUpdate.lp);
            }
            playerToUpdate.rank = newRankData.rank;
            playerToUpdate.lp = newRankData.lp;
        }
    });
    const action = type === 'promote' ? '昇格' : '降格';
    alert(`チームメンバーのランクを${action}させ、入力欄に反映しました！\n再度「チームを振り分ける！」ボタンを押して、最新のLPで再計算してください。`);
};

// 画像コピーボタンクリック時の処理
const copyTeamImage = async (event) => {
    const comboElement = event.target.closest('.team-combination');
    if (comboElement) {
        try {
            const canvas = await html2canvas(comboElement, {
                scale: 2,
                useCORS: true,
            });
            canvas.toBlob(async (blob) => {
                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({
                            'image/png': blob,
                        }),
                    ]);
                    alert('画像をクリップボードにコピーしました！');
                } catch (err) {
                    console.error('クリップボードへのコピーに失敗しました:', err);
                    alert('クリップボードへのコピーに失敗しました。ブラウザのセキュリティ設定を確認してください。');
                }
            }, 'image/png');
        } catch (err) {
            console.error('画像の生成に失敗しました:', err);
            alert('画像の生成に失敗しました。');
        }
    }
};
</script>

<style scoped>
/* スコープ付きスタイルはApp.vueの<style>セクションに定義された基本スタイルを参照して機能します */
.team-combination {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

/* App.vueのスタイルを参照 */
</style>
