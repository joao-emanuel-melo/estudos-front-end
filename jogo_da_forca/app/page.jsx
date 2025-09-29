'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './Hangman.module.css';

// Lista de palavras + dicas
const WORDS = [
  // Times Brasileiros
  { word: "SANTA CRUZ", hint: "Clube nordestino conhecido como 'O mais querido'"},
  { word: "FLAMENGO", hint: "Seu departamento de remo foi fundado antes do futebol; tem a maior torcida do Brasil" },
  { word: "PALMEIRAS", hint: "Fundado por imigrantes italianos; foi campeão paulista no primeiro ano de existência" },
  { word: "SAO PAULO", hint: "Detém o recorde mundial de maior público em jogos noturnos no Morumbi" },
  { word: "SANTOS", hint: "Sua cidade natal é conhecida como 'Capital Nacional do Futebol' pelos talentos revelados" },
  { word: "CORINTHIANS", hint: "Nasceu da união de operários; primeiro time paulista a vencer o Rio-São Paulo" },
  { word: "CRUZEIRO", hint: "Primeiro clube mineiro a conquistar a tríplice coroa: estadual, brasileiro e copa do Brasil" },
  { word: "INTERNACIONAL", hint: "Tem como símbolo uma árvore genealógica que representa suas cores vermelha e branca" },
  { word: "GREMIO", hint: "Sua fundação ocorreu durante festividades da unificação da Itália em Porto Alegre" },
  { word: "ATLETICO MINEIRO", hint: "Primeiro clube brasileiro a ter um mascote vivo: um galo de verdade" },
  { word: "BOTAFOGO", hint: "Único clube carioca a ter um jogador bicampeão mundial de clubes por times diferentes" },
  { word: "VASCO DA GAMA", hint: "Primeiro clube a lutar contra a elitização do futebol incluindo jogadores negros" },
  { word: "FLUMINENSE", hint: "Criador do C.R.F. que inspirou a formação da primeira seleção brasileira" },
  { word: "BAHIA", hint: "Seu hino foi composto por dois dos maiores nomes da música popular brasileira" },
  { word: "SPORT", hint: "Primeiro clube nordestino a disputar uma final de Copa do Brasil" },

  // Times Estrangeiros
  { word: "REAL MADRID", hint: "Recebeu o título de 'Real' por decreto do rei Alfonso XIII em 1920" },
  { word: "BARCELONA", hint: "Durante a ditadura espanhola, tornou-se símbolo da resistência catalã" },
  { word: "MANCHESTER UNITED", hint: "Sobreviveu a tragédia aérea que matou o 'Busby Babes' e se reconstruiu" },
  { word: "BAYERN MUNICH", hint: "Foi rebaixado para a segunda divisão alemã nos anos 60 antes de dominar o país" },
  { word: "JUVENTUS", hint: "Família proprietária da FIAT conduziu o clube por quase um século" },
  { word: "LIVERPOOL", hint: "Seu treinador mais famoso criou a filosofia 'futebol de passe e movimento'" },
  { word: "AC MILAN", hint: "Fundado como 'Milan Cricket and Football Club' por empresários ingleses" },
  { word: "INTER MILAN", hint: "Nasceu da dissidência de membros que queriam aceitar mais estrangeiros no Milan" },
  { word: "ARSENAL", hint: "Mudou-se para o norte de Londres em circunstâncias controversas em 1913" },
  { word: "CHELSEA", hint: "Primeiro clube inglês a viajar de avião para jogos fora de Londres" },
  { word: "MANCHESTER CITY", hint: "Jogou a terceira divisão inglesa nos anos 90 antes da era de ouro" },
  { word: "PARIS SAINT GERMAIN", hint: "Surgiu da fusão entre Paris FC e Stade Saint-Germain nos anos 70" },
  { word: "BORUSSIA DORTMUND", hint: "Quase faliu nos anos 2000 antes de se tornar modelo de gestão financeira" },
  { word: "ATLETICO MADRID", hint: "Começou como filial do Athletic Bilbao antes de se tornar independente" },
  { word: "BOCA JUNIORS", hint: "Cores foram escolhidas após ver um navio sueco atracado no porto de Buenos Aires" }
];

// Letras do teclado virtual
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

