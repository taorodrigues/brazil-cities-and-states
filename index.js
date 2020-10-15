import fileHandler from './file-handler.js';
import sort from './sort.js';

const citiesPerStateDirectory = './cities-per-state/';
const originalDataDirectory = './original-data/';

const fileNameStates = originalDataDirectory + 'estados.json';
const fileNameCities = originalDataDirectory + 'cidades.json';

let statesJson = [];
let citiesJson = [];
let citiesFromStates = [];
let citiesPerState = [];
const citiesPerStates = [];

init();

/**
 * TOPICO 1 - Criar um arquivo JSON para cada estado representado no arquivo Estados.json.
 * O seu conteúdo será um array das cidades pertencentes a aquele estado,
 de acordo com o arquivo Cidades.json.
 * O nome do arquivo deve ser o UF do estado, por exemplo: MG.json.
 * */
async function init() {
  try {
    // read the states and cities from the original json file
    statesJson = await fileHandler.readJsonData(fileNameStates);
    citiesJson = await fileHandler.readJsonData(fileNameCities);

    statesJson.forEach((state) => {
      citiesPerState = citiesJson.filter((city) => city.Estado === state.ID);

      fileHandler.writeJsonData(
        citiesPerStateDirectory + state.Sigla + '.json',
        citiesPerState
      );
    });

    execute();
  } catch (error) {
    console.error(error);
  }
}

async function execute() {
  await countCities();
  await getTopFiveMoreOrLessCities(true);
  await getTopFiveMoreOrLessCities(false);
  await getBiggestCityNameFromState();
  await getBiggestAndSmallestCityName();
  await getSmallestCityName();
}

/**
 * Topico 2 - Criar uma função que recebe como parâmetro o UF do estado,
 * realiza a leitura do arquivo JSON correspondente e
 * retorna a quantidade de cidades daquele estado.
 */
async function countCities() {
  citiesPerState = [];
  for (const state of statesJson) {
    let numberOfCities = await countCitiesPerState(state.Sigla);
    let sigla = state.Sigla;

    const jsonObject = {
      Sigla: sigla,
      NumberOfCities: numberOfCities,
    };

    citiesPerStates.push(jsonObject);
  }
}

async function countCitiesPerState(siglaDoEstado) {
  const citiesPerState = await fileHandler.readJsonData(
    citiesPerStateDirectory + siglaDoEstado + '.json'
  );

  return citiesPerState.length;
}

async function getTopFiveMoreOrLessCities(showMore) {
  const result = [];
  let citiesSorted = await sort.sortNumbers(citiesPerStates);

  if (showMore) {
    /**
     * Topico 3 - Criar um método que imprima no console um array com o UF dos cinco
     * estados que mais possuem cidades, seguidos da quantidade, em ordem decrescente.
     */
    citiesSorted
      .slice(0, 5)
      .forEach((item) => result.push(`${item.Sigla} - ${item.NumberOfCities}`));

    console.log('3 - Estados com MAIOR numero de cidades');
    console.log(result);
  } else {
    /**
     * Topico 4 - Criar um método que imprima no console um array com o UF dos cinco estados que menos possuem cidades, seguidos da quantidade, em ordem decrescente.
     */
    citiesSorted
      .slice(-5) // pega os ultimos 5 elementos do array
      .forEach((item) => result.push(`${item.Sigla} - ${item.NumberOfCities}`));

    console.log('4 - Estados com MENOR numero de cidades');
    console.log(result);
  }
}

/**
 * Topico 5 - Criar um método que imprima no console um array com a cidade
 * de maior nome de cada estado, seguida de seu UF.
 * Topico 6 - Criar um método que imprima no console um array com a cidade de
 * menor nome de cada estado, seguida de seu UF.
 */
async function getBiggestCityNameFromState() {
  for (const state of statesJson) {
    let biggestCityName = await getCitiesNames(state.Sigla);

    citiesFromStates.push(biggestCityName);
  }

  console.log('5 - Cidade de MAIOR nome por estado');
  citiesFromStates.forEach((city) => {
    console.log(city.MaiorCidade + ' - ' + city.Estado);
  });

  console.log('6 - Cidade de MENOR nome por estado');
  citiesFromStates.forEach((city) => {
    console.log(city.MenorCidade + ' - ' + city.Estado);
  });
}

/**
 * Topico 7 - Criar um método que imprima no console a cidade de maior nome
 * entre todos os estados, seguido do seu UF.
 */
async function getBiggestAndSmallestCityName() {
  await getCitiesFromStates();
  await sort.sortObjectByLengthAndAlphabeticalOrder(citiesFromStates, true);

  console.log('7 - Cidade de MAIOR nome dentre todos os estados');
  let maiorCidade = citiesFromStates.reverse()[0];
  console.log(`${maiorCidade.MaiorCidade} - ${maiorCidade.Estado}`);
}

/**
 * Topico 8 - Criar um método que imprima no console a cidade de menor nome entre
 * todos os estados, seguido do seu UF.
 */
async function getSmallestCityName() {
  await getCitiesFromStates();
  await sort.sortObjectByLengthAndAlphabeticalOrder(citiesFromStates, false);

  console.log('8 - Cidade de MENOR nome dentre todos os estados');
  let menorCidade = citiesFromStates[0];
  console.log(`${menorCidade.MenorCidade} - ${menorCidade.Estado}`);
}

async function getCitiesNames(siglaDoEstado) {
  // le o arquivo com os dados das cidades do estado desejado
  const citiesNames = await fileHandler.readJsonData(
    citiesPerStateDirectory + siglaDoEstado + '.json'
  );

  // mapeia apenas o nome da cidade para um novo array
  const names = citiesNames.map((city) => {
    return city.Nome;
  });

  let menorCidade = names.slice();

  await sort.sortStringArray(names, true);
  await sort.sortStringArray(menorCidade, false);

  return {
    Estado: siglaDoEstado,
    MaiorCidade: menorCidade[menorCidade.length - 1],
    MenorCidade: names[0],
  };
}

async function getCitiesFromStates() {
  citiesFromStates = [];
  for (const state of statesJson) {
    let biggestCityName = await getCitiesNames(state.Sigla);

    citiesFromStates.push(biggestCityName);
  }
}
