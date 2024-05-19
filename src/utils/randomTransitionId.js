const { CHARACTERS } = require('./constants');

const randomTransitionId = (lenthId = 6) => {
  let id = '';
  const charactersLength = CHARACTERS.length;

  for (let i = 0; i < lenthId; i++) {
    id += CHARACTERS.charAt(Math.floor(Math.random() * charactersLength));
  }

  return id;
};

return randomTransitionId;
