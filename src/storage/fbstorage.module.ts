import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StorageService } from './services/storage.service';
import { StorageComponent } from './components/storage.component';
import { NgModule } from '@angular/core';

const COMPONENTS = [
  StorageComponent
];
@NgModule({
  imports: [ReactiveFormsModule, CommonModule],
  exports: [...COMPONENTS, ReactiveFormsModule, CommonModule],
  declarations: [...COMPONENTS],
  providers: [
    StorageService
  ],
})
export class FbStorageModule { }
