import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Authenticator} from '../../providers/authenticator/authenticator';
import {ExerciseSets, ISharedExerciseSet} from '../../providers/exercise-sets/exercise-sets';

@Component({
  selector: 'guide',
  templateUrl: 'guide.html',
})
export class GuidePage {
  private static ReceivedType = 'received';
  private static SharedType = 'shared';
  sharedExerciseSets: ISharedExerciseSet[];
  receivedExerciseSets: ISharedExerciseSet[];
  whichSet: string;

  constructor(private navCtrl: NavController,
    private authenticator: Authenticator,
    private exerciseSets: ExerciseSets) {
      this.sharedExerciseSets = exerciseSets.shared;
      this.receivedExerciseSets = exerciseSets.received;
      this.whichSet = GuidePage.ReceivedType;
      console.log('hello from guide')
      console.dir(this.receivedExerciseSets);
  }
}
