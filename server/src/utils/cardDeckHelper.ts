const colors = ["R", "Y", "G", "B"];
const values = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "S", "R", "D2"]
// S = skip, R = reverse, D2 = draw two

const createCardDeck = () => {
  const cardDeck : string[] = [];

  colors.forEach((color) => {
    values.forEach((value) => {
      cardDeck.push(value + color)
      if(value !== "0") cardDeck.push(value + color)
    })
    
    cardDeck.push("WC");
    cardDeck.push("D4");
  })


  return cardDeck;
}

const shuffleCardDeck = (cardDeck: string[]) => {
  let currentIndex = cardDeck.length;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [cardDeck[currentIndex], cardDeck[randomIndex]] = [
      cardDeck[randomIndex],
      cardDeck[currentIndex],
    ];
  }

  return cardDeck;
}

export default { createCardDeck, shuffleCardDeck }