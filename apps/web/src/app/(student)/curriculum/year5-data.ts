// Victorian Curriculum Year 5 Mathematics
import type { YearLevelCurriculum } from './curriculum-data';

export const year5Maths: YearLevelCurriculum = {
  yearLevel: 5,
  subject: 'maths',
  strands: [
    {
      id: 'number-algebra',
      name: 'Number and Algebra',
      chapters: [
        {
          id: 'place-value',
          title: 'Place Value and Large Numbers',
          description: 'Understanding numbers up to hundreds of thousands',
          sections: [
            {
              id: 'VCMNA186',
              code: 'VCMNA186',
              title: 'Reading and Writing Large Numbers',
              description: 'Recognise, represent and order numbers to at least hundreds of thousands',
              content: `# Understanding Large Numbers

When we count beyond thousands, we enter the world of really big numbers! Let's explore how our place value system works with these large numbers.

## What is Place Value?

Every digit in a number has a special position that tells us its value. Think of it like assigned seats in a cinema - each seat has a specific spot!

| Hundred Thousands | Ten Thousands | Thousands | Hundreds | Tens | Ones |
|-------------------|---------------|-----------|----------|------|------|
| 100,000          | 10,000        | 1,000     | 100      | 10   | 1    |

## Reading Large Numbers

Let's read the number **347,582**:
- **3** hundred thousands = 300,000
- **4** ten thousands = 40,000
- **7** thousands = 7,000
- **5** hundreds = 500
- **8** tens = 80
- **2** ones = 2

We say: "Three hundred and forty-seven thousand, five hundred and eighty-two"

## The Comma Rule

We use commas to separate groups of three digits from the right. This makes big numbers easier to read!

## Ordering Large Numbers

When comparing large numbers, start from the left and compare digit by digit.`,
              keyPoints: [
                'Each position in a number represents a different value (ones, tens, hundreds, thousands, etc.)',
                'We use commas to separate groups of three digits for easier reading',
                'When comparing numbers, start from the leftmost digit',
                'The more digits a number has, the larger it generally is'
              ],
              examples: [
                {
                  problem: 'Write 456,789 in words',
                  solution: 'Four hundred and fifty-six thousand, seven hundred and eighty-nine',
                  explanation: 'Break it into parts: 456 thousand + 789'
                },
                {
                  problem: 'Order from smallest to largest: 89,234 | 98,234 | 89,432',
                  solution: '89,234 < 89,432 < 98,234',
                  explanation: 'Compare the ten-thousands digit first, then thousands, etc.'
                }
              ],
              questions: [
                {
                  id: 'VCMNA186-001',
                  question: 'What is the value of the 7 in 372,458?',
                  options: ['7', '70', '700', '70,000'],
                  correctAnswer: 3,
                  explanation: 'The 7 is in the ten thousands place, so its value is 70,000.',
                  difficulty: 1
                },
                {
                  id: 'VCMNA186-002',
                  question: 'Which number is largest?',
                  options: ['199,999', '200,001', '189,999', '201,000'],
                  correctAnswer: 3,
                  explanation: '201,000 has the highest value in the hundred thousands and thousands places.',
                  difficulty: 2
                },
                {
                  id: 'VCMNA186-003',
                  question: 'How do you write "five hundred and thirty-two thousand, one hundred and seven" as a number?',
                  options: ['53,217', '532,107', '532,170', '523,107'],
                  correctAnswer: 1,
                  explanation: '532 thousand = 532,000, plus 107 = 532,107',
                  difficulty: 2
                },
                {
                  id: 'VCMNA186-004',
                  question: 'What number is 10,000 more than 456,789?',
                  options: ['456,799', '457,789', '466,789', '556,789'],
                  correctAnswer: 2,
                  explanation: 'Adding 10,000 changes the ten thousands digit: 456,789 + 10,000 = 466,789',
                  difficulty: 2
                },
                {
                  id: 'VCMNA186-005',
                  question: 'Round 847,562 to the nearest ten thousand',
                  options: ['847,000', '848,000', '850,000', '840,000'],
                  correctAnswer: 2,
                  explanation: 'Look at the thousands digit (7). Since 7 ≥ 5, round up to 850,000.',
                  difficulty: 3
                },
                {
                  id: 'VCMNA186-006',
                  question: 'What is the place value of 5 in 258,146?',
                  options: ['5,000', '50,000', '500', '500,000'],
                  correctAnswer: 1,
                  explanation: 'The 5 is in the ten thousands place, so its value is 50,000.',
                  difficulty: 1
                },
                {
                  id: 'VCMNA186-007',
                  question: 'Order from smallest to largest: 345,678 | 354,678 | 345,768',
                  options: ['345,678, 345,768, 354,678', '345,768, 345,678, 354,678', '354,678, 345,768, 345,678', '345,678, 354,678, 345,768'],
                  correctAnswer: 0,
                  explanation: 'Compare left to right: 345,678 < 345,768 < 354,678',
                  difficulty: 2
                },
                {
                  id: 'VCMNA186-008',
                  question: 'What number is 100,000 less than 567,234?',
                  options: ['467,234', '566,234', '557,234', '477,234'],
                  correctAnswer: 0,
                  explanation: 'Subtracting 100,000 changes the hundred thousands digit: 567,234 - 100,000 = 467,234',
                  difficulty: 2
                },
                {
                  id: 'VCMNA186-009',
                  question: 'How do you write 408,052 in words?',
                  options: ['Four hundred and eight thousand and fifty-two', 'Forty-eight thousand and fifty-two', 'Four hundred eight thousand fifty-two', 'Four million eight thousand and fifty-two'],
                  correctAnswer: 0,
                  explanation: '408 thousand = four hundred and eight thousand, 052 = and fifty-two',
                  difficulty: 2
                },
                {
                  id: 'VCMNA186-010',
                  question: 'Which digit is in the hundred thousands place in 923,456?',
                  options: ['9', '2', '3', '4'],
                  correctAnswer: 0,
                  explanation: 'Reading from left to right: 9 is in the hundred thousands place.',
                  difficulty: 1
                },
                {
                  id: 'VCMNA186-011',
                  question: 'What is 50,000 + 6,000 + 400 + 30 + 7?',
                  options: ['56,437', '506,437', '5,643,007', '564,307'],
                  correctAnswer: 0,
                  explanation: 'Add each place value: 50,000 + 6,000 + 400 + 30 + 7 = 56,437',
                  difficulty: 1
                },
                {
                  id: 'VCMNA186-012',
                  question: 'Round 463,518 to the nearest hundred thousand',
                  options: ['400,000', '500,000', '460,000', '470,000'],
                  correctAnswer: 1,
                  explanation: 'Look at the ten thousands digit (6). Since 6 ≥ 5, round up to 500,000.',
                  difficulty: 2
                },
                {
                  id: 'VCMNA186-013',
                  question: 'Which number is between 234,567 and 243,567?',
                  options: ['233,567', '244,567', '240,000', '230,000'],
                  correctAnswer: 2,
                  explanation: '240,000 is greater than 234,567 and less than 243,567.',
                  difficulty: 2
                },
                {
                  id: 'VCMNA186-014',
                  question: 'What is the difference between 500,000 and 499,999?',
                  options: ['1', '10', '100', '1,000'],
                  correctAnswer: 0,
                  explanation: '500,000 - 499,999 = 1. These are consecutive numbers.',
                  difficulty: 1
                },
                {
                  id: 'VCMNA186-015',
                  question: 'How many hundreds are in 45,600?',
                  options: ['456', '45', '6', '4,560'],
                  correctAnswer: 0,
                  explanation: '45,600 ÷ 100 = 456 hundreds',
                  difficulty: 3
                },
                {
                  id: 'VCMNA186-016',
                  question: 'Which number has 8 in the thousands place?',
                  options: ['180,234', '108,234', '801,234', '218,034'],
                  correctAnswer: 3,
                  explanation: 'In 218,034, the 8 is in the thousands place (8,000).',
                  difficulty: 2
                },
                {
                  id: 'VCMNA186-017',
                  question: 'What is 789,012 rounded to the nearest thousand?',
                  options: ['789,000', '790,000', '788,000', '800,000'],
                  correctAnswer: 0,
                  explanation: 'Look at the hundreds digit (0). Since 0 < 5, round down to 789,000.',
                  difficulty: 2
                },
                {
                  id: 'VCMNA186-018',
                  question: 'Which is the smallest 6-digit number?',
                  options: ['999,999', '100,000', '100,001', '99,999'],
                  correctAnswer: 1,
                  explanation: '100,000 is the smallest 6-digit number. 99,999 has only 5 digits.',
                  difficulty: 2
                },
                {
                  id: 'VCMNA186-019',
                  question: 'What is 300,000 + 40,000 + 5,000 + 600 + 70 + 8?',
                  options: ['345,678', '354,678', '3,456,780', '34,567,800'],
                  correctAnswer: 0,
                  explanation: 'Add each place value to get 345,678.',
                  difficulty: 2
                },
                {
                  id: 'VCMNA186-020',
                  question: 'The population of a town is 284,953. What is this rounded to the nearest ten thousand?',
                  options: ['280,000', '285,000', '290,000', '300,000'],
                  correctAnswer: 0,
                  explanation: 'Look at the thousands digit (4). Since 4 < 5, round down to 280,000.',
                  difficulty: 3
                }
              ]
            },
            {
              id: 'VCMNA181',
              code: 'VCMNA181',
              title: 'Factors and Multiples',
              description: 'Identify and describe factors and multiples of whole numbers and use them to solve problems',
              content: `# Factors and Multiples

Understanding factors and multiples helps us see how numbers are connected to each other!

## What are Factors?

**Factors** are numbers that divide evenly into another number with no remainder.

**Example:** What are the factors of 12?
- 1 × 12 = 12 ✓
- 2 × 6 = 12 ✓
- 3 × 4 = 12 ✓

So the factors of 12 are: **1, 2, 3, 4, 6, 12**

### Finding Factors - The Pair Method

Start with 1 and work your way up, finding pairs. Stop when your pairs start repeating!

## What are Multiples?

**Multiples** are what you get when you multiply a number by 1, 2, 3, 4, and so on.

**Example:** Multiples of 5: **5, 10, 15, 20, 25, 30...**

## The Connection

If 3 is a **factor** of 12, then 12 is a **multiple** of 3. They're like two sides of the same coin!`,
              keyPoints: [
                'Factors divide evenly into a number with no remainder',
                'Multiples are the "times tables" of a number',
                'If A is a factor of B, then B is a multiple of A',
                'Every number has at least two factors: 1 and itself',
                'Common factors/multiples are shared between numbers'
              ],
              examples: [
                {
                  problem: 'Find all factors of 24',
                  solution: '1, 2, 3, 4, 6, 8, 12, 24',
                  explanation: 'Pairs: 1×24, 2×12, 3×8, 4×6'
                },
                {
                  problem: 'List the first 5 multiples of 7',
                  solution: '7, 14, 21, 28, 35',
                  explanation: '7×1=7, 7×2=14, 7×3=21, 7×4=28, 7×5=35'
                }
              ],
              questions: [
                {
                  id: 'VCMNA181-001',
                  question: 'Which of these is NOT a factor of 20?',
                  options: ['2', '4', '6', '10'],
                  correctAnswer: 2,
                  explanation: '20 ÷ 6 = 3 remainder 2. Since there is a remainder, 6 is not a factor.',
                  difficulty: 1
                },
                {
                  id: 'VCMNA181-002',
                  question: 'What is the 6th multiple of 8?',
                  options: ['40', '48', '56', '64'],
                  correctAnswer: 1,
                  explanation: '8 × 6 = 48. The multiples are 8, 16, 24, 32, 40, 48.',
                  difficulty: 1
                },
                {
                  id: 'VCMNA181-003',
                  question: 'How many factors does 36 have?',
                  options: ['6', '8', '9', '12'],
                  correctAnswer: 2,
                  explanation: 'Factors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36 = 9 factors',
                  difficulty: 2
                },
                {
                  id: 'VCMNA181-004',
                  question: 'What is the greatest common factor of 24 and 36?',
                  options: ['6', '8', '12', '18'],
                  correctAnswer: 2,
                  explanation: 'Factors of 24: 1,2,3,4,6,8,12,24. Factors of 36: 1,2,3,4,6,9,12,18,36. The largest shared factor is 12.',
                  difficulty: 3
                },
                {
                  id: 'VCMNA181-005',
                  question: 'What is the smallest number that is a multiple of both 4 and 6?',
                  options: ['12', '18', '24', '36'],
                  correctAnswer: 0,
                  explanation: 'Multiples of 4: 4,8,12,16... Multiples of 6: 6,12,18... The first common one is 12.',
                  difficulty: 2
                },
                {
                  id: 'VCMNA181-006',
                  question: 'List all the factors of 18.',
                  options: ['1, 2, 3, 6, 9, 18', '1, 2, 3, 6, 18', '2, 3, 6, 9', '1, 2, 9, 18'],
                  correctAnswer: 0,
                  explanation: 'Factor pairs: 1×18, 2×9, 3×6. So factors are 1, 2, 3, 6, 9, 18.',
                  difficulty: 1
                },
                {
                  id: 'VCMNA181-007',
                  question: 'What is the 9th multiple of 7?',
                  options: ['56', '63', '70', '77'],
                  correctAnswer: 1,
                  explanation: '7 × 9 = 63',
                  difficulty: 1
                },
                {
                  id: 'VCMNA181-008',
                  question: 'Is 45 a multiple of 9?',
                  options: ['Yes, because 9 × 5 = 45', 'No, because 45 ÷ 9 has a remainder', 'Yes, because 45 ends in 5', 'No, because 45 is odd'],
                  correctAnswer: 0,
                  explanation: '45 ÷ 9 = 5 exactly, so 45 is a multiple of 9.',
                  difficulty: 1
                },
                {
                  id: 'VCMNA181-009',
                  question: 'Which number is a common factor of 15 and 25?',
                  options: ['3', '5', '15', '25'],
                  correctAnswer: 1,
                  explanation: 'Factors of 15: 1, 3, 5, 15. Factors of 25: 1, 5, 25. Common factors: 1 and 5.',
                  difficulty: 2
                },
                {
                  id: 'VCMNA181-010',
                  question: 'What is the smallest common multiple of 3 and 5?',
                  options: ['8', '10', '15', '30'],
                  correctAnswer: 2,
                  explanation: 'Multiples of 3: 3, 6, 9, 12, 15... Multiples of 5: 5, 10, 15... First common: 15.',
                  difficulty: 2
                },
                {
                  id: 'VCMNA181-011',
                  question: 'A number has exactly 2 factors. What type of number is it?',
                  options: ['Even number', 'Odd number', 'Prime number', 'Composite number'],
                  correctAnswer: 2,
                  explanation: 'A prime number has exactly 2 factors: 1 and itself.',
                  difficulty: 2
                },
                {
                  id: 'VCMNA181-012',
                  question: 'Which of these numbers is NOT a multiple of 6?',
                  options: ['24', '36', '44', '54'],
                  correctAnswer: 2,
                  explanation: '44 ÷ 6 = 7 remainder 2. So 44 is not a multiple of 6.',
                  difficulty: 1
                },
                {
                  id: 'VCMNA181-013',
                  question: 'What is the greatest common factor of 16 and 24?',
                  options: ['4', '6', '8', '12'],
                  correctAnswer: 2,
                  explanation: 'Factors of 16: 1,2,4,8,16. Factors of 24: 1,2,3,4,6,8,12,24. GCF = 8.',
                  difficulty: 2
                },
                {
                  id: 'VCMNA181-014',
                  question: 'How many factors does 1 have?',
                  options: ['0', '1', '2', '3'],
                  correctAnswer: 1,
                  explanation: '1 has only one factor: itself (1).',
                  difficulty: 2
                },
                {
                  id: 'VCMNA181-015',
                  question: 'What is the lowest common multiple of 8 and 12?',
                  options: ['16', '24', '48', '96'],
                  correctAnswer: 1,
                  explanation: 'Multiples of 8: 8, 16, 24... Multiples of 12: 12, 24... LCM = 24.',
                  difficulty: 3
                },
                {
                  id: 'VCMNA181-016',
                  question: 'Which of these is a factor of every number?',
                  options: ['0', '1', '2', '10'],
                  correctAnswer: 1,
                  explanation: '1 is a factor of every number because every number ÷ 1 = itself.',
                  difficulty: 1
                },
                {
                  id: 'VCMNA181-017',
                  question: 'If 7 is a factor of a number, what must also be factors?',
                  options: ['2 and 14', '1 and 7', '3 and 7', '7 and 14'],
                  correctAnswer: 1,
                  explanation: 'Every number has 1 and itself as factors. If 7 is a factor, then 1 and the number itself are also factors.',
                  difficulty: 2
                },
                {
                  id: 'VCMNA181-018',
                  question: 'What is the product of all factors of 6?',
                  options: ['12', '18', '36', '72'],
                  correctAnswer: 2,
                  explanation: 'Factors of 6: 1, 2, 3, 6. Product: 1 × 2 × 3 × 6 = 36.',
                  difficulty: 3
                },
                {
                  id: 'VCMNA181-019',
                  question: 'Which pair of numbers has a GCF of 1?',
                  options: ['6 and 9', '8 and 12', '7 and 11', '10 and 15'],
                  correctAnswer: 2,
                  explanation: '7 and 11 are both prime numbers with no common factors except 1.',
                  difficulty: 3
                },
                {
                  id: 'VCMNA181-020',
                  question: 'Eggs come in boxes of 6. Bread rolls come in packs of 8. What is the smallest number where you have equal eggs and rolls?',
                  options: ['14', '24', '48', '96'],
                  correctAnswer: 1,
                  explanation: 'LCM of 6 and 8: Multiples of 6: 6,12,18,24... Multiples of 8: 8,16,24... LCM = 24.',
                  difficulty: 3
                }
              ]
            },
            {
              id: 'VCMNA182',
              code: 'VCMNA182',
              title: 'Addition and Subtraction Strategies',
              description: 'Use efficient mental and written strategies for addition and subtraction involving larger numbers',
              content: `# Addition and Subtraction Strategies

When working with larger numbers, using smart strategies makes calculations faster and more accurate.

## Mental Strategies

**1. Compensation Strategy**
Add or subtract a friendly number, then adjust.
- 456 + 99 = 456 + 100 - 1 = 555
- 823 - 98 = 823 - 100 + 2 = 725

**2. Splitting Strategy**
Break numbers into place value parts.
- 345 + 234 = (300 + 200) + (40 + 30) + (5 + 4) = 579

**3. Jump Strategy**
Use a number line mentally, jumping by easy amounts.
- 567 + 240: Start at 567, jump +200 = 767, jump +40 = 807

## Written Strategies

**Vertical Addition**
Line up place values and add column by column, regrouping when needed.

**Vertical Subtraction**
Line up place values and subtract, borrowing when needed.

## Estimation

Round numbers first to check your answer is reasonable.
- 4,872 + 3,156 ≈ 5,000 + 3,000 = 8,000`,
              keyPoints: [
                'Use compensation by adding/subtracting friendly numbers then adjusting',
                'Split numbers by place value to make addition easier',
                'Always estimate first to check your answer is reasonable',
                'Line up place values carefully for written methods'
              ],
              examples: [
                {
                  problem: 'Calculate 678 + 199 using compensation',
                  solution: '678 + 200 - 1 = 877',
                  explanation: 'Add 200 (friendly number) then subtract 1 to compensate'
                },
                {
                  problem: 'Calculate 5,432 - 2,987 using vertical subtraction',
                  solution: '2,445',
                  explanation: 'Align place values, borrow where needed, subtract each column'
                }
              ],
              questions: [
                {
                  id: 'VCMNA182-001',
                  question: 'Calculate 456 + 299 using the compensation strategy.',
                  options: ['745', '755', '754', '756'],
                  correctAnswer: 1,
                  explanation: '456 + 300 = 756, then subtract 1 = 755',
                  difficulty: 1
                },
                {
                  id: 'VCMNA182-002',
                  question: 'What is 1,234 + 5,678?',
                  options: ['6,812', '6,912', '6,902', '7,012'],
                  correctAnswer: 1,
                  explanation: 'Add column by column: 4+8=12, 3+7+1=11, 2+6+1=9, 1+5=6. Answer: 6,912',
                  difficulty: 1
                },
                {
                  id: 'VCMNA182-003',
                  question: 'Calculate 8,000 - 3,456.',
                  options: ['4,544', '4,454', '5,544', '4,644'],
                  correctAnswer: 0,
                  explanation: 'Borrow from thousands: 8,000 - 3,456 = 4,544',
                  difficulty: 2
                },
                {
                  id: 'VCMNA182-004',
                  question: 'Which mental strategy is best for 567 + 198?',
                  options: ['Count by ones', 'Add 200, subtract 2', 'Use a calculator', 'Guess'],
                  correctAnswer: 1,
                  explanation: 'Compensation: 567 + 200 = 767, then 767 - 2 = 765',
                  difficulty: 1
                },
                {
                  id: 'VCMNA182-005',
                  question: 'Estimate 4,872 + 3,156 by rounding to the nearest thousand.',
                  options: ['7,000', '8,000', '9,000', '6,000'],
                  correctAnswer: 1,
                  explanation: '5,000 + 3,000 = 8,000',
                  difficulty: 1
                },
                {
                  id: 'VCMNA182-006',
                  question: 'What is 12,345 - 6,789?',
                  options: ['5,556', '5,456', '5,656', '5,566'],
                  correctAnswer: 0,
                  explanation: 'Subtract with borrowing: 12,345 - 6,789 = 5,556',
                  difficulty: 2
                },
                {
                  id: 'VCMNA182-007',
                  question: 'Calculate 2,500 + 3,700 + 1,800.',
                  options: ['7,000', '8,000', '7,900', '8,100'],
                  correctAnswer: 1,
                  explanation: '2,500 + 3,700 = 6,200, then 6,200 + 1,800 = 8,000',
                  difficulty: 2
                },
                {
                  id: 'VCMNA182-008',
                  question: 'What is 10,000 - 4,567?',
                  options: ['5,433', '5,533', '5,343', '6,433'],
                  correctAnswer: 0,
                  explanation: 'Borrow from ten thousands: 10,000 - 4,567 = 5,433',
                  difficulty: 2
                },
                {
                  id: 'VCMNA182-009',
                  question: 'Using splitting: 345 + 234 = ?',
                  options: ['569', '579', '589', '559'],
                  correctAnswer: 1,
                  explanation: '(300+200) + (40+30) + (5+4) = 500 + 70 + 9 = 579',
                  difficulty: 1
                },
                {
                  id: 'VCMNA182-010',
                  question: 'A school has 2,458 students. 1,239 are girls. How many boys?',
                  options: ['1,219', '1,229', '1,119', '1,319'],
                  correctAnswer: 0,
                  explanation: '2,458 - 1,239 = 1,219 boys',
                  difficulty: 2
                },
                {
                  id: 'VCMNA182-011',
                  question: 'What is 7,654 + 2,346?',
                  options: ['9,000', '10,000', '9,900', '10,100'],
                  correctAnswer: 1,
                  explanation: '7,654 + 2,346 = 10,000 (the digits in each place add to make round numbers)',
                  difficulty: 2
                },
                {
                  id: 'VCMNA182-012',
                  question: 'Calculate 15,000 - 8,765.',
                  options: ['6,235', '6,335', '7,235', '6,245'],
                  correctAnswer: 0,
                  explanation: '15,000 - 8,765 = 6,235',
                  difficulty: 2
                },
                {
                  id: 'VCMNA182-013',
                  question: 'Round 6,789 + 4,321 to estimate the answer.',
                  options: ['10,000', '11,000', '12,000', '9,000'],
                  correctAnswer: 1,
                  explanation: '7,000 + 4,000 = 11,000 (actual: 11,110)',
                  difficulty: 1
                },
                {
                  id: 'VCMNA182-014',
                  question: 'What is 50,000 - 23,456?',
                  options: ['26,544', '27,544', '26,454', '27,454'],
                  correctAnswer: 0,
                  explanation: '50,000 - 23,456 = 26,544',
                  difficulty: 3
                },
                {
                  id: 'VCMNA182-015',
                  question: 'A farmer had 8,500 sheep. He sold 2,375 and bought 1,250. How many now?',
                  options: ['7,375', '7,275', '7,475', '7,175'],
                  correctAnswer: 0,
                  explanation: '8,500 - 2,375 = 6,125, then 6,125 + 1,250 = 7,375',
                  difficulty: 3
                },
                {
                  id: 'VCMNA182-016',
                  question: 'Calculate 999 + 999 + 999.',
                  options: ['2,997', '2,897', '3,000', '2,999'],
                  correctAnswer: 0,
                  explanation: '999 × 3 = 2,997, or 1000 + 1000 + 1000 - 3 = 2,997',
                  difficulty: 2
                },
                {
                  id: 'VCMNA182-017',
                  question: 'What is missing? 4,567 + ___ = 10,000',
                  options: ['5,433', '5,333', '5,443', '5,533'],
                  correctAnswer: 0,
                  explanation: '10,000 - 4,567 = 5,433',
                  difficulty: 2
                },
                {
                  id: 'VCMNA182-018',
                  question: 'The difference between two numbers is 3,456. One number is 7,890. What could the other number be?',
                  options: ['4,434 or 11,346', '4,334 or 11,346', '4,434 or 11,246', '4,534 or 11,346'],
                  correctAnswer: 0,
                  explanation: '7,890 - 3,456 = 4,434 or 7,890 + 3,456 = 11,346',
                  difficulty: 3
                },
                {
                  id: 'VCMNA182-019',
                  question: 'Calculate 23,456 + 34,567 - 12,345.',
                  options: ['45,678', '45,578', '45,688', '45,778'],
                  correctAnswer: 0,
                  explanation: '23,456 + 34,567 = 58,023, then 58,023 - 12,345 = 45,678',
                  difficulty: 3
                },
                {
                  id: 'VCMNA182-020',
                  question: 'A charity raised $45,670 in Week 1 and $38,945 in Week 2. How much in total?',
                  options: ['$84,615', '$84,515', '$83,615', '$84,605'],
                  correctAnswer: 0,
                  explanation: '$45,670 + $38,945 = $84,615',
                  difficulty: 2
                }
              ]
            }
          ]
        },
        {
          id: 'multiplication-division',
          title: 'Multiplication and Division',
          description: 'Strategies for multiplying and dividing larger numbers',
          sections: [
            {
              id: 'VCMNA183',
              code: 'VCMNA183',
              title: 'Multiplying Large Numbers',
              description: 'Solve problems involving multiplication of large numbers using efficient strategies',
              content: `# Multiplying Large Numbers

When numbers get bigger, we need smart strategies to multiply them!

## The Expanded Method (Partitioning)

Break the number into parts:

**347 × 6 = ?**
- 300 × 6 = 1,800
- 40 × 6 = 240
- 7 × 6 = 42
- Total: 1,800 + 240 + 42 = **2,082**

## Mental Strategies

### Doubling and Halving
- 25 × 16 = 50 × 8 = 100 × 4 = **400**

### Using Known Facts
- 99 × 7 = (100 × 7) - 7 = 700 - 7 = **693**

### Breaking Apart
- 15 × 12 = 15 × 10 + 15 × 2 = 150 + 30 = **180**`,
              keyPoints: [
                'The standard algorithm works from right to left, carrying when needed',
                'Partitioning breaks numbers into easier parts (hundreds, tens, ones)',
                'When multiplying by two digits, multiply by each digit then add',
                'Mental strategies like doubling/halving can make calculations easier'
              ],
              examples: [
                {
                  problem: '256 × 4',
                  solution: '1,024',
                  explanation: '200×4=800, 50×4=200, 6×4=24. Total: 800+200+24=1,024'
                },
                {
                  problem: '34 × 25',
                  solution: '850',
                  explanation: '34 × 25 = 34 × 100 ÷ 4 = 3400 ÷ 4 = 850'
                }
              ],
              questions: [
                {
                  id: 'VCMNA183-001',
                  question: 'What is 145 × 6?',
                  options: ['770', '830', '870', '890'],
                  correctAnswer: 2,
                  explanation: '100×6=600, 40×6=240, 5×6=30. Total: 600+240+30=870',
                  difficulty: 1
                },
                {
                  id: 'VCMNA183-002',
                  question: 'Calculate 38 × 12',
                  options: ['446', '456', '466', '476'],
                  correctAnswer: 1,
                  explanation: '38×10=380, 38×2=76. Total: 380+76=456',
                  difficulty: 2
                },
                {
                  id: 'VCMNA183-003',
                  question: 'What is 25 × 32 using the doubling and halving strategy?',
                  options: ['750', '800', '850', '900'],
                  correctAnswer: 1,
                  explanation: '25×32 = 50×16 = 100×8 = 800',
                  difficulty: 2
                },
                {
                  id: 'VCMNA183-004',
                  question: 'A school has 28 classes with 24 students in each. How many students in total?',
                  options: ['572', '612', '672', '724'],
                  correctAnswer: 2,
                  explanation: '28×24 = 28×20 + 28×4 = 560 + 112 = 672',
                  difficulty: 2
                },
                {
                  id: 'VCMNA183-005',
                  question: 'What is 99 × 15?',
                  options: ['1,485', '1,495', '1,500', '1,515'],
                  correctAnswer: 0,
                  explanation: '99×15 = (100×15) - 15 = 1500 - 15 = 1,485',
                  difficulty: 3
                },
                {
                  id: 'VCMNA183-006',
                  question: 'What is 234 × 5?',
                  options: ['1,070', '1,170', '1,270', '1,370'],
                  correctAnswer: 1,
                  explanation: '234 × 5 = 234 × 10 ÷ 2 = 2340 ÷ 2 = 1,170',
                  difficulty: 1
                },
                {
                  id: 'VCMNA183-007',
                  question: 'Calculate 56 × 11',
                  options: ['606', '616', '626', '636'],
                  correctAnswer: 1,
                  explanation: '56 × 11 = 56 × 10 + 56 = 560 + 56 = 616',
                  difficulty: 1
                },
                {
                  id: 'VCMNA183-008',
                  question: 'What is 125 × 8?',
                  options: ['900', '1,000', '1,100', '1,200'],
                  correctAnswer: 1,
                  explanation: '125 × 8 = 1,000 (125 × 8 is a useful fact to remember!)',
                  difficulty: 2
                },
                {
                  id: 'VCMNA183-009',
                  question: 'A farmer plants 45 rows of trees with 23 trees in each row. How many trees in total?',
                  options: ['935', '1,015', '1,035', '1,135'],
                  correctAnswer: 2,
                  explanation: '45 × 23 = 45 × 20 + 45 × 3 = 900 + 135 = 1,035',
                  difficulty: 2
                },
                {
                  id: 'VCMNA183-010',
                  question: 'What is 50 × 48?',
                  options: ['2,200', '2,300', '2,400', '2,500'],
                  correctAnswer: 2,
                  explanation: '50 × 48 = 100 × 24 = 2,400',
                  difficulty: 2
                },
                {
                  id: 'VCMNA183-011',
                  question: 'Calculate 67 × 9',
                  options: ['593', '603', '613', '623'],
                  correctAnswer: 1,
                  explanation: '67 × 9 = 67 × 10 - 67 = 670 - 67 = 603',
                  difficulty: 2
                },
                {
                  id: 'VCMNA183-012',
                  question: 'What is 15 × 16?',
                  options: ['220', '230', '240', '250'],
                  correctAnswer: 2,
                  explanation: '15 × 16 = 15 × 4 × 4 = 60 × 4 = 240',
                  difficulty: 2
                },
                {
                  id: 'VCMNA183-013',
                  question: 'A box contains 144 pencils. How many pencils in 7 boxes?',
                  options: ['988', '1,008', '1,028', '1,048'],
                  correctAnswer: 1,
                  explanation: '144 × 7 = 140 × 7 + 4 × 7 = 980 + 28 = 1,008',
                  difficulty: 2
                },
                {
                  id: 'VCMNA183-014',
                  question: 'What is 199 × 6?',
                  options: ['1,184', '1,194', '1,204', '1,214'],
                  correctAnswer: 1,
                  explanation: '199 × 6 = 200 × 6 - 6 = 1,200 - 6 = 1,194',
                  difficulty: 2
                },
                {
                  id: 'VCMNA183-015',
                  question: 'Calculate 35 × 14',
                  options: ['470', '480', '490', '500'],
                  correctAnswer: 2,
                  explanation: '35 × 14 = 35 × 10 + 35 × 4 = 350 + 140 = 490',
                  difficulty: 2
                },
                {
                  id: 'VCMNA183-016',
                  question: 'What is 250 × 12?',
                  options: ['2,800', '2,900', '3,000', '3,100'],
                  correctAnswer: 2,
                  explanation: '250 × 12 = 250 × 4 × 3 = 1,000 × 3 = 3,000',
                  difficulty: 2
                },
                {
                  id: 'VCMNA183-017',
                  question: 'A cinema has 32 rows with 25 seats each. What is the total capacity?',
                  options: ['750', '800', '850', '900'],
                  correctAnswer: 1,
                  explanation: '32 × 25 = 32 × 100 ÷ 4 = 3,200 ÷ 4 = 800',
                  difficulty: 3
                },
                {
                  id: 'VCMNA183-018',
                  question: 'What is 48 × 25?',
                  options: ['1,100', '1,200', '1,300', '1,400'],
                  correctAnswer: 1,
                  explanation: '48 × 25 = 48 × 100 ÷ 4 = 4,800 ÷ 4 = 1,200',
                  difficulty: 3
                },
                {
                  id: 'VCMNA183-019',
                  question: 'Calculate 76 × 15',
                  options: ['1,120', '1,140', '1,160', '1,180'],
                  correctAnswer: 1,
                  explanation: '76 × 15 = 76 × 10 + 76 × 5 = 760 + 380 = 1,140',
                  difficulty: 3
                },
                {
                  id: 'VCMNA183-020',
                  question: 'A book has 286 pages. If a library has 15 copies, how many pages in total?',
                  options: ['4,190', '4,290', '4,390', '4,490'],
                  correctAnswer: 1,
                  explanation: '286 × 15 = 286 × 10 + 286 × 5 = 2,860 + 1,430 = 4,290',
                  difficulty: 3
                }
              ]
            },
            {
              id: 'VCMNA184',
              code: 'VCMNA184',
              title: 'Division with Remainders',
              description: 'Solve problems involving division by a one digit number, including those that result in a remainder',
              content: `# Division with Remainders

Sometimes when we divide, things don't split evenly. That's where remainders come in!

## What is a Remainder?

When you share 17 lollies among 5 friends:
- Each friend gets 3 lollies (5 × 3 = 15)
- There are 2 lollies left over
- We write: **17 ÷ 5 = 3 remainder 2** or **17 ÷ 5 = 3 r 2**

## What Do Remainders Mean in Real Life?

**1. Ignore the remainder:** "How many full cartons?" → Just use the quotient

**2. Round up:** "How many buses needed?" → Add 1 if there's a remainder

**3. The remainder IS the answer:** "How many left over?" → Use the remainder`,
              keyPoints: [
                'A remainder is what\'s left over after dividing evenly',
                'Always check: divisor × quotient + remainder = dividend',
                'The remainder must always be less than the divisor',
                'Context determines how to interpret the remainder'
              ],
              examples: [
                {
                  problem: '87 ÷ 4',
                  solution: '21 r 3',
                  explanation: '4 × 21 = 84, and 87 - 84 = 3 remainder'
                },
                {
                  problem: '125 ÷ 6',
                  solution: '20 r 5',
                  explanation: '6 × 20 = 120, and 125 - 120 = 5 remainder'
                }
              ],
              questions: [
                {
                  id: 'VCMNA184-001',
                  question: 'What is 47 ÷ 5?',
                  options: ['8 r 7', '9 r 2', '9 r 3', '10 r 3'],
                  correctAnswer: 1,
                  explanation: '5 × 9 = 45, and 47 - 45 = 2. So 47 ÷ 5 = 9 r 2',
                  difficulty: 1
                },
                {
                  id: 'VCMNA184-002',
                  question: '83 students need to be divided into groups of 6. How many complete groups can be made?',
                  options: ['12', '13', '14', '15'],
                  correctAnswer: 1,
                  explanation: '83 ÷ 6 = 13 r 5. There are 13 complete groups.',
                  difficulty: 2
                },
                {
                  id: 'VCMNA184-003',
                  question: 'What is 156 ÷ 7?',
                  options: ['21 r 3', '22 r 2', '22 r 3', '23 r 1'],
                  correctAnswer: 1,
                  explanation: '7 × 22 = 154, and 156 - 154 = 2. So 156 ÷ 7 = 22 r 2',
                  difficulty: 2
                },
                {
                  id: 'VCMNA184-004',
                  question: 'A baker has 200 cupcakes to put in boxes of 8. How many boxes does she need?',
                  options: ['24', '25', '26', '27'],
                  correctAnswer: 1,
                  explanation: '200 ÷ 8 = 25 exactly. She needs 25 boxes.',
                  difficulty: 2
                },
                {
                  id: 'VCMNA184-005',
                  question: 'If 173 ÷ 8 = 21 r ?, what is the remainder?',
                  options: ['3', '4', '5', '6'],
                  correctAnswer: 2,
                  explanation: '8 × 21 = 168, and 173 - 168 = 5',
                  difficulty: 3
                },
                {
                  id: 'VCMNA184-006',
                  question: 'What is 35 ÷ 4?',
                  options: ['7 r 3', '8 r 2', '8 r 3', '9 r 1'],
                  correctAnswer: 2,
                  explanation: '4 × 8 = 32, and 35 - 32 = 3. So 35 ÷ 4 = 8 r 3',
                  difficulty: 1
                },
                {
                  id: 'VCMNA184-007',
                  question: 'What is 52 ÷ 6?',
                  options: ['8 r 2', '8 r 4', '9 r 2', '9 r 4'],
                  correctAnswer: 1,
                  explanation: '6 × 8 = 48, and 52 - 48 = 4. So 52 ÷ 6 = 8 r 4',
                  difficulty: 1
                },
                {
                  id: 'VCMNA184-008',
                  question: '67 children need to travel by minibus. Each minibus holds 9 children. How many minibuses are needed?',
                  options: ['7', '8', '9', '10'],
                  correctAnswer: 1,
                  explanation: '67 ÷ 9 = 7 r 4. But we need to round UP for all children, so 8 minibuses.',
                  difficulty: 2
                },
                {
                  id: 'VCMNA184-009',
                  question: 'What is 100 ÷ 7?',
                  options: ['14 r 1', '14 r 2', '15 r 1', '15 r 5'],
                  correctAnswer: 1,
                  explanation: '7 × 14 = 98, and 100 - 98 = 2. So 100 ÷ 7 = 14 r 2',
                  difficulty: 2
                },
                {
                  id: 'VCMNA184-010',
                  question: 'A rope is 95 metres long. It is cut into 8-metre pieces. How many metres are left over?',
                  options: ['5', '6', '7', '8'],
                  correctAnswer: 2,
                  explanation: '95 ÷ 8 = 11 r 7. There are 7 metres left over.',
                  difficulty: 2
                },
                {
                  id: 'VCMNA184-011',
                  question: 'What is 145 ÷ 6?',
                  options: ['23 r 7', '24 r 1', '24 r 2', '25 r 1'],
                  correctAnswer: 1,
                  explanation: '6 × 24 = 144, and 145 - 144 = 1. So 145 ÷ 6 = 24 r 1',
                  difficulty: 2
                },
                {
                  id: 'VCMNA184-012',
                  question: 'If you divide a number by 5 and get a remainder of 7, what is wrong?',
                  options: ['Nothing is wrong', 'The remainder must be less than 5', 'The quotient is too small', 'You forgot to carry'],
                  correctAnswer: 1,
                  explanation: 'The remainder must always be less than the divisor. If dividing by 5, the remainder can only be 0, 1, 2, 3, or 4.',
                  difficulty: 2
                },
                {
                  id: 'VCMNA184-013',
                  question: 'What is 234 ÷ 9?',
                  options: ['25 r 9', '26 r 0', '26 r 1', '27 r 1'],
                  correctAnswer: 1,
                  explanation: '9 × 26 = 234 exactly. So 234 ÷ 9 = 26 with no remainder.',
                  difficulty: 2
                },
                {
                  id: 'VCMNA184-014',
                  question: 'A farmer has 175 eggs to pack in cartons of 12. How many full cartons can be made?',
                  options: ['14', '15', '16', '17'],
                  correctAnswer: 0,
                  explanation: '175 ÷ 12 = 14 r 7. Only 14 full cartons can be made.',
                  difficulty: 2
                },
                {
                  id: 'VCMNA184-015',
                  question: 'What is 500 ÷ 7?',
                  options: ['70 r 10', '71 r 2', '71 r 3', '72 r 1'],
                  correctAnswer: 2,
                  explanation: '7 × 71 = 497, and 500 - 497 = 3. So 500 ÷ 7 = 71 r 3',
                  difficulty: 3
                },
                {
                  id: 'VCMNA184-016',
                  question: 'Which division gives the largest remainder?',
                  options: ['50 ÷ 6', '50 ÷ 7', '50 ÷ 8', '50 ÷ 9'],
                  correctAnswer: 2,
                  explanation: '50÷6=8r2, 50÷7=7r1, 50÷8=6r2, 50÷9=5r5. The largest remainder is 5.',
                  difficulty: 3
                },
                {
                  id: 'VCMNA184-017',
                  question: 'If 247 ÷ ? = 35 r 2, what is the divisor?',
                  options: ['6', '7', '8', '9'],
                  correctAnswer: 1,
                  explanation: '? × 35 + 2 = 247, so ? × 35 = 245, and ? = 245 ÷ 35 = 7',
                  difficulty: 3
                },
                {
                  id: 'VCMNA184-018',
                  question: 'What is 1,000 ÷ 9?',
                  options: ['110 r 10', '111 r 1', '111 r 2', '112 r 0'],
                  correctAnswer: 1,
                  explanation: '9 × 111 = 999, and 1000 - 999 = 1. So 1000 ÷ 9 = 111 r 1',
                  difficulty: 3
                },
                {
                  id: 'VCMNA184-019',
                  question: 'A class of 29 students needs to form teams of 4. How many students will not be in a complete team?',
                  options: ['0', '1', '2', '3'],
                  correctAnswer: 1,
                  explanation: '29 ÷ 4 = 7 r 1. One student will be left over.',
                  difficulty: 2
                },
                {
                  id: 'VCMNA184-020',
                  question: 'What is 365 ÷ 7? (Think: days in a year divided by days in a week)',
                  options: ['51 r 8', '52 r 0', '52 r 1', '53 r 1'],
                  correctAnswer: 2,
                  explanation: '7 × 52 = 364, and 365 - 364 = 1. So 365 ÷ 7 = 52 r 1 (52 complete weeks plus 1 day)',
                  difficulty: 3
                }
              ]
            },
            {
              id: 'VCMNA185',
              code: 'VCMNA185',
              title: 'Order of Operations',
              description: 'Use brackets and order of operations to write number sentences',
              content: `# Order of Operations

When a calculation has more than one operation, we need rules to know which to do first.

## The Rules (BODMAS/BIMDAS)

**B** - Brackets first
**O/I** - Orders/Indices (powers, roots)
**DM** - Division and Multiplication (left to right)
**AS** - Addition and Subtraction (left to right)

## Examples

**Example 1:** 3 + 4 × 2
- Multiply first: 4 × 2 = 8
- Then add: 3 + 8 = 11

**Example 2:** (3 + 4) × 2
- Brackets first: 3 + 4 = 7
- Then multiply: 7 × 2 = 14

**Example 3:** 20 ÷ 4 + 3 × 2
- Division: 20 ÷ 4 = 5
- Multiplication: 3 × 2 = 6
- Addition: 5 + 6 = 11

## Why Brackets Matter

Brackets change the order! They tell us "do this first".
- 5 + 3 × 2 = 5 + 6 = 11
- (5 + 3) × 2 = 8 × 2 = 16`,
              keyPoints: [
                'BODMAS/BIMDAS gives us the order: Brackets, Orders, Division/Multiplication, Addition/Subtraction',
                'Multiplication and division are done left to right',
                'Addition and subtraction are done left to right',
                'Brackets always come first - they override all other rules'
              ],
              examples: [
                {
                  problem: 'Calculate: 12 + 8 ÷ 2',
                  solution: '12 + 4 = 16',
                  explanation: 'Division first (8 ÷ 2 = 4), then addition'
                },
                {
                  problem: 'Calculate: (12 + 8) ÷ 2',
                  solution: '20 ÷ 2 = 10',
                  explanation: 'Brackets first (12 + 8 = 20), then division'
                }
              ],
              questions: [
                {
                  id: 'VCMNA185-001',
                  question: 'Calculate: 5 + 3 × 2',
                  options: ['16', '11', '10', '13'],
                  correctAnswer: 1,
                  explanation: 'Multiplication first: 3 × 2 = 6, then 5 + 6 = 11',
                  difficulty: 1
                },
                {
                  id: 'VCMNA185-002',
                  question: 'Calculate: (5 + 3) × 2',
                  options: ['11', '13', '16', '10'],
                  correctAnswer: 2,
                  explanation: 'Brackets first: 5 + 3 = 8, then 8 × 2 = 16',
                  difficulty: 1
                },
                {
                  id: 'VCMNA185-003',
                  question: 'Calculate: 20 - 4 × 3',
                  options: ['48', '8', '12', '17'],
                  correctAnswer: 1,
                  explanation: 'Multiplication first: 4 × 3 = 12, then 20 - 12 = 8',
                  difficulty: 1
                },
                {
                  id: 'VCMNA185-004',
                  question: 'Calculate: 18 ÷ 3 + 2',
                  options: ['3', '8', '6', '12'],
                  correctAnswer: 1,
                  explanation: 'Division first: 18 ÷ 3 = 6, then 6 + 2 = 8',
                  difficulty: 1
                },
                {
                  id: 'VCMNA185-005',
                  question: 'Calculate: 18 ÷ (3 + 3)',
                  options: ['9', '3', '6', '12'],
                  correctAnswer: 1,
                  explanation: 'Brackets first: 3 + 3 = 6, then 18 ÷ 6 = 3',
                  difficulty: 1
                },
                {
                  id: 'VCMNA185-006',
                  question: 'Calculate: 4 + 6 × 5 - 2',
                  options: ['32', '48', '28', '38'],
                  correctAnswer: 0,
                  explanation: 'Multiplication first: 6 × 5 = 30, then 4 + 30 - 2 = 32',
                  difficulty: 2
                },
                {
                  id: 'VCMNA185-007',
                  question: 'What is 100 - 50 ÷ 5?',
                  options: ['10', '90', '80', '60'],
                  correctAnswer: 1,
                  explanation: 'Division first: 50 ÷ 5 = 10, then 100 - 10 = 90',
                  difficulty: 2
                },
                {
                  id: 'VCMNA185-008',
                  question: 'Calculate: (10 + 5) × (8 - 4)',
                  options: ['60', '50', '40', '54'],
                  correctAnswer: 0,
                  explanation: 'Both brackets first: 15 × 4 = 60',
                  difficulty: 2
                },
                {
                  id: 'VCMNA185-009',
                  question: 'Which calculation equals 20?',
                  options: ['2 + 3 × 5', '(2 + 3) × 5 - 5', '2 × 3 + 5', '(2 + 3) × 3'],
                  correctAnswer: 1,
                  explanation: '(2 + 3) × 5 - 5 = 5 × 5 - 5 = 25 - 5 = 20',
                  difficulty: 2
                },
                {
                  id: 'VCMNA185-010',
                  question: 'Calculate: 24 ÷ 4 + 24 ÷ 6',
                  options: ['10', '8', '12', '6'],
                  correctAnswer: 0,
                  explanation: 'Both divisions first: 6 + 4 = 10',
                  difficulty: 2
                },
                {
                  id: 'VCMNA185-011',
                  question: 'What is 3 × 4 + 2 × 5?',
                  options: ['22', '70', '32', '50'],
                  correctAnswer: 0,
                  explanation: 'Both multiplications first: 12 + 10 = 22',
                  difficulty: 2
                },
                {
                  id: 'VCMNA185-012',
                  question: 'Calculate: 36 ÷ (2 × 3)',
                  options: ['6', '18', '54', '12'],
                  correctAnswer: 0,
                  explanation: 'Brackets first: 2 × 3 = 6, then 36 ÷ 6 = 6',
                  difficulty: 2
                },
                {
                  id: 'VCMNA185-013',
                  question: 'What is (15 - 5) ÷ 2 + 3?',
                  options: ['8', '6.5', '5', '10'],
                  correctAnswer: 0,
                  explanation: 'Brackets: 10, Division: 10 ÷ 2 = 5, Addition: 5 + 3 = 8',
                  difficulty: 2
                },
                {
                  id: 'VCMNA185-014',
                  question: 'Add brackets to make this true: 8 + 4 × 2 = 24',
                  options: ['(8 + 4) × 2', '8 + (4 × 2)', '8 × 4 + 2', 'Cannot be done'],
                  correctAnswer: 0,
                  explanation: '(8 + 4) × 2 = 12 × 2 = 24',
                  difficulty: 2
                },
                {
                  id: 'VCMNA185-015',
                  question: 'Calculate: 50 - 3 × (4 + 6)',
                  options: ['20', '470', '30', '200'],
                  correctAnswer: 0,
                  explanation: 'Brackets: 10, Multiplication: 3 × 10 = 30, Subtraction: 50 - 30 = 20',
                  difficulty: 3
                },
                {
                  id: 'VCMNA185-016',
                  question: 'What is 100 ÷ 4 ÷ 5?',
                  options: ['125', '5', '80', '20'],
                  correctAnswer: 1,
                  explanation: 'Left to right: 100 ÷ 4 = 25, then 25 ÷ 5 = 5',
                  difficulty: 2
                },
                {
                  id: 'VCMNA185-017',
                  question: 'Calculate: (8 + 2) × (8 - 2)',
                  options: ['60', '64', '56', '48'],
                  correctAnswer: 0,
                  explanation: 'Brackets: 10 × 6 = 60',
                  difficulty: 2
                },
                {
                  id: 'VCMNA185-018',
                  question: 'Which equals 1? A: 10 - 3 × 3  B: (10 - 3) × 3  C: 10 ÷ (5 + 5)',
                  options: ['A only', 'B only', 'C only', 'A and C'],
                  correctAnswer: 3,
                  explanation: 'A: 10 - 9 = 1. B: 7 × 3 = 21. C: 10 ÷ 10 = 1. So A and C.',
                  difficulty: 3
                },
                {
                  id: 'VCMNA185-019',
                  question: 'Calculate: 2 × 3 + 4 × 5 - 6',
                  options: ['20', '64', '40', '14'],
                  correctAnswer: 0,
                  explanation: 'Multiplications first: 6 + 20 - 6 = 20',
                  difficulty: 2
                },
                {
                  id: 'VCMNA185-020',
                  question: 'Insert one pair of brackets to make 5 + 3 × 4 - 2 = 30',
                  options: ['(5 + 3) × 4 - 2', '5 + 3 × (4 - 2)', '5 + (3 × 4) - 2', 'Cannot be done'],
                  correctAnswer: 0,
                  explanation: '(5 + 3) × 4 - 2 = 8 × 4 - 2 = 32 - 2 = 30',
                  difficulty: 3
                }
              ]
            }
          ]
        },
        {
          id: 'fractions-decimals',
          title: 'Fractions and Decimals',
          description: 'Understanding and working with fractions and decimal numbers',
          sections: [
            {
              id: 'VCMNA187',
              code: 'VCMNA187',
              title: 'Comparing and Ordering Fractions',
              description: 'Compare and order common unit fractions and locate and represent them on a number line',
              content: `# Comparing and Ordering Fractions

## Understanding Unit Fractions

A **unit fraction** has 1 as its numerator: ½, ⅓, ¼, ⅕, ⅙...

**Important rule:** The LARGER the denominator, the SMALLER the fraction!

Think about it: If you share a pizza among more people, each person gets a smaller piece.

So: **½ > ⅓ > ¼ > ⅕ > ⅙ > ⅐ > ⅛**

## Comparing Fractions with Same Denominators

When denominators are the same, just compare numerators:
- ⅗ vs ⅖ → 3 > 2, so **⅗ > ⅖**

## Using Benchmarks

Compare fractions to ½:
- Is ³⁄₈ more or less than ½? → ½ = ⁴⁄₈, and 3 < 4, so **³⁄₈ < ½**`,
              keyPoints: [
                'For unit fractions, larger denominator = smaller fraction',
                'Same denominators: compare numerators directly',
                'Same numerators: larger denominator = smaller fraction',
                'Use ½ as a benchmark to help compare fractions'
              ],
              examples: [
                {
                  problem: 'Order from smallest to largest: ½, ¼, ⅓',
                  solution: '¼ < ⅓ < ½',
                  explanation: 'These are unit fractions. Larger denominator = smaller fraction, so ¼ is smallest.'
                },
                {
                  problem: 'Which is larger: ⅗ or ⁷⁄₁₀?',
                  solution: '⁷⁄₁₀ is larger',
                  explanation: '⅗ = ⁶⁄₁₀, and ⁷⁄₁₀ > ⁶⁄₁₀'
                }
              ],
              questions: [
                {
                  id: 'VCMNA187-001',
                  question: 'Which fraction is the smallest?',
                  options: ['½', '⅓', '¼', '⅕'],
                  correctAnswer: 3,
                  explanation: 'For unit fractions, the larger the denominator, the smaller the fraction. ⅕ has the largest denominator.',
                  difficulty: 1
                },
                {
                  id: 'VCMNA187-002',
                  question: 'Order these fractions from smallest to largest: ⅝, ⅜, ⅞',
                  options: ['⅜, ⅝, ⅞', '⅞, ⅝, ⅜', '⅝, ⅜, ⅞', '⅜, ⅞, ⅝'],
                  correctAnswer: 0,
                  explanation: 'Same denominators, so compare numerators: 3 < 5 < 7',
                  difficulty: 1
                },
                {
                  id: 'VCMNA187-003',
                  question: 'Which fraction is greater than ½?',
                  options: ['³⁄₈', '²⁄₅', '⁴⁄₉', '⁵⁄₈'],
                  correctAnswer: 3,
                  explanation: '½ = ⁴⁄₈, and ⁵⁄₈ > ⁴⁄₈, so ⁵⁄₈ > ½',
                  difficulty: 2
                },
                {
                  id: 'VCMNA187-004',
                  question: 'Where would ³⁄₄ be on a number line from 0 to 1?',
                  options: ['Closer to 0', 'Exactly at ½', 'Between ½ and 1', 'At 1'],
                  correctAnswer: 2,
                  explanation: '³⁄₄ = 0.75, which is between ½ (0.5) and 1',
                  difficulty: 2
                },
                {
                  id: 'VCMNA187-005',
                  question: 'Which is larger: ⁵⁄₆ or ⁷⁄₈?',
                  options: ['⁵⁄₆', '⁷⁄₈', 'They are equal', 'Cannot compare'],
                  correctAnswer: 1,
                  explanation: '⁵⁄₆ ≈ 0.833, ⁷⁄₈ = 0.875. So ⁷⁄₈ is larger.',
                  difficulty: 3
                },
                {
                  id: 'VCMNA187-006',
                  question: 'Which unit fraction is largest?',
                  options: ['⅛', '⅙', '⅕', '¼'],
                  correctAnswer: 3,
                  explanation: 'For unit fractions, smaller denominator = larger fraction. ¼ has the smallest denominator.',
                  difficulty: 1
                },
                {
                  id: 'VCMNA187-007',
                  question: 'Which fraction equals ½?',
                  options: ['²⁄₅', '³⁄₆', '⁴⁄₆', '³⁄₅'],
                  correctAnswer: 1,
                  explanation: '³⁄₆ = 3÷3 / 6÷3 = ½',
                  difficulty: 1
                },
                {
                  id: 'VCMNA187-008',
                  question: 'Order from smallest to largest: ¼, ⅔, ½',
                  options: ['¼, ½, ⅔', '⅔, ½, ¼', '½, ¼, ⅔', '¼, ⅔, ½'],
                  correctAnswer: 0,
                  explanation: '¼ = 0.25, ½ = 0.5, ⅔ ≈ 0.67. So ¼ < ½ < ⅔',
                  difficulty: 2
                },
                {
                  id: 'VCMNA187-009',
                  question: 'Which fraction is closest to 1?',
                  options: ['³⁄₄', '⁴⁄₅', '⁵⁄₆', '⁸⁄₉'],
                  correctAnswer: 3,
                  explanation: '⁸⁄₉ is closest to 1 because it is only ¹⁄₉ away from 1.',
                  difficulty: 2
                },
                {
                  id: 'VCMNA187-010',
                  question: 'Is ²⁄₃ greater than, less than, or equal to ³⁄₄?',
                  options: ['Greater than', 'Less than', 'Equal to', 'Cannot compare'],
                  correctAnswer: 1,
                  explanation: '²⁄₃ = ⁸⁄₁₂ and ³⁄₄ = ⁹⁄₁₂. Since 8 < 9, ²⁄₃ < ³⁄₄',
                  difficulty: 2
                },
                {
                  id: 'VCMNA187-011',
                  question: 'Which fraction is exactly halfway between 0 and ½?',
                  options: ['⅛', '¼', '⅓', '⅖'],
                  correctAnswer: 1,
                  explanation: 'Halfway between 0 and ½ is ¼ (since ¼ + ¼ = ½)',
                  difficulty: 2
                },
                {
                  id: 'VCMNA187-012',
                  question: 'Which fraction is less than ⅓?',
                  options: ['²⁄₅', '³⁄₈', '¼', '⅖'],
                  correctAnswer: 2,
                  explanation: '⅓ ≈ 0.33, and ¼ = 0.25. Since 0.25 < 0.33, ¼ < ⅓',
                  difficulty: 2
                },
                {
                  id: 'VCMNA187-013',
                  question: 'Order these fractions: ²⁄₃, ¾, ⁵⁄₆ from smallest to largest',
                  options: ['²⁄₃, ¾, ⁵⁄₆', '¾, ²⁄₃, ⁵⁄₆', '⁵⁄₆, ¾, ²⁄₃', '²⁄₃, ⁵⁄₆, ¾'],
                  correctAnswer: 0,
                  explanation: '²⁄₃ ≈ 0.67, ¾ = 0.75, ⁵⁄₆ ≈ 0.83. So ²⁄₃ < ¾ < ⁵⁄₆',
                  difficulty: 3
                },
                {
                  id: 'VCMNA187-014',
                  question: 'Which pair of fractions are equivalent?',
                  options: ['²⁄₃ and ⁴⁄₅', '³⁄₄ and ⁶⁄₈', '½ and ³⁄₅', '¼ and ²⁄₆'],
                  correctAnswer: 1,
                  explanation: '³⁄₄ = ⁶⁄₈ (multiply both parts by 2)',
                  difficulty: 2
                },
                {
                  id: 'VCMNA187-015',
                  question: 'On a number line, which fraction comes just after ½?',
                  options: ['⁷⁄₁₀', '⁴⁄₁₀', '⁶⁄₁₀', '³⁄₁₀'],
                  correctAnswer: 2,
                  explanation: '½ = ⁵⁄₁₀, and the next tenth is ⁶⁄₁₀',
                  difficulty: 2
                },
                {
                  id: 'VCMNA187-016',
                  question: 'What fraction is ¼ more than ½?',
                  options: ['½', '¾', '⅔', '⅝'],
                  correctAnswer: 1,
                  explanation: '½ + ¼ = ²⁄₄ + ¼ = ¾',
                  difficulty: 2
                },
                {
                  id: 'VCMNA187-017',
                  question: 'Which is larger: ⁴⁄₇ or ⁵⁄₉?',
                  options: ['⁴⁄₇', '⁵⁄₉', 'They are equal', 'Cannot compare'],
                  correctAnswer: 0,
                  explanation: '⁴⁄₇ ≈ 0.571 and ⁵⁄₉ ≈ 0.556. So ⁴⁄₇ > ⁵⁄₉',
                  difficulty: 3
                },
                {
                  id: 'VCMNA187-018',
                  question: 'If you cut a pizza into 8 equal slices and eat 3, what fraction is left?',
                  options: ['³⁄₈', '⁵⁄₈', '⅜', '⁸⁄₅'],
                  correctAnswer: 1,
                  explanation: 'Started with ⁸⁄₈, ate ³⁄₈, so ⁸⁄₈ - ³⁄₈ = ⁵⁄₈ left',
                  difficulty: 1
                },
                {
                  id: 'VCMNA187-019',
                  question: 'Which fraction is exactly ¼ less than 1?',
                  options: ['½', '⅔', '¾', '⅘'],
                  correctAnswer: 2,
                  explanation: '1 - ¼ = ⁴⁄₄ - ¼ = ¾',
                  difficulty: 2
                },
                {
                  id: 'VCMNA187-020',
                  question: 'Arrange in order from smallest: ⁵⁄₁₂, ⅓, ½',
                  options: ['⅓, ⁵⁄₁₂, ½', '⁵⁄₁₂, ⅓, ½', '½, ⅓, ⁵⁄₁₂', '⅓, ½, ⁵⁄₁₂'],
                  correctAnswer: 0,
                  explanation: '⅓ = ⁴⁄₁₂, ⁵⁄₁₂ = ⁵⁄₁₂, ½ = ⁶⁄₁₂. Order: ⁴⁄₁₂ < ⁵⁄₁₂ < ⁶⁄₁₂',
                  difficulty: 3
                }
              ]
            },
            {
              id: 'VCMNA188',
              code: 'VCMNA188',
              title: 'Adding and Subtracting Fractions',
              description: 'Solve problems involving addition and subtraction of fractions with the same or related denominators',
              content: `# Adding and Subtracting Fractions

When adding or subtracting fractions, the key is having the same denominator.

## Same Denominators

When denominators are the same, just add or subtract the numerators:
- ²⁄₅ + ¹⁄₅ = ³⁄₅
- ⁵⁄₈ - ²⁄₈ = ³⁄₈

## Different Denominators

Find a common denominator first:
- ½ + ¼ = ²⁄₄ + ¼ = ³⁄₄
- ⅓ + ⅙ = ²⁄₆ + ⅙ = ³⁄₆ = ½

## Mixed Numbers

Convert to improper fractions or work with whole numbers separately:
- 1½ + 2¼ = 1²⁄₄ + 2¼ = 3³⁄₄

## Simplifying Answers

Always simplify your answer if possible:
- ⁴⁄₈ = ½
- ⁶⁄₉ = ⅔`,
              keyPoints: [
                'Same denominators: add/subtract numerators only',
                'Different denominators: find a common denominator first',
                'Always simplify your final answer',
                'Mixed numbers: work with whole numbers and fractions separately'
              ],
              examples: [
                {
                  problem: '³⁄₈ + ²⁄₈',
                  solution: '⁵⁄₈',
                  explanation: 'Same denominator, so 3 + 2 = 5 eighths'
                },
                {
                  problem: '½ + ⅓',
                  solution: '⁵⁄₆',
                  explanation: 'Common denominator 6: ³⁄₆ + ²⁄₆ = ⁵⁄₆'
                }
              ],
              questions: [
                {
                  id: 'VCMNA188-001',
                  question: 'What is ²⁄₇ + ³⁄₇?',
                  options: ['⁵⁄₇', '⁵⁄₁₄', '⁶⁄₇', '⁶⁄₁₄'],
                  correctAnswer: 0,
                  explanation: 'Same denominator: 2 + 3 = 5 sevenths = ⁵⁄₇',
                  difficulty: 1
                },
                {
                  id: 'VCMNA188-002',
                  question: 'What is ⁵⁄₈ - ²⁄₈?',
                  options: ['³⁄₁₆', '³⁄₈', '⁷⁄₈', '³⁄₀'],
                  correctAnswer: 1,
                  explanation: 'Same denominator: 5 - 2 = 3 eighths = ³⁄₈',
                  difficulty: 1
                },
                {
                  id: 'VCMNA188-003',
                  question: 'What is ½ + ¼?',
                  options: ['²⁄₆', '³⁄₆', '³⁄₄', '¹⁄₆'],
                  correctAnswer: 2,
                  explanation: '½ = ²⁄₄, so ²⁄₄ + ¼ = ³⁄₄',
                  difficulty: 1
                },
                {
                  id: 'VCMNA188-004',
                  question: 'What is ¾ - ¼?',
                  options: ['²⁄₈', '½', '¼', '²⁄₄'],
                  correctAnswer: 1,
                  explanation: '¾ - ¼ = ²⁄₄ = ½',
                  difficulty: 1
                },
                {
                  id: 'VCMNA188-005',
                  question: 'What is ⅓ + ⅙?',
                  options: ['²⁄₉', '½', '³⁄₆', '²⁄₆'],
                  correctAnswer: 1,
                  explanation: '⅓ = ²⁄₆, so ²⁄₆ + ⅙ = ³⁄₆ = ½',
                  difficulty: 2
                },
                {
                  id: 'VCMNA188-006',
                  question: 'What is ²⁄₃ + ⅙?',
                  options: ['³⁄₉', '⁵⁄₆', '³⁄₆', '⁴⁄₆'],
                  correctAnswer: 1,
                  explanation: '²⁄₃ = ⁴⁄₆, so ⁴⁄₆ + ⅙ = ⁵⁄₆',
                  difficulty: 2
                },
                {
                  id: 'VCMNA188-007',
                  question: 'What is ⁷⁄₁₀ - ³⁄₁₀?',
                  options: ['⁴⁄₂₀', '²⁄₅', '⁴⁄₁₀', '¹⁄₅'],
                  correctAnswer: 1,
                  explanation: '⁷⁄₁₀ - ³⁄₁₀ = ⁴⁄₁₀ = ²⁄₅',
                  difficulty: 1
                },
                {
                  id: 'VCMNA188-008',
                  question: 'What is ⁵⁄₆ - ⅓?',
                  options: ['²⁄₃', '½', '⁴⁄₆', '³⁄₆'],
                  correctAnswer: 1,
                  explanation: '⅓ = ²⁄₆, so ⁵⁄₆ - ²⁄₆ = ³⁄₆ = ½',
                  difficulty: 2
                },
                {
                  id: 'VCMNA188-009',
                  question: 'What is 1 - ³⁄₅?',
                  options: ['²⁄₅', '³⁄₅', '⁵⁄₅', '⁸⁄₅'],
                  correctAnswer: 0,
                  explanation: '1 = ⁵⁄₅, so ⁵⁄₅ - ³⁄₅ = ²⁄₅',
                  difficulty: 2
                },
                {
                  id: 'VCMNA188-010',
                  question: 'Simplify: ⁴⁄₈ + ²⁄₈',
                  options: ['⁶⁄₁₆', '⁶⁄₈', '¾', '³⁄₈'],
                  correctAnswer: 2,
                  explanation: '⁴⁄₈ + ²⁄₈ = ⁶⁄₈ = ¾',
                  difficulty: 1
                },
                {
                  id: 'VCMNA188-011',
                  question: 'What is ¼ + ½ + ¼?',
                  options: ['¾', '1', '⁴⁄₁₂', '⁶⁄₈'],
                  correctAnswer: 1,
                  explanation: '¼ + ²⁄₄ + ¼ = ⁴⁄₄ = 1',
                  difficulty: 2
                },
                {
                  id: 'VCMNA188-012',
                  question: 'What is ⅔ - ⅙?',
                  options: ['½', '⁴⁄₆', '³⁄₆', '⅙'],
                  correctAnswer: 0,
                  explanation: '⅔ = ⁴⁄₆, so ⁴⁄₆ - ⅙ = ³⁄₆ = ½',
                  difficulty: 2
                },
                {
                  id: 'VCMNA188-013',
                  question: 'A pizza is cut into 8 slices. You eat ³⁄₈ and your friend eats ²⁄₈. What fraction is left?',
                  options: ['⁵⁄₈', '⅜', '½', '⅛'],
                  correctAnswer: 1,
                  explanation: '⁸⁄₈ - ³⁄₈ - ²⁄₈ = ³⁄₈ left',
                  difficulty: 2
                },
                {
                  id: 'VCMNA188-014',
                  question: 'What is ⅓ + ⅓ + ⅓?',
                  options: ['⁹⁄₃', '³⁄₉', '1', '⅓'],
                  correctAnswer: 2,
                  explanation: '⅓ + ⅓ + ⅓ = ³⁄₃ = 1',
                  difficulty: 1
                },
                {
                  id: 'VCMNA188-015',
                  question: 'What is ⁷⁄₁₂ + ⁵⁄₁₂?',
                  options: ['¹²⁄₂₄', '1', '¹²⁄₁₂', '⁶⁄₁₂'],
                  correctAnswer: 1,
                  explanation: '⁷⁄₁₂ + ⁵⁄₁₂ = ¹²⁄₁₂ = 1',
                  difficulty: 1
                },
                {
                  id: 'VCMNA188-016',
                  question: 'What is ¾ - ½?',
                  options: ['¼', '²⁄₄', '½', '⅛'],
                  correctAnswer: 0,
                  explanation: '¾ - ²⁄₄ = ¼',
                  difficulty: 1
                },
                {
                  id: 'VCMNA188-017',
                  question: 'I walked ⅖ of a km in the morning and ²⁄₅ in the afternoon. How far did I walk?',
                  options: ['⁴⁄₁₀ km', '⁴⁄₅ km', '²⁄₅ km', '⅘ km'],
                  correctAnswer: 1,
                  explanation: '⅖ + ²⁄₅ = ⁴⁄₅ km',
                  difficulty: 2
                },
                {
                  id: 'VCMNA188-018',
                  question: 'What is ⅝ - ⅜?',
                  options: ['²⁄₁₆', '¼', '²⁄₈', '½'],
                  correctAnswer: 1,
                  explanation: '⅝ - ⅜ = ²⁄₈ = ¼',
                  difficulty: 1
                },
                {
                  id: 'VCMNA188-019',
                  question: 'What is ½ + ¼ + ⅛?',
                  options: ['³⁄₁₃', '⁷⁄₈', '¾', '⁴⁄₈'],
                  correctAnswer: 1,
                  explanation: '⁴⁄₈ + ²⁄₈ + ⅛ = ⁷⁄₈',
                  difficulty: 2
                },
                {
                  id: 'VCMNA188-020',
                  question: 'A tank is ⅚ full. After using ⅓, what fraction remains?',
                  options: ['½', '⁴⁄₆', '³⁄₆', '⅙'],
                  correctAnswer: 0,
                  explanation: '⅓ = ²⁄₆, so ⅚ - ²⁄₆ = ³⁄₆ = ½',
                  difficulty: 2
                }
              ]
            },
            {
              id: 'VCMNA189',
              code: 'VCMNA189',
              title: 'Fractions and Decimals Connection',
              description: 'Make connections between equivalent fractions, decimals and percentages',
              content: `# Connecting Fractions, Decimals and Percentages

Fractions, decimals, and percentages are different ways to show the same amount!

## Common Conversions

| Fraction | Decimal | Percentage |
|----------|---------|------------|
| ½        | 0.5     | 50%        |
| ¼        | 0.25    | 25%        |
| ¾        | 0.75    | 75%        |
| ⅕        | 0.2     | 20%        |
| ⅒        | 0.1     | 10%        |

## Converting Fractions to Decimals

Divide the numerator by the denominator:
- ¾ = 3 ÷ 4 = 0.75
- ⅖ = 2 ÷ 5 = 0.4

## Converting Decimals to Fractions

Use place value:
- 0.5 = ⁵⁄₁₀ = ½
- 0.25 = ²⁵⁄₁₀₀ = ¼

## Percentages

Percent means "per 100":
- 50% = ⁵⁰⁄₁₀₀ = ½ = 0.5
- 25% = ²⁵⁄₁₀₀ = ¼ = 0.25`,
              keyPoints: [
                'Fractions, decimals, and percentages show the same values differently',
                'To convert fraction to decimal: divide numerator by denominator',
                'Common fractions like ½, ¼, ¾ should be memorised as decimals',
                'Percent means out of 100'
              ],
              examples: [
                {
                  problem: 'Convert ¾ to a decimal',
                  solution: '0.75',
                  explanation: '3 ÷ 4 = 0.75'
                },
                {
                  problem: 'Convert 0.4 to a fraction',
                  solution: '⅖',
                  explanation: '0.4 = ⁴⁄₁₀ = ⅖'
                }
              ],
              questions: [
                {
                  id: 'VCMNA189-001',
                  question: 'What is ½ as a decimal?',
                  options: ['0.2', '0.5', '0.25', '0.12'],
                  correctAnswer: 1,
                  explanation: '½ = 1 ÷ 2 = 0.5',
                  difficulty: 1
                },
                {
                  id: 'VCMNA189-002',
                  question: 'What is ¼ as a decimal?',
                  options: ['0.4', '0.14', '0.25', '0.5'],
                  correctAnswer: 2,
                  explanation: '¼ = 1 ÷ 4 = 0.25',
                  difficulty: 1
                },
                {
                  id: 'VCMNA189-003',
                  question: 'What is 0.75 as a fraction?',
                  options: ['⁷⁄₅', '¾', '⁷⁵⁄₁₀', '⅗'],
                  correctAnswer: 1,
                  explanation: '0.75 = ⁷⁵⁄₁₀₀ = ¾',
                  difficulty: 1
                },
                {
                  id: 'VCMNA189-004',
                  question: 'What is ⅕ as a decimal?',
                  options: ['0.5', '0.15', '0.2', '0.25'],
                  correctAnswer: 2,
                  explanation: '⅕ = 1 ÷ 5 = 0.2',
                  difficulty: 1
                },
                {
                  id: 'VCMNA189-005',
                  question: 'What is 50% as a fraction?',
                  options: ['⅕', '½', '⁵⁄₁₀₀', '⅒'],
                  correctAnswer: 1,
                  explanation: '50% = ⁵⁰⁄₁₀₀ = ½',
                  difficulty: 1
                },
                {
                  id: 'VCMNA189-006',
                  question: 'What is ⅜ as a decimal?',
                  options: ['0.38', '0.375', '0.83', '3.8'],
                  correctAnswer: 1,
                  explanation: '⅜ = 3 ÷ 8 = 0.375',
                  difficulty: 2
                },
                {
                  id: 'VCMNA189-007',
                  question: 'Which is largest: ½, 0.45, or 48%?',
                  options: ['½', '0.45', '48%', 'They are equal'],
                  correctAnswer: 0,
                  explanation: '½ = 0.5, 48% = 0.48. So 0.5 > 0.48 > 0.45',
                  difficulty: 2
                },
                {
                  id: 'VCMNA189-008',
                  question: 'What is 0.125 as a fraction?',
                  options: ['⅛', '⅕', '¹²⁵⁄₁₀₀', '⅙'],
                  correctAnswer: 0,
                  explanation: '0.125 = ¹²⁵⁄₁₀₀₀ = ⅛',
                  difficulty: 2
                },
                {
                  id: 'VCMNA189-009',
                  question: 'What is 25% as a decimal?',
                  options: ['2.5', '0.025', '0.25', '25.0'],
                  correctAnswer: 2,
                  explanation: '25% = 25 ÷ 100 = 0.25',
                  difficulty: 1
                },
                {
                  id: 'VCMNA189-010',
                  question: 'What is ⅔ as a decimal (rounded to 2 places)?',
                  options: ['0.66', '0.67', '0.23', '0.33'],
                  correctAnswer: 1,
                  explanation: '⅔ = 2 ÷ 3 = 0.666... ≈ 0.67',
                  difficulty: 2
                },
                {
                  id: 'VCMNA189-011',
                  question: 'Which fraction equals 0.4?',
                  options: ['¼', '⅖', '⁴⁄₁₀₀', '⁴⁄₅'],
                  correctAnswer: 1,
                  explanation: '0.4 = ⁴⁄₁₀ = ⅖',
                  difficulty: 1
                },
                {
                  id: 'VCMNA189-012',
                  question: 'What is ¾ as a percentage?',
                  options: ['34%', '75%', '0.75%', '7.5%'],
                  correctAnswer: 1,
                  explanation: '¾ = 0.75 = 75%',
                  difficulty: 1
                },
                {
                  id: 'VCMNA189-013',
                  question: 'Order from smallest: 0.3, ⅓, 30%',
                  options: ['All equal', '0.3, 30%, ⅓', '30%, 0.3, ⅓', '⅓, 0.3, 30%'],
                  correctAnswer: 1,
                  explanation: '30% = 0.3, ⅓ ≈ 0.333. Order: 0.3 = 30% < ⅓',
                  difficulty: 2
                },
                {
                  id: 'VCMNA189-014',
                  question: 'What is 0.6 as a fraction in simplest form?',
                  options: ['⁶⁄₁₀', '⅗', '⁶⁄₁₀₀', '³⁄₆'],
                  correctAnswer: 1,
                  explanation: '0.6 = ⁶⁄₁₀ = ⅗',
                  difficulty: 1
                },
                {
                  id: 'VCMNA189-015',
                  question: 'What is ⅝ as a percentage?',
                  options: ['58%', '62.5%', '0.625%', '5.8%'],
                  correctAnswer: 1,
                  explanation: '⅝ = 0.625 = 62.5%',
                  difficulty: 2
                },
                {
                  id: 'VCMNA189-016',
                  question: 'A test score is ⁴⁄₅. What percentage is this?',
                  options: ['45%', '80%', '4.5%', '54%'],
                  correctAnswer: 1,
                  explanation: '⁴⁄₅ = 4 ÷ 5 = 0.8 = 80%',
                  difficulty: 2
                },
                {
                  id: 'VCMNA189-017',
                  question: 'Which is NOT equal to the others?',
                  options: ['½', '0.5', '50%', '0.05'],
                  correctAnswer: 3,
                  explanation: '½ = 0.5 = 50%, but 0.05 = 5%',
                  difficulty: 1
                },
                {
                  id: 'VCMNA189-018',
                  question: 'What is 0.05 as a fraction?',
                  options: ['½', '⁵⁄₁₀', '⅕', '¹⁄₂₀'],
                  correctAnswer: 3,
                  explanation: '0.05 = ⁵⁄₁₀₀ = ¹⁄₂₀',
                  difficulty: 2
                },
                {
                  id: 'VCMNA189-019',
                  question: 'A shop offers 20% off. What fraction is this?',
                  options: ['⅕', '²⁄₁₀₀', '½', '⅖'],
                  correctAnswer: 0,
                  explanation: '20% = ²⁰⁄₁₀₀ = ⅕',
                  difficulty: 1
                },
                {
                  id: 'VCMNA189-020',
                  question: 'What is ⁷⁄₁₀ as a decimal and percentage?',
                  options: ['0.7 and 70%', '0.07 and 7%', '7.0 and 700%', '0.17 and 17%'],
                  correctAnswer: 0,
                  explanation: '⁷⁄₁₀ = 0.7 = 70%',
                  difficulty: 1
                }
              ]
            },
            {
              id: 'VCMNA190',
              code: 'VCMNA190',
              title: 'Comparing and Ordering Decimals',
              description: 'Compare, order and represent decimals',
              content: `# Understanding Decimals

Decimals are another way to show parts of a whole number, just like fractions!

## Place Value in Decimals

| Ones | . | Tenths | Hundredths | Thousandths |
|------|---|--------|------------|-------------|
| 1    | . | 0.1    | 0.01       | 0.001       |

## Comparing Decimals

**Golden Rule:** Line up the decimal points, then compare from left to right!

**Example:** Which is larger, 3.45 or 3.5?
- 3.45
- 3.50 (add a zero to help compare)
- Compare: 4 < 5, so **3.5 > 3.45**

## Common Mistakes to Avoid

❌ "3.45 is bigger because it has more digits"
✓ Compare place values, not number of digits!`,
              keyPoints: [
                'Each place value is 10 times smaller as you move right',
                'Line up decimal points when comparing',
                'Add trailing zeros to help compare (0.5 = 0.50 = 0.500)',
                'More digits doesn\'t mean a larger number!'
              ],
              examples: [
                {
                  problem: 'Order from smallest to largest: 0.6, 0.06, 0.66',
                  solution: '0.06 < 0.6 < 0.66',
                  explanation: 'Compare as 0.06, 0.60, 0.66 - looking at tenths first'
                },
                {
                  problem: 'Which is larger: 4.5 or 4.125?',
                  solution: '4.5 is larger',
                  explanation: '4.500 vs 4.125: The tenths digit 5 > 1'
                }
              ],
              questions: [
                {
                  id: 'VCMNA190-001',
                  question: 'What is the value of the 7 in 3.478?',
                  options: ['7', '0.7', '0.07', '0.007'],
                  correctAnswer: 2,
                  explanation: 'The 7 is in the hundredths place, so its value is 0.07',
                  difficulty: 1
                },
                {
                  id: 'VCMNA190-002',
                  question: 'Which decimal is largest?',
                  options: ['0.9', '0.85', '0.095', '0.58'],
                  correctAnswer: 0,
                  explanation: 'Compare tenths: 9 > 8 > 5 > 0, so 0.9 is largest',
                  difficulty: 1
                },
                {
                  id: 'VCMNA190-003',
                  question: 'Order these from smallest to largest: 2.05, 2.5, 2.005',
                  options: ['2.005, 2.05, 2.5', '2.5, 2.05, 2.005', '2.05, 2.005, 2.5', '2.5, 2.005, 2.05'],
                  correctAnswer: 0,
                  explanation: '2.005 = 2.005, 2.05 = 2.050, 2.5 = 2.500. Comparing: 005 < 050 < 500',
                  difficulty: 2
                },
                {
                  id: 'VCMNA190-004',
                  question: 'Which decimal is equivalent to ¾?',
                  options: ['0.34', '0.43', '0.75', '0.74'],
                  correctAnswer: 2,
                  explanation: '¾ = 3 ÷ 4 = 0.75',
                  difficulty: 2
                },
                {
                  id: 'VCMNA190-005',
                  question: 'What is 2.8 + 0.35?',
                  options: ['2.115', '3.15', '2.43', '3.05'],
                  correctAnswer: 1,
                  explanation: '2.80 + 0.35 = 3.15 (line up decimal points)',
                  difficulty: 3
                },
                {
                  id: 'VCMNA190-006',
                  question: 'What is the place value of 4 in 0.146?',
                  options: ['4 tenths', '4 hundredths', '4 thousandths', '4 ones'],
                  correctAnswer: 1,
                  explanation: 'In 0.146: 1 is tenths, 4 is hundredths, 6 is thousandths.',
                  difficulty: 1
                },
                {
                  id: 'VCMNA190-007',
                  question: 'Which is smaller: 0.3 or 0.29?',
                  options: ['0.3', '0.29', 'They are equal', 'Cannot compare'],
                  correctAnswer: 1,
                  explanation: '0.3 = 0.30, and 0.30 > 0.29. So 0.29 is smaller.',
                  difficulty: 1
                },
                {
                  id: 'VCMNA190-008',
                  question: 'Write 0.6 as a fraction.',
                  options: ['⅙', '⅗', '⁶⁄₁₀', '⁶⁄₁₀₀'],
                  correctAnswer: 2,
                  explanation: '0.6 = 6 tenths = ⁶⁄₁₀ = ³⁄₅',
                  difficulty: 1
                },
                {
                  id: 'VCMNA190-009',
                  question: 'Order from largest to smallest: 0.45, 0.54, 0.405',
                  options: ['0.54, 0.45, 0.405', '0.405, 0.45, 0.54', '0.45, 0.54, 0.405', '0.54, 0.405, 0.45'],
                  correctAnswer: 0,
                  explanation: '0.540 > 0.450 > 0.405',
                  difficulty: 2
                },
                {
                  id: 'VCMNA190-010',
                  question: 'What is 0.1 + 0.01 + 0.001?',
                  options: ['0.3', '0.111', '0.012', '1.11'],
                  correctAnswer: 1,
                  explanation: '0.100 + 0.010 + 0.001 = 0.111',
                  difficulty: 2
                },
                {
                  id: 'VCMNA190-011',
                  question: 'Round 4.567 to the nearest tenth.',
                  options: ['4.5', '4.6', '4.57', '5.0'],
                  correctAnswer: 1,
                  explanation: 'Look at hundredths (6). Since 6 ≥ 5, round up: 4.6',
                  difficulty: 2
                },
                {
                  id: 'VCMNA190-012',
                  question: 'Which decimal equals ½?',
                  options: ['0.2', '0.25', '0.5', '0.12'],
                  correctAnswer: 2,
                  explanation: '½ = 1 ÷ 2 = 0.5',
                  difficulty: 1
                },
                {
                  id: 'VCMNA190-013',
                  question: 'What is 1.5 - 0.75?',
                  options: ['0.25', '0.75', '1.25', '0.85'],
                  correctAnswer: 1,
                  explanation: '1.50 - 0.75 = 0.75',
                  difficulty: 2
                },
                {
                  id: 'VCMNA190-014',
                  question: 'Which is between 0.6 and 0.7?',
                  options: ['0.59', '0.75', '0.65', '0.8'],
                  correctAnswer: 2,
                  explanation: '0.60 < 0.65 < 0.70, so 0.65 is between them.',
                  difficulty: 2
                },
                {
                  id: 'VCMNA190-015',
                  question: 'How many tenths are in 2.3?',
                  options: ['3', '23', '2.3', '230'],
                  correctAnswer: 1,
                  explanation: '2.3 = 2 ones + 3 tenths = 20 tenths + 3 tenths = 23 tenths',
                  difficulty: 2
                },
                {
                  id: 'VCMNA190-016',
                  question: 'Round 0.849 to the nearest hundredth.',
                  options: ['0.8', '0.84', '0.85', '0.9'],
                  correctAnswer: 2,
                  explanation: 'Look at thousandths (9). Since 9 ≥ 5, round up: 0.85',
                  difficulty: 2
                },
                {
                  id: 'VCMNA190-017',
                  question: 'What is 0.25 × 4?',
                  options: ['0.5', '1', '1.25', '1.5'],
                  correctAnswer: 1,
                  explanation: '0.25 × 4 = 1 (or ¼ × 4 = 1)',
                  difficulty: 2
                },
                {
                  id: 'VCMNA190-018',
                  question: 'Which decimal is closest to 1?',
                  options: ['0.89', '0.9', '0.99', '0.909'],
                  correctAnswer: 2,
                  explanation: '0.99 is only 0.01 away from 1, which is the smallest difference.',
                  difficulty: 2
                },
                {
                  id: 'VCMNA190-019',
                  question: 'What is 3.2 × 10?',
                  options: ['32', '3.20', '0.32', '320'],
                  correctAnswer: 0,
                  explanation: 'Multiplying by 10 moves the decimal point one place right: 3.2 → 32',
                  difficulty: 2
                },
                {
                  id: 'VCMNA190-020',
                  question: 'Express 0.125 as a fraction in simplest form.',
                  options: ['⅛', '¼', '⅕', '⅓'],
                  correctAnswer: 0,
                  explanation: '0.125 = 125/1000 = ⅛',
                  difficulty: 3
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'measurement-geometry',
      name: 'Measurement and Geometry',
      chapters: [
        {
          id: 'using-units',
          title: 'Using Units of Measurement',
          description: 'Choosing and using appropriate units for measuring',
          sections: [
            {
              id: 'VCMMG196',
              code: 'VCMMG196',
              title: 'Perimeter, Area and Volume',
              description: 'Calculate the perimeter and area of rectangles and the volume and capacity of prisms',
              content: `# Perimeter, Area and Volume

These three measurements tell us different things about shapes!

## Perimeter

**Perimeter** = the distance around the outside of a shape

For a rectangle: **Perimeter = 2 × (length + width)**

## Area

**Area** = the space inside a 2D shape (measured in square units)

For a rectangle: **Area = length × width**

## Volume

**Volume** = the space inside a 3D shape (measured in cubic units)

For a rectangular prism (box): **Volume = length × width × height**

### Volume and Capacity

- **1 cm³ = 1 mL**
- **1,000 cm³ = 1 L**`,
              keyPoints: [
                'Perimeter = distance around (add all sides)',
                'Area = space inside a 2D shape (length × width)',
                'Volume = space inside a 3D shape (length × width × height)',
                '1 cm³ = 1 mL, so volume connects to capacity'
              ],
              examples: [
                {
                  problem: 'Find the perimeter and area of a rectangle 12cm by 7cm',
                  solution: 'Perimeter = 38cm, Area = 84 cm²',
                  explanation: 'P = 2×(12+7) = 38cm. A = 12×7 = 84 cm²'
                },
                {
                  problem: 'A fish tank is 30cm × 20cm × 25cm. What is its capacity in litres?',
                  solution: '15 litres',
                  explanation: 'Volume = 30×20×25 = 15,000 cm³ = 15 L'
                }
              ],
              questions: [
                {
                  id: 'VCMMG196-001',
                  question: 'What is the perimeter of a rectangle with length 9m and width 4m?',
                  options: ['13 m', '26 m', '36 m', '52 m'],
                  correctAnswer: 1,
                  explanation: 'Perimeter = 2 × (9 + 4) = 2 × 13 = 26 m',
                  difficulty: 1
                },
                {
                  id: 'VCMMG196-002',
                  question: 'A garden is 15m long and 8m wide. What is its area?',
                  options: ['23 m²', '46 m²', '120 m²', '240 m²'],
                  correctAnswer: 2,
                  explanation: 'Area = length × width = 15 × 8 = 120 m²',
                  difficulty: 1
                },
                {
                  id: 'VCMMG196-003',
                  question: 'A box is 6cm × 4cm × 5cm. What is its volume?',
                  options: ['15 cm³', '60 cm³', '120 cm³', '240 cm³'],
                  correctAnswer: 2,
                  explanation: 'Volume = 6 × 4 × 5 = 120 cm³',
                  difficulty: 2
                },
                {
                  id: 'VCMMG196-004',
                  question: 'A rectangular pool has an area of 48 m². If it is 8m long, how wide is it?',
                  options: ['4 m', '5 m', '6 m', '7 m'],
                  correctAnswer: 2,
                  explanation: 'Area = length × width, so 48 = 8 × width. Width = 48 ÷ 8 = 6 m',
                  difficulty: 2
                },
                {
                  id: 'VCMMG196-005',
                  question: 'A container is 20cm × 15cm × 10cm. How many litres can it hold?',
                  options: ['3 L', '30 L', '300 L', '0.3 L'],
                  correctAnswer: 0,
                  explanation: 'Volume = 20 × 15 × 10 = 3,000 cm³ = 3 L (since 1,000 cm³ = 1 L)',
                  difficulty: 3
                },
                {
                  id: 'VCMMG196-006',
                  question: 'What is the perimeter of a square with sides of 7cm?',
                  options: ['14 cm', '21 cm', '28 cm', '49 cm'],
                  correctAnswer: 2,
                  explanation: 'Perimeter of a square = 4 × side = 4 × 7 = 28 cm',
                  difficulty: 1
                },
                {
                  id: 'VCMMG196-007',
                  question: 'What is the area of a square with sides of 9m?',
                  options: ['18 m²', '36 m²', '81 m²', '324 m²'],
                  correctAnswer: 2,
                  explanation: 'Area of a square = side × side = 9 × 9 = 81 m²',
                  difficulty: 1
                },
                {
                  id: 'VCMMG196-008',
                  question: 'A rectangular prism is 8cm long, 5cm wide, and 3cm high. What is its volume?',
                  options: ['16 cm³', '40 cm³', '80 cm³', '120 cm³'],
                  correctAnswer: 3,
                  explanation: 'Volume = 8 × 5 × 3 = 120 cm³',
                  difficulty: 2
                },
                {
                  id: 'VCMMG196-009',
                  question: 'A rectangle has a perimeter of 24cm. If the length is 8cm, what is the width?',
                  options: ['4 cm', '6 cm', '8 cm', '16 cm'],
                  correctAnswer: 0,
                  explanation: 'Perimeter = 2(l + w), so 24 = 2(8 + w), 12 = 8 + w, w = 4 cm',
                  difficulty: 2
                },
                {
                  id: 'VCMMG196-010',
                  question: 'How many 1cm cubes fit in a box that is 4cm × 3cm × 2cm?',
                  options: ['9', '14', '20', '24'],
                  correctAnswer: 3,
                  explanation: 'Volume = 4 × 3 × 2 = 24 cm³, so 24 unit cubes fit.',
                  difficulty: 2
                },
                {
                  id: 'VCMMG196-011',
                  question: 'A room is 6m by 4m. How much carpet is needed to cover the floor?',
                  options: ['10 m²', '20 m²', '24 m²', '48 m²'],
                  correctAnswer: 2,
                  explanation: 'Area = 6 × 4 = 24 m²',
                  difficulty: 1
                },
                {
                  id: 'VCMMG196-012',
                  question: 'A cube has sides of 5cm. What is its volume?',
                  options: ['15 cm³', '25 cm³', '75 cm³', '125 cm³'],
                  correctAnswer: 3,
                  explanation: 'Volume of cube = side³ = 5 × 5 × 5 = 125 cm³',
                  difficulty: 2
                },
                {
                  id: 'VCMMG196-013',
                  question: 'How many millilitres are in a container with volume 500 cm³?',
                  options: ['5 mL', '50 mL', '500 mL', '5000 mL'],
                  correctAnswer: 2,
                  explanation: '1 cm³ = 1 mL, so 500 cm³ = 500 mL',
                  difficulty: 2
                },
                {
                  id: 'VCMMG196-014',
                  question: 'A field has an area of 200 m². If it is 25m long, how wide is it?',
                  options: ['4 m', '6 m', '8 m', '10 m'],
                  correctAnswer: 2,
                  explanation: 'Area = l × w, so 200 = 25 × w, w = 200 ÷ 25 = 8 m',
                  difficulty: 2
                },
                {
                  id: 'VCMMG196-015',
                  question: 'A fence goes around a rectangular paddock 50m by 30m. How long is the fence?',
                  options: ['80 m', '150 m', '160 m', '1500 m'],
                  correctAnswer: 2,
                  explanation: 'Perimeter = 2 × (50 + 30) = 2 × 80 = 160 m',
                  difficulty: 2
                },
                {
                  id: 'VCMMG196-016',
                  question: 'A fish tank is 40cm × 25cm × 30cm. What is its capacity in litres?',
                  options: ['3 L', '30 L', '300 L', '3000 L'],
                  correctAnswer: 1,
                  explanation: 'Volume = 40 × 25 × 30 = 30,000 cm³ = 30 L',
                  difficulty: 3
                },
                {
                  id: 'VCMMG196-017',
                  question: 'Two squares have the same perimeter as a rectangle 12cm by 6cm. What is the side length of each square?',
                  options: ['6 cm', '9 cm', '12 cm', '18 cm'],
                  correctAnswer: 1,
                  explanation: 'Rectangle perimeter = 2(12+6) = 36cm. Square perimeter = 36 ÷ 2 = 18cm per square. Side = 18 ÷ 4 = 4.5cm... Wait, let me recalculate. Actually: If one square has perimeter 36cm, side = 36 ÷ 4 = 9cm',
                  difficulty: 3
                },
                {
                  id: 'VCMMG196-018',
                  question: 'What is the area of a rectangle with perimeter 30cm if one side is 10cm?',
                  options: ['25 cm²', '50 cm²', '100 cm²', '150 cm²'],
                  correctAnswer: 1,
                  explanation: 'P = 30, one side = 10, so other side = (30 ÷ 2) - 10 = 5. Area = 10 × 5 = 50 cm²',
                  difficulty: 3
                },
                {
                  id: 'VCMMG196-019',
                  question: 'A cube-shaped box holds 8 litres. What is the length of each side?',
                  options: ['2 cm', '20 cm', '200 cm', '8 cm'],
                  correctAnswer: 1,
                  explanation: '8 L = 8,000 cm³. Cube root of 8,000 = 20. Side = 20 cm.',
                  difficulty: 3
                },
                {
                  id: 'VCMMG196-020',
                  question: 'A playground is shaped like an L. The long part is 20m × 10m and the short part is 10m × 8m. What is the total area?',
                  options: ['200 m²', '280 m²', '300 m²', '380 m²'],
                  correctAnswer: 1,
                  explanation: 'Total area = (20 × 10) + (10 × 8) = 200 + 80 = 280 m²',
                  difficulty: 3
                }
              ]
            }
          ]
        },
        {
          id: 'geometric-reasoning',
          title: 'Geometric Reasoning',
          description: 'Understanding and measuring angles',
          sections: [
            {
              id: 'VCMMG202',
              code: 'VCMMG202',
              title: 'Angles',
              description: 'Estimate, measure and compare angles using degrees. Construct angles using a protractor',
              content: `# Understanding Angles

An angle is formed when two lines meet at a point. We measure angles in degrees (°).

## Types of Angles

- **Acute Angle** (Sharp!): Less than 90°
- **Right Angle** (Square corner): Exactly 90°
- **Obtuse Angle** (Wide): Between 90° and 180°
- **Straight Angle**: Exactly 180°
- **Reflex Angle**: Between 180° and 360°

## Angles in Shapes

| Shape | Sum of Angles |
|-------|---------------|
| Triangle | 180° |
| Quadrilateral | 360° |`,
              keyPoints: [
                'Angles are measured in degrees (°)',
                'Acute < 90° < Right = 90° < Obtuse < 180° < Straight = 180° < Reflex < 360°',
                'Use benchmarks (45°, 90°, 180°) to estimate',
                'A protractor measures angles precisely'
              ],
              examples: [
                {
                  problem: 'What type of angle is 135°?',
                  solution: 'Obtuse angle',
                  explanation: '135° is between 90° and 180°, so it\'s obtuse'
                },
                {
                  problem: 'Two angles in a triangle are 60° and 70°. What is the third angle?',
                  solution: '50°',
                  explanation: 'Triangle angles sum to 180°. 180 - 60 - 70 = 50°'
                }
              ],
              questions: [
                {
                  id: 'VCMMG202-001',
                  question: 'What type of angle is 75°?',
                  options: ['Acute', 'Right', 'Obtuse', 'Reflex'],
                  correctAnswer: 0,
                  explanation: '75° is less than 90°, so it is an acute angle',
                  difficulty: 1
                },
                {
                  id: 'VCMMG202-002',
                  question: 'What type of angle is 145°?',
                  options: ['Acute', 'Right', 'Obtuse', 'Reflex'],
                  correctAnswer: 2,
                  explanation: '145° is between 90° and 180°, so it is an obtuse angle',
                  difficulty: 1
                },
                {
                  id: 'VCMMG202-003',
                  question: 'A right angle and an angle of 35° are together. What is their total?',
                  options: ['115°', '125°', '135°', '145°'],
                  correctAnswer: 1,
                  explanation: 'A right angle = 90°, so 90° + 35° = 125°',
                  difficulty: 2
                },
                {
                  id: 'VCMMG202-004',
                  question: 'The angles of a triangle are 90°, 45°, and what?',
                  options: ['35°', '45°', '55°', '65°'],
                  correctAnswer: 1,
                  explanation: 'Triangle angles = 180°, so 180 - 90 - 45 = 45°',
                  difficulty: 2
                },
                {
                  id: 'VCMMG202-005',
                  question: 'What is the reflex angle when the acute angle is 50°?',
                  options: ['130°', '230°', '310°', '360°'],
                  correctAnswer: 2,
                  explanation: 'A reflex angle and its corresponding angle make 360°. 360° - 50° = 310°',
                  difficulty: 3
                },
                {
                  id: 'VCMMG202-006',
                  question: 'What type of angle is exactly 90°?',
                  options: ['Acute', 'Right', 'Obtuse', 'Straight'],
                  correctAnswer: 1,
                  explanation: 'A right angle is exactly 90°.',
                  difficulty: 1
                },
                {
                  id: 'VCMMG202-007',
                  question: 'What type of angle is 180°?',
                  options: ['Right', 'Obtuse', 'Straight', 'Reflex'],
                  correctAnswer: 2,
                  explanation: 'A straight angle is exactly 180°.',
                  difficulty: 1
                },
                {
                  id: 'VCMMG202-008',
                  question: 'What type of angle is 200°?',
                  options: ['Acute', 'Obtuse', 'Straight', 'Reflex'],
                  correctAnswer: 3,
                  explanation: '200° is between 180° and 360°, so it is a reflex angle.',
                  difficulty: 1
                },
                {
                  id: 'VCMMG202-009',
                  question: 'Two angles in a triangle are 60° and 80°. What is the third angle?',
                  options: ['30°', '40°', '50°', '60°'],
                  correctAnswer: 1,
                  explanation: 'Triangle angles sum to 180°. 180 - 60 - 80 = 40°',
                  difficulty: 2
                },
                {
                  id: 'VCMMG202-010',
                  question: 'How many degrees are in a full turn?',
                  options: ['90°', '180°', '270°', '360°'],
                  correctAnswer: 3,
                  explanation: 'A full turn (complete rotation) is 360°.',
                  difficulty: 1
                },
                {
                  id: 'VCMMG202-011',
                  question: 'What is half of a right angle?',
                  options: ['30°', '45°', '60°', '90°'],
                  correctAnswer: 1,
                  explanation: 'A right angle is 90°, so half is 45°.',
                  difficulty: 1
                },
                {
                  id: 'VCMMG202-012',
                  question: 'The angles of a quadrilateral add up to how many degrees?',
                  options: ['180°', '270°', '360°', '540°'],
                  correctAnswer: 2,
                  explanation: 'The angles in any quadrilateral sum to 360°.',
                  difficulty: 2
                },
                {
                  id: 'VCMMG202-013',
                  question: 'An angle is 25° less than a right angle. What is the angle?',
                  options: ['55°', '65°', '75°', '85°'],
                  correctAnswer: 1,
                  explanation: '90° - 25° = 65°',
                  difficulty: 2
                },
                {
                  id: 'VCMMG202-014',
                  question: 'Two angles on a straight line add up to how many degrees?',
                  options: ['90°', '180°', '270°', '360°'],
                  correctAnswer: 1,
                  explanation: 'Angles on a straight line sum to 180°.',
                  difficulty: 2
                },
                {
                  id: 'VCMMG202-015',
                  question: 'If one angle on a straight line is 115°, what is the other angle?',
                  options: ['55°', '65°', '75°', '85°'],
                  correctAnswer: 1,
                  explanation: 'Angles on a straight line = 180°. 180 - 115 = 65°',
                  difficulty: 2
                },
                {
                  id: 'VCMMG202-016',
                  question: 'How many right angles make a straight angle?',
                  options: ['1', '2', '3', '4'],
                  correctAnswer: 1,
                  explanation: 'A straight angle is 180° = 2 × 90° = 2 right angles.',
                  difficulty: 2
                },
                {
                  id: 'VCMMG202-017',
                  question: 'A rectangle has four angles. Each angle is:',
                  options: ['45°', '60°', '90°', '120°'],
                  correctAnswer: 2,
                  explanation: 'All angles in a rectangle are right angles (90°).',
                  difficulty: 1
                },
                {
                  id: 'VCMMG202-018',
                  question: 'An equilateral triangle has three equal angles. What is each angle?',
                  options: ['45°', '60°', '90°', '120°'],
                  correctAnswer: 1,
                  explanation: '180° ÷ 3 = 60° for each angle.',
                  difficulty: 2
                },
                {
                  id: 'VCMMG202-019',
                  question: 'Which angle is closest to the angle of a slice of pizza cut into 8 equal pieces?',
                  options: ['30°', '45°', '60°', '90°'],
                  correctAnswer: 1,
                  explanation: '360° ÷ 8 = 45° per slice.',
                  difficulty: 2
                },
                {
                  id: 'VCMMG202-020',
                  question: 'Three angles of a quadrilateral are 80°, 100°, and 90°. What is the fourth angle?',
                  options: ['70°', '80°', '90°', '100°'],
                  correctAnswer: 2,
                  explanation: 'Quadrilateral angles = 360°. 360 - 80 - 100 - 90 = 90°',
                  difficulty: 3
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'statistics-probability',
      name: 'Statistics and Probability',
      chapters: [
        {
          id: 'chance',
          title: 'Chance and Probability',
          description: 'Understanding likelihood and probability',
          sections: [
            {
              id: 'VCMSP203',
              code: 'VCMSP203',
              title: 'Probability as Fractions',
              description: 'List outcomes of chance experiments and represent probabilities using fractions',
              content: `# Understanding Probability

Probability tells us how likely something is to happen, measured from 0 to 1.

## The Probability Scale

- **0** = Impossible (will never happen)
- **½** = Even chance (equally likely to happen or not)
- **1** = Certain (will definitely happen)

## Writing Probability as Fractions

**Probability = Number of ways event can happen / Total number of possible outcomes**

## Example: Rolling a Die

**P(rolling a 4) = 1/6** (1 way to get 4, 6 total outcomes)
**P(even number) = 3/6 = 1/2** (3 even numbers: 2, 4, 6)`,
              keyPoints: [
                'Probability is a number between 0 (impossible) and 1 (certain)',
                'Probability = favourable outcomes ÷ total outcomes',
                'All probabilities in an experiment add up to 1',
                '½ means an equal chance of happening or not'
              ],
              examples: [
                {
                  problem: 'A bag has 4 red and 6 blue balls. What is P(red)?',
                  solution: '4/10 = 2/5',
                  explanation: '4 red out of 10 total = 4/10, simplified to 2/5'
                },
                {
                  problem: 'A spinner has sections: 3 red, 2 blue, 1 yellow. What is P(not red)?',
                  solution: '3/6 = 1/2',
                  explanation: 'Not red = blue or yellow = 2 + 1 = 3 sections out of 6'
                }
              ],
              questions: [
                {
                  id: 'VCMSP203-001',
                  question: 'What is the probability of flipping heads on a fair coin?',
                  options: ['1/4', '1/3', '1/2', '2/3'],
                  correctAnswer: 2,
                  explanation: 'A coin has 2 outcomes (heads, tails). P(heads) = 1/2',
                  difficulty: 1
                },
                {
                  id: 'VCMSP203-002',
                  question: 'What is the probability of rolling a number greater than 4 on a die?',
                  options: ['1/6', '2/6', '3/6', '4/6'],
                  correctAnswer: 1,
                  explanation: 'Numbers greater than 4: 5 and 6 (2 outcomes). P = 2/6 = 1/3',
                  difficulty: 2
                },
                {
                  id: 'VCMSP203-003',
                  question: 'A bag has 3 red, 5 blue, and 2 green balls. What is P(blue)?',
                  options: ['3/10', '5/10', '2/10', '7/10'],
                  correctAnswer: 1,
                  explanation: '5 blue out of 10 total = 5/10 = 1/2',
                  difficulty: 1
                },
                {
                  id: 'VCMSP203-004',
                  question: 'If P(rain) = 3/5, what is P(no rain)?',
                  options: ['1/5', '2/5', '3/5', '4/5'],
                  correctAnswer: 1,
                  explanation: 'P(rain) + P(no rain) = 1. So P(no rain) = 1 - 3/5 = 2/5',
                  difficulty: 2
                },
                {
                  id: 'VCMSP203-005',
                  question: 'Two coins are flipped. What is P(getting two heads)?',
                  options: ['1/2', '1/3', '1/4', '1/8'],
                  correctAnswer: 2,
                  explanation: 'Outcomes: HH, HT, TH, TT (4 total). P(HH) = 1/4',
                  difficulty: 3
                },
                {
                  id: 'VCMSP203-006',
                  question: 'What is the probability of rolling an even number on a die?',
                  options: ['1/6', '2/6', '3/6', '4/6'],
                  correctAnswer: 2,
                  explanation: 'Even numbers: 2, 4, 6 (3 outcomes out of 6). P = 3/6 = 1/2',
                  difficulty: 1
                },
                {
                  id: 'VCMSP203-007',
                  question: 'What does a probability of 0 mean?',
                  options: ['Certain to happen', 'Impossible', 'Equal chance', 'Likely to happen'],
                  correctAnswer: 1,
                  explanation: 'A probability of 0 means the event is impossible - it will never happen.',
                  difficulty: 1
                },
                {
                  id: 'VCMSP203-008',
                  question: 'What does a probability of 1 mean?',
                  options: ['Impossible', 'Unlikely', 'Even chance', 'Certain to happen'],
                  correctAnswer: 3,
                  explanation: 'A probability of 1 means the event is certain - it will definitely happen.',
                  difficulty: 1
                },
                {
                  id: 'VCMSP203-009',
                  question: 'A spinner has 4 equal sections: red, blue, green, yellow. What is P(red)?',
                  options: ['1/2', '1/3', '1/4', '1/5'],
                  correctAnswer: 2,
                  explanation: '1 red section out of 4 equal sections. P(red) = 1/4',
                  difficulty: 1
                },
                {
                  id: 'VCMSP203-010',
                  question: 'What is P(rolling a 7) on a standard die?',
                  options: ['0', '1/6', '1/7', '1'],
                  correctAnswer: 0,
                  explanation: 'A standard die only has numbers 1-6. Rolling a 7 is impossible, so P = 0.',
                  difficulty: 1
                },
                {
                  id: 'VCMSP203-011',
                  question: 'A bag has 4 red and 6 blue marbles. What is P(not red)?',
                  options: ['4/10', '6/10', '10/10', '0/10'],
                  correctAnswer: 1,
                  explanation: 'P(not red) = P(blue) = 6/10 = 3/5',
                  difficulty: 2
                },
                {
                  id: 'VCMSP203-012',
                  question: 'What is P(rolling a number less than 5) on a die?',
                  options: ['2/6', '3/6', '4/6', '5/6'],
                  correctAnswer: 2,
                  explanation: 'Numbers less than 5: 1, 2, 3, 4 (4 outcomes). P = 4/6 = 2/3',
                  difficulty: 2
                },
                {
                  id: 'VCMSP203-013',
                  question: 'A spinner has 8 equal sections numbered 1-8. What is P(landing on an odd number)?',
                  options: ['1/8', '2/8', '4/8', '5/8'],
                  correctAnswer: 2,
                  explanation: 'Odd numbers: 1, 3, 5, 7 (4 numbers). P = 4/8 = 1/2',
                  difficulty: 2
                },
                {
                  id: 'VCMSP203-014',
                  question: 'In a class of 20, 8 students wear glasses. If a student is picked randomly, what is P(glasses)?',
                  options: ['8/20', '12/20', '8/12', '20/8'],
                  correctAnswer: 0,
                  explanation: '8 students with glasses out of 20 total. P = 8/20 = 2/5',
                  difficulty: 2
                },
                {
                  id: 'VCMSP203-015',
                  question: 'Which probability describes an event that is "likely" to happen?',
                  options: ['0', '1/4', '3/4', '1'],
                  correctAnswer: 2,
                  explanation: '3/4 is greater than 1/2, meaning the event is more likely to happen than not.',
                  difficulty: 2
                },
                {
                  id: 'VCMSP203-016',
                  question: 'A bag contains only red marbles. What is P(picking a red marble)?',
                  options: ['0', '1/2', '1', 'Cannot determine'],
                  correctAnswer: 2,
                  explanation: 'If all marbles are red, picking red is certain. P = 1.',
                  difficulty: 2
                },
                {
                  id: 'VCMSP203-017',
                  question: 'What is P(rolling 1 or 6) on a die?',
                  options: ['1/6', '2/6', '3/6', '6/6'],
                  correctAnswer: 1,
                  explanation: 'Two favourable outcomes (1 or 6) out of 6. P = 2/6 = 1/3',
                  difficulty: 2
                },
                {
                  id: 'VCMSP203-018',
                  question: 'A card is drawn from a deck. There are 13 hearts out of 52 cards. What is P(heart)?',
                  options: ['1/4', '1/13', '13/52', '1/2'],
                  correctAnswer: 0,
                  explanation: 'P(heart) = 13/52 = 1/4',
                  difficulty: 2
                },
                {
                  id: 'VCMSP203-019',
                  question: 'If you flip a coin 3 times, how many different outcomes are possible?',
                  options: ['3', '6', '8', '12'],
                  correctAnswer: 2,
                  explanation: 'Each flip has 2 outcomes. Total = 2 × 2 × 2 = 8 outcomes.',
                  difficulty: 3
                },
                {
                  id: 'VCMSP203-020',
                  question: 'A bag has 2 red, 3 blue, and 5 green balls. What is P(red or blue)?',
                  options: ['2/10', '3/10', '5/10', '8/10'],
                  correctAnswer: 2,
                  explanation: 'Red or blue = 2 + 3 = 5 balls. P = 5/10 = 1/2',
                  difficulty: 3
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
