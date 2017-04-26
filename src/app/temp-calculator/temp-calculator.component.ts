import {
  Component, OnInit, Input, EventEmitter, OnChanges, SimpleChanges, OnDestroy,
  ChangeDetectorRef, ChangeDetectionStrategy
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ValidateOptions} from 'mrd-ui-components';
import {Subscription, Observable} from 'rxjs';
import {EhrModelObservable} from 'thinkehr-forms';
import {CustomModel} from 'thinkehr-forms';
import {EhrFormCustomComponent} from 'thinkehr-forms';
import {QuantityFieldModel} from 'thinkehr-forms';

@Component({
  selector: 'app-temp-calculator',
  templateUrl: './temp-calculator.component.html',
  styleUrls: ['./temp-calculator.component.css'],

})
export class TempCalculatorComponent implements OnDestroy, EhrFormCustomComponent {
  valueTemp: string;

  @Input()
  set model(value: CustomModel) {
    this.modelValue$ = null;
   // this.unsubscribeAll();
    this.connectValues(value);
    this._model = value;

  }

  get model(): CustomModel {
    return this._model;
  }

  private _model: CustomModel;

  @Input()
  ehrFormGroup: FormGroup;

  @Input()
  validateFormEvent: EventEmitter<ValidateOptions>;

  protected connectValues(customModel: CustomModel): void {

    if (customModel) {
      let temp: QuantityFieldModel = customModel.findModelWithTag('temperature', true) as QuantityFieldModel;
      let temp$: Observable<string> = this.ehrModelObservable.fromValue(temp, 'magnitudeValue', 0);
      // this.modelValue$ = this.ehrModelObservable.fromValue(customModel.getDelegateModel(), 'magnitudeValue', 0);

      /*///this.modelSubscriptions.push(this.modelValue$.subscribe((val) => {
       this.changeDetectorRef.markForCheck();
       })
       );*/


      this.modelSubscriptions.push(temp$.subscribe(val => {
        this.valueTemp = val;
        this.changeDetectorRef.detectChanges();

      }));



    }
  }

  protected modelValue$: Observable<string>;

  protected modelSubscriptions: Subscription[] = [];

  constructor(private changeDetectorRef: ChangeDetectorRef, private ehrModelObservable: EhrModelObservable) {

  }

  ngOnDestroy() {
    this.unsubscribeAll();
  }

  private unsubscribeAll() {
    this.modelSubscriptions.forEach((subs: Subscription) => {
      subs.unsubscribe();
    });
    this.modelSubscriptions = [];
  }

  private calcBMI(heightValue: string, weightValue: string) {
    let hVal: number, wVal: number;
    let bmiVal: string = '';
    if (heightValue) {
      hVal = parseInt(heightValue, 10);
    }
    if (weightValue) {
      wVal = parseInt(weightValue, 10);
    }

    if (hVal && wVal) {
      var bmiRaw = wVal * 10000 / hVal / hVal;
      bmiVal = (Math.round(bmiRaw * 100) / 100).toString();
    }
    return bmiVal;
  }


}
