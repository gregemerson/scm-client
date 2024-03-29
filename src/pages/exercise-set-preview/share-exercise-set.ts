import {Component} from '@angular/core';
import {NavParams, NavController} from 'ionic-angular'
import {Validators, FormBuilder, FormGroup, FormControl} from '@angular/forms';
import {ScmValidators} from '../../utilities/scm-validators';
import {ExerciseConstraints} from '../../utilities/constraints';
import {MessageItem} from '../message-item/message-item';

@Component({
  selector: 'share-exercise-set',
  templateUrl: 'share-exercise-set.html',
})
export class ShareExerciseSetForm {
  shareForm: FormGroup;
  constraints = new ExerciseConstraints();
  private callback: (initializer: Object) => void;

  constructor(private formBuilder: FormBuilder,
    private navCtrl: NavController, params: NavParams) {
      this.callback = <(initializer: Object) => void>params.get('callback');
      this.shareForm = this.formBuilder.group({
        'receiverName': new FormControl('', [
          Validators.required, 
          ScmValidators.userName
          ]),
        'comments': new FormControl('', Validators.maxLength(
            this.constraints.maxSharedExerciseComments))
      });
  }

  create() {
    this.callback(this.shareForm.value);
    this.navCtrl.pop();
  }

  cancel() {
    this.navCtrl.pop();
  }
}