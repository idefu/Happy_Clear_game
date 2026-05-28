/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LevelConfig } from '../types';

export type LanguageCode = 'zh' | 'en' | 'hi' | 'pt' | 'fr' | 'ja' | 'ko' | 'de' | 'es' | 'vi';

export interface LanguageDef {
  code: LanguageCode;
  flag: string;
  name: string;
  country: string;
}

export const LANGUAGES: LanguageDef[] = [
  { code: 'zh', flag: '🇨🇳', name: '简体中文', country: '中国' },
  { code: 'en', flag: '🇺🇸', name: 'English', country: 'USA' },
  { code: 'hi', flag: '🇮🇳', name: 'हिन्दी', country: 'भारत' },
  { code: 'pt', flag: '🇧🇷', name: 'Português', country: 'Brasil' },
  { code: 'fr', flag: '🇫🇷', name: 'Français', country: 'France' },
  { code: 'ja', flag: '🇯🇵', name: '日本語', country: '日本' },
  { code: 'ko', flag: '🇰🇷', name: '한국어', country: '한국' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch', country: 'Deutschland' },
  { code: 'es', flag: '🇪🇸', name: 'Español', country: 'España' },
  { code: 'vi', flag: '🇻🇳', name: 'Tiếng Việt', country: 'Việt Nam' }
];

// Dictionary of core UI elements
const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  zh: {
    title: '快乐消消乐',
    mascotBubble: '喵~ 跟我一起开启欢乐消除之旅吧！✨',
    playBtn: '闯关冒险',
    backToLobby: '返回大厅',
    cumulativeStars: '累计星星',
    autoUnlockTip: '🐱 闯关成功自动解锁下一关！',
    levelTitle: '关卡',
    challengeStart: '开启挑战',
    frostGlass: '❄️ 霜层',
    eliminatingGrid: '💥 消除',
    comboCountMetric: '⚡ 连击数',
    movesPercentText: '剩余步数',
    scoreLabel: '得分',
    winStateTitle: '通关成功',
    loseStateTitle: '挑战失败',
    bonusLabel: '奖励',
    grandTotalLabel: '总计',
    newRecordLabel: '新纪录',
    nextLevelBtn: '下一关',
    replayBtn: '重试',
    lobbyBtn: '大厅',
    sponsorTitle: '赞助支持本程序',
    sponsorSub: '感谢您的热心赞助，程序运行需要您的支持！',
    scanTip: '请使用支付宝/微信扫一扫赞助',
    winModalSponsorSub: '感谢您的每一份善意，您的赞助是程序走得更好的动力！💖',
    closeBtn: '关闭窗口',
    alipaySponsorDesc: 'Alipay 赞助支持',
    wepaySponsorDesc: 'Wepay 赞助支持',
    deadlockToast: '🔄 棋盘死局已触发！正在施法魔法重排字母...'
  },
  en: {
    title: 'Happy Match-3',
    mascotBubble: "Meow~ Let's start the joyful match-3 journey together! ✨",
    playBtn: 'Play Levels',
    backToLobby: 'Back to Lobby',
    cumulativeStars: 'Total Stars',
    autoUnlockTip: '🐱 Clear standard stages to unlock the next level!',
    levelTitle: 'Level',
    challengeStart: 'Current Goals',
    frostGlass: '❄️ Frost',
    eliminatingGrid: '💥 Matches',
    comboCountMetric: '⚡ Combos',
    movesPercentText: 'Moves Left',
    scoreLabel: 'Score',
    winStateTitle: 'Victory!',
    loseStateTitle: 'Defeat',
    bonusLabel: 'Bonus',
    grandTotalLabel: 'Total',
    newRecordLabel: 'New Record',
    nextLevelBtn: 'Next Level',
    replayBtn: 'Retry',
    lobbyBtn: 'Lobby',
    sponsorTitle: 'Support Development',
    sponsorSub: 'Thank you for your donation, running this app requires your support!',
    scanTip: 'Please scan the QR code via Alipay or WeChat to sponsor.',
    winModalSponsorSub: 'Thank you for your kindness, your sponsorship drives us to improve! 💖',
    closeBtn: 'Close',
    alipaySponsorDesc: 'Alipay Sponsorship',
    wepaySponsorDesc: 'Wepay Sponsorship',
    deadlockToast: '🔄 No matches left! Magic reshuffling is underway...'
  },
  hi: {
    title: 'मज़ेदार मैच-3',
    mascotBubble: 'म्याऊ~ चलो साथ में मज़ेदार मैच-3 यात्रा शुरू करें! ✨',
    playBtn: 'लेवल खेलें',
    backToLobby: 'लॉबी पर वापस',
    cumulativeStars: 'कुल सितारे',
    autoUnlockTip: '🐱 अगला स्तर खोलने के लिए मंच पार करें!',
    levelTitle: 'स्तर',
    challengeStart: 'वर्तमान लक्ष्य',
    frostGlass: '❄️ बर्फ',
    eliminatingGrid: '💥 मैच',
    comboCountMetric: '⚡ कॉम्बो',
    movesPercentText: 'बाकी चालें',
    scoreLabel: 'स्कोर',
    winStateTitle: 'जीत!',
    loseStateTitle: 'हार!',
    bonusLabel: 'बोनस',
    grandTotalLabel: 'कुल',
    newRecordLabel: 'नया रिकॉर्ड',
    nextLevelBtn: 'अगला स्तर',
    replayBtn: 'पुनः प्रयास',
    lobbyBtn: 'लॉबी',
    sponsorTitle: 'विकास का समर्थन',
    sponsorSub: 'आपके दान के लिए धन्यवाद, इस ऐप को चलाने के लिए आपके समर्थन की आवश्यकता है!',
    scanTip: 'कृपया दान देने के लिए अलीपे या वीचैट के माध्यम से क्यूआर कोड को स्कैन करें।',
    winModalSponsorSub: 'आपकी दयालुता के लिए धन्यवाद, आपका समर्थन हमें और बेहतर बनाने के लिए प्रेरित करता है! 💖',
    closeBtn: 'बंद करें',
    alipaySponsorDesc: 'Alipay प्रायोजन',
    wepaySponsorDesc: 'Wepay प्रायोजन',
    deadlockToast: '🔄 कोई मिलान नहीं बचा! जादुई पुनरावृत्ति जारी है...'
  },
  pt: {
    title: 'Match-3 Feliz',
    mascotBubble: 'Miau~ Vamos começar a jornada alegre de match-3 juntos! ✨',
    playBtn: 'Jogar Níveis',
    backToLobby: 'Voltar ao Lobby',
    cumulativeStars: 'Estrelas Coletadas',
    autoUnlockTip: '🐱 Vença o nível para desbloquear o próximo automaticamente!',
    levelTitle: 'Nível',
    challengeStart: 'Metas Atuais',
    frostGlass: '❄️ Gelo',
    eliminatingGrid: '💥 Detonações',
    comboCountMetric: '⚡ Combos',
    movesPercentText: 'Jogadas',
    scoreLabel: 'Pontos',
    winStateTitle: 'Vitória!',
    loseStateTitle: 'Derrota',
    bonusLabel: 'Bônus',
    grandTotalLabel: 'Total',
    newRecordLabel: 'Novo Recorde',
    nextLevelBtn: 'Próximo Nível',
    replayBtn: 'Tentar de novo',
    lobbyBtn: 'Lobby',
    sponsorTitle: 'Apoie o Desenvolvimento',
    sponsorSub: 'Obrigado pela sua doação, manter este aplicativo ativo exige seu apoio!',
    scanTip: 'Por favor, escaneie o código QR via Alipay ou WeChat para doar.',
    winModalSponsorSub: 'Agradecemos sua bondade, seu apoio nos inspira a melhorar cada vez mais! 💖',
    closeBtn: 'Fechar',
    alipaySponsorDesc: 'Patrocínio do Alipay',
    wepaySponsorDesc: 'Patrocínio do Wepay',
    deadlockToast: '🔄 Sem movimentos! Executando reembaralhamento mágico...'
  },
  fr: {
    title: 'Joyeux Match-3',
    mascotBubble: "Miaou~ Commençons ensemble un joyeux voyage de match-3 ! ✨",
    playBtn: 'Jouer aux Niveaux',
    backToLobby: 'Retour au Lobby',
    cumulativeStars: 'Étoiles Totales',
    autoUnlockTip: '🐱 Terminez le niveau pour débloquer le suivant !',
    levelTitle: 'Niveau',
    challengeStart: 'Objectifs Actuels',
    frostGlass: '❄️ Givre',
    eliminatingGrid: '💥 Éliminations',
    comboCountMetric: '⚡ Combos',
    movesPercentText: 'Coups Restants',
    scoreLabel: 'Score',
    winStateTitle: 'Victoire !',
    loseStateTitle: 'Défaite',
    bonusLabel: 'Bonus',
    grandTotalLabel: 'Total',
    newRecordLabel: 'Nouveau Record',
    nextLevelBtn: 'Suivant',
    replayBtn: 'Réessayer',
    lobbyBtn: 'Lobby',
    sponsorTitle: "Soutenir l'Appli",
    sponsorSub: "Merci pour votre don, le fonctionnement de cette application nécessite votre soutien !",
    scanTip: 'Veuillez scanner le code QR Alipay ou WeChat pour parrainer.',
    winModalSponsorSub: 'Merci pour votre gentillesse, votre parrainage nous pousse à nous améliorer ! 💖',
    closeBtn: 'Fermer',
    alipaySponsorDesc: 'Soutien Alipay',
    wepaySponsorDesc: 'Soutien Wepay',
    deadlockToast: '🔄 Plus de combinaisons ! Mélange magique en cours...'
  },
  ja: {
    title: 'ハッピー消消楽',
    mascotBubble: 'ニャー〜 一緒にハッピーな消消楽の旅に出かけましょう！✨',
    playBtn: '冒険スタート',
    backToLobby: 'ロビーに戻る',
    cumulativeStars: '累計星数',
    autoUnlockTip: '🐱 ステージをクリアすると次の関が自動的に解放されます！',
    levelTitle: 'レベル',
    challengeStart: '挑戦目標',
    frostGlass: '❄️ 氷の霜',
    eliminatingGrid: '💥 消去数',
    comboCountMetric: '⚡ 連撃数',
    movesPercentText: '残り手数',
    scoreLabel: '得点',
    winStateTitle: 'クリア成功！',
    loseStateTitle: 'チャレンジ失敗',
    bonusLabel: 'ボーナス',
    grandTotalLabel: '合計',
    newRecordLabel: '新記録',
    nextLevelBtn: '次のレベル',
    replayBtn: 'もう一度',
    lobbyBtn: 'ロビー',
    sponsorTitle: '開発を応援',
    sponsorSub: '皆様の温かい応援に深く感謝いたします。開発運営の支えになります！',
    scanTip: 'AlipayまたはWeChatアプリでQRコードを読み取ってご支援ください。',
    winModalSponsorSub: 'すべての善意に感謝いたします！皆様の応援がゲーム向上の原動力です！💖',
    closeBtn: '閉じる',
    alipaySponsorDesc: 'Alipayで応援',
    wepaySponsorDesc: 'Wepayで応援',
    deadlockToast: '🔄 手詰まりを検出しました！魔法の再配置を実行中...'
  },
  ko: {
    title: '해피 매치-3',
    mascotBubble: '야옹~ 나와 함께 즐거운 매치-3 여행을 시작해봐요! ✨',
    playBtn: '모험 시작',
    backToLobby: '로비로 돌아가기',
    cumulativeStars: '누적 별',
    autoUnlockTip: '🐱 스테이지를 수복하면 다음 레벨이 자동 잠금 해제됩니다!',
    levelTitle: '레벨',
    challengeStart: '도전 목표',
    frostGlass: '❄️ 서리층',
    eliminatingGrid: '💥 소거',
    comboCountMetric: '⚡ 콤보수',
    movesPercentText: '남은 횟수',
    scoreLabel: '점수',
    winStateTitle: '스테이지 통과!',
    loseStateTitle: '도전 실패',
    bonusLabel: '보너스',
    grandTotalLabel: '총합',
    newRecordLabel: '신기록',
    nextLevelBtn: '다음 단계',
    replayBtn: '다시 하기',
    lobbyBtn: '로비',
    sponsorTitle: '프로그램 후원',
    sponsorSub: '따뜻한 후원에 감사드립니다, 프로그램 운영에 큰 힘이 됩니다! 💖',
    scanTip: '알리페이 또는 위챗 청구서 QR 코드를 스캔하여 후원하실 수 있습니다.',
    winModalSponsorSub: '여러분의 따뜻한 마음에 진심으로 감사드립니다! 후원은 더 멋진 업데이트로 보답됩니다! 💖',
    closeBtn: '닫기',
    alipaySponsorDesc: 'Alipay 후원',
    wepaySponsorDesc: 'Wepay 후원',
    deadlockToast: '🔄 움직일 수 있는 블록이 없습니다! 마법의 재정렬 진행 중...'
  },
  de: {
    title: 'Happy Match-3',
    mascotBubble: 'Miau~ Lass uns gemeinsam die fröhliche Match-3-Reise beginnen! ✨',
    playBtn: 'Abenteuer',
    backToLobby: 'Zurück zur Lobby',
    cumulativeStars: 'Sterne gesamt',
    autoUnlockTip: '🐱 Schließe das Level ab, um das nächste freizuschalten!',
    levelTitle: 'Level',
    challengeStart: 'Ziele',
    frostGlass: '❄️ Frost',
    eliminatingGrid: '💥 Matches',
    comboCountMetric: '⚡ Combos',
    movesPercentText: 'Züge übrig',
    scoreLabel: 'Punkte',
    winStateTitle: 'Sieg!',
    loseStateTitle: 'Fehlgeschlagen',
    bonusLabel: 'Bonus',
    grandTotalLabel: 'Gesamt',
    newRecordLabel: 'Bestergebnis',
    nextLevelBtn: 'Nächstes Level',
    replayBtn: 'Wiederholen',
    lobbyBtn: 'Lobby',
    sponsorTitle: 'Unterstützung',
    sponsorSub: 'Vielen Dank für deine Spende! Die App benötigt Unterstützung beim Betrieb.',
    scanTip: 'Bitte scanne den QR-Code über Alipay oder WeChat, um zu spenden.',
    winModalSponsorSub: 'Vielen Dank für deine Großzügigkeit! Deine Spende motiviert uns zu Höchstleistungen! 💖',
    closeBtn: 'Schließen',
    alipaySponsorDesc: 'Alipay-Sponsoring',
    wepaySponsorDesc: 'Wepay-Sponsoring',
    deadlockToast: '🔄 Keine gültigen Züge mehr! Magische Neuaufteilung läuft...'
  },
  es: {
    title: 'Feliz Match-3',
    mascotBubble: '¡Miau~ Empecemos juntos el alegre viaje de combinaciones! ✨',
    playBtn: 'Aventura',
    backToLobby: 'Volver al Lobby',
    cumulativeStars: 'Estrellas Totales',
    autoUnlockTip: '🐱 ¡Supera el nivel para desbloquear el siguiente!',
    levelTitle: 'Nivel',
    challengeStart: 'Objetivos',
    frostGlass: '❄️ Escarcha',
    eliminatingGrid: '💥 Eliminar',
    comboCountMetric: '⚡ Combos',
    movesPercentText: 'Movimientos',
    scoreLabel: 'Puntos',
    winStateTitle: '¡Victoria!',
    loseStateTitle: 'Derrota',
    bonusLabel: 'Bono',
    grandTotalLabel: 'Total',
    newRecordLabel: 'Nuevo Récord',
    nextLevelBtn: 'Siguiente',
    replayBtn: 'Reintentar',
    lobbyBtn: 'Lobby',
    sponsorTitle: 'Apoyar Desarrollo',
    sponsorSub: '¡Gracias por su apoyo financiero, esta aplicación necesita su ayuda para seguir activa!',
    scanTip: 'Use Alipay o WeChat para escanear el código QR para patrocinar.',
    winModalSponsorSub: '¡Gracias por cada muestra de bondad! Su patrocinio es el motor para seguir mejorando. 💖',
    closeBtn: 'Cerrar',
    alipaySponsorDesc: 'Patrocinio Alipay',
    wepaySponsorDesc: 'Patrocinio Wepay',
    deadlockToast: '🔄 ¡No quedan movimientos! Mezcla mágica en curso...'
  },
  vi: {
    title: 'Tiêu Tiêu Nhạc',
    mascotBubble: 'Meo~ Hãy cùng tôi bắt đầu hành trình phá gạch vui vẻ nhé! ✨',
    playBtn: 'Bắt Đầu Choi',
    backToLobby: 'Trở về Đại Sảnh',
    cumulativeStars: 'Thành Tích Sao',
    autoUnlockTip: '🐱 Vượt ải thành công sẽ tự động mở khóa ải tiếp theo!',
    levelTitle: 'Bản đồ',
    challengeStart: 'Mục Tiêu',
    frostGlass: '❄️ Tảng Băng',
    eliminatingGrid: '💥 Tiêu Diệt',
    comboCountMetric: '⚡ Liên Hoàn',
    movesPercentText: 'Lượt Còn Lại',
    scoreLabel: 'Điểm Số',
    winStateTitle: 'Thành Công!',
    loseStateTitle: 'Thất Bại',
    bonusLabel: 'Thưởng',
    grandTotalLabel: 'Tổng Cộng',
    newRecordLabel: 'Kỷ Lục Mới',
    nextLevelBtn: 'Ải Tiếp Theo',
    replayBtn: 'Thử Lại',
    lobbyBtn: 'Đại Sảnh',
    sponsorTitle: 'Ủng Hộ Nhà Phát Triển',
    sponsorSub: 'Cảm ơn sự đóng góp quý báu của bạn, dự án cần sự hỗ trợ từ bạn để duy trì lâu dài!',
    scanTip: 'Vui lòng quét mã QR bằng Alipay hoặc WeChat để ủng hộ.',
    winModalSponsorSub: 'Xin chân thành cảm ơn lòng hảo tâm của bạn, sự hỗ trợ này là động lực to lớn của chúng tôi! 💖',
    closeBtn: 'Đóng',
    alipaySponsorDesc: 'Ủng hộ qua Alipay',
    wepaySponsorDesc: 'Ủng hộ qua Wepay',
    deadlockToast: '🔄 Không còn lượt kết hợp! Đang tự động sắp xếp lại...'
  }
};

