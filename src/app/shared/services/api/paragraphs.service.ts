import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { IParagraphs } from '../../interfaces/paragraphs';
import { IParagraph } from '../../interfaces/paragraph';

declare global {
  interface Window {
    paragraphs: IParagraphs
  }
}

interface State {
  past: IParagraph[][];
  present: IParagraph[];
  future: IParagraph[][];
}

const initialState: State = {
  past: [],
  present: [],
  future: [],
}


@Injectable({
  providedIn: 'root'
})
export class ParagraphsService {
  state$ = new BehaviorSubject<State>(initialState);

  constructor() {
    const insert = (p: IParagraph) => {
      let {
        present,
      } = this.state;
      present = [ ...present, p ];
      this.state$.next({
        ...this.state,
        present,
        past: this.pastStateByPresent(present),
      });
    };

    const deleteParagraph = (id: string) => {
      let {
        present,
      } = this.state;
      present = present.filter((p) => p.id !== id);
      this.state$.next({
        ...this.state,
        present,
        past: this.pastStateByPresent(present)
      });
    };

    const update = (id: string, p: IParagraph) => {
      const present = this.state.present.map((paragraph) => {
        if (id === paragraph.id) {
          return p;
        }
        return paragraph;
      });
      this.state$.next({
        ...this.state,
        present,
        past: this.pastStateByPresent(present)
      });
    }

    const undo = () => {
      let {
        past,
        present,
        future
      } = this.state;
      future = past[0] ? [ present, ...future ] : future;
      past = [ ...past.slice(1) ];
      present = [ ...past[0] || [] ];
      this.state$.next({
        future,
        present,
        past
      });
    }

    const redo = () => {
      let {
        past,
        present,
        future
      } = this.state;
      present = [ ...future[0] || present ];
      past = future[0] ? [ present, ...past ] : past;
      future = [ ...future.slice(1) ];
      this.state$.next({
        future,
        present,
        past
      });
    }

    window['paragraphs'] = {
      insert,
      delete: deleteParagraph,
      update,
      undo,
      redo,
    }
  }

  get state(): State {
    return this.state$.getValue();
  }

  get paragraphs$() {
    return this.state$.asObservable();
  }

  pastStateByPresent(present: IParagraph[]): IParagraph[][] {
    return present.length ? [ present, ...this.state.past ] : [ [] ];
  }
}
