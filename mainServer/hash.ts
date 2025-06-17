function sqrtToBinaryNumbers(n: number): number[] {
    const sqrt = Math.sqrt(n);
    const binary: number[] = [];
    let frac = sqrt % 1;

    while (binary.length < CHUNKLENGTH) {
        frac *= 2;
        binary.push(Math.floor(frac));
        frac %= 1;
    }

    return binary;
}

function byteToString(n: number): number[] {
    let num = n % 256;

    let result: number[] = [];

    while (num > 0) {
        result.unshift(num % 2);
        num = Math.floor(num / 2);
    }

    const t = result.join("").padStart(8, "0").split("");
    result = [];
    t.forEach((value, _i) => {
        result.push(Number(value));
    });
    return result;
}

//shifts right
function shiftRight(
    numbers: number[],
    shiftAmount: number,
    loop: boolean = true,
): number[] {
    const result = numbers;
    const shift = shiftAmount % numbers.length;

    for (let i = 0; i < shift; i++) {
        if (loop) {
            const t = result.pop();
            result.unshift(t!);
        } else {
            result.pop();
            result.unshift(0);
        }
    }

    return result;
}

//shifts left
function shiftLeft(
    numbers: number[],
    shiftAmount: number,
    loop: boolean = true,
): number[] {
    const result = numbers;
    const shift = shiftAmount % numbers.length;

    for (let i = 0; i < shift; i++) {
        if (loop) {
            const t = result.shift();
            result.push(t!);
        } else {
            result.shift();
            result.push(0);
        }
    }

    return result;
}

function binaryToNumber(numbers: number[]): number {
    let res = 0;

    numbers.forEach((value, i) => {
        res += value * (2 ** i);
    });

    return res;
}

function xor(nums: number[]): number {
    let sum = 0;
    for (let index = 0; index < nums.length; index++) {
        sum += nums[index];
    }
    return sum % 2;
}

/*
    Le merging function
    if nums2 last number is:
        1 -> then shift nums1 right 19 without looping
        0 -> then shift nums1 left 13 with looping

    if the original nums1 ends in:
        1 -> then shift nums2 right 29 with looping
        0 -> then shift nums2 left 37 without looping

    then take the prime square that is made from converting the (([nums1[0], nums2[0], nums1[48] ,nums2[48] nums1[95], nums2[95]]) * 17)%16

    and with these three 96 long number streams do a bitwise xor

*/
function merge(nums1: number[], nums2: number[]): number[] {
    let tnums1 = nums1;
    let tnums2 = nums2;

    const prime = primeSquareRoots[
        (binaryToNumber([
            nums1[0],
            nums2[0],
            nums1[CHUNKLENGTH / 2],
            nums2[CHUNKLENGTH / 2],
            nums1[CHUNKLENGTH - 1],
            nums2[CHUNKLENGTH - 1],
        ]) * 59) % 64
    ];

    if (nums2[CHUNKLENGTH - 1] == 1) {
        tnums1 = shiftRight(nums1, 19, false);
    } else if (nums2[CHUNKLENGTH - 1] == 0) {
        tnums1 = shiftLeft(nums1, 43, true);
    } else {
        console.log(nums2[CHUNKLENGTH - 1]);
        throw "this can only be 0 or 1";
    }

    if (nums1[CHUNKLENGTH - 1] == 1) {
        tnums2 = shiftRight(nums2, 29, true);
    } else if (nums1[CHUNKLENGTH - 1] == 0) {
        tnums2 = shiftLeft(nums2, 11, false);
    } else {
        throw "this can only be 0 or 1";
    }

    const res: number[] = [];

    for (let i = 0; i < CHUNKLENGTH; i++) {
        res.push(xor([tnums1[i], tnums2[i], prime[i]]));
    }

    return res;
}

