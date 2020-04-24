import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import keyboards from "../assets/keyboards.json";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";

import { HelperService } from "./helper.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styles: [],
})
export class AppComponent implements OnInit {
  title = "Stamina";
  keyboardForm: FormGroup;
  keyboards = keyboards;
  keys = {};

  @ViewChild("passed", { static: false }) passed: ElementRef;
  @ViewChild("exercise", { static: false }) exercise: ElementRef;

  constructor(
    public fb: FormBuilder,
    public hs: HelperService,
    @Inject(DOCUMENT) document
  ) {}

  fillKeyMap() {
    let keys_elements = keyboards[
      this.keyboardForm.get("keyboard").value
    ].keys.reduce((a, b) => a.concat(b), []);
    let keys_buttons = document.getElementsByClassName("keyboard_button");

    for (let i in keys_buttons) {
      for (let j in keys_buttons[i].children)
        if (keys_buttons[i].children[j].tagName == "SPAN") {
          for (let k of keys_elements) {
            if (k.glyph == keys_buttons[i].children[j].innerHTML)
              this.keys[k.glyph] = keys_buttons[i];
          }
        }
    }
  }

  ngOnInit() {
    this.keyboardForm = this.fb.group({
      text: [],
      keyboard: [],
      lesson: [],
    });

    this.keyboardForm.get("keyboard").valueChanges.subscribe((sel) => {
      this.keys = {};
    });

    this.keyboardForm.get("lesson").valueChanges.subscribe((sel) => {
      this.passed.nativeElement.value = "";
      this.exercise.nativeElement.value = this.hs.lesson(
        this.keyboardForm.get("keyboard").value,
        sel
      );
      this.exercise.nativeElement.scrollLeft = 0;
    });
  }

  keyPress(event: any) {
    //console.log(event)
    try {
      if (Object.keys(this.keys).length == 0) this.fillKeyMap();

      let correct = this.exercise.nativeElement.value[0] == event.key;

      let color = correct ? "#0e7a00" : "#de2821";
      this.keys[event.key.trim() ? event.key.toUpperCase() : "Space"].animate(
        [
          { backgroundColor: "#FFF" },
          { backgroundColor: color },
          { backgroundColor: "#FFF" },
        ],
        { duration: 500, iterations: 1 }
      );

      if (correct) {
        this.exercise.nativeElement.value = this.exercise.nativeElement.value.substr(1);

        this.passed.nativeElement.value += event.key;
        this.passed.nativeElement.scrollLeft += 10;
      }
    } catch (e) {}

    event.preventDefault();
  }
}
