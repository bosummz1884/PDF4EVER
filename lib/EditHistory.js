class EditAction {
  constructor(previousState, newState) {
    this.previousState = previousState;
    this.newState = newState;
  }
}

export class EditHistory {
  constructor() {
    this._undoStack = [];
    this._redoStack = [];
  }

  recordChange(oldState, newState) {
    this._undoStack.push(new EditAction(oldState, newState));
    this._redoStack = [];
  }

  undo(currentState) {
    if (this._undoStack.length === 0) return null;
    const last = this._undoStack.pop();
    this._redoStack.push(new EditAction(last.newState, last.previousState));
    return last.previousState;
  }

  redo(currentState) {
    if (this._redoStack.length === 0) return null;
    const next = this._redoStack.pop();
    this._undoStack.push(new EditAction(next.newState, next.previousState));
    return next.previousState;
  }

  clear() {
    this._undoStack = [];
    this._redoStack = [];
  }

  get canUndo() {
    return this._undoStack.length > 0;
  }

  get canRedo() {
    return this._redoStack.length > 0;
  }
}