// Automatic level text translator dictionaries to avoid huge file size
// We provide specific keywords or direct rule-based translate function
const LEVEL_TRANSLATIONS: Record<LanguageCode, {
  namePrefix: string;
  defaultDesc: string;
  levels: Record<number, { name: string; desc: string }>;
}> = {
  zh: {
    namePrefix: '关卡',
    defaultDesc: '消除方块以达成目标！',
    levels: {} // Fallback directly uses level.chineseName and level.chineseDescription
  },
  en: {
    namePrefix: 'Level',
    defaultDesc: 'Match letters to reach the goal!',
    levels: {
      1: { name: "A.B.C. Beginnings", desc: "Beginner level. Swap adjacent letters to match 3 of the same letters in a line. Simple and sweet!" },
      2: { name: "The Grand Cross", desc: "A cross-shaped arena. Irregular corners limit matching. Watch your steps!" },
      3: { name: "Frosty Fortress", desc: "Ice barriers block the lower board. Match adjacent to shatter the ice locks!" },
      4: { name: "Twin Pillars", desc: "Two narrow vertical towers separated by a central gap. Gravity feeds separately!" },
      5: { name: "Diamond Vault", desc: "A diamond shape grid. Extreme matching restrictions. Use your special power letters wisely!" }
    }
  },
  hi: {
    namePrefix: 'स्तर',
    defaultDesc: 'लक्ष्य तक पहुँचने के लिए अक्षरों का मिलान करें!',
    levels: {
      1: { name: "प्रारंभिक शुरुआत", desc: "शुरुआती स्तर। एक रेखा में एक ही अक्षर के 3 मिलान करने के लिए आस-पास के अक्षरों को बदलें।" },
      2: { name: "भव्य क्रॉस", desc: "एक क्रॉस के आकार का क्षेत्र। अनियमित कोने मिलान को सीमित करते हैं।" },
      3: { name: "बर्फीला किला", desc: "बर्फ की रुकावटें निचले बोर्ड को रोकती हैं। बर्फ को तोड़ने के लिए आस-पास मिलान करें!" },
      4: { name: "जुड़वां खंभे", desc: "एक केंद्रीय अंतर से अलग किए गए दो संकीर्ण ऊर्ध्वाधर स्तंभ। गुरुत्वाकर्षण अलग-अलग काम करता है!" },
      5: { name: "हीरा तिजोरी", desc: "एक हीरे के आकार का ग्रिड। अत्यधिक मिलान प्रतिबंध। अपने विशेष अक्षरों का बुद्धिमानी से उपयोग करें!" }
    }
  },
  pt: {
    namePrefix: 'Nível',
    defaultDesc: 'Combine as letras para vencer e atingir a pontuação alvo!',
    levels: {
      1: { name: "Começo Simples", desc: "Nível iniciante. Troque letras adjacentes para alinhar 3 ou mais iguais. Divertido e fácil!" },
      2: { name: "Grande Cruz", desc: "Arena em formato de cruz. Cantos irregulares limitam as jogadas. Cuidado onde mexe!" },
      3: { name: "Forte Congelado", desc: "Barreiras de gelo bloqueiam a parte inferior do tabuleiro. Combine ao lado para quebrá-lo!" },
      4: { name: "Pilares Gêmeos", desc: "Duas colunas estreitas separadas por um abismo central. A gravidade age individualmente!" },
      5: { name: "Cofre de Diamante", desc: "Grelha em forma de losango. Restrições severas de espaço. Use poderes especiais com inteligência!" }
    }
  },
  fr: {
    namePrefix: 'Niveau',
    defaultDesc: 'Alignez les lettres magiques pour atteindre vos objectifs !',
    levels: {
      1: { name: "Premiers Pas", desc: "Niveau débutant. Échangez des lettres adjacentes pour aligner 3 blocs identiques. Simple et sympa !" },
      2: { name: "La Grande Croix", desc: "Arène en forme de croix. Les coins vides limitent l'espace. Planifiez vos coups !" },
      3: { name: "Forteresse de Givre", desc: "La glace bloque le bas du plateau. Faites des d'associations à côté pour la briser !" },
      4: { name: "Piliers Jumeaux", desc: "Deux fines tours verticales séparées au centre. La chute des cubes est indépendante !" },
      5: { name: "Voûte de Diamant", desc: "Grille en forme de diamant. Espace très restreint. Activez des bombes avec stratégie !" }
    }
  },
  ja: {
    namePrefix: 'レベル',
    defaultDesc: 'シンボルをそろえてステージ目標得点をクリアしよう！',
    levels: {
      1: { name: "はじめの一歩", desc: "初心者向けステージ。隣り合う文字を入れ替えて、縦横に3つ以上そろえましょう！" },
      2: { name: "グランドクロス", desc: "十字型のエリア。角が削られているため、マッチさせ難い構造です。一歩一歩を慎重に！" },
      3: { name: "氷結の要塞", desc: "画面下部が硬い氷で閉ざされています。隣接するセルでマッチさせて氷を砕こう！" },
      4: { name: "ツインピラー", desc: "中央の隙間で分断された2本の細長タワー。予測不能な連鎖落下を狙いましょう！" },
      5: { name: "ダイヤの保管庫", desc: "ひし形の特殊ボード。マッチできる範囲が非常に狭く、スペシャル文字の使い方が鍵です！" }
    }
  },
  ko: {
    namePrefix: '레벨',
    defaultDesc: '동일한 문자 모양을 조합하여 미션 목표를 완수하세요!',
    levels: {
      1: { name: "행복한 첫걸음", desc: "행복한 비기너 단계. 인접 문자를 스와이프하여 일렬로 3개 이상을 맞추는 워밍업 스쿨!" },
      2: { name: "십자가 대성당", desc: "십자 모양의 이색 아레나. 구석 장벽이 많아 가로막히므로 중앙 공간 리드를 조심하세요!" },
      3: { name: "빙하의 동굴", desc: "하단부가 완전 미끄러운 서리벽으로 마감됨. 결계를 깨부시고 공간을 수복하세요!" },
      4: { name: "트윈 빌딩", desc: "중앙 협곡을 경계로 분할된 트윈 타워. 중력 낙차가 달라 폭풍 연쇄 반응을 이끕니다!" },
      5: { name: "다이아몬드 볼트", desc: "다이아몬드형 협소 그리드. 특수 아이템 합성 조합 패턴을 적극 활용해 보세요!" }
    }
  },
  de: {
    namePrefix: 'Level',
    defaultDesc: 'Kombiniere die richtigen Buchstaben, um die Ziele zu erreichen!',
    levels: {
      1: { name: "Aller Anfang ist süß", desc: "Einsteiger-Level. Tausche Symbole, um 3er-Reihen zu bilden. Einfach und entspannend!" },
      2: { name: "Das Große Kreuz", desc: "Ein kreuzförmiges Spielfeld. Keine Ecken zum Ablegen. Überlege dir jeden Zug gut!" },
      3: { name: "Eisige Zitadelle", desc: "Das untere Feld ist fest gefroren. Löse daneben Kombinationen aus, um das Eis zu sprengen!" },
      4: { name: "Zwillingssäulen", desc: "Zwei schmale Türme, getrennt durch einen leeren Spalt. Die Steine stürzen getrennt herab!" },
      5: { name: "Diamantenkammer", desc: "Ein rautenförmiges Spielfeld. Enge Platzverhältnisse erfordern kreative Spezialsteine!" }
    }
  },
  es: {
    namePrefix: 'Nivel',
    defaultDesc: '¡Empareja letras mágicas para ganar fantásticos puntos!',
    levels: {
      1: { name: "Primeros Pasos", desc: "Nivel de principiantes. Desliza letras adyacentes para juntar 3 iguales en línea recta." },
      2: { name: "La Gran Cruz", desc: "Un tablero en forma de cruz con esquinas obstruidas. Requiere desplazamientos detallados." },
      3: { name: "Fortaleza Helada", desc: "Gruesas escarchas envuelven el centro. Destrúyelas combinando símbolos adyacentes." },
      4: { name: "Pilares Gemelos", desc: "Dos columnas verticales estrechas separadas por un abismo central. Caída fluida de piezas." },
      5: { name: "Bóveda de Diamante", desc: "Tablero romboidal decorativo. Poco espacio de combinaciones, usa bombas de alto poder." }
    }
  },
  vi: {
    namePrefix: 'Ải',
    defaultDesc: 'Kết hợp các ký tự kẹo dẻo cùng màu để đạt mục tiêu!',
    levels: {
      1: { name: "Khởi Đầu May Mắn", desc: "Mức độ tân thủ. Vuốt đổi các ký tự liền kề để ghép 3 hình giống nhau thẳng hàng." },
      2: { name: "Thập Tự Điện", desc: "Bàn chơi hình chữ thập độc đáo. Các góc khuyết sẽ hạn chế tầm vuốt, hãy cẩn thận!" },
      3: { name: "Lãnh Địa Băng Giá", desc: "Lớp băng dẻo dai khóa chặt nửa dưới vùng cấm. Ghép cặp sát bên để phá tan tảng băng!" },
      4: { name: "Tháp Đôi Song Hành", desc: "Hai hành lang đứng độc lập được chia cắt bởi vực sâu. Trọng lực riêng biệt tạo combo lớn!" },
      5: { name: "Kho Báu Kim Cương", desc: "Bản đồ hình kim cương tinh tế. Không gian hẹp thúc đẩy tạo ra các ký tự bổ trợ đặc biệt!" }
    }
  }
};