// compresses the number, for some amount of times
function compress(numbers: number[], amount: number): number[] {
    // initialise 2 clones of numbers that will be used to encode in the result in more ways -> bigger avalanche effect
    let numbersClone1 = numbers;
    let numbersClone2 = numbers;
    let result = numbers;

    for (let i = 0; i < amount; i++) {
        // takes 2 primes from the i and amount-i -> a bit more randomness sprinkled in
        let prime1 = primeSquareRoots[i % 64];
        let prime2 = primeSquareRoots[Math.abs((amount - i) % 64)];
        for (let j = 0; j < CHUNKLENGTH; j++) {
            //takes some values and xors them so some data is lost
            result[j] = xor([
                result[j],
                numbersClone1[CHUNKLENGTH - 1 - j],
                numbersClone2[CHUNKLENGTH - 1 - j],
                numbers[CHUNKLENGTH - 1 - j],
                prime1[CHUNKLENGTH - 1 - j],
                prime2[j],
            ]);

            // shift numbers around for a bit of chaos
            result = shiftRight(result, 17);
            numbersClone1 = shiftLeft(numbersClone1, 2);
            numbersClone2 = shiftRight(numbersClone2, 3);
            prime1 = shiftLeft(prime1, 5);
            prime2 = shiftRight(prime2, 7);
        }
        // shifts result 34 so all parts of the result are touched and out of sinc wiht the 96*17 right shifts
        result = shiftLeft(result, 34);
    }

    return result;
}

// yep i vibe coded this
function hasAllCriteria(pass: string): boolean {
    const lowercaseCount = (pass.match(/[a-z]/g) || []).length;
    const uppercaseCount = (pass.match(/[A-Z]/g) || []).length;
    const digitCount = (pass.match(/[0-9]/g) || []).length;
    const specialCount = (pass.match(/[^a-zA-Z0-9]/g) || []).length;

    return (
        lowercaseCount >= 2 &&
        uppercaseCount >= 2 &&
        digitCount >= 2 &&
        specialCount >= 2
    );
}

//old lookup table: bcdfgjpqrstvwxzDFGHLMNPQWXYZ1236789!@#%^&*()-_=+[]{}|;:',.<>?/\`~
//new lookup ascii lookup table from 33-126 (first: ! last: ~)  (lenghts should be 93)
// then we take out all vowels (lower and uppercase)                                        (new length should be 83)
// take out the most 6 most common consonants in the first shrek movies script (t,n,h,r,s,l) (new length should be 71)
// take out letters that look like S ( $)     (70)
// take out the remaining first 4 letters of the ABC (b,c,d)
const lookupTable: string[] =
    `!"#%&'()*+,-./0123456789:;<=>?@FGJKMPQVWXYZ[\]^_${"`"}fgjkmpqvwxyz{|}~`
        .split(
            "",
        );
// exactly 64 long so 1 charachter will be 6 bits

function lookUp(n: number): string {
    return lookupTable[n % lookupTable.length];
}

let HASHLENGTH = 4; // the output will be this HASHLENGTH * 4 characthers long, and it will chunk the input into HASHLENGTH * 3 initial chunks
let INPUTCHUNKLENGTH = HASHLENGTH * 3;
let OUTPUTLENGTH = HASHLENGTH * 4;
let CHUNKLENGTH = OUTPUTLENGTH * 6;

