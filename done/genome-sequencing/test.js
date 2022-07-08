/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

const N = parseInt(readline());
const subs = []
for (let i = 0; i < N; i++) {
    const subseq = readline();
    subs.push(subseq);
}

// Write an answer using console.log()
// To debug: console.error('Debug messages...');

// Bruteforce
function brute(sbs) {
    let combs = [];
    const usedParts = [];

    let b = null;

    while(sbs.filter(x => usedParts.includes(x)).length != sbs.length) {
        if (b == null) {
            const usage = [...sbs, ...combs.map(x => x.concat)];
            combs = [];
            // Get scores
            while(usage.length > 0) {
                combs.push(...getScoreArray(usage.shift(), sbs))
            };
            console.error(combs)
        } else {
            // combs.push(...getScoreArray(b.concat, sbs))
            combs = getScoreArray(b.concat, sbs);
        }

        // Get best
        const best = combs.sort((a, b) => b.score - a.score)[0];
        usedParts.push(best.str, best.sample);

        b = best;
        // console.error(sbs.filter(x => usedParts.includes(x)), best)
        // console.error(combs);
    }

    console.error(b)
}
function getScoreArray(str, arr) {
    // Matching most characters in consecutive manner
    // let best = null;
    // let bestScore = 0;
    const o = [];
    const ar = arr.filter(x => x != str);
    for (const s of ar) {
        const d = getScore(str, s);
        // if (d.score > bestScore) {
        //     bestScore = d.score;
        //     best = d;
        // }
        o.push(d);
    }
    // return best;
    return o;
}
function getScore(str, sample) {
    // Find part of sample in str(starting or ending position), or whole inside
    // Also return the common part of the sample and str
    let score = 0;
    let best = {
        part: "",
        score: 0,
        concat: ""
    };
    for (let i = -sample.length + 1; i < str.length; i++) {
        let s = "";
        let isContained = false;
        let con = "";
        if (i < 0) {
            s = sample.substring(0-i);
            isContained = str.startsWith(s);
            con = str.replace(new RegExp(s), sample)
        } else {
            s = sample.substring(0, str.length - i);
            isContained = str.endsWith(s);
            con = str.replace(new RegExp(s + "$"), sample)
        }

        const cur = s.length;
        if (isContained && cur > score) {
            score = cur;
            best = {
                str: str,
                sample: sample,
                part: s,
                score: cur,
                concat: con
            }
        }
        // console.error(str, sample, i, s, isContained);
    }
    // console.error("score", score);
    // console.error("best", best);
    return best;
}

// getScore(subs[0], subs[1])

// const b = getBest(subs[0], subs);
// console.error(b)

brute(subs);