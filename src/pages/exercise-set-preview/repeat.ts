import {Component} from '@angular/core';
import {NavParams, NavController} from 'ionic-angular';
import {Validators, FormBuilder, FormGroup, FormControl} from '@angular/forms';
import {ExerciseConstraints} from '../../utilities/constraints'

@Component({
  selector: 'new-repeat',
  templateUrl: 'repeat.html',
})
export class RepeatForm {
  constraints = new ExerciseConstraints();
  repeatsGroup: FormGroup;
  maxMeasures: number;
  private callback: (measures: number, repeats: number) => void;

  constructor(private navCtrl: NavController,
              private formBuilder: FormBuilder,
              params: NavParams) {

    this.callback = <(measures: number, repeats: number) => void>params.get('create');
    this.maxMeasures = <number>params.get('maxMeasures');

    this.repeatsGroup = this.formBuilder.group({
      numMeasures: [this.constraints.minRepeatMeasures, Validators.maxLength(this.constraints.minRepeatMeasures)],
      numRepeats: [this.constraints.minRepeats, Validators.maxLength(this.constraints.maxRepeats)]
    });
  }

  create() {
    this.callback(this.repeatsGroup.value.numMeasures, 
      this.repeatsGroup.value.numRepeats);
    this.navCtrl.pop();
  }

  cancel() {
    this.navCtrl.pop();
  }
}