const levenshteinDistance = (str1 = '', str2 = '') => {
    const track = Array(str2.length + 1).fill(null).map(() =>
    Array(str1.length + 1).fill(null));
    for (let i = 0; i <= str1.length; i += 1) {
       track[0][i] = i;
    }
    for (let j = 0; j <= str2.length; j += 1) {
       track[j][0] = j;
    }
    for (let j = 1; j <= str2.length; j += 1) {
       for (let i = 1; i <= str1.length; i += 1) {
          const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
          track[j][i] = Math.min(
             track[j][i - 1] + 1, // deletion
             track[j - 1][i] + 1, // insertion
             track[j - 1][i - 1] + indicator, // substitution
          );
       }
    }
    return track[str2.length][str1.length];
 };

 let LD = function(str1, str2) {
    if (str1 == "" || str2 == "") {
        return 0;
    } else {
        str1 = str1.toString().trim();
        str2 = str2.toString().trim();
        let distance = levenshteinDistance(str1, str2);
        let l;
        if (str1.length>=str2.length) {
            l = str1.length;
        } else {
            l = str2.length;
        }
        let num = 0;
        num = (1 - distance / l) * 100;
        return num.toFixed(2)
    }
};