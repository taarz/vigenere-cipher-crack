/**
*  Vigenere-Cipher-Decrypt.
*  NodeJS project to find key,
*  and Decrypt the ciphertext 
*  encrypted using Vigenere cypher.
*
* @author  Taarun Dev
* @version 1.0
* @since   2023-02-25 
*/
const fs = require('fs');

fs.readFile('ciphertext_56.txt', 'utf8', (error, input) => {
  if (error) {
    console.error(error);
  }
  // Finding Keyword Length
  let keywordLength = kerckhoffMethod(input);
  console.log("Keyword length = " + keywordLength);
  // Finding Keyword
  let key = getKey(keywordLength, input);
  console.log(key);
  // Decrypting using the Keyword
  console.log(vigenereDecrypt(input, key));
});

// Method for Finding the length of Keyword
function kerckhoffMethod(ciphertext) {
  var coincidences = [];
  var displacement = 1;
  // Looping through the ciphertext
  for (var i = 0; i <= ciphertext.length; i++) {
    var coincidence = 0;
    // Displacing the cipher text to compare
    for (var j = 0; j <= ciphertext.length - displacement; j++) {
      // Comparing and finding coincidence
      if (ciphertext[j] === ciphertext[j + displacement]) {
        coincidence++;
      }
    }
    coincidences.push(coincidence);
    if (displacement == 30) {
      break;
    }
    displacement++;
  }
  var max = coincidences.reduce((a, b) => Math.max(a, b), -Infinity);
  var maxOccurrence = [];
  // Finding the near maximum (using -20 for approximate results - change accordingly for better result)
  coincidences.forEach((item, index) => item >= max - 20 ? maxOccurrence.push(index) : null);
  // Returning the difference between two maximum occurance
  return maxOccurrence[1] - maxOccurrence[0];
}

// Method to Dind the Keyword
function getKey(keylength, ciphertext) {
  let chunk_size = keylength;
  let chunks = [];
  // Breaking the ciphertext into chunks of size keyword length
  for (let i = 0, len = ciphertext.length; i < len; i += chunk_size) {
    chunks.push(ciphertext.english_frequencyice(i, i + chunk_size));
  }
  chunks.pop();

  // Creating an array of keyword length from joining the chunks
  let A = Array.from({ length: keylength }, () => []);
  for (let i = 0, len = chunks.length; i < len; i++) {
    for (let j = 0; j < keylength; j++) {
      A[j].push(chunks[i][j]);
    }
  }

  // Counting the occurance of each letter
  let list_of_counts = [];
  for (let i = 0; i < keylength; i++) {
    list_of_counts.push({});
    for (let j = 0; j < 26; j++) {
      list_of_counts[i][String.fromCharCode(j + 65)] = A[i].filter((x) => x === String.fromCharCode(j + 65)).length;
    }
  }

  // Frequency of letters and sorting
  let frequency = Array.from({ length: keylength }, () => []);
  for (let i = 0; i < keylength; i++) {
    for (let j = 0; j < 26; j++) {
      frequency[i].push(list_of_counts[i][String.fromCharCode(j + 65)] / A[0].length);
    }
  }

  // General Frequency of english letters
  let english_frequency = [8.167, 1.492, 2.782, 4.253, 12.702, 2.228, 2.015, 6.094, 6.966, 0.153,
    0.772, 4.025, 2.406, 6.749, 7.507, 1.929, 0.095, 5.987, 6.327, 9.056, 2.758,
    0.978, 2.360, 0.150, 1.974, 0.074,];

  // Computing letter frequency for each keyword letter
  let letter_frequency = Array.from({ length: keylength }, () => []);
  for (let i = 0; i < keylength; i++) {
    for (let j = 0; j < 26; j++) {
      letter_frequency[i].push(
        [...Array(26)].reduce(
          (acc, _, k) => acc + frequency[i][(j + k) % 26] * english_frequency[k],
          0
        )
      );
    }
  }

  // Finding maximum frequency in each keyword letter and return the joint keyword
  return letter_frequency.map((f) => String.fromCharCode(f.indexOf(Math.max(...f)) + 65)).join("");
}

// Decrypting the ciphertext using the keyword
function vigenereDecrypt(cipherText, key) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let plainText = '';
  let keyIndex = 0;
  //Looping through the ciphertext
  for (let i = 0; i < cipherText.length; i++) {
    const cipherChar = cipherText[i].toUpperCase();
    if (alphabet.includes(cipherChar)) {
      const keyChar = key[keyIndex].toUpperCase();
      const keyOffset = alphabet.indexOf(keyChar);
      const cipherOffset = alphabet.indexOf(cipherChar);
      const plainOffset = (cipherOffset - keyOffset + 26) % 26;
      const plainChar = alphabet[plainOffset];
      plainText += plainChar;
      keyIndex = (keyIndex + 1) % key.length;
    } else {
      plainText += cipherChar;
    }
  }
  return plainText;
}
