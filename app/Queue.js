/**
 * Represent the queue displayed on the screen.
 */
export class Queue {
  /**
   * Create a new queue
   */
  constructor() {
    this.items = [];
  }

  /**
   * Enqueue any node in the queue
   * @param {*} item 
   */
  enqueue(item) {
    this.items.push(item);
  }

  /**
   * Delete head node from the queue
   * @returns {*} head node
   */
  dequeue() {
    return this.items.shift();
  }

  /**
   * Check if the queue is empty
   * @returns {boolean} isEmpty
   */
  isEmpty() {
    return this.items.length === 0;
  }

  /**
   * Get the number of nodes in the queue
   * @returns {int} number of nodes
   */
  size() {
    return this.items.length;
  }

  /**
   * Get all nodes in the queue
   * @returns {array} array of nodes
   */
  getItems() {
    return this.items;
  }
}