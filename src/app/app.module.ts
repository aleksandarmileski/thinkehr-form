import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {EhrFormComponentsModule, EhrFormModelModule, EhrFormService, TerminologyService} from 'thinkehr-forms';
// import EhrFormCustomComponentsModule for custom components
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BmiSimpleComponent} from "./bmi-simple/bmi-simple.component";
import {BasicService} from "./basic.service";
import {TempCalculatorComponent} from './temp-calculator/temp-calculator.component';
import {Das28Component} from './das28/das28.component';
// import {AuthService} from './auth.service';


@NgModule({
  declarations: [
    AppComponent,
    BmiSimpleComponent,
    TempCalculatorComponent,
    Das28Component
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    EhrFormModelModule,
    EhrFormComponentsModule.forRoot({
      terminologyLoaderService: TerminologyService,
      customComponentsMap: {
        'bmiCalc': BmiSimpleComponent,
        'outputCalc': TempCalculatorComponent,
        'das': Das28Component
      }
    })
  ],
  providers: [EhrFormService, TerminologyService, BasicService],
  entryComponents: [BmiSimpleComponent, TempCalculatorComponent, Das28Component],
  bootstrap: [AppComponent]
})
export class AppModule {
}
