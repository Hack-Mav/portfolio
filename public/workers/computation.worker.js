// Web Worker for heavy computations
self.onmessage = function(e) {
  const { type, data } = e.data;
  
  switch (type) {
    case 'FIBONACCI': {
      const fibResult = calculateFibonacci(data.n);
      self.postMessage({ type: 'FIBONACCI_RESULT', result: fibResult });
      break;
    }
      
    case 'PRIME_CHECK': {
      const primeResult = isPrime(data.number);
      self.postMessage({ type: 'PRIME_RESULT', result: primeResult });
      break;
    }
      
    case 'ARRAY_SORT': {
      const sortedResult = heavySort(data.array, data.algorithm);
      self.postMessage({ type: 'SORT_RESULT', result: sortedResult });
      break;
    }
      
    case 'IMAGE_PROCESS':
      processImage(data.imageData, data.operation)
        .then(result => self.postMessage({ type: 'IMAGE_RESULT', result }))
        .catch(error => self.postMessage({ type: 'ERROR', error: error.message }));
      break;
      
    case 'DATA_ANALYSIS': {
      const analysisResult = analyzeData(data.data);
      self.postMessage({ type: 'ANALYSIS_RESULT', result: analysisResult });
      break;
    }
      
    default:
      self.postMessage({ type: 'ERROR', error: 'Unknown operation type' });
  }
};

// Fibonacci calculation (heavy computation example)
function calculateFibonacci(n) {
  if (n <= 1) return n;
  
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}

// Prime number checking
function isPrime(number) {
  if (number <= 1) return false;
  if (number <= 3) return true;
  if (number % 2 === 0 || number % 3 === 0) return false;
  
  let i = 5;
  while (i * i <= number) {
    if (number % i === 0 || number % (i + 2) === 0) return false;
    i += 6;
  }
  return true;
}

// Heavy array sorting algorithms
function heavySort(array, algorithm = 'quickSort') {
  const arr = [...array]; // Don't mutate original
  
  switch (algorithm) {
    case 'quickSort':
      return quickSort(arr);
    case 'mergeSort':
      return mergeSort(arr);
    case 'heapSort':
      return heapSort(arr);
    case 'bubbleSort': // Intentionally slow for demonstration
      return bubbleSort(arr);
    default:
      return quickSort(arr);
  }
}

function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  
  return [...quickSort(left), ...middle, ...quickSort(right)];
}

function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;
  
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }
  
  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

function heapSort(arr) {
  const n = arr.length;
  
  // Build heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  
  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]]; // Swap
    heapify(arr, i, 0);
  }
  
  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }
  
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }
  
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}

function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

// Image processing (simplified example)
async function processImage(imageData, operation) {
  // This is a simplified example - in reality, you'd use proper image processing
  const { data, width, height } = imageData;
  const processedData = new Uint8ClampedArray(data);
  
  switch (operation) {
    case 'grayscale':
      for (let i = 0; i < processedData.length; i += 4) {
        const gray = processedData[i] * 0.299 + processedData[i + 1] * 0.587 + processedData[i + 2] * 0.114;
        processedData[i] = gray;     // Red
        processedData[i + 1] = gray; // Green
        processedData[i + 2] = gray; // Blue
        // Alpha channel remains unchanged
      }
      break;
      
    case 'invert':
      for (let i = 0; i < processedData.length; i += 4) {
        processedData[i] = 255 - processedData[i];         // Red
        processedData[i + 1] = 255 - processedData[i + 1]; // Green
        processedData[i + 2] = 255 - processedData[i + 2]; // Blue
        // Alpha channel remains unchanged
      }
      break;
      
    case 'brightness': {
      const factor = 1.5; // Increase brightness by 50%
      for (let i = 0; i < processedData.length; i += 4) {
        processedData[i] = Math.min(255, processedData[i] * factor);         // Red
        processedData[i + 1] = Math.min(255, processedData[i + 1] * factor); // Green
        processedData[i + 2] = Math.min(255, processedData[i + 2] * factor); // Blue
        // Alpha channel remains unchanged
      }
      break;
    }
      
    default:
      throw new Error('Unknown image operation');
  }
  
  return {
    data: processedData,
    width,
    height,
  };
}

// Data analysis functions
function analyzeData(data) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Invalid data for analysis');
  }
  
  const numbers = data.filter(item => typeof item === 'number');
  
  if (numbers.length === 0) {
    throw new Error('No numeric data found');
  }
  
  // Basic statistics
  const sum = numbers.reduce((acc, val) => acc + val, 0);
  const mean = sum / numbers.length;
  
  const sortedNumbers = [...numbers].sort((a, b) => a - b);
  const median = sortedNumbers.length % 2 === 0
    ? (sortedNumbers[sortedNumbers.length / 2 - 1] + sortedNumbers[sortedNumbers.length / 2]) / 2
    : sortedNumbers[Math.floor(sortedNumbers.length / 2)];
  
  const variance = numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / numbers.length;
  const standardDeviation = Math.sqrt(variance);
  
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  
  // Frequency analysis
  const frequency = {};
  numbers.forEach(num => {
    frequency[num] = (frequency[num] || 0) + 1;
  });
  
  const mode = Object.keys(frequency).reduce((a, b) => 
    frequency[a] > frequency[b] ? a : b
  );
  
  return {
    count: numbers.length,
    sum,
    mean,
    median,
    mode: parseFloat(mode),
    standardDeviation,
    variance,
    min,
    max,
    range: max - min,
    frequency,
  };
}
