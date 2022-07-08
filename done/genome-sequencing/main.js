
function getAllCombinations(prts) {

    const parts = prts.reduce((s, e) => s.includes(e) ? s : [ ...s, e ],[])

    if (parts.length == 0) {
        return [];
    } else if (parts.length == 1) {
        return [
            generatePackage(parts[0], "", "", 0, parts[0], 1, [], [ parts[0] ])
        ]
    }
    
    const combs = [];
    while (combs.length == 0 || combs.filter(x => x.age == parts.length) < combs.length) {
        const _parts = [...parts];
        const cmb = combs.length == 0 ? _parts.flatMap(x => getScoreArray(x, _parts)) : combs.flatMap(x => getScoreArray(x, _parts.filter(y => !x.used.includes(y))));
        combs.push(...cmb);
    }
    return combs.filter(x => x.age == parts.length).sort((a, b) => a.concat.length - b.concat.length); //.sort((a, b) => b.age - a.age);
}
function getScoreArray(str, arr) {
    const o = [];
    const ar = arr.filter(x => x != str);
    for (const s of ar) {
        o.push(getScore(str, s));
    }
    return o;
}
function getScore(str, sample) {
    // Find part of sample in str(starting or ending position), or whole inside
    // Also return the common part of the sample and str
    let score = 0;
    let best = null;
    const srcIsObject = typeof str == "object";
    const string = srcIsObject ? str.concat : str;
    for (let i = -sample.length + 1; i < string.length; i++) {
        let s = "";
        let isContained = false;
        let con = "";
        if (i < 0) {
            s = sample.substring(0-i);
            isContained = string.startsWith(s);
            con = string.replace(new RegExp(s), sample)
        } else {
            s = sample.substring(0, string.length - i);
            const substr = string.substring(i, i + s.length);
            isContained = substr == s;
            con = string.substring(0, i) + sample + (string.length - 1 > i ? string.substring(i + sample.length) : "");
        }
        const cur = s.length;
        if (isContained && cur > score) {
            score = cur;
            best = generatePackage(string, sample, s, cur, con, srcIsObject ? (str.age + 1) : 2, srcIsObject ? [...str.last, str] : [], srcIsObject ? [...new Set([...str.used, sample])] : [ string, sample ])
        }
    }

    if (best == null) { // New
        best = generatePackage(string, sample, "", 0, string + sample, 2, [], [ string, sample ])
    }
    return best;
}
function generatePackage(str, sample, part, score, concat, age, last, used) {
    return {
        str,
        sample,
        part,
        score,
        concat,
        age,
        last,
        used
    }
}

const pts = [ "ACA", "ACA" ]
const c = getAllCombinations(pts);

console.log(c);