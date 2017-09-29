import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ViewChild, Component, OnInit, Inject, ElementRef} from '@angular/core';
import { FirebaseApp } from 'angularfire2';
import 'firebase/storage';

@Component({
  selector: 'storage',
  template: `
  <form [formGroup]="form" (ngSubmit)="submit($event)">
  <input formControlName="file" #file type="file" />
  <button>Submit</button>
</form>

<p>Value: {{ form.value | json }}</p>
<p>Validation status: {{ form.status }}</p>
    <img [src]="image">
  `
})
export class StorageComponent implements OnInit {
  image: string;
  form: FormGroup;
  storageRef:any;
  
  @ViewChild('file') file: ElementRef;

  constructor(firebaseApp: FirebaseApp, @Inject(FormBuilder) fb: FormBuilder) {
    this.storageRef = firebaseApp.storage().ref().child('images');
    this.form = fb.group({
      file: ['']
    });

    this.form.valueChanges.subscribe(
      (file) => {
        debugger;
      }
    )
  }

  submit($event) {
    console.log($event);
   }
  ngOnInit() { 
    const watcher = Observable.fromEvent(this.file.nativeElement, 'change');
    watcher.subscribe(
      (event: any) => {
        const file = event.target.files[0];
        var metadata = {
          'contentType': file.type
        };
        // Push to child path.
        // [START oncomplete]
        this.storageRef.child(file.name).put(file, metadata).then((snapshot) => {
          console.log('Uploaded', snapshot.totalBytes, 'bytes.');
          console.log(snapshot.metadata);
          var url = snapshot.downloadURL;
          console.log('File available at', url);
          this.image = snapshot.downloadURL;
        }).catch((error) => {
          console.error('Upload failed:', error);
        });
        console.log(event.target.files[0]);
      }
    )
    // this.file.nativeElement. ('change', (event) => {
    //   console.log(event);
    // })
  }
}
