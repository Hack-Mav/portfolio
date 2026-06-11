import { useCallback, useRef } from 'react';

// Web Worker manager for handling heavy computations
export class WorkerManager {
  private workers: Map<string, Worker> = new Map();
  private pendingTasks: Map<string, {
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = new Map();

  constructor() {
    // Initialize workers
    this.initializeWorker('computation', '/workers/computation.worker.js');
  }

  private initializeWorker(name: string, scriptPath: string) {
    if (this.workers.has(name)) {
      return;
    }

    const worker = new Worker(scriptPath);
    
    worker.onmessage = (event) => {
      const { type: _type, result, error, taskId } = event.data;
      
      if (taskId && this.pendingTasks.has(taskId)) {
        const { resolve, reject } = this.pendingTasks.get(taskId)!;
        this.pendingTasks.delete(taskId);
        
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      }
    };

    worker.onerror = (error) => {
      console.error(`Worker ${name} error:`, error);
    };

    this.workers.set(name, worker);
  }

  public async executeTask<T>(
    workerName: string,
    taskType: string,
    data: any,
    timeout: number = 30000
  ): Promise<T> {
    const worker = this.workers.get(workerName);
    if (!worker) {
      throw new Error(`Worker ${workerName} not found`);
    }

    const taskId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return new Promise<T>((resolve, reject) => {
      // Set up timeout
      const timeoutId = setTimeout(() => {
        this.pendingTasks.delete(taskId);
        reject(new Error(`Task ${taskId} timed out after ${timeout}ms`));
      }, timeout);

      // Store promise handlers
      this.pendingTasks.set(taskId, {
        resolve: (result) => {
          clearTimeout(timeoutId);
          resolve(result);
        },
        reject: (error) => {
          clearTimeout(timeoutId);
          reject(error);
        },
      });

      // Send task to worker
      worker.postMessage({
        taskId,
        type: taskType,
        data,
      });
    });
  }

  public terminateWorker(workerName: string) {
    const worker = this.workers.get(workerName);
    if (worker) {
      worker.terminate();
      this.workers.delete(workerName);
    }
  }

  public terminateAll() {
    this.workers.forEach((worker, name) => {
      this.terminateWorker(name);
    });
  }
}

// Singleton instance
const workerManager = new WorkerManager();

// React hook for using web workers
export function useWebWorker() {
  const workerManagerRef = useRef(workerManager);

  const calculateFibonacci = useCallback(async (n: number) => {
    return workerManagerRef.current.executeTask<number>(
      'computation',
      'FIBONACCI',
      { n }
    );
  }, []);

  const checkPrime = useCallback(async (number: number) => {
    return workerManagerRef.current.executeTask<boolean>(
      'computation',
      'PRIME_CHECK',
      { number }
    );
  }, []);

  const sortArray = useCallback(async (
    array: number[],
    algorithm: 'quickSort' | 'mergeSort' | 'heapSort' | 'bubbleSort' = 'quickSort'
  ) => {
    return workerManagerRef.current.executeTask<number[]>(
      'computation',
      'ARRAY_SORT',
      { array, algorithm }
    );
  }, []);

  const processImage = useCallback(async (
    imageData: ImageData,
    operation: 'grayscale' | 'invert' | 'brightness'
  ) => {
    return workerManagerRef.current.executeTask<ImageData>(
      'computation',
      'IMAGE_PROCESS',
      { imageData, operation }
    );
  }, []);

  const analyzeData = useCallback(async (data: number[]) => {
    return workerManagerRef.current.executeTask<any>(
      'computation',
      'DATA_ANALYSIS',
      { data }
    );
  }, []);

  return {
    calculateFibonacci,
    checkPrime,
    sortArray,
    processImage,
    analyzeData,
  };
}

// Utility functions for common heavy computations
export const heavyComputations = {
  // Fibonacci calculation
  fibonacci: (n: number) => workerManager.executeTask<number>('computation', 'FIBONACCI', { n }),
  
  // Prime checking
  isPrime: (number: number) => workerManager.executeTask<boolean>('computation', 'PRIME_CHECK', { number }),
  
  // Array sorting
  sortArray: (
    array: number[],
    algorithm: 'quickSort' | 'mergeSort' | 'heapSort' | 'bubbleSort' = 'quickSort'
  ) => workerManager.executeTask<number[]>('computation', 'ARRAY_SORT', { array, algorithm }),
  
  // Image processing
  processImage: (
    imageData: ImageData,
    operation: 'grayscale' | 'invert' | 'brightness'
  ) => workerManager.executeTask<ImageData>('computation', 'IMAGE_PROCESS', { imageData, operation }),
  
  // Data analysis
  analyzeData: (data: number[]) => workerManager.executeTask<any>('computation', 'DATA_ANALYSIS', { data }),
};

export default workerManager;
