import type { Locale } from "@/i18n/config";

/** Copy for a topic's landing page. Server-only in practice (pages import it). */
export interface CategoryContent {
  /** The topic's quiz by name: footer links, Czech headings ("Zeměpisný kvíz"). */
  quiz: string;
  /** One line for cards and meta descriptions. */
  tagline: string;
  /** Intro paragraphs for the category landing page. */
  intro: string[];
}

/** Keyed by `Category.name`. */
export const CATEGORY_CONTENT: Record<Locale, Record<string, CategoryContent>> = {
  en: {
    "General Knowledge": {
      quiz: "General Knowledge quiz",
      tagline: "Everyday facts, words, food, animals and the odd curveball.",
      intro: [
        "General knowledge is the classic pub-quiz round: a bit of everything, from what's in your kitchen cupboard to the flags you half-remember from school. It rewards curiosity more than study — the kind of facts you pick up from reading labels, travelling and asking \"wait, why is that?\"",
        "Play a timed round to chase the speed bonus, or scroll down for the full list of questions with answers and a short explanation for each — handy if you're running a quiz night of your own.",
      ],
    },
    Science: {
      quiz: "Science quiz",
      tagline: "Physics, chemistry, biology, space and the human body.",
      intro: [
        "Science trivia covers the big ideas and the strange details: why the sky is blue, what your bones are made of, which planet spins on its side. Easy questions stick to things you met in school; the hard ones dig into elements, units and the people behind famous discoveries.",
        "Every question below comes with its answer and a one-line explanation, so a wrong guess still teaches you something.",
      ],
    },
    History: {
      quiz: "History quiz",
      tagline: "Empires, revolutions, explorers and turning points.",
      intro: [
        "History trivia spans thousands of years — ancient civilisations, medieval kingdoms, revolutions, world wars and the people who shaped them. Dates matter, but the best questions are about the moments and decisions behind them.",
        "Test yourself with a quick timed round, then read through the questions and explanations below to fill in the gaps.",
      ],
    },
    Geography: {
      quiz: "Geography quiz",
      tagline: "Capitals, rivers, mountains, borders and maps.",
      intro: [
        "Geography trivia is more than capital cities: rivers that cross borders, mountains on every continent, deserts, islands and the lines on the map that surprise people. If you can picture the globe, you're halfway there.",
        "Play a round against the clock, or browse every question with its answer and a short explanation further down the page.",
      ],
    },
    Literature: {
      quiz: "Literature quiz",
      tagline: "Novels, poets, plays, characters and famous first lines.",
      intro: [
        "Literature trivia covers the books people love to quote and the ones they pretend to have read — classic novels, plays, poetry, children's favourites and world literature beyond the English-speaking canon.",
        "Can you match the author to the character, or the first line to the novel? Play a round, then check the full question list with answers below.",
      ],
    },
    Mathematics: {
      quiz: "Mathematics quiz",
      tagline: "Mental arithmetic, number facts, geometry and famous theorems.",
      intro: [
        "Maths trivia mixes quick mental arithmetic with number facts, geometry and the history of the subject — primes, Roman numerals, famous constants and the mathematicians behind the theorems.",
        "No calculator needed: every question is solvable in your head within the time limit. The explanations below show the quick working for each answer.",
      ],
    },
    Sports: {
      quiz: "Sports quiz",
      tagline: "Rules, records, Olympic history and iconic moments.",
      intro: [
        "Sports trivia goes beyond football scores — rules and terminology, the origins of games, Olympic history and the moments fans still argue about. Questions cover sports from around the world, not just the big leagues.",
        "Play a timed round to build a streak, or read the full list of questions, answers and explanations below.",
      ],
    },
    Entertainment: {
      quiz: "Entertainment quiz",
      tagline: "Film, music, TV, games and art.",
      intro: [
        "Entertainment trivia covers the films, songs, shows, games and paintings that everyone seems to know — and the behind-the-scenes facts they don't. Directors, composers, creators and the stories behind famous works.",
        "Start a round below, or scroll down for every question with its answer and a short explanation.",
      ],
    },
  },
  cs: {
    "General Knowledge": {
      quiz: "Kvíz ze všeobecného přehledu",
      tagline: "Fakta všedního dne, slova, jídlo, zvířata a sem tam nějaký chyták.",
      intro: [
        "Všeobecný přehled je klasika každého hospodského kvízu: od všeho trochu, od toho, co máš v kuchyňské skříňce, až po vlajky, které si napůl pamatuješ ze školy. Víc než biflování tu rozhoduje zvědavost — fakta, která člověk pochytí při čtení etiket, na cestách a když se zeptá „počkat, a proč vlastně?“",
        "Zahraj si kolo na čas a hon na bonus za rychlost, nebo sjeď níž na kompletní seznam otázek s odpověďmi a krátkým vysvětlením — hodí se, i když chystáš vlastní kvízový večer.",
      ],
    },
    Science: {
      quiz: "Přírodovědný kvíz",
      tagline: "Fyzika, chemie, biologie, vesmír a lidské tělo.",
      intro: [
        "Vědecký kvíz se točí kolem velkých myšlenek i podivných detailů: proč je obloha modrá, z čeho jsou kosti, která planeta se otáčí „na boku“. Lehké otázky nevybočí ze školní látky, ty těžké se noří do prvků, jednotek a lidí za slavnými objevy.",
        "Každá otázka níže má odpověď i krátké vysvětlení, takže i špatný tip tě něco naučí.",
      ],
    },
    History: {
      quiz: "Historický kvíz",
      tagline: "Říše, revoluce, objevitelé a zlomové okamžiky.",
      intro: [
        "Historický kvíz pokrývá tisíce let — starověké civilizace, středověká království, revoluce, světové války i lidi, kteří je utvářeli. Na letopočtech záleží, ale nejlepší otázky jsou o okamžicích a rozhodnutích, která za nimi stojí.",
        "Prověř se v rychlém kole na čas a pak si projdi otázky s vysvětlením níže a doplň, co ti chybí.",
      ],
    },
    Geography: {
      quiz: "Zeměpisný kvíz",
      tagline: "Hlavní města, řeky, hory, hranice a mapy.",
      intro: [
        "Zeměpisný kvíz není jen o hlavních městech: řeky, které tečou přes hranice, hory na všech kontinentech, pouště, ostrovy a čáry na mapě, které dokážou překvapit. Kdo si umí představit glóbus, má napůl vyhráno.",
        "Zahraj si kolo proti hodinám, nebo si níže na stránce projdi všechny otázky s odpověďmi a krátkým vysvětlením.",
      ],
    },
    Literature: {
      quiz: "Literární kvíz",
      tagline: "Romány, básníci, divadelní hry, postavy a slavné první věty.",
      intro: [
        "Literární kvíz zahrnuje knihy, ze kterých lidé rádi citují, i ty, které jen předstírají, že četli — klasické romány, divadelní hry, poezii, oblíbené dětské knížky a světovou literaturu napříč jazyky.",
        "Dokážeš přiřadit autora k postavě nebo první větu k románu? Zahraj si kolo a pak si projdi celý seznam otázek s odpověďmi níže.",
      ],
    },
    Mathematics: {
      quiz: "Matematický kvíz",
      tagline: "Počítání z hlavy, zajímavá čísla, geometrie a slavné věty.",
      intro: [
        "Matematický kvíz kombinuje rychlé počítání z hlavy se zajímavostmi o číslech, geometrií a dějinami oboru — prvočísla, římské číslice, slavné konstanty a matematici, kteří stojí za známými větami.",
        "Kalkulačka není potřeba: každou otázku spočítáš z hlavy v časovém limitu. Vysvětlení níže ukazují rychlý postup ke každé odpovědi.",
      ],
    },
    Sports: {
      quiz: "Sportovní kvíz",
      tagline: "Pravidla, rekordy, historie olympiád a legendární okamžiky.",
      intro: [
        "Sportovní kvíz jde dál než k fotbalovým výsledkům — pravidla a terminologie, vznik jednotlivých her, historie olympijských her a momenty, o kterých se fanoušci přou dodnes. Otázky pokrývají sporty z celého světa, nejen ty největší ligy.",
        "Zahraj si kolo na čas a rozjeď sérii, nebo si níže přečti celý seznam otázek s odpověďmi a vysvětlením.",
      ],
    },
    Entertainment: {
      quiz: "Kvíz ze světa zábavy",
      tagline: "Film, hudba, seriály, hry a umění.",
      intro: [
        "Kvíz ze světa zábavy se točí kolem filmů, písní, seriálů, her a obrazů, které jako by znal každý — a zákulisních faktů, které už tak známé nejsou. Režiséři, skladatelé, tvůrci a příběhy za slavnými díly.",
        "Spusť kolo níže, nebo sjeď dolů ke všem otázkám s odpověďmi a krátkým vysvětlením.",
      ],
    },
  },
};

export function categoryContent(name: string, locale: Locale): CategoryContent {
  return CATEGORY_CONTENT[locale][name] ?? CATEGORY_CONTENT.en[name];
}