const HangmanDrawing = ({ numberOfGuesses }) => {
  const HEAD = <div key="head" className={styles.head} />;
  const BODY = <div key="body" className={styles.body} />;
  const RIGHT_ARM = <div key="right-arm" className={styles.rightArm} />;
  const LEFT_ARM = <div key="left-arm" className={styles.leftArm} />;
  const RIGHT_LEG = <div key="right-leg" className={styles.rightLeg} />;
  const LEFT_LEG = <div key="left-leg" className={styles.leftLeg} />;

  const BODY_PARTS = [HEAD, BODY, RIGHT_ARM, LEFT_ARM, RIGHT_LEG, LEFT_LEG];

  return (
    <div className={styles.drawingContainer}>
      {BODY_PARTS.slice(0, numberOfGuesses)}
      <div className={styles.hanginPost} />
      <div className={styles.topBar} />
      <div className={styles.verticalBar} />
      <div className={styles.baseBar} />
    </div>
  );
};

export default function HangmanGame() {
  const [wordToGuess, setWordToGuess] = useState('');
  const [hint, setHint] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [showHint, setShowHint] = useState(false);

  const incorrectLetters = guessedLetters.filter(
    letter => !wordToGuess.includes(letter)
  );

  const isLoser = incorrectLetters.length >= 6;
  const isWinner =
    wordToGuess.split('').every(letter => guessedLetters.includes(letter)) &&
    wordToGuess !== '';

  const initializeGame = useCallback(() => {
    const { word, hint } = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWordToGuess(word);
    setHint(hint);
    setGuessedLetters([]);
    setShowHint(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleGuess = useCallback(
    (letter) => {
      if (guessedLetters.includes(letter) || isWinner || isLoser) return;
      setGuessedLetters(currentLetters => [...currentLetters, letter]);
    },
    [guessedLetters, isWinner, isLoser]
  );

  // Listener para teclado físico
  useEffect(() => {
    const handler = (e) => {
      const key = e.key.toUpperCase();
      if (ALPHABET.includes(key)) {
        e.preventDefault();
        handleGuess(key);
      }
    };

    document.addEventListener('keypress', handler);
    return () => document.removeEventListener('keypress', handler);
  }, [handleGuess]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Jogo da Forca Futebolistico⚽</h1>

      <div className={styles.gameStatus}>
        {isWinner && "Parabéns, você venceu! 🎉"}
        {isLoser && `Você perdeu! A palavra era: ${wordToGuess}`}
      </div>

      <HangmanDrawing numberOfGuesses={incorrectLetters.length} />

      <div className={styles.word}>
        {wordToGuess.split('').map((letter, index) => (
          <span key={index} className={styles.letter}>
            <span
              style={{
                visibility: guessedLetters.includes(letter) || isLoser ? 'visible' : 'hidden',
                color: !guessedLetters.includes(letter) && isLoser ? 'red' : 'black'
              }}
            >
              {letter}
            </span>
          </span>
        ))}
      </div>

      {/* Botão e caixa de Dica */}
      {!showHint && !isWinner && !isLoser && (
        <button onClick={() => setShowHint(true)} className={styles.hintButton}>
          Mostrar Dica
        </button>
      )}
      {showHint && <p className={styles.hint}>💡 {hint}</p>}

      <div className={styles.usedLettersContainer}>
        <strong>Letras erradas:</strong>
        <div className={styles.usedLetters}>
          {incorrectLetters.map((letter, index) => (
            <span key={index} className={styles.usedLetter}>{letter}</span>
          ))}
        </div>
      </div>

      <div className={styles.keyboard}>
        {ALPHABET.map(key => {
          const isUsed = guessedLetters.includes(key);
          const isCorrect = isUsed && wordToGuess.includes(key);
          const isIncorrect = isUsed && !wordToGuess.includes(key);

          return (
            <button
              onClick={() => handleGuess(key)}
              className={`${styles.key} 
                ${isCorrect ? styles.correct : ''}
                ${isIncorrect ? styles.incorrect : ''}
              `}
              disabled={isUsed || isWinner || isLoser}
              key={key}
            >
              {key}
            </button>
          );
        })}
      </div>

      {(isWinner || isLoser) && (
        <button onClick={initializeGame} className={styles.restartButton}>
          Jogar Novamente
        </button>
      )}
    </div>
  );
}