let primeSquareRoots = [
    sqrtToBinaryNumbers(2), // k0
    sqrtToBinaryNumbers(3), // k1
    sqrtToBinaryNumbers(5), // k2
    sqrtToBinaryNumbers(7), // k3
    sqrtToBinaryNumbers(11), // k4
    sqrtToBinaryNumbers(13), // k5
    sqrtToBinaryNumbers(17), // k6
    sqrtToBinaryNumbers(19), // k7
    sqrtToBinaryNumbers(23), // k8
    sqrtToBinaryNumbers(29), // k9
    sqrtToBinaryNumbers(31), // k10
    sqrtToBinaryNumbers(37), // k11
    sqrtToBinaryNumbers(41), // k12
    sqrtToBinaryNumbers(43), // k13
    sqrtToBinaryNumbers(47), // k14
    sqrtToBinaryNumbers(53), // k15
    sqrtToBinaryNumbers(59), // k16
    sqrtToBinaryNumbers(61), // k17
    sqrtToBinaryNumbers(67), // k18
    sqrtToBinaryNumbers(71), // k19
    sqrtToBinaryNumbers(73), // k20
    sqrtToBinaryNumbers(79), // k21
    sqrtToBinaryNumbers(83), // k22
    sqrtToBinaryNumbers(89), // k23
    sqrtToBinaryNumbers(97), // k24
    sqrtToBinaryNumbers(101), // k25
    sqrtToBinaryNumbers(103), // k26
    sqrtToBinaryNumbers(107), // k27
    sqrtToBinaryNumbers(109), // k28
    sqrtToBinaryNumbers(113), // k29
    sqrtToBinaryNumbers(127), // k30
    sqrtToBinaryNumbers(131), // k31
    sqrtToBinaryNumbers(137), // k32
    sqrtToBinaryNumbers(139), // k33
    sqrtToBinaryNumbers(149), // k34
    sqrtToBinaryNumbers(151), // k35
    sqrtToBinaryNumbers(157), // k36
    sqrtToBinaryNumbers(163), // k37
    sqrtToBinaryNumbers(167), // k38
    sqrtToBinaryNumbers(173), // k39
    sqrtToBinaryNumbers(179), // k40
    sqrtToBinaryNumbers(181), // k41
    sqrtToBinaryNumbers(191), // k42
    sqrtToBinaryNumbers(193), // k43
    sqrtToBinaryNumbers(197), // k44
    sqrtToBinaryNumbers(199), // k45
    sqrtToBinaryNumbers(211), // k46
    sqrtToBinaryNumbers(223), // k47
    sqrtToBinaryNumbers(227), // k48
    sqrtToBinaryNumbers(229), // k49
    sqrtToBinaryNumbers(233), // k50
    sqrtToBinaryNumbers(239), // k51
    sqrtToBinaryNumbers(241), // k52
    sqrtToBinaryNumbers(251), // k53
    sqrtToBinaryNumbers(257), // k54
    sqrtToBinaryNumbers(263), // k55
    sqrtToBinaryNumbers(269), // k56
    sqrtToBinaryNumbers(271), // k57
    sqrtToBinaryNumbers(277), // k58
    sqrtToBinaryNumbers(281), // k59
    sqrtToBinaryNumbers(283), // k60
    sqrtToBinaryNumbers(293), // k61
    sqrtToBinaryNumbers(307), // k62
    sqrtToBinaryNumbers(311), // k63
];

function generatePrimes() {
    primeSquareRoots = [
        sqrtToBinaryNumbers(2), // k0
        sqrtToBinaryNumbers(3), // k1
        sqrtToBinaryNumbers(5), // k2
        sqrtToBinaryNumbers(7), // k3
        sqrtToBinaryNumbers(11), // k4
        sqrtToBinaryNumbers(13), // k5
        sqrtToBinaryNumbers(17), // k6
        sqrtToBinaryNumbers(19), // k7
        sqrtToBinaryNumbers(23), // k8
        sqrtToBinaryNumbers(29), // k9
        sqrtToBinaryNumbers(31), // k10
        sqrtToBinaryNumbers(37), // k11
        sqrtToBinaryNumbers(41), // k12
        sqrtToBinaryNumbers(43), // k13
        sqrtToBinaryNumbers(47), // k14
        sqrtToBinaryNumbers(53), // k15
        sqrtToBinaryNumbers(59), // k16
        sqrtToBinaryNumbers(61), // k17
        sqrtToBinaryNumbers(67), // k18
        sqrtToBinaryNumbers(71), // k19
        sqrtToBinaryNumbers(73), // k20
        sqrtToBinaryNumbers(79), // k21
        sqrtToBinaryNumbers(83), // k22
        sqrtToBinaryNumbers(89), // k23
        sqrtToBinaryNumbers(97), // k24
        sqrtToBinaryNumbers(101), // k25
        sqrtToBinaryNumbers(103), // k26
        sqrtToBinaryNumbers(107), // k27
        sqrtToBinaryNumbers(109), // k28
        sqrtToBinaryNumbers(113), // k29
        sqrtToBinaryNumbers(127), // k30
        sqrtToBinaryNumbers(131), // k31
        sqrtToBinaryNumbers(137), // k32
        sqrtToBinaryNumbers(139), // k33
        sqrtToBinaryNumbers(149), // k34
        sqrtToBinaryNumbers(151), // k35
        sqrtToBinaryNumbers(157), // k36
        sqrtToBinaryNumbers(163), // k37
        sqrtToBinaryNumbers(167), // k38
        sqrtToBinaryNumbers(173), // k39
        sqrtToBinaryNumbers(179), // k40
        sqrtToBinaryNumbers(181), // k41
        sqrtToBinaryNumbers(191), // k42
        sqrtToBinaryNumbers(193), // k43
        sqrtToBinaryNumbers(197), // k44
        sqrtToBinaryNumbers(199), // k45
        sqrtToBinaryNumbers(211), // k46
        sqrtToBinaryNumbers(223), // k47
        sqrtToBinaryNumbers(227), // k48
        sqrtToBinaryNumbers(229), // k49
        sqrtToBinaryNumbers(233), // k50
        sqrtToBinaryNumbers(239), // k51
        sqrtToBinaryNumbers(241), // k52
        sqrtToBinaryNumbers(251), // k53
        sqrtToBinaryNumbers(257), // k54
        sqrtToBinaryNumbers(263), // k55
        sqrtToBinaryNumbers(269), // k56
        sqrtToBinaryNumbers(271), // k57
        sqrtToBinaryNumbers(277), // k58
        sqrtToBinaryNumbers(281), // k59
        sqrtToBinaryNumbers(283), // k60
        sqrtToBinaryNumbers(293), // k61
        sqrtToBinaryNumbers(307), // k62
        sqrtToBinaryNumbers(311), // k63
    ];
}

