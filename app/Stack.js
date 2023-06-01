/**
 * A stack data structure that allows elements to be pushed and popped from the top of the stack.
 */
export class Stack {
  /**
   * Constructs an empty stack.
   */
  constructor() {
    this.items = [];
  }

  /**
   * Pushes an element onto the top of the stack.
   *
   * @param {any} element - the element to be pushed onto the stack
   */
  push(element) {
    this.items.push(element);
  }

  /**
   * Removes and returns the element at the top of the stack.
   *
   * @return {any} the element at the top of the stack
   * @throws {string} if the stack is empty
   */
  pop() {
    if (this.items.length === 0) {
      throw "Underflow";
    }
    return this.items.pop();
  }

  /**
   * Returns true if the stack is empty, false otherwise.
   *
   * @return {boolean} true if the stack is empty, false otherwise
   */
  isEmpty() {
    return this.items.length === 0;
  }

  shuffle() {
    for (let i = this.items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.items[i], this.items[j]] = [this.items[j], this.items[i]];
    }
  }
}