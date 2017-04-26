import {Component, OnChanges, OnInit, ViewChild} from '@angular/core';
import {forma} from "./form"
import {BasicService} from "./basic.service";
import {validate} from "codelyzer/walkerFactory/walkerFn";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  form = forma;

  @ViewChild('renderer')
  renderer;

  forms: any = [];

  vH: any;

  formDescription: any = '';
  formLayout: any = '';
  newFormConfig;
  values: any = {};

  formConfig: { description: any, layout?: any, values?: any, context?: any };

  constructor(private basicService: BasicService) {

  }

  ngOnInit() {
    this.basicService.getForms()
      .subscribe(response => {
        // this.forms = response['forms'];

        this.vH = response['forms'][0].name;
        this.forms.push(response['forms'][0]);
        response['forms'].forEach(form => {
          // console.log("Form name: " + form.name + " vHname=" + this.vH)
          if (form.name != this.vH) {
            this.vH = form.name;
            this.forms.push(form);
            // console.log("New form, name: " + this.vH)
          }
        })
      });
  }

  getForm(name, version) {
    // console.log(name);
    // console.log(version);
    this.basicService.getForm(name, version)
      .subscribe(response => {
        // console.log(response)
        this.basicService.getFormResource(name, version, "form-description")
          .subscribe(desc => {
            for (let i = 0; i < 2; i++) {
              let newOne = desc['children'][0]['children'][0];
              newOne.formId = newOne.formId + ':' + i;
              desc['children'][0]['children'].unshift(newOne);
            }
            this.basicService.getFormResource(name, version, "form-layout")
              .subscribe(layout => {
                // console.log(layout[0]['children'][0]['rows'][0]['cols'][0]['children'])
                // for (let i = 0; i < 28; i++) {
                //   layout[0]['children'][0]['rows'][0]['cols'][0]['children'].unshift(layout[0]['children'][0]['rows'][0]['cols'][0]['children'][0])
                // }
                this.formConfig = {description: desc, layout: layout}
                // console.log(this.formConfig)
              });
          });
      })
  }

  postComposition() {
    // console.log(this.values.allergies['adverse_reaction_-_allergy.v1'] = this.values.allergies['adverse_reaction_-_allergy']  , 'values');
    console.log(this.values)
    this.basicService.postComposition({
      "ctx/time": "2014-3-19T13:10Z",
      "ctx/language": "en",
      "ctx/territory": "CA",
      "allergies": this.values.allergies
    })
      .subscribe(console.log);
    // console.log(JSON.stringify({
    //   "ctx": {
    //     "language": "en",
    //     "territory": "SI",
    //     "composer_name": "matijak_test"
    //   },
    //   'allergies': this.values
    // }))
  }

  putComposition() {
    this.basicService.putComposition(JSON.stringify({
      "ctx/language": "en",
      "ctx/territory": "CA",
      'allergies': this.values
    }))
      .subscribe(console.log);
  }
}