// makes a string be composed of 12 charachter chunks that are 8 bits long, so all in all it will be 96 bits long so when converted into the password it will be 16 charachters

//at the last chunk when it runs out of charachters it padds it with this function Math.floor(((t[t.length-1] * t[t.length-2])/17)*15)%256
// it takes the last 2 charachters that were added, multiplies them by 15/17 then floors it and makes it always be 8 bits
// if t[t.length-2] doesnt exist just replace it with 13
function toLetterCodes(input: string): number[][] {
    const serialized: number[][] = [];
    let i = 0;
    const chunkAmount = Math.ceil(input.length / INPUTCHUNKLENGTH);

    while (i < chunkAmount) {
        const t: number[] = [];
        for (let j = 0; j < INPUTCHUNKLENGTH; j++) {
            const char = input.charCodeAt(i * INPUTCHUNKLENGTH + j);
            if (char) {
                t.push(char);
            } else {
                t.push(
                    Math.floor(
                        ((t[t.length - 1] * (t[t.length - 2] | 13)) / 17) * 15,
                    ) % 256,
                );
            }
        }
        serialized.push(t);
        i += 1;
    }

    return serialized;
}

// convers from 12 8 bit numbers to 96 bits
function convertToChunks(input: number[][]): number[][] {
    let i = 0;
    const res: number[][] = [];

    while (i < input.length) {
        for (let j = 0; j < INPUTCHUNKLENGTH; j++) {
            const num = input[i][j];
            if (j == 0) {
                res.push(byteToString(num));
            } else {
                res[i] = res[i].concat(byteToString(num));
            }
        }

        i += 1;
    }
    return res;
}

export function hash(
    input: string,
    length: number = 4,
    matchCriteria: boolean = false,
): string {
    if (HASHLENGTH != length) {
        HASHLENGTH = length; // the output will be this HASHLENGTH * 4 characthers long, and it will chunk the input into HASHLENGTH * 3 initial chunks
        INPUTCHUNKLENGTH = HASHLENGTH * 3;
        OUTPUTLENGTH = HASHLENGTH * 4;
        CHUNKLENGTH = OUTPUTLENGTH * 6;

        generatePrimes();
    }

    if (input.length == 0) {
        throw "lenght of hash input needs to be at least length of 1";
    }

    let extended = input;

    // padds the input up to 512 length so the compression algorithm can work its magic
    while (extended.length < 512) {
        extended += input;
    }

    const chunks: number[][] = convertToChunks(toLetterCodes(extended));

    while (chunks.length >= 2) {
        chunks.push(merge(chunks.pop()!, chunks.pop()!));
    }

    const compressed = compress(chunks[0], 300);

    const res: string[] = [];

    for (let i = 0; i < OUTPUTLENGTH; i++) {
        res.push(
            lookUp(
                binaryToNumber([
                    compressed[i * 6],
                    compressed[i * 6 + 1],
                    compressed[i * 6 + 2],
                    compressed[i * 6 + 3],
                    compressed[i * 6 + 4],
                    compressed[i * 6 + 5],
                ]),
            ),
        );
    }

    if (!matchCriteria || hasAllCriteria(res.join(""))) {
        return res.join("");
    } else {
        if (matchCriteria && length < 4) {
            throw "you shouldnt match criteria and have a length less than 4";
        }
        return hash(res.join(""), length);
    }
}

