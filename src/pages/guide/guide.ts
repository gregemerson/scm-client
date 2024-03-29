import {Component, ChangeDetectorRef, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Authenticator} from '../../providers/authenticator/authenticator';
import {ExerciseSets, ISharedExerciseSet} from '../../providers/exercise-sets/exercise-sets';
import {MessageItem} from '../message-item/message-item';

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
  @ViewChild(MessageItem) errorDisplay: MessageItem;

  constructor(private navCtrl: NavController,
    private authenticator: Authenticator,
    private exerciseSets: ExerciseSets) {
      this.sharedExerciseSets = this.exerciseSets.shared;
      this.receivedExerciseSets = this.exerciseSets.received;
      this.whichSet = GuidePage.ReceivedType;
  }

  accept(index: number) {
    this.exerciseSets.receiveExerciseSet(index)
      .subscribe(
        () => { 
          this.receivedExerciseSets.splice(index, 1);
        },
        (error) => {
          this.errorDisplay.show(error.message);
        }
      )
  }

  deleteShare(index: number, type: string) {
    let share: ISharedExerciseSet = (type == 'shared') ? 
      this.sharedExerciseSets[index] : this.receivedExerciseSets[index];
    this.exerciseSets.deleteShare(share).subscribe(
      () => {},
      (error) => this.errorDisplay.show(error)
    )
  }
}
