#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const changeCase = require('change-case');

class TemplatesProto {

  actions(name) {
    return `
import { Action } from '@ngrx/store';
export const ${changeCase.constantCase(name)}_START = '[${changeCase.pascalCase(name)}] ${changeCase.pascalCase(name)}Start';
/**
 * @export
 * @class ${changeCase.pascalCase(name)}Start
 * @implements {Action}
 */
export class ${changeCase.pascalCase(name)}Start implements Action {
  readonly type = ${changeCase.constantCase(name)}_START;
  constructor(public payload: boolean) { }
}

export type All
  = ${changeCase.pascalCase(name)}Start;
`;
  }

  effects(name) {
    return `
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import * as ${changeCase.pascalCase(name)}Actions from './../actions/${name}-actions';

@Injectable()
export class ${changeCase.pascalCase(name)}Effects {

  @Effect()
  $${changeCase.lcFirst(changeCase.pascalCase(name))}Start: Observable<Action> = this.action$.ofType(${changeCase.pascalCase(name)}Actions.${changeCase.constantCase(name)}_START);
  
  constructor(
    private action$: Actions
  ) { }
}
    `;
  }
  reducers(name) {
    return `
import * as ${changeCase.pascalCase(name)}Action from '../actions/${name}-actions';

export interface State {
  onStart: any
};

const initialState: State = {
  onStart: false
};

export function reducer(state = initialState, action: ${changeCase.pascalCase(name)}Action.All): State {
  switch (action.type) {

    case ${changeCase.pascalCase(name)}Action.${changeCase.constantCase(name)}_START: {
      return {
        ...state,
        onLoad: action.payload
      }
    }

    default: {
      return state;
    }
  }
}
    `;
  }
  reducersIndex(name) {
    return `
import * as from${changeCase.pascalCase(name)} from './${name}-reducers';

export interface State {
  '${name}': from${changeCase.pascalCase(name)}.State;
}

export const reducers = {
  '${name}': from${changeCase.pascalCase(name)}.reducer
};
`;
  }
  ngModule(name) {
    return `
import { ${changeCase.pascalCase(name)}Effects } from './effects/${name}-effects';
import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import * as reducers from './reducers';


export const COMPONENTS = [];
export const PROVIDERS = [];

@NgModule({
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    IonicModule,
    StoreModule.forFeature('${name}', reducers.reducers['${name}']),
    EffectsModule.forFeature([${changeCase.pascalCase(name)}Effects]),
  ],
  declarations: [
    ...COMPONENTS
  ],
  entryComponents: [...COMPONENTS],
  providers: [...PROVIDERS],
  exports: [CommonModule, ReactiveFormsModule, IonicModule]
})
export class ${changeCase.pascalCase(name)}Module { }

    `;
  }
}
/**
 * create a skeleton of a ngrx module with empty files :()
 * @example $bin: ./proto.js --module test
 * @todo add templates
 * @class ModuleProtoType
 */
class ModuleProtoType {
  constructor(name) {
    this.moduleFolders = ['actions', 'reducers', 'effects', 'models', 'pages', 'providers'];
    this.templatesProto = new TemplatesProto();
    this.root = path.join(__dirname, '..', 'src');
    // console.dir(process.argv);
    try {
      this.name = changeCase.paramCase(process.argv[3]);
    } catch(e) {
      throw Error('please enter a name like `--module testWurst`');
    }

    // console.log('this.name ' + this.name);
    // console.log('__dirname ' + __dirname);
    // console.log('root ' + this.root);
    this.moduleStartProto();
  }

  moduleStartProto() {
    const moduleRoot = `${this.root}/${this.name}`;

    fs.mkdir(
      moduleRoot,
      (err) =>{
        if (err) {
           throw err;
        } else {
          this.createModuleFile(moduleRoot);
          this.createSubFolders(moduleRoot);
        }
      }
    ); 
  }
  createModuleFile(root) {
    fs.writeFileSync(`${root}/${this.name}.module.ts`, this.templatesProto.ngModule(this.name));
  }
  createSubFolders(root) {
    this.moduleFolders.forEach((folderName) => {
      fs.mkdir(
        `${root}/${folderName}`,
        (err) =>{
          if (err) {
            throw err;
          } else {
            this.createSubFiles(folderName, root);
          }
        }
      ); 
    });
    console.log(`Module ${this.name} is created!`);
  }

  createSubFiles(folderName, root) {
    let template = '';
    if (folderName === 'actions') {
      template =  this.templatesProto.actions(this.name);
    }
    if (folderName === 'effects') {
      template = this.templatesProto.effects(this.name);
    }
    if (folderName === 'reducers') {
      template = this.templatesProto.reducers(this.name);
    }
    fs.writeFileSync(`${root}/${folderName}/${this.name}-${folderName}.ts`, template);

    if (folderName === 'reducers') {
      template = this.templatesProto.reducersIndex(this.name);
      fs.writeFileSync(`${root}/${folderName}/index.ts`, template);
    }
  }
}

new ModuleProtoType();