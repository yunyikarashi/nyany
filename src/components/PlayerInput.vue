<template>
    <div class="player-input-group">
        <label :for="`playerName${player.id}`">プレイヤー {{ player.id }} の名前:</label>
        <input type="text" :id="`playerName${player.id}`" v-model="player.name" />

        <label :for="`playerRank${player.id}`">ランク:</label>
        <select :id="`playerRank${player.id}`" v-model="player.rank" @change="handleRankChange">
            <option v-for="rankOption in rankOrder" :key="rankOption" :value="rankOption">
                {{ rankDisplayNames[rankOption] }}
            </option>
        </select>

        <label :for="`playerLP${player.id}`" class="lp-label" v-show="isMasterPlus">LP (Master以上):</label>
        <input type="number" :id="`playerLP${player.id}`" min="0" max="9999" v-model.number="player.lp" v-show="isMasterPlus" />
    </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { rankOrder, rankDisplayNames, rankBaseLP } from '../constants';

// Propsで親からプレイヤーデータを受け取る
const props = defineProps({
    player: Object, // { id, name, rank, lp, totalLP }
});

// Master以上のランクかどうかを判定
const isMasterPlus = computed(() => {
    return ['MASTER', 'GRANDMASTER', 'CHALLENGER'].includes(props.player.rank);
});

// LPまたはランクが変更されたときにtotalLPを更新する関数
const updateTotalLP = () => {
    if (['MASTER', 'GRANDMASTER', 'CHALLENGER'].includes(props.player.rank)) {
        // Master, GrandMaster, Challenger は Masterの基本LPに現在のLPを加算
        props.player.totalLP = rankBaseLP['MASTER'] + (props.player.lp || 0);
    } else {
        props.player.totalLP = rankBaseLP[props.player.rank];
    }
};

// ランクが変更されたときの処理
const handleRankChange = () => {
    if (!isMasterPlus.value) {
        props.player.lp = 0; // Master未満になったらLPをリセット
    }
    updateTotalLP();
};

// LPまたはランクが変更されたときにtotalLPを更新するwatch
watch(
    () => props.player.lp,
    () => {
        updateTotalLP();
    }
);

watch(
    () => props.player.rank,
    () => {
        updateTotalLP();
    },
    { immediate: true }
); // 初期ロード時にも実行

// スタイルはApp.vueまたはstyle.cssに記述するため、ここでは最低限のscopedスタイルのみ
</script>

<style scoped>
.player-input-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background-color: #ffffff;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    border: 1px solid #ddd;
}
</style>
