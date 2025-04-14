let slugForm;
let sourceErrorMessage;
let langErrorMessage;

let submitButton;

let outputTextfield;


init();


function init() {
  slugForm = document.getElementById('slugForm');
  sourceErrorMessage = document.getElementById('sourceErrorMessage');
  langErrorMessage = document.getElementById('langErrorMessage');
  submitButton = document.getElementById('submitButton');
  outputTextfield = document.getElementById('outputTextfield');

  submitButton.addEventListener('click', onSubmit);
}

function onSubmit(event) {
  event.preventDefault();

  outputTextfield.value = '';

  const sourceField = document.getElementById('source');
  const langGroupChecked = document.querySelector('input[name="lang"]:checked');
  const response = validate({
    sourceField,
    langGroup: langGroupChecked,
  });

  if (response.sourceField.isValid) {
    sourceErrorMessage.classList.remove('visible');
    sourceField.setCustomValidity('');
  } else {
    sourceField.setCustomValidity(response.sourceField.context);
    sourceErrorMessage.classList.add('visible');
  }

  const langGroup = document.querySelector('input[name="lang"]');
  if (response.langGroup.isValid) {
    langErrorMessage.classList.remove('visible');
    langGroup.setCustomValidity('');
  } else {
    langGroup.setCustomValidity(response.langGroup.context);
    langErrorMessage.classList.add('visible');
  }

  const slug = convertToSlug({
    source: sourceField.value,
    lang: langGroupChecked.value,
  });

  outputTextfield.value = slug;
}

function validate(options) {
  const { sourceField, langGroup } = options;

  let response = {};

  response.sourceField = {
    isValid: true,
    context: null,
  };
  if (sourceField.value === '') {
    response.sourceField.isValid = false;
    response.sourceField.context = 'empty string';
  }

  response.langGroup = {
    isValid: true,
    context: null,
  };
  if (!langGroup) {
    response.langGroup.isValid = false;
    response.langGroup.context = 'no selection';
  }

  return response;
}

function convertToSlug(options) {
  const { source, lang } = options;

  let slug = filterApostrophes(source);

  slug = slugify(slug, {
    locale: lang,
    lower: true,
    strict: true,
    remove: /[,;:!?.'''’’"\(\)\[\]\{\}\@\*\/\\&\#\%\©\®\+\<\=\>\|\$\º\™]/g,
  });

  slug = removeShortWords(slug);
  slug = removeStopWords({ slug, lang });

  return slug;
}

function filterApostrophes(slug) {
  let response = slug;

  const apostrophes = ["'", "'", "'", "’", "’"];
  apostrophes.forEach(apos => {
    response = response.replace(new RegExp(apos, 'g'), ' ');
  });

  return response;
}

function removeShortWords(slug) {
  let longWords = [];

  const allWords = slug.split('-');
  allWords.forEach((word) => {
    if (word.length > 2) {
      longWords.push(word);
    }
  });

  const response = longWords.join('-');

  return response;
}

function removeStopWords(options) {
  const { slug, lang } = options;

  let localeStopWords;
  if (lang === 'fr') {
    localeStopWords = [ 'a', 'alors', 'au', 'aucun', 'aussi', 'autre', 'avec', 'avoir', 'bon', 'c', 'ça', 'car', 'ce', 'cela', 'ces', 'ceux', 'chaque', 'ci', 'comme', 'd', 'dans', 'de', 'dedans', 'des', 'doit', 'donc', 'dos', 'du', 'elle', 'elles', 'en', 'encore', 'est', 'et', 'étaient', 'état', 'été', 'étions', 'être', 'eu', 'fait', 'faites', 'fois', 'font', 'hors', 'ici', 'il', 'ils', 'je', 'juste', 'l', 'la', 'là', 'le', 'les', 'leur', 'ma', 'm', 'maintenant', 'mais', 'même', 'mes', 'mien', 'moins', 'mon', 'ni', 'notre', 'nous', 'ou', 'où', 'par', 'parce', 'pas', 'peut', 'pour', 'quand', 'que', 'quel', 'quelle', 'quelles', 'quels', 'qui', 'qu', 's', 'sa', 'sans', 'ses', 'seulement', 'si', 'sien', 'son', 'sont', 'sous', 'soyez', 'sujet', 'sur', 't', 'ta', 'tandis', 'tellement', 'tels', 'tes', 'ton', 'tous', 'tout', 'très', 'trop', 'tu', 'voient', 'vont', 'votre', 'vous', 'vu' ];
  } else {
    localeStopWords = [ 'a', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at', 'be', 'been', 'both', 'but', 'by', 'did', 'do', 'does', 'down', 'each', 'few', 'for', 'from', 'had', 'has', 'have', 'he', 'her', 'here', 'hers', 'him', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'me', 'more', 'most', 'my', 'nor', 'of', 'on', 'once', 'only', 'or', 'our', 'ours', 'out', 'over', 'own', 'same', 'she', 'so', 'some', 'such', 'than', 'that', 'the', 'them', 'then', 'they', 'this', 'to', 'too', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'who', 'whom', 'why', 'with', 'you', 'your' ];
  }

  let withoutStopWords = [];

  const withStopWords = slug.split('-');
  withStopWords.forEach((word) => {
    // add words that arent stop words
    if (localeStopWords.indexOf(word) === -1) {
      withoutStopWords.push(word);
    }
  });

  const response = withoutStopWords.join('-');

  return response;
}