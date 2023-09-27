const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const suits = ['♥', '♦', '♣', '♠'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function createDeck() {
  const deck = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function calculateScore(hand) {
  let score = 0;
  let hasAce = false;

  for (const card of hand) {
    if (card.rank === 'A') {
      score += 11;
      hasAce = true;
    } else if (['K', 'Q', 'J'].includes(card.rank)) {
      score += 10;
    } else {
      score += parseInt(card.rank);
    }
  }

  if (hasAce && score > 21) {
    score -= 10;
  }

  return score;
}

function dealCard(deck, hand) {
  const card = deck.pop();
  hand.push(card);
}

function displayHand(hand) {
  return hand.map(card => `${card.rank} of ${card.suit}`).join(', ');
}

function blackjack() {
  const deck = createDeck();
  shuffleDeck(deck);

  const playerHand = [];
  const dealerHand = [];

  dealCard(deck, playerHand);
  dealCard(deck, dealerHand);
  dealCard(deck, playerHand);
  dealCard(deck, dealerHand);

  console.log(`Player's hand: ${displayHand(playerHand)}`);
  console.log(`Dealer's hand: ${dealerHand[0].rank} of ${dealerHand[0].suit} and [Hidden]`);

  if (calculateScore(playerHand) === 21) {
    console.log('Blackjack! You win!');
    rl.close();
    return;
  }

  function playerTurn() {
    rl.question('Do you want to "hit" or "stand"? ', (choice) => {
      if (choice.toLowerCase() === 'hit') {
        dealCard(deck, playerHand);
        console.log(`Player's hand: ${displayHand(playerHand)}`);
        if (calculateScore(playerHand) > 21) {
          console.log('Bust! Dealer wins.');
          rl.close();
        } else {
          playerTurn();
        }
      } else if (choice.toLowerCase() === 'stand') {
        dealerTurn();
      } else {
        console.log('Invalid choice. Please enter "hit" or "stand".');
        playerTurn();
      }
    });
  }

  function dealerTurn() {
    console.log(`Dealer's hand: ${displayHand(dealerHand)}`);
    while (calculateScore(dealerHand) < 17) {
      dealCard(deck, dealerHand);
      console.log(`Dealer hits: ${dealerHand[dealerHand.length - 1].rank} of ${dealerHand[dealerHand.length - 1].suit}`);
    }

    if (calculateScore(dealerHand) > 21) {
      console.log('Dealer busts! You win!');
    } else if (calculateScore(playerHand) > calculateScore(dealerHand)) {
      console.log('You win!');
    } else if (calculateScore(playerHand) < calculateScore(dealerHand)) {
      console.log('Dealer wins.');
    } else {
      console.log('It\'s a tie!');
    }

    rl.close();
  }

  playerTurn();
}

blackjack();