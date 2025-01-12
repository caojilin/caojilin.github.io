function loadPuzzleData() {
  fetch(
    "https://raw.githubusercontent.com/princeton-nlp/tree-of-thought-llm/master/src/tot/data/24/24.csv"
  )
    .then((response) => response.text())
    .then((data) => {
      const records = Papa.parse(data, { header: true }).data;
      // Sort records by 'Solved rate' in descending order
      records.sort((a, b) => {
        const rateA = parseFloat(a["Solved rate"].replace("%", ""));
        const rateB = parseFloat(b["Solved rate"].replace("%", ""));
        return rateB - rateA; // Descending order
      });
      populatePuzzleSelector(records);
    })
    .catch((error) => console.error("Error fetching CSV:", error));
}

function populatePuzzleSelector(data) {
  const selector = document.getElementById("puzzleSelector");
  selector.innerHTML = ""; // Clear existing options
  data.forEach((record) => {
    const option = document.createElement("option");
    option.value = record.Puzzles;
    option.textContent = `${record.Puzzles} - Solved rate: ${record["Solved rate"]}`;
    selector.appendChild(option);
  });
}

function selectPuzzle(puzzleString) {
  const nums = puzzleString.split(" ").map((num) => parseFloat(num));
  document.getElementById("num1").value = nums[0];
  document.getElementById("num2").value = nums[1];
  document.getElementById("num3").value = nums[2];
  document.getElementById("num4").value = nums[3];
}

window.onload = function () {
  loadPuzzleData();
};

// Define operator combinations
const signs = ["+", "-", "*", "/"];
const allSigns = cartesianProduct([signs, signs, signs]);

function find24() {
  // Get input values
  const a = parseFloat(document.getElementById("num1").value);
  const b = parseFloat(document.getElementById("num2").value);
  const c = parseFloat(document.getElementById("num3").value);
  const d = parseFloat(document.getElementById("num4").value);

  // Check for valid numbers
  if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) {
    alert("Please enter valid numbers.");
    return;
  }

  // Generate all permutations of the numbers
  const allArr = permutations([a, b, c, d]);

  // Define all possible expression templates with operator placeholders
  const expressions = [
    "a %1 b %2 c %3 d",
    "(a %1 b) %2 c %3 d",
    "a %1 (b %2 c) %3 d",
    "a %1 b %2 (c %3 d)",
    "(a %1 b) %2 (c %3 d)",
    "(a %1 b %2 c) %3 d",
    "a %1 (b %2 c %3 d)",
    "((a %1 b) %2 c) %3 d",
    "a %1 ((b %2 c) %3 d)",
    "(a %1 (b %2 c)) %3 d",
    "a %1 (b %2 (c %3 d))",
  ];

  let results = [];

  // Iterate through all permutations
  for (let arr of allArr) {
    const numA = arr[0];
    const numB = arr[1];
    const numC = arr[2];
    const numD = arr[3];
    // Iterate through all operator combinations
    for (let ops of allSigns) {
      const op1 = ops[0];
      const op2 = ops[1];
      const op3 = ops[2];
      // Iterate through all expression templates
      for (let expr of expressions) {
        // Replace operator placeholders with the current operators
        let exprWithOps = expr
          .replace(/%1/g, op1)
          .replace(/%2/g, op2)
          .replace(/%3/g, op3);
        // Replace number placeholders with actual numbers
        let finalExpr = exprWithOps
          .replace(/a/g, numA)
          .replace(/b/g, numB)
          .replace(/c/g, numC)
          .replace(/d/g, numD);
        // Evaluate the expression safely
        try {
          const result = math.evaluate(finalExpr);
          if (Math.abs(result - 24) < 1e-6) {
            results.push(finalExpr);
          }
        } catch (e) {
          // Skip invalid expressions
        }
      }
    }
  }

  // Remove duplicate results
  results = Array.from(new Set(results));
  let uniqueArray = removeDuplicates(results, areDuplicates);
  uniqueArray.forEach((element, index) => (uniqueArray[index] += " = 24"));
  // Display the results
  results = uniqueArray;
  const resultsDiv = document.getElementById("results");
  if (results.length > 0) {
    resultsDiv.innerHTML = results.join("<br>");
  } else {
    resultsDiv.innerHTML = "No expressions found that equal 24.";
  }
}

// Function to generate all permutations of an array
function permutations(arr) {
  if (arr.length === 0) return [[]];
  const firstElement = arr[0];
  const remainingElements = arr.slice(1);
  const permsWithoutFirst = permutations(remainingElements);
  const allPermutations = [];
  permsWithoutFirst.forEach((perm) => {
    for (let i = 0; i <= perm.length; i++) {
      const permWithFirst = [
        ...perm.slice(0, i),
        firstElement,
        ...perm.slice(i),
      ];
      allPermutations.push(permWithFirst);
    }
  });
  return allPermutations;
}

// Function to generate Cartesian product
function cartesianProduct(arrays) {
  return arrays.reduce(
    (acc, curr) => {
      return acc.flatMap((c) => curr.map((n) => [...c, n]));
    },
    [[]]
  );
}

function compareNodes(
  node1,
  node2,
  ignore = ["start", "end", "loc", "range", "comments"]
) {
  if (
    typeof node1 !== "object" ||
    typeof node2 !== "object" ||
    node1 === null ||
    node2 === null
  ) {
    return node1 === node2;
  }
  if (node1.type !== node2.type) {
    return false;
  }
  const keys1 = Object.keys(node1).filter((key) => !ignore.includes(key));
  const keys2 = Object.keys(node2).filter((key) => !ignore.includes(key));
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    const val1 = node1[key];
    const val2 = node2[key];
    if (typeof val1 !== typeof val2) {
      return false;
    }
    if (typeof val1 === "object" && val1 !== null) {
      if (Array.isArray(val1) && Array.isArray(val2)) {
        if (val1.length !== val2.length) {
          return false;
        }
        for (let i = 0; i < val1.length; i++) {
          if (!compareNodes(val1[i], val2[i], ignore)) {
            return false;
          }
        }
      } else {
        if (!compareNodes(val1, val2, ignore)) {
          return false;
        }
      }
    } else {
      if (val1 !== val2) {
        return false;
      }
    }
  }
  return true;
}

// Function to compare lists of AST nodes
function compareNodeLists(list1, list2) {
  if (list1.length !== list2.length) {
    return false;
  }
  for (let i = 0; i < list1.length; i++) {
    if (!compareNodes(list1[i], list2[i])) {
      return false;
    }
  }
  return true;
}

// Custom comparator function
function areDuplicates(expr1, expr2) {
  // Parse expressions into ASTs
  const ast1 = acorn.parse(expr1, { ecmaVersion: 2020, sourceType: "script" });
  const ast2 = acorn.parse(expr2, { ecmaVersion: 2020, sourceType: "script" });

  return compareNodes(ast1, ast2);
}

// Function to remove duplicates with custom comparator
function removeDuplicates(array, comparator) {
  const unique = [];
  array.forEach((element) => {
    // Check if there is no element in unique that is a duplicate
    const isDuplicate = unique.some((uniqueElement) =>
      comparator(element, uniqueElement)
    );
    if (!isDuplicate) {
      unique.push(element);
    }
  });
  return unique;
}

function selectRandomPuzzle() {
  const selector = document.getElementById("puzzleSelector");
  const randomIndex = Math.floor(Math.random() * selector.options.length);
  selector.selectedIndex = randomIndex;
  selectPuzzle(selector.value);
}