const LanguageContext = createContext<{
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  translateLevelName: (level: LevelConfig) => string;
  translateLevelDesc: (level: LevelConfig) => string;
}>({
  language: 'zh',
  setLanguage: () => {},
  t: (key) => key,
  translateLevelName: (lvl) => lvl.chineseName,
  translateLevelDesc: (lvl) => lvl.chineseDescription
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('happy_match3_lang');
      return (saved as LanguageCode) || 'zh';
    } catch {
      return 'zh';
    }
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('happy_match3_lang', lang);
    } catch (e) {
      console.error(e);
    }
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  // Maps level translation elegantly.
  const translateLevelName = (level: LevelConfig): string => {
    if (language === 'zh') return level.chineseName;
    if (language === 'en') return level.name;
    
    // Check specific translation dictionary first
    const spec = LEVEL_TRANSLATIONS[language]?.levels?.[level.id];
    if (spec) return spec.name;

    // Direct automated fallback translations for common levels above 5
    const prefix = LEVEL_TRANSLATIONS[language]?.namePrefix || 'Level';
    
    // Let's create beautiful titles matching language structure if not explicit
    const titleWords: Record<string, Record<LanguageCode, string>> = {
      "快乐初体验": { zh: "快乐初体验", en: "Happy Beginnings", hi: "खुशहाल शुरुआत", pt: "Início Alegre", fr: "Début Joyeux", ja: "ハッピースタート", ko: "기쁜 첫출발", de: "Froher Start", es: "Inicio Feliz", vi: "Ấn Tượng Đầu" },
      "十字圣殿": { zh: "十字圣殿", en: "Cross Temple", hi: "क्रॉस मंदिर", pt: "Templo da Cruz", fr: "Temple de la Croix", ja: "十字大聖堂", ko: "십자성전", de: "Kreuztempel", es: "Templo de la Cruz", vi: "Thánh Điện Thập Tự" },
      "冰封禁地": { zh: "冰封禁地", en: "Frozen Land", hi: "बर्फीला क्षेत्र", pt: "Terras Congeladas", fr: "Terre Gelée", ja: "氷結禁地", ko: "빙하결계", de: "Eisland", es: "Tierra Helada", vi: "Băng Phong Lãnh Địa" },
      "双塔圣殿": { zh: "双塔圣殿", en: "Twin Pillars", hi: "जुड़वां स्तंभ", pt: "Pilares Gêmeos", fr: "Piliers Jumeaux", ja: "双塔の神殿", ko: "쌍두마차", de: "Zwillingssäulen", es: "Pilares Gemelos", vi: "Tháp Đôi Song Hành" },
      "钻石宝库": { zh: "钻石宝库", en: "Diamond Vault", hi: "हीरा तिजोरी", pt: "Cofre de Diamantes", fr: "Trésor de Diamants", ja: "ダイヤの宝庫", ko: "보석 창고", de: "Diamantenkammer", es: "Bóveda de Diamantes", vi: "Kho Kim Cương" },
      "极品回廊": { zh: "极品回廊", en: "Grand Corridor", hi: "भव्य गलियारा", pt: "Corredor Nobre", fr: "Grand Corridor", ja: "極上の回廊", ko: "극강의 미로", de: "Prachtkorridor", es: "Gran Pasillo", vi: "Hành Lang Danh Giá" }
    };

    const nativeWord = titleWords[level.chineseName]?.[language];
    if (nativeWord) return nativeWord;

    // Otherwise format as "Level X" or similar
    return `${prefix} ${level.id}`;
  };

  const translateLevelDesc = (level: LevelConfig): string => {
    if (language === 'zh') return level.chineseDescription;
    if (language === 'en') return level.description;

    const spec = LEVEL_TRANSLATIONS[language]?.levels?.[level.id];
    if (spec) return spec.desc;

    // Fast-mapping templates for desc
    const templates: Record<LanguageCode, string> = {
      zh: '消除方块以达成目标！',
      en: 'Clear blockers and match candy shapes to unlock your star goals!',
      hi: 'अवरोधकों को साफ़ करें और अपने सितारों के लक्ष्यों को अनलॉक करें!',
      pt: 'Elimine os bloqueadores e combine os blocos para conquistar as estrelas do nível!',
      fr: 'Détruisez les modules de glace et alignez les dômes pour décrocher vos étoiles !',
      ja: 'ブロックや氷の障害物を破壊して、最高の星3つ星クリアに挑戦しよう！',
      ko: '장벽들을 신속히 부수고 환상적인 연쇄 반응을 이끌어 최고기록 성사!',
      de: 'Spreng die Blockaden weg, bilde Ketten und gewinne alle 3 Sterne!',
      es: '¡Supera los bloques helados y crea impresionantes combos para ganar 3 estrellas!',
      vi: 'Dọn sạch vật cản cát đá và tạo phản ứng chuỗi liên tiếp để dành trọn 3 sao vàng!'
    };

    return templates[language] || level.description;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translateLevelName, translateLevelDesc }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);
