import { czPlural, formatNumber } from "../config";
import type { Difficulty } from "@/types/quiz";
import type { PageMessages } from "./pages.en";

const n = (value: number) => formatNumber(value, "cs");
const NB = " ";
const body = (points: number) => czPlural(points, "bod", "body", "bodů");
const otazek = (count: number) => czPlural(count, "otázka", "otázky", "otázek");

const LEVEL: Record<Difficulty, string> = {
  easy: "Lehké otázky",
  medium: "Středně těžké otázky",
  hard: "Těžké otázky",
};

/** Czech page text. Informal "ty", no gendered past tense — see ui.cs.ts. */
export const pagesCs: PageMessages = {
  meta: {
    homeTitle: "Quizzy — denní vědomostní kvíz zdarma i s odpověďmi",
    homeDescription:
      "Vědomostní kvíz zdarma s novou denní výzvou: poraž čas, sbírej série až pro ×3 bodů, odemykej odznaky a vyzvi kamarády. Osm kategorií, tři obtížnosti, bez registrace.",
    ogAlt: "Quizzy — denní vědomostní kvíz zdarma",
    appDescription:
      "Vědomostní kvíz zdarma s denní výzvou, koly na čas, násobiči za série, úrovněmi a odznaky",
    topicsTitle: "Kvízové otázky podle témat — kvízy zdarma i s odpověďmi",
    topicsDescription:
      "Kvízy zdarma v osmi tématech — všeobecný přehled, věda, historie, zeměpis, literatura, matematika, sport a zábava. Zahraj si kolo na čas, nebo si projdi všechny otázky s odpověďmi.",
    topicTitle: (topic, count) => `${topic.quiz} — ${count} ${otazek(count)} s odpověďmi`,
    topicDescription: (topic, tagline, count) =>
      `${topic.quiz} zdarma: ${tagline} Zahraj si kolo na čas, nebo si projdi ${count} ${otazek(count)} s odpověďmi a vysvětlením.`,
    dailyTitle: "Denní kvízová výzva — 8 nových otázek každý den",
    dailyDescription:
      "Denní vědomostní kvíz zdarma: každý den osm nových otázek, pro všechny stejných. Udržuj sérii, porovnej se s ostatními hráči, vyzvi kamarády a projdi si starší výzvy i s odpověďmi.",
    dayTitleRevealed: (number, day) => `Denní výzva #${number} (${day}) — otázky a odpovědi`,
    dayDescriptionRevealed: (count, day) =>
      `${count} ${otazek(count)} z denní kvízové výzvy Quizzy ze dne ${day}, i s odpověďmi a vysvětlením. Zahraj si celou sadu, nebo se rovnou podívej na odpovědi.`,
    dayTitle: (number, day) => `Denní výzva #${number} — ${day}`,
    dayDescription: (count, day) =>
      `Denní kvízová výzva Quizzy na ${day}: ${count} ${otazek(count)}, pro všechny stejné.`,
    challengeTitle: (correct, count, number) =>
      `Překonáš ${correct}/${count} v denní výzvě Quizzy #${number}?`,
    challengeDescription: (correct, count, points, day) =>
      `Výsledek k překonání: ${correct}/${count} (${n(points)}${NB}${body(points)}) v denní kvízové výzvě ze dne ${day}. Stejných ${count} otázek — jsi na řadě.`,
    embedTitle: "Denní kvíz",
  },
  breadcrumbs: { label: "Drobečková navigace", home: "Úvod" },
  home: {
    eyebrow: "Denní vědomostní kvíz zdarma",
    titleBefore: "Kolik toho ",
    titleEmphasis: "doopravdy",
    titleAfter: " víš?",
    lead: "Poraž čas, rozjeď sérii, stoupej po úrovních — a pak vyzvi kamaráda, ať překoná tvoje dnešní skóre.",
    topicsHeading: "Kvízy podle témat",
    allTopics: "Všechna témata →",
    topicCardSub: "Otázky a odpovědi",
    features: [
      {
        emoji: "🔥",
        title: "Série se vyplácí",
        text: "Tři správné odpovědi v řadě spustí násobič — až ×3 na každý získaný bod.",
      },
      {
        emoji: "⚔️",
        title: "Vyzvi kamaráda",
        text: "Pošli svůj výsledek z denní výzvy a kamarád dostane stejných osm otázek — i s tvým skóre k překonání.",
      },
      {
        emoji: "💡",
        title: "Uč se za pochodu",
        text: "Otázky z denní výzvy mají krátké vysvětlení, takže tě něco naučí i špatná odpověď.",
      },
    ],
  },
  faq: {
    heading: "Časté otázky",
    items: [
      {
        question: "Jak funguje bodování?",
        answer:
          "Každá správná odpověď má základ 100 bodů. V režimu na čas získáš navíc až 100 bonusových bodů za rychlou odpověď. Těžší otázky celkový součet násobí (×1,25 střední, ×1,5 těžká) a tři správné odpovědi v řadě spustí násobič série, který vystoupá až na ×3.",
      },
      {
        question: "Co je denní výzva?",
        answer:
          "Osm otázek, pro všechny stejná sada, obnovená o půlnoci tvého času. Máš jeden pokus: jakmile začneš, dnešní výzva se počítá jako odehraná a další hry jsou jen trénink. Hraj každý den a buduj denní sérii — vynecháš den a série spadne na nulu. Po dohrání uvidíš, jak jsi na tom ve srovnání se všemi ostatními, a starší dny zůstávají k zahrání v archivu denních výzev.",
      },
      {
        question: "Jak vyzvu kamaráda?",
        answer:
          "Dohraj denní výzvu a klepni na Sdílet. Odkaz otevře kamarádovi stejných osm otázek a ukáže mu tvoje skóre k překonání — po dohrání uvidíte oba výsledky vedle sebe.",
      },
      {
        question: "K čemu jsou žolíky?",
        answer:
          "V každém kvízu máš od každého jeden. 50:50 odebere špatné odpovědi, +10 s ti v režimu na čas přidá čas a Přeskočit tě pustí dál bez ztráty série. Kvíz na čas s úspěšností 90 % a víc bez jediného žolíka ti odemkne odznak Čistá hra.",
      },
      {
        question: "Dá se hrát klávesnicí?",
        answer:
          "Ano. Odpověď vybereš klávesami A–D (nebo 1–4), Enterem nebo mezerníkem přejdeš na další otázku. Po správné odpovědi se po chvilce pokračuje samo — pokud nemáš co dočíst ve vysvětlení.",
      },
      {
        question: "Kde je uložený můj postup?",
        answer:
          "Ve tvém prohlížeči — žádný účet, žádná registrace. Úroveň, XP, odznaky, série i statistiky podle kategorií zůstávají v tomto zařízení a kdykoli je smažeš v nastavení. K nám se dostanou jen dvě věci a ani jedna není spojená s tebou: tvůj výsledek denní výzvy (které z osmi otázek máš správně), aby všichni viděli, jak den dopadl, a anonymní počty návštěv bez cookies (zobrazení stránek, spuštěná a dohraná kola, sdílení) přes Vercel Analytics.",
      },
      {
        question: "Odkud jsou otázky?",
        answer:
          "Denní výzva, stránky s tématy i vlastní kola používají vlastní banku otázek Quizzy, s krátkým vysvětlením ke každé odpovědi.",
      },
      {
        question: "Můžu si denní kvíz dát na vlastní web?",
        answer:
          "Ano — na stránce s archivem denních výzev najdeš kód pro vložení. Je to zdarma, jen nech odkaz na Quizzy.",
      },
      {
        question: "Je Quizzy zdarma?",
        answer: "Úplně. Žádné reklamy, žádné účty, žádné limity na počet odehraných kol.",
      },
    ],
  },
  topics: {
    crumb: "Témata",
    title: "Kvízové otázky podle témat",
    lead: "Vyber si téma a zahraj si rychlé kolo na čas, nebo si projdi celý seznam otázek s odpověďmi a vysvětlením — klidně je použij na vlastní kvízový večer.",
    cardTitle: (topic) => topic.quiz,
    count: (count) => `${count} ${otazek(count)} s odpověďmi →`,
  },
  topic: {
    title: (topic) => topic.quiz,
    questionsHeading: (topic, count) => `${topic.label}: ${count} ${otazek(count)} s odpověďmi`,
    hint: "Klepni na „Ukázat odpověď“ a ověř se. Chystáš kvíz? Klidně tyhle otázky použij.",
    levelHeading: (_topic, level) => LEVEL[level],
    moreTopics: "Další kvízová témata",
    dailyLink: "📅 Denní výzva",
  },
  questionList: {
    showAnswer: "Ukázat odpověď",
    answer: "Odpověď:",
  },
  daily: {
    crumb: "Denní výzva",
    title: "Denní kvízová výzva",
    lead: "Každý den osm nových otázek, pro všechny stejných, obnovených o půlnoci tvého času. Zahraj si jednou, udrž sérii, porovnej se se všemi ostatními — a pak pošli stejnou osmičku kamarádovi.",
    howItWorks: "Jak to funguje",
    features: [
      { emoji: "⏱️", title: "Na čas", text: "U každé otázky běží odpočet a za rychlost jsou bonusové body." },
      {
        emoji: "⚔️",
        title: "Vyzvi kamarády",
        text: "Pošli svůj výsledek — odkaz jim nabídne přesně tvých osm otázek.",
      },
      { emoji: "💡", title: "Nauč se něco", text: "Každá odpověď má krátké vysvětlení." },
    ],
    archiveHeading: "Starší denní kvízy s odpověďmi",
    archiveLead:
      "Zmeškaný den? Každá výzva tu zůstává k zahrání — odpovědi zveřejňujeme o dva dny později, až skončí všude na světě.",
    archiveEmpty: "První archivní výzva se objeví brzy.",
    archiveItem: (number) => `Výzva #${number}`,
    embedHeading: "Dej si denní kvíz na svůj web",
    embedLead:
      "Zdarma pro blogy, školní stránky, newslettery i komunitní weby. Každý den se aktualizuje sám — stačí vložit tenhle kód tam, kde se má zobrazit.",
  },
  day: {
    title: (number) => `Denní výzva #${number}`,
    leadRevealed: (count, day) =>
      `${count} ${otazek(count)}, které se hrály ${day}. Nejdřív si je zahraj — odpovědi najdeš níže.`,
    lead: (count) =>
      `${count} ${otazek(count)}, pro všechny stejné. Odpovědi tu zveřejníme, až den skončí všude na světě.`,
    answersHeading: "Otázky a odpovědi",
    locked: (day) => `🔒 Odpovědi k tomuto dni zveřejníme ${day}.`,
    otherDays: "Další dny",
    allDailies: "Všechny výzvy",
  },
  challenge: {
    eyebrow: "⚔️ Někdo tě vyzývá",
    title: (correct, count) => `Překonáš ${correct}/${count}?`,
    scored: (points, number, day) =>
      `Výsledek k překonání: ${n(points)}${NB}${body(points)} v denní výzvě #${number} (${day}).`,
    footnote: (count) => `Stejných ${count} otázek, na čas. Zdarma, bez registrace.`,
    newHere: "Quizzy ještě neznáš?",
    seeMore: "Podívej se, co dalšího si můžeš zahrát →",
    imageAlt: "Výsledek k překonání v denní výzvě Quizzy",
    imageHeading: (number) => `Quizzy · Výzva #${number}`,
    imageFallbackHeading: "Quizzy · Denní výzva",
    imageFallbackScore: "Denní kvíz",
    imagePoints: (points) => `${n(points)} ${body(points)} — překonáš to?`,
    imageFallback: (count) => `${count} ${otazek(count)}. Pro všechny stejné.`,
  },
  embedPage: {
    credit: "Denní kvíz od Quizzy ↗",
  },
  notFound: {
    title: "Tahle otázka v bance není",
    text: "Stránka, kterou hledáš, neexistuje — ale zahrát si můžeš spoustu jiného.",
    play: "Zahrát si kvíz",
    daily: "Dnešní denní výzva",
  },
  footer: {
    label: "Patička",
    play: "Hrát",
    triviaQuiz: "Vědomostní kvíz",
    dailyChallenge: "Denní kvízová výzva",
    archive: "Archiv výzev s odpověďmi",
    embed: "Denní kvíz na tvůj web",
    byTopic: "Kvízy podle témat",
    blurb:
      "Vědomostní kvíz zdarma a bez registrace v osmi kategoriích a třech obtížnostech, s novou denní výzvou každý den.",
    builtBy: "Tvorba: Robert Libsansky",
    language: "Jazyk",
  },
};
