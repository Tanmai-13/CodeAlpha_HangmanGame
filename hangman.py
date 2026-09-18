"""
Hangman Game - CodeAlpha Python Programming Internship (Task 1)
================================================================
A simple, clean and interactive Hangman game.

How the game works:
  1. A word is randomly selected from a predefined list of 5 words.
  2. The player guesses one letter at a time.
  3. Correct guesses reveal the matching letters in the word.
  4. The player is allowed a maximum of 6 incorrect guesses.
  5. If the player reveals the entire word before running out of
     guesses, they win. Otherwise, the game is over.
  6. The player can type "REVEAL" at any time to reveal the word
     and end the round early.

Python concepts used:
  - random module   -> to pick a random word
  - while loop      -> to keep the game running until win/lose
  - if-else         -> to check guesses and game state
  - strings         -> to display the word and process input
  - lists           -> to store guessed letters and wrong guesses

Author: CodeAlpha Intern
"""

import random


# ----------------------------------------------------------------------
# 1. Predefined list of 5 words
# ----------------------------------------------------------------------
WORD_LIST = ["PYTHON", "HANGMAN", "PROGRAM", "DEVELOPER", "CODING"]

# ----------------------------------------------------------------------
# 2. Maximum number of incorrect guesses
# ----------------------------------------------------------------------
MAX_WRONG_GUESSES = 6


def pick_random_word():
    """Return a random word (uppercase string) from WORD_LIST."""
    return random.choice(WORD_LIST)


def display_word(word, guessed_letters):
    """
    Build a display string showing the word with underscores for
    letters that have not yet been guessed.

    Example:
        word            = "PYTHON"
        guessed_letters = ['P', 'T']
        returns         = "P _ T _ _ _"
    """
    display = []
    for letter in word:
        if letter in guessed_letters:
            display.append(letter)
        else:
            display.append("_")
    return " ".join(display)


def is_word_complete(word, guessed_letters):
    """Return True if every letter in word has been guessed."""
    for letter in word:
        if letter not in guessed_letters:
            return False
    return True


def get_valid_guess(guessed_letters):
    """
    Ask the player for a single letter and validate the input.

    Validation rules:
      - Reject empty input.
      - Reject more than one character.
      - Reject non-alphabet characters.
      - Reject letters that were already guessed.

    Special command:
      - "REVEAL" (typed in full) will reveal the word and end the round.

    Returns either a single uppercase letter OR the string "REVEAL".
    """
    while True:
        guess = input("\nEnter a letter (or type REVEAL to reveal the word): ").strip()

        # --- Special: reveal command ---
        if guess.upper() == "REVEAL":
            return "REVEAL"

        # --- Validation 1: empty input ---
        if guess == "":
            print("  -> Input cannot be empty. Please try again.")
            continue

        # --- Validation 2: multiple characters ---
        if len(guess) != 1:
            print("  -> Please enter only ONE character. Try again.")
            continue

        # --- Validation 3: must be a letter ---
        if not guess.isalpha():
            print("  -> Only letters are allowed (A-Z). Try again.")
            continue

        guess = guess.upper()

        # --- Validation 4: already guessed ---
        if guess in guessed_letters:
            print(f"  -> You already guessed '{guess}'. Try a different letter.")
            continue

        return guess


def print_hangman_stage(wrong_count):
    """
    Print an ASCII-art representation of the hangman based on the
    number of incorrect guesses (0 through 6).
    """
    stages = [
        # 0 wrong
        """
           _____
          |     |
                |
                |
                |
                |
        =========
        """,
        # 1 wrong
        """
           _____
          |     |
          O     |
                |
                |
                |
        =========
        """,
        # 2 wrong
        """
           _____
          |     |
          O     |
          |     |
                |
                |
        =========
        """,
        # 3 wrong
        """
           _____
          |     |
          O     |
         /|     |
                |
                |
        =========
        """,
        # 4 wrong
        """
           _____
          |     |
          O     |
         /|\\   |
                |
                |
        =========
        """,
        # 5 wrong
        """
           _____
          |     |
          O     |
         /|\\   |
         /      |
                |
        =========
        """,
        # 6 wrong (game over)
        """
           _____
          |     |
          O     |
         /|\\   |
         / \\   |
                |
        =========
        """,
    ]
    print(stages[wrong_count])


def play_round():
    """
    Run a single full round of Hangman (one word).

    The round can end in three ways:
      1. The player guesses every letter  -> WIN
      2. The player makes 6 wrong guesses  -> LOSE (word revealed)
      3. The player types REVEAL            -> REVEALED (word shown)
    """
    # --- Setup -------------------------------------------------------
    word = pick_random_word()
    guessed_letters = []          # all correct + incorrect guesses
    wrong_guesses = []            # incorrect guesses only
    wrong_count = 0               # number of incorrect guesses
    revealed = False              # did the player use the reveal command?

    print("\n" + "=" * 50)
    print("          HANGMAN GAME")
    print("=" * 50)
    print(f"  Guess the word!  You have {MAX_WRONG_GUESSES} wrong attempts allowed.")
    print("  Type REVEAL at any time to give up and see the word.")

    # --- Main game loop (while loop) ---------------------------------
    # The loop continues while:
    #   - wrong guesses are below the maximum, AND
    #   - the word is not fully guessed
    while wrong_count < MAX_WRONG_GUESSES and not is_word_complete(word, guessed_letters):
        # Show current state
        print_hangman_stage(wrong_count)
        print(f"\n  Word:            {display_word(word, guessed_letters)}")
        print(f"  Wrong guesses:   {', '.join(wrong_guesses) if wrong_guesses else 'None'}")
        print(f"  Guessed letters: {', '.join(sorted(guessed_letters)) if guessed_letters else 'None'}")
        print(f"  Attempts left:   {MAX_WRONG_GUESSES - wrong_count}")

        # Get a validated guess (or the REVEAL command)
        guess = get_valid_guess(guessed_letters)

        # --- Handle the REVEAL command ------------------------------
        if guess == "REVEAL":
            revealed = True
            break

        # --- Normal letter guess ------------------------------------
        guessed_letters.append(guess)

        # --- Check guess with if-else -------------------------------
        if guess in word:
            print(f"  -> Good job! '{guess}' is in the word.")
        else:
            print(f"  -> Sorry, '{guess}' is not in the word.")
            wrong_guesses.append(guess)
            wrong_count += 1

    # --- End of round ------------------------------------------------
    print_hangman_stage(wrong_count)

    if revealed:
        # Player chose to reveal the word
        print(f"\n  The word was: {word}")
        print("  The word was revealed. Try a new game!")
    elif is_word_complete(word, guessed_letters):
        # Player won
        print(f"\n  *** YOU WIN! ***")
        print(f"  The word was: {word}")
        print(f"  Wrong guesses: {wrong_count} out of {MAX_WRONG_GUESSES}")
    else:
        # Player lost - reveal the word automatically
        print(f"\n  *** GAME OVER ***")
        print(f"  The word was: {word}")
        print(f"  You used all {MAX_WRONG_GUESSES} wrong guesses.")


def main():
    """
    Entry point. Runs rounds in a loop so the player can start a
    new game / restart without re-running the script.
    """
    print("=" * 50)
    print("   Welcome to Hangman - CodeAlpha Task 1")
    print("=" * 50)

    while True:
        play_round()

        # Ask whether the player wants to play again (New Game / Restart)
        choice = input("\nPlay again? (Y/N): ").strip().upper()
        if choice != "Y":
            print("\nThanks for playing! Goodbye.\n")
            break


# Run the game when this script is executed directly
if __name__ == "__main__":
    main()
