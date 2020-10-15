/**
 * Sort an array by descending order.
 */
async function sortNumbers(array) {
  let newArray = array.slice();

  return newArray.sort((a, b) => {
    if (a.NumberOfCities < b.NumberOfCities) return 1;
    else if (a.NumberOfCities > b.NumberOfCities) return -1;
    else return 0;
  });
}

/**
 * Sort by length, if equal then sort by dictionary order.
 * @param {*} array
 */
async function sortObjectByLengthAndAlphabeticalOrder(
  array,
  maiorCidade = true
) {
  if (maiorCidade) {
    array.sort(function (a, b) {
      return (
        a.MaiorCidade.length - b.MaiorCidade.length ||
        a.MaiorCidade.localeCompare(b.MaiorCidade)
      );
    });
  } else {
    array.sort(function (a, b) {
      return (
        a.MenorCidade.length - b.MenorCidade.length ||
        a.MenorCidade.localeCompare(b.MenorCidade)
      );
    });
  }
}

async function sortStringArray(array, compareAB = true) {
  if (compareAB) {
    array.sort(function (a, b) {
      return a.length - b.length || a.localeCompare(b);
    });
  } else {
    array.sort(function (a, b) {
      return a.length - b.length || b.localeCompare(a);
    });
  }
}

export default {
  sortNumbers,
  sortObjectByLengthAndAlphabeticalOrder,
  sortStringArray,
};
