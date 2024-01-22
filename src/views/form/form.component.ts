import {Component, ViewChild} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {FieldComponent} from "../../components/field/field.component";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatChipsModule} from "@angular/material/chips";
import {HttpClient} from "@angular/common/http";
import {VATService} from "../../services/vat.service";
import {CoCService} from "../../services/coc.service";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {ErrorModel} from "../../models/error.model";

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FieldComponent,
    MatButtonModule,
    MatChipsModule,
    MatProgressBarModule,
    FormsModule,
    NgForOf
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})

export class FormComponent {
  @ViewChild('companyname', {static: false})
  companyName!: FieldComponent;
  @ViewChild('phonenumber', {static: false})
  phoneNumber!: FieldComponent;
  @ViewChild('cocnumber', {static: false})
  cocNumber!: FieldComponent;
  @ViewChild('vatnumber', {static: false})
  vatNumber!: FieldComponent;
  @ViewChild('iban', {static: false})
  iban!: FieldComponent;
  @ViewChild('budget', {static: false})
  budget!: FieldComponent;
  errors: ErrorModel[] = [];
  descInput!: string;
  emplInput!: string;
  emplOptions = ["1-10", "11-20", "21-50", "51-300", "300+"];

  constructor(
    private http: HttpClient,
    private vatService: VATService,
    private cocService: CoCService
  ) {}

  validatePhoneNumber(number: string): boolean {
    // regex voor een mobiel en vast (nederlands) telefoonnummer
    const formatMobile = /^(((\\+31|0|0031)6){1}[1-9]{1}[0-9]{7})$/i
    const formatHouse = /^(((0)[1-9]{2}[0-9][-]?[1-9][0-9]{5})|((\\+31|0|0031)[1-9][0-9][-]?[1-9][0-9]{6}))$/

    return formatHouse.test(number) || formatMobile.test(number)
  }

  validateIBAN(iban: string): boolean {
    // regex voor (nederlandse) IBAN
    const format = /^[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}$/i

    return format.test(iban)
  }

  async validateEntries(): Promise<undefined | boolean> {
    if (!this.validatePhoneNumber(this.phoneNumber.userInput)) {
      this.errors.push({msg: 'Incorrect Phone Number'})
    }

    if (!this.validateIBAN(this.iban.userInput)) {
      this.errors.push({msg: 'Incorrect IBAN'})
    }

    this.vatService.validateVATNumber(this.vatNumber.userInput).subscribe((value) => {
      if (!value) {
        this.errors.push({msg: 'Incorrect VAT Number'});
      }
    });

    this.cocService.isCocNumberValid(this.cocNumber.userInput).subscribe(() => {
      if (!this.cocService.cocModel.valid) {
        this.errors.push({msg: 'Incorrect CoC Number'})
      }
    });

    return this.errors.length == 0;
  }

  checkRequiredFields(): boolean {
    return !(this.companyName.userInput == undefined ||
      this.phoneNumber.userInput == undefined ||
      this.emplInput == undefined ||
      this.cocNumber == undefined ||
      this.vatNumber == undefined ||
      this.descInput == undefined ||
      this.iban.userInput == undefined);
  }

  async saveData(): Promise<void> {
    this.errors = [];

    if (!await this.validateEntries()) {
      return;
    }

    if (!this.checkRequiredFields()) {
      this.errors.push({ msg: 'Missing Required Fields' })
      return;
    }

    let body = {
      companyName: this.companyName.userInput,
      phoneNumber: this.phoneNumber.userInput,
      employees: this.emplInput,
      cocNumber: this.cocNumber.userInput,
      vatNumber: this.vatNumber.userInput,
      iban: this.iban.userInput,
      budget: this.budget.userInput,
      description: this.descInput
    }

    console.log(body)
  }
}
