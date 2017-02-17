import {Component, ChangeDetectorRef} from '@angular/core';
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
      this.sharedExerciseSets = this.exerciseSets.shared;
      this.receivedExerciseSets = this.exerciseSets.received;
      this.whichSet = GuidePage.ReceivedType;
  }

  accept(index: number) {
    this.exerciseSets.receiveExerciseSet(this.receivedExerciseSets[index].id)
      .subscribe({
        next: () => {
          this.receivedExerciseSets.splice(index, 1);
        }
      })
  }
}
