import type { QuestionTranslations } from "../types";

export const mathematics: QuestionTranslations = {
  q007: {
    question: "Kolik je 12 × 12?",
    correct_answer: "144",
    incorrect_answers: ["124", "134", "154"],
    explanation:
      "12 × 12 = 144, tedy množství, kterému se tradičně říká veletucet. Je to také jediné Fibonacciho číslo větší než 1, které je druhou mocninou celého čísla.",
  },
  q012: {
    question: "Jaká je derivace x³?",
    correct_answer: "3x²",
    incorrect_answers: ["x²", "3x", "x³"],
    explanation:
      "Podle pravidla pro derivaci mocniny je derivace xⁿ rovna nxⁿ⁻¹: exponent 3 se přesune před x a sníží se o jedna, takže vyjde 3x².",
  },
  q021: {
    question: "Ludolfovo číslo π je racionální.",
    explanation:
      "π je iracionální: nelze ho zapsat jako zlomek dvou celých čísel. Dokázal to Johann Heinrich Lambert v roce 1761; 22/7 je jen přibližná hodnota.",
  },
  q029: {
    question: "Kolik je 15 + 25?",
    correct_answer: "40",
    incorrect_answers: ["35", "45", "50"],
    explanation:
      "Sečtěte desítky (10 + 20 = 30) a jednotky (5 + 5 = 10) a pak obojí spojte: 30 + 10 = 40.",
  },
  q037: {
    question: "Kolik je druhá odmocnina ze 196?",
    correct_answer: "14",
    incorrect_answers: ["12", "13", "16"],
    explanation:
      "14 × 14 = 196, takže √196 = 14. (Na druhou dává 196 i −14, ale symbol √ označuje kladnou odmocninu.)",
  },
  q045: {
    question: "Jaký je neurčitý integrál z 1/x?",
    correct_answer: "ln|x| + C",
    incorrect_answers: ["x + C", "1/x² + C", "x²/2 + C"],
    explanation:
      "Derivace ln|x| je 1/x pro každé nenulové x – proto na absolutní hodnotě záleží, když x může být záporné.",
  },
  q053: {
    question: "Nula se považuje za sudé číslo.",
    explanation:
      "Sudé číslo je celé číslo dělitelné 2 beze zbytku a 0 : 2 = 0 přesně. Nula navíc leží mezi dvěma lichými čísly, −1 a 1.",
  },
  q102: {
    question: "Kolik je 15 % z 200?",
    correct_answer: "30",
    incorrect_answers: ["25", "35", "20"],
    explanation: "10 % z 200 je 20 a 5 % je polovina z toho, tedy 10, takže 15 % je 20 + 10 = 30.",
  },
  q103: {
    question: "Jaká je hodnota čísla π zaokrouhlená na dvě desetinná místa?",
    correct_answer: "3,14",
    incorrect_answers: ["3,15", "3,41", "3,12"],
    explanation:
      "π = 3,14159… a protože třetí číslice za desetinnou čárkou je 1, zaokrouhlujeme dolů na 3,14. Den π se slaví 14. března (v americkém zápisu data 3/14).",
  },
  q104: {
    question: "Kolik stupňů dává dohromady součet vnitřních úhlů trojúhelníku?",
    correct_answer: "180",
    incorrect_answers: ["90", "270", "360"],
    explanation:
      "Vnitřní úhly každého trojúhelníku v rovině mají součet 180°. Na zakřiveném povrchu, například na kouli, je jejich součet větší.",
  },
  q105: {
    question: "Jaké je nejmenší prvočíslo větší než 50?",
    correct_answer: "53",
    incorrect_answers: ["51", "55", "57"],
    explanation:
      "51 = 3 × 17 a 52 je sudé, takže 53 je první prvočíslo po 50. Ani chytáky 55 (5 × 11) a 57 (3 × 19) prvočísla nejsou.",
  },
  q106: {
    question: "Kolik je 9 × 7?",
    correct_answer: "63",
    incorrect_answers: ["56", "72", "69"],
    explanation:
      "9 × 7 = 63. Šikovná kontrola násobilky devíti: ciferný součet každého výsledku až do 9 × 10 je 9 (tady 6 + 3).",
  },
  q107: {
    question: "Kolik je druhá odmocnina ze 169?",
    correct_answer: "13",
    incorrect_answers: ["12", "14", "17"],
    explanation:
      "13 × 13 = 169, takže √169 = 13. Rychlá kontrola: 13² = 10² + 2 × 10 × 3 + 3² = 100 + 60 + 9.",
  },
  q108: {
    question: "Které prvočíslo následuje hned po 7?",
    correct_answer: "11",
    incorrect_answers: ["9", "13", "10"],
    explanation: "8, 9 i 10 jsou dělitelné 2 nebo 3, takže další prvočíslo po 7 je 11.",
  },
  q109: {
    question: "Ve Fibonacciho posloupnosti začínající 1, 1, 2, 3, 5 – které číslo následuje po 21?",
    correct_answer: "34",
    incorrect_answers: ["26", "32", "42"],
    explanation:
      "Každé Fibonacciho číslo je součtem dvou předchozích: 1, 1, 2, 3, 5, 8, 13, 21, takže další je 13 + 21 = 34.",
  },
  "math-001": {
    question: "Jaké číslo se římskými číslicemi zapisuje jako XL?",
    correct_answer: "40",
    incorrect_answers: ["60", "90", "110"],
    explanation:
      "Menší číslice zapsaná před větší se odečítá, takže XL = 50 − 10 = 40. Zapsáno obráceně, LX znamená 60.",
  },
  "math-002": {
    question: "Kolik je ½ + ¼?",
    correct_answer: "¾",
    incorrect_answers: ["⅓", "⅔", "⅝"],
    explanation:
      "Když ½ zapíšeme jako 2/4, dostaneme 2/4 + 1/4 = 3/4. Sečíst zvlášť čitatele a zvlášť jmenovatele a dostat 2/6 = ⅓ je klasická chyba.",
  },
  "math-003": {
    question: "Které je jediné sudé prvočíslo?",
    correct_answer: "2",
    incorrect_answers: ["0", "4", "6"],
    explanation:
      "Každé větší sudé číslo je dělitelné 2, a proto nemůže být prvočíslem. Dvojka je tak jediné sudé prvočíslo a zároveň nejmenší prvočíslo vůbec.",
  },
  "math-004": {
    question: "O kolik stupňů se otočí minutová ručička hodin za 20 minut?",
    correct_answer: "120°",
    incorrect_answers: ["20°", "60°", "90°"],
    explanation:
      "Minutová ručička se za 60 minut otočí o celých 360°, takže 20 minut je třetina otáčky: 360 : 3 = 120°.",
  },
  "math-005": {
    question: "Jaký je obvod čtverce se stranou dlouhou 5 cm?",
    correct_answer: "20 cm",
    incorrect_answers: ["25 cm", "10 cm", "15 cm"],
    explanation:
      "Čtverec má čtyři stejně dlouhé strany, takže jeho obvod je 4 × 5 = 20 cm. Lákavých 25 je jeho obsah ve čtverečních centimetrech.",
  },
  "math-006": {
    question: "Jak se nazývá trojúhelník, jehož všechny tři strany jsou stejně dlouhé?",
    correct_answer: "Rovnostranný",
    incorrect_answers: ["Rovnoramenný", "Různostranný", "Pravoúhlý"],
    explanation:
      "„Rovnostranný“ znamená, že má všechny strany stejné, a každý z jeho tří úhlů měří 60°. Rovnoramennému stačí dvě shodné strany (formálně se tedy počítá i rovnostranný), různostranný nemá žádné.",
  },
  "math-007": {
    question: "Kolik je 5 + 3 × 2?",
    correct_answer: "11",
    incorrect_answers: ["16", "13", "10"],
    explanation:
      "Násobení má přednost před sčítáním, takže nejdřív 3 × 2 = 6 a pak 5 + 6 = 11. Počítání popořadě zleva doprava vede k chytáku 16.",
  },
  "math-008": {
    question: "Jak se nazývá délka okraje kruhu, když ho obejdeme dokola?",
    correct_answer: "Obvod",
    incorrect_answers: ["Průměr", "Poloměr", "Tečna"],
    explanation:
      "Obvod kruhu se rovná π krát průměr, takže je o něco větší než trojnásobek vzdálenosti napříč. Poloměr vede od středu k okraji.",
  },
  "math-009": {
    question: "Kolik hran má krychle?",
    correct_answer: "12",
    incorrect_answers: ["6", "8", "10"],
    explanation:
      "Krychle má 12 hran, 6 stěn a 8 vrcholů. Eulerova věta o mnohostěnech sedí: vrcholy − hrany + stěny = 8 − 12 + 6 = 2.",
  },
  "math-010": {
    question: "Kolik je 1 000 : 8?",
    correct_answer: "125",
    incorrect_answers: ["120", "150", "250"],
    explanation:
      "Protože 8 = 2 × 2 × 2, stačí třikrát vydělit dvěma: 1 000 → 500 → 250 → 125. Proto je také ⅛ = 0,125.",
  },
  "math-011": {
    question: "Které číslo následuje v řadě 1, 4, 9, 16, 25, …?",
    correct_answer: "36",
    incorrect_answers: ["30", "35", "49"],
    explanation:
      "Jsou to druhé mocniny 1², 2², 3², 4², 5², takže další je 6² = 36. Rozdíly mezi nimi tvoří lichá čísla 3, 5, 7, 9, 11.",
  },
  "math-012": {
    question: "Každý čtverec je zároveň obdélník.",
    explanation:
      "Obdélník je každý čtyřúhelník se čtyřmi pravými úhly, takže čtverec tuto podmínku splňuje: je to prostě obdélník, jehož strany jsou všechny stejně dlouhé.",
  },
  "math-013": {
    question: "Který rok se římskými číslicemi zapisuje jako MCMXCIX?",
    correct_answer: "1999",
    incorrect_answers: ["1899", "1989", "1994"],
    explanation:
      "M = 1 000, CM = 900, XC = 90 a IX = 9, dohromady tedy 1999. V každé dvojici se menší číslice zapsaná před větší odečítá.",
  },
  "math-014": {
    question: "Jak se nazývá číslo tvořené jedničkou a 100 nulami?",
    correct_answer: "Googol",
    incorrect_answers: ["Googolplex", "Centilion", "Zilion"],
    explanation:
      "Název vymyslel Milton Sirotta, devítiletý synovec amerického matematika Edwarda Kasnera. Jméno firmy Google je hříčkou právě na toto slovo.",
  },
  "math-015": {
    question: "Kolik je 2 na desátou?",
    correct_answer: "1 024",
    incorrect_answers: ["1 000", "512", "2 048"],
    explanation:
      "Začněte u 1 a desetkrát zdvojnásobte: 2, 4, 8, 16, 32, 64, 128, 256, 512, 1 024. Proto měl kilobajt tradičně 1 024 bajtů.",
  },
  "math-016": {
    question: "Které z těchto čísel je prvočíslo?",
    correct_answer: "97",
    incorrect_answers: ["91", "87", "57"],
    explanation:
      "91 = 7 × 13, 87 = 3 × 29 a 57 = 3 × 19, ale 97 nemá jiné dělitele než 1 a sebe sama. Je to největší prvočíslo menší než 100.",
  },
  "math-017": {
    question: "Pravoúhlý trojúhelník má odvěsny dlouhé 6 cm a 8 cm. Jak dlouhá je jeho přepona?",
    correct_answer: "10 cm",
    incorrect_answers: ["14 cm", "12 cm", "11 cm"],
    explanation:
      "Podle Pythagorovy věty je 6² + 8² = 36 + 64 = 100 a √100 = 10. Je to klasický pravoúhlý trojúhelník se stranami 3, 4, 5, jen dvakrát zvětšený.",
  },
  "math-018": {
    question: "Který starořecký matematik napsal „Základy“, stěžejní učebnici geometrie?",
    correct_answer: "Eukleidés",
    incorrect_answers: ["Pýthagorás", "Archimédés", "Thalés"],
    explanation:
      "Eukleidés je sepsal v Alexandrii kolem roku 300 př. n. l. Jejich 13 knih buduje geometrii z hrstky axiomů a jako standardní učebnice sloužily až do 20. století.",
  },
  "math-019": {
    question: "Který součet padne nejpravděpodobněji při hodu dvěma obyčejnými šestistěnnými kostkami?",
    correct_answer: "7",
    incorrect_answers: ["6", "8", "12"],
    explanation:
      "Součet 7 dává šest z 36 stejně pravděpodobných výsledků (1+6, 2+5, 3+4 a jejich obrácení). Součty 6 a 8 lze hodit pěti způsoby, 12 jen jedním.",
  },
  "math-020": {
    question: "Kolik je 25 × 24?",
    correct_answer: "600",
    incorrect_answers: ["576", "625", "500"],
    explanation: "Rozložte 24 na 4 × 6: 25 × 4 = 100 a pak 100 × 6 = 600.",
  },
  "math-021": {
    question: "Který matematik 17. století je autorem slavné „velké věty“, kterou až o více než 350 let později dokázal Andrew Wiles?",
    correct_answer: "Pierre de Fermat",
    incorrect_answers: ["René Descartes", "Blaise Pascal", "Leonhard Euler"],
    explanation:
      "Kolem roku 1637 si Fermat poznamenal na okraj knihy, že rovnice xⁿ + yⁿ = zⁿ nemá pro n > 2 žádné řešení v kladných celých číslech, a dodal, že jeho důkaz se na okraj nevejde.",
  },
  "math-022": {
    question: "Jaká je přibližná hodnota zlatého řezu φ?",
    correct_answer: "1,618",
    incorrect_answers: ["1,414", "1,732", "2,718"],
    explanation:
      "φ = (1 + √5) / 2 ≈ 1,618. Podíly po sobě jdoucích Fibonacciho čísel, například 21 : 13, se k němu blíží čím dál víc.",
  },
  "math-023": {
    question: "Pálka a míček stojí dohromady 110 Kč. Pálka je o 100 Kč dražší než míček. Kolik stojí míček?",
    correct_answer: "5 Kč",
    incorrect_answers: ["10 Kč", "1 Kč", "15 Kč"],
    explanation:
      "Když míček stojí 5 Kč, pálka stojí 105 Kč a dohromady to dělá 110 Kč. Lákavých 10 Kč by znamenalo pálku za 110 Kč a celkem 120 Kč.",
  },
  "math-024": {
    question: "Prvočísel je nekonečně mnoho.",
    explanation:
      "Eukleidés to dokázal kolem roku 300 př. n. l.: vynásobte libovolný konečný seznam prvočísel a přičtěte 1 – výsledek má prvočinitele, který v seznamu chybí.",
  },
  "math-025": {
    question: "Který středověký italský matematik zpopularizoval v Evropě indicko-arabské číslice svou knihou „Liber Abaci“ z roku 1202?",
    correct_answer: "Fibonacci",
    incorrect_answers: ["Gerolamo Cardano", "Luca Pacioli", "Galileo Galilei"],
    explanation:
      "Fibonacci, známý také jako Leonardo Pisánský, zařadil do Liber Abaci úlohu o množení králíků – odtud pochází posloupnost nesoucí jeho jméno.",
  },
  "math-026": {
    question: "Periodické číslo 0,999… se přesně rovná 1.",
    explanation:
      "⅓ = 0,333… a trojnásobek toho je 0,999…, což se musí rovnat 3 × ⅓ = 1. Mezi oběma čísly neleží žádné jiné číslo.",
  },
  "math-027": {
    question: "Ve skupině pouhých 23 lidí je pravděpodobnost, že dva z nich mají narozeniny ve stejný den, větší než 50 %.",
    explanation:
      "Jde o tzv. narozeninový paradox: 23 lidí tvoří 253 různých dvojic a pravděpodobnost alespoň jedné shody narozenin je asi 50,7 %.",
  },
  "math-028": {
    question: "Kolik dává součet všech čísel na evropské ruletě (0 až 36)?",
    correct_answer: "666",
    incorrect_answers: ["630", "648", "703"],
    explanation:
      "Podle vzorce n(n + 1) / 2 dávají čísla 1 až 36 dohromady 36 × 37 / 2 = 666, tedy takzvané „číslo šelmy“. Nula nic nepřidá.",
  },
  "math-029": {
    question: "Které je nejmenší číslo, jež lze dvěma různými způsoby zapsat jako součet dvou kladných třetích mocnin?",
    correct_answer: "1 729",
    incorrect_answers: ["1 728", "1 001", "4 104"],
    explanation:
      "1 729 = 1³ + 12³ = 9³ + 10³. Ramanujan na to upozornil, když G. H. Hardy prohlásil, že je to nudné číslo – bylo to číslo Hardyho taxíku.",
  },
  "math-030": {
    question: "Jaký je přesný součet řady 1 + 1/4 + 1/9 + 1/16 + …, tedy převrácených hodnot všech druhých mocnin?",
    correct_answer: "π²/6",
    incorrect_answers: ["π/4", "2", "e − 1"],
    explanation:
      "Jde o tzv. basilejský problém, který ve 30. letech 18. století vyřešil Leonhard Euler. Součet je asi 1,645 a to, že se v něm objevilo π, matematiky ohromilo.",
  },
  "math-031": {
    question: "Čemu se podle Eulerovy identity rovná e^(iπ)?",
    correct_answer: "−1",
    incorrect_answers: ["1", "0", "i"],
    explanation:
      "e^(iπ) = −1, obvykle se zapisuje jako e^(iπ) + 1 = 0. Spojuje pět nejdůležitějších čísel matematiky: e, i, π, 1 a 0.",
  },
  "math-032": {
    question: "Který francouzský matematik, jeden ze zakladatelů teorie grup, zahynul v roce 1832 v souboji ve věku pouhých 20 let?",
    correct_answer: "Évariste Galois",
    incorrect_answers: ["Niels Henrik Abel", "Augustin-Louis Cauchy", "Joseph Fourier"],
    explanation:
      "Galois byl smrtelně zraněn v souboji v Paříži. Noc předtím sepsal dopis shrnující své myšlenky, na nichž dnes stojí moderní algebra.",
  },
  "math-033": {
    question: "Která žena jako první získala Fieldsovu medaili, často označovanou za „Nobelovu cenu matematiky“?",
    correct_answer: "Maryam Mirzakhaniová",
    incorrect_answers: ["Emmy Noetherová", "Maryna Vjazovska", "Sofja Kovalevská"],
    explanation:
      "Íránská matematička Maryam Mirzakhaniová ji získala v roce 2014 za práci o geometrii Riemannových ploch. Maryna Vjazovska se v roce 2022 stala druhou oceněnou ženou.",
  },
  "math-034": {
    question: "Která slavná nevyřešená hypotéza tvrdí, že každé sudé číslo větší než 2 je součtem dvou prvočísel?",
    correct_answer: "Goldbachova hypotéza",
    incorrect_answers: ["Riemannova hypotéza", "Collatzova hypotéza", "Hypotéza o prvočíselných dvojčatech"],
    explanation:
      "Christian Goldbach ji vyslovil v roce 1742 v dopise Leonhardu Eulerovi. Počítače ji ověřily až do 4 × 10¹⁸, důkaz ale zatím nikdo nenašel.",
  },
  "math-035": {
    question: "Jaký tvar mají Mersennova prvočísla, pojmenovaná po francouzském mnichovi ze 17. století?",
    correct_answer: "2ⁿ − 1",
    incorrect_answers: ["2ⁿ + 1", "n² + 1", "n! + 1"],
    explanation:
      "Mezi prvočísla tvaru 2ⁿ − 1 patří 3, 7, 31 a 127. Většina rekordně velkých známých prvočísel jsou Mersennova prvočísla, a to díky rychlému Lucasovu–Lehmerovu testu.",
  },
};
