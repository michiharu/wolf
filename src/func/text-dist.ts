const textDist = (a: string, b: string) => {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  var matrix = new Array(a.length + 1);
  for (var i = 0; i <= a.length; i++)
    matrix[i] = new Array(b.length + 1);
  for (var i = 0; i <= a.length; i++)
    matrix[i][0] = i;
  for (var j = 0; j <= b.length; j++)
    matrix[0][j] = j;
  for (var i = 1; i <= a.length; i++) {
    for (var j = 1; j <= b.length; j++) {
      var x = a[i - 1] == b[j -1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j- 1] + x
      );
    }
  }
  return matrix[a.length][b.length];
}

const textDistPercent = (origin: string, a: string): number => {
  if (origin.length === 0 && a.length === 0) { return 100; }
  if (a.length === 0)                        { return 0; }
  const dist = textDist(origin, a);
  return (1 - dist / a.length) * 100;
}

export default textDistPercent;