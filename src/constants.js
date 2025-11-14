// ランクの順序を定義
export const rankOrder = ['IRON_4', 'IRON_3', 'IRON_2', 'IRON_1', 'BRONZE_4', 'BRONZE_3', 'BRONZE_2', 'BRONZE_1', 'SILVER_4', 'SILVER_3', 'SILVER_2', 'SILVER_1', 'GOLD_4', 'GOLD_3', 'GOLD_2', 'GOLD_1', 'PLATINUM_4', 'PLATINUM_3', 'PLATINUM_2', 'PLATINUM_1', 'EMERALD_4', 'EMERALD_3', 'EMERALD_2', 'EMERALD_1', 'DIAMOND_4', 'DIAMOND_3', 'DIAMOND_2', 'DIAMOND_1', 'MASTER', 'GRANDMASTER', 'CHALLENGER'];

// ランクごとの基本LP値 (1ディビジョンあたり100LPとして計算)
export const rankBaseLP = {
    IRON_4: 0,
    IRON_3: 100,
    IRON_2: 200,
    IRON_1: 300,
    BRONZE_4: 400,
    BRONZE_3: 500,
    BRONZE_2: 600,
    BRONZE_1: 700,
    SILVER_4: 800,
    SILVER_3: 900,
    SILVER_2: 1000,
    SILVER_1: 1100,
    GOLD_4: 1200,
    GOLD_3: 1300,
    GOLD_2: 1400,
    GOLD_1: 1500,
    PLATINUM_4: 1600,
    PLATINUM_3: 1700,
    PLATINUM_2: 1800,
    PLATINUM_1: 1900,
    EMERALD_4: 2000,
    EMERALD_3: 2100,
    EMERALD_2: 2200,
    EMERALD_1: 2300,
    DIAMOND_4: 2400,
    DIAMOND_3: 2500,
    DIAMOND_2: 2600,
    DIAMOND_1: 2700,
    // Master+のベースLPはD1_LP + 100LP
    MASTER: 2700 + 100,
    GRANDMASTER: 2700 + 100,
    CHALLENGER: 2700 + 100,
};

// ランクの表示名
export const rankDisplayNames = {
    IRON_4: 'アイアン IV',
    IRON_3: 'アイアン III',
    IRON_2: 'アイアン II',
    IRON_1: 'アイアン I',
    BRONZE_4: 'ブロンズ IV',
    BRONZE_3: 'ブロンズ III',
    BRONZE_2: 'ブロンズ II',
    BRONZE_1: 'ブロンズ I',
    SILVER_4: 'シルバー IV',
    SILVER_3: 'シルバー III',
    SILVER_2: 'シルバー II',
    SILVER_1: 'シルバー I',
    GOLD_4: 'ゴールド IV',
    GOLD_3: 'ゴールド III',
    GOLD_2: 'ゴールド II',
    GOLD_1: 'ゴールド I',
    PLATINUM_4: 'プラチナ IV',
    PLATINUM_3: 'プラチナ III',
    PLATINUM_2: 'プラチナ II',
    PLATINUM_1: 'プラチナ I',
    EMERALD_4: 'エメラルド IV',
    EMERALD_3: 'エメラルド III',
    EMERALD_2: 'エメラルド II',
    EMERALD_1: 'エメラルド I',
    DIAMOND_4: 'ダイアモンド IV',
    DIAMOND_3: 'ダイアモンド III',
    DIAMOND_2: 'ダイアモンド II',
    DIAMOND_1: 'ダイアモンド I',
    MASTER: 'マスター',
    GRANDMASTER: 'グランドマスター',
    CHALLENGER: 'チャレンジャー',
};

// ランクごとのCSSクラス名を取得
export function getRankClass(rank) {
    return `rank-${rank.split('_')[0]}`;
}

// ランクを昇格させる関数
export function promoteRank(currentRank, currentLP) {
    const currentIndex = rankOrder.indexOf(currentRank);
    if (currentIndex === -1) return { rank: currentRank, lp: currentLP };

    if (['MASTER', 'GRANDMASTER', 'CHALLENGER'].includes(currentRank)) {
        return { rank: currentRank, lp: currentLP + 100 };
    } else {
        const nextRank = rankOrder[currentIndex + 1];
        if (nextRank) {
            if (currentRank === 'DIAMOND_1' && nextRank === 'MASTER') {
                return { rank: 'MASTER', lp: 0 };
            }
            return { rank: nextRank, lp: 0 };
        } else {
            return { rank: currentRank, lp: currentLP };
        }
    }
}

// ランクを降格させる関数
export function demoteRank(currentRank, currentLP) {
    const currentIndex = rankOrder.indexOf(currentRank);
    if (currentIndex === -1) return { rank: currentRank, lp: currentLP };

    if (currentRank === 'IRON_4') {
        return { rank: 'IRON_4', lp: Math.max(0, currentLP - 100) };
    } else if (['MASTER', 'GRANDMASTER', 'CHALLENGER'].includes(currentRank)) {
        const newLP = currentLP - 100;
        if (newLP < 0) {
            return { rank: 'DIAMOND_1', lp: 99 }; // D1 99LPに降格
        } else {
            return { rank: currentRank, lp: newLP };
        }
    } else {
        const prevRank = rankOrder[currentIndex - 1];
        if (prevRank) {
            return { rank: prevRank, lp: 99 };
        } else {
            return { rank: currentRank, lp: currentLP };
        }
    }
}
